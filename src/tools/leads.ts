import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";

export function registerLeadTools(server: McpServer, client: AdsClient): void {
  // ─── get_form_leads ────────────────────────────────────────
  server.tool(
    "get_form_leads",
    "Get leads submitted through a lead generation form.",
    {
      form_id: z.string().describe("Lead form ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results to return"),
      after: z.string().optional().describe("Pagination cursor for next page"),
    },
    async ({ form_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.get(`/${form_id}/leads`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_lead ──────────────────────────────────────────────
  server.tool(
    "get_lead",
    "Get details of a specific lead by ID.",
    {
      lead_id: z.string().describe("Lead ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
    },
    async ({ lead_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.get(`/${lead_id}`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── list_lead_forms ───────────────────────────────────────
  server.tool(
    "list_lead_forms",
    "List lead generation forms for a Facebook Page.",
    {
      page_id: z.string().describe("Facebook Page ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results to return"),
      after: z.string().optional().describe("Pagination cursor for next page"),
    },
    async ({ page_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.get(`/${page_id}/leadgen_forms`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_lead_form ─────────────────────────────────────────
  server.tool(
    "get_lead_form",
    "Get details of a specific lead generation form.",
    {
      form_id: z.string().describe("Lead form ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
    },
    async ({ form_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.get(`/${form_id}`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
