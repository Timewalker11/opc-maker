import { mockRequest, mockFailure } from "./apiClient";

export interface ActionResult {
  success: boolean;
}

// Every function here performs a sensitive, real-world-affecting action.
// The caller (recommendation cards, agent approval flow) is responsible for
// gating these behind explicit user approval -- none of them should ever fire automatically.

// Integration placeholder: POST /api/emails/:id/reply
export function sendEmailReply(_emailId: string, _body: string): Promise<ActionResult> {
  return mockRequest({ success: true });
}

// Integration placeholder: POST /api/social/posts/:id/publish
export function publishPost(_postId: string): Promise<ActionResult> {
  return mockRequest({ success: true });
}

// Integration placeholder: POST /api/customers/:id/charge
export function chargeCustomer(_customerId: string, _amount: number): Promise<ActionResult> {
  return mockRequest({ success: true });
}

// Integration placeholder: DELETE /api/files/:id
export function deleteFile(_fileId: string): Promise<ActionResult> {
  return mockRequest({ success: true });
}

// Integration placeholder: PATCH /api/invoices/:id
export function modifyPayment(_invoiceId: string): Promise<ActionResult> {
  return mockRequest({ success: true });
}

// Integration placeholder: POST /api/customers/:id/contact
export function contactCustomer(_customerId: string, _channel: string): Promise<ActionResult> {
  return mockRequest({ success: true });
}

// Integration placeholder: POST /api/integrations/:id/reconnect
export function reconnectIntegration(_integrationId: string, forceFail = false): Promise<ActionResult> {
  if (forceFail) {
    return mockFailure("Reconnection failed -- the provider rejected the stored credentials.", 502);
  }
  return mockRequest({ success: true });
}

// Integration placeholder: PATCH /api/campaigns/:id { status: "paused" }
export function pauseCampaign(_campaignId: string): Promise<ActionResult> {
  return mockRequest({ success: true });
}

// Integration placeholder: POST /api/customers/merge
export function mergeDuplicateCustomers(): Promise<ActionResult> {
  return mockRequest({ success: true });
}
