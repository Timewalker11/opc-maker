import express from "express";
import cors from "cors";
import { env } from "./env.js";
import "./db.js";
import authRoutes from "./routes/auth.js";
import businessProfileRoutes from "./routes/businessProfile.js";
import integrationsRoutes from "./routes/integrations.js";
import emailsRoutes from "./routes/emails.js";
import chatRoutes from "./routes/chat.js";

const app = express();

app.use(cors({ origin: env.frontendUrl }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/business-profile", businessProfileRoutes);
app.use("/api/integrations", integrationsRoutes);
app.use("/api/emails", emailsRoutes);
app.use("/api/chat", chatRoutes);

app.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port}`);
});
