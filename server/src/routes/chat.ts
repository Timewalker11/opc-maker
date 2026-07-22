import { Router } from "express";
import OpenAI from "openai";
import { env } from "../env.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();
router.use(requireAuth);

const client = env.openaiApiKey ? new OpenAI({ apiKey: env.openaiApiKey }) : null;

const SPECIALIZED_AGENT_IDS = [
  "customer",
  "email",
  "marketing",
  "social",
  "sales",
  "task",
  "scheduling",
  "storage",
  "media",
  "analytics",
  "finance",
  "product",
  "integration",
  "automation",
] as const;

interface ActionArgSpec {
  type: "string" | "number";
  enum?: readonly string[];
  description: string;
}

interface ActionDef {
  agents: readonly string[] | "all";
  description: string;
  args: Record<string, ActionArgSpec>;
}

// The 5 real, low-risk actions agents can take on the app's actual state (not just narrate).
// Each is reversible and non-sensitive (create/schedule/resolve, never publish/send/charge/delete),
// so the prompt tells the model to always mark these requiresApproval: false -- see buildSystemPrompt.
const ACTION_DEFS: Record<string, ActionDef> = {
  create_task: {
    agents: ["task"],
    description: 'Add a new task to the task list. Omit "dueInHours" to default to 24.',
    args: {
      title: { type: "string", description: "The task title." },
      dueInHours: { type: "number", description: "Hours from now the task is due. Omit to default to 24." },
    },
  },
  complete_task: {
    agents: ["task"],
    description: 'Mark an existing task done. "taskId" must be one of the ids listed in the business data below -- never invent one.',
    args: {
      taskId: { type: "string", description: "The id of the task to mark done." },
    },
  },
  schedule_social_post: {
    agents: ["social"],
    description: "Schedule a new social media post as a draft/scheduled item -- this does NOT publish it.",
    args: {
      platform: { type: "string", enum: ["instagram", "facebook", "linkedin", "tiktok"], description: "Which platform to schedule the post on." },
      caption: { type: "string", description: "The post caption/copy." },
      scheduledAt: { type: "string", description: "ISO 8601 timestamp for when the post should go out." },
    },
  },
  create_calendar_event: {
    agents: ["scheduling"],
    description: "Add a new event to the calendar.",
    args: {
      title: { type: "string", description: "The event title." },
      startAt: { type: "string", description: "ISO 8601 timestamp for when the event starts." },
      durationMinutes: { type: "number", description: "How long the event lasts, in minutes." },
      location: { type: "string", enum: ["video-call", "phone", "in-person"], description: "How the event takes place." },
    },
  },
  resolve_alert: {
    agents: "all",
    description: 'Dismiss/resolve an existing alert. "alertId" must be one of the ids listed in the business data below -- never invent one.',
    args: {
      alertId: { type: "string", description: "The id of the alert to resolve." },
    },
  },
};

function allowedActionsFor(agentId: string): string[] {
  return Object.entries(ACTION_DEFS)
    .filter(([, def]) => def.agents === "all" || def.agents.includes(agentId))
    .map(([name]) => name);
}

// Strict-mode args schema: the union of every field used by this agent's allowed actions, all
// nullable (a reply that isn't taking any action sets action/args to null entirely).
function buildArgsSchema(actionNames: string[]) {
  const properties: Record<string, unknown> = {};
  for (const name of actionNames) {
    for (const [field, spec] of Object.entries(ACTION_DEFS[name].args)) {
      if (properties[field]) continue;
      properties[field] = {
        type: [spec.type, "null"],
        ...(spec.enum ? { enum: [...spec.enum, null] } : {}),
        description: spec.description,
      };
    }
  }
  return {
    type: ["object", "null"],
    properties,
    required: Object.keys(properties),
    additionalProperties: false,
  };
}

function buildResponseSchema(agentId: string) {
  const actionNames = allowedActionsFor(agentId);
  return {
    name: "agent_reply",
    strict: true,
    schema: {
      type: "object",
      properties: {
        reply: { type: "string" },
        reasoning: { type: ["string", "null"] },
        sources: {
          type: ["array", "null"],
          items: {
            type: "object",
            properties: {
              label: { type: "string" },
              section: { type: "string" },
            },
            required: ["label", "section"],
            additionalProperties: false,
          },
        },
        routing: {
          type: ["array", "null"],
          items: {
            type: "object",
            properties: {
              agentId: { type: "string", enum: SPECIALIZED_AGENT_IDS },
              action: { type: ["string", "null"], enum: [...actionNames, null] },
              args: buildArgsSchema(actionNames),
              proposedAction: { type: "string" },
              requiresApproval: { type: "boolean" },
            },
            required: ["agentId", "action", "args", "proposedAction", "requiresApproval"],
            additionalProperties: false,
          },
        },
        undoable: { type: ["boolean", "null"] },
      },
      required: ["reply", "reasoning", "sources", "routing", "undoable"],
      additionalProperties: false,
    },
  };
}

function buildActionsParagraph(agentId: string): string {
  const names = allowedActionsFor(agentId);
  const lines = names.map((name) => {
    const def = ACTION_DEFS[name];
    const argNames = Object.keys(def.args).join(", ");
    return `- ${name} {${argNames}}: ${def.description}`;
  });
  return `You can take the following real actions by filling in "action" and "args" (using exactly these field names) on a routing entry -- set both to null if you aren't taking one of these:
${lines.join("\n")}

These are safe and reversible -- always set requiresApproval to false for them, and phrase "proposedAction" as something you've already done (e.g. "Added a task to follow up with the supplier tomorrow"), not as a request for permission.`;
}

interface Persona {
  name: string;
  description: string;
  dataAccess: string[];
}

interface ChatRequestBody {
  agentId: string;
  message: string;
  history?: { role: string; content: string }[];
  persona: Persona;
  context: unknown;
}

interface RawAgentReply {
  reply: string;
  reasoning: string | null;
  sources: { label: string; section: string }[] | null;
  routing:
    | {
        agentId: string;
        action: string | null;
        args: Record<string, unknown> | null;
        proposedAction: string;
        requiresApproval: boolean;
      }[]
    | null;
  undoable: boolean | null;
}

function buildSystemPrompt(body: ChatRequestBody): string {
  const routingScope = `If you propose a routing entry, always set its "agentId" to "${body.agentId}" (yourself) -- never another specialist.`;

  return `You are the ${body.persona.name} inside a business-operations dashboard for a solo entrepreneur or small team. ${body.persona.description}.

Stay strictly within your own domain (${body.persona.dataAccess.join(", ")}) -- don't discuss or offer to take on work that belongs to a different specialist.

Only use the business data given below -- never invent customers, numbers, emails, or events that aren't in it. If a domain is empty or not yet connected, say so plainly and suggest connecting or adding data rather than making something up.

When fulfilling the request would require a sensitive action -- sending an email, publishing a post, charging or contacting a customer, deleting a file, or touching a payment -- propose it through the "routing" field with requiresApproval set to true instead of claiming you already did it; the interface will ask the owner to approve before anything real happens. Internal, reversible, read-only work (counting, ranking, drafting without sending) can be marked requiresApproval false and treated as already done. Set "undoable" to true only if you describe having already taken a reversible action yourself (like creating a draft).

${buildActionsParagraph(body.agentId)}

${routingScope}

Business data (JSON):
${JSON.stringify(body.context ?? {}, null, 2)}

Reply conversationally and concisely (usually 1-4 sentences), grounded strictly in the JSON above. Include a "reasoning" value only when it explains a non-obvious step, such as why something needs approval -- otherwise use null. Use null for any other field you have nothing to report (an empty "sources"/"routing" array is also fine).`;
}

router.post("/", async (req, res) => {
  if (!client) {
    return res.status(503).json({ error: "AI chat isn't configured on the server yet (missing OPENAI_API_KEY)." });
  }

  const body = req.body as Partial<ChatRequestBody>;
  if (!body?.message?.trim() || !body.agentId || !body.persona) {
    return res.status(400).json({ error: "message, agentId, and persona are required." });
  }
  const agentId = body.agentId;

  const history = (body.history ?? []).slice(-12).map((m) => ({
    role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
    content: m.content,
  }));

  try {
    const response = await client.chat.completions.create({
      model: env.openaiModel,
      messages: [
        { role: "system", content: buildSystemPrompt(body as ChatRequestBody) },
        ...history,
        { role: "user", content: body.message },
      ],
      response_format: { type: "json_schema", json_schema: buildResponseSchema(agentId) },
    });

    const choice = response.choices[0];
    if (choice?.message.refusal) {
      return res.json({ reply: "I'm not able to help with that request." });
    }

    const content = choice?.message.content;
    if (!content) {
      return res.status(502).json({ error: "The AI didn't return a response. Try again." });
    }

    const raw = JSON.parse(content) as RawAgentReply;
    const allowed = allowedActionsFor(agentId);
    res.json({
      reply: raw.reply,
      ...(raw.reasoning != null && { reasoning: raw.reasoning }),
      ...(raw.sources != null && { sources: raw.sources }),
      ...(raw.routing != null && {
        routing: raw.routing.map((r) => {
          // Defensive re-check -- the schema's enum already constrains this, but these actions
          // trigger real mutations, so don't trust the model's output alone.
          const action = r.action != null && allowed.includes(r.action) ? r.action : null;
          return {
            agentId: r.agentId,
            proposedAction: r.proposedAction,
            requiresApproval: r.requiresApproval,
            ...(action != null && { action, args: r.args ?? {} }),
          };
        }),
      }),
      ...(raw.undoable != null && { undoable: raw.undoable }),
    });
  } catch (err) {
    console.error("Chat completion failed:", err);
    res.status(502).json({ error: "Couldn't reach the AI service. Try again in a moment." });
  }
});

export default router;
