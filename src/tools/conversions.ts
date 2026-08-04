import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";

export function registerConversionTools(server: McpServer, client: AdsClient): void {
  // ─── send_conversion_event ─────────────────────────────────
  server.tool(
    "send_conversion_event",
    "Send a server-side conversion event via the Conversions API (pixel).",
    {
      events: z.string().describe("JSON array of events: [{event_name, event_time, user_data, custom_data, action_source}]"),
    },
    async (params) => {
      try {
        const { data, rateLimit } = await client.post(`/${client.pixelId}/events`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── send_offline_event ────────────────────────────────────
  server.tool(
    "send_offline_event",
    "Send an offline conversion event to an offline event set.",
    {
      event_set_id: z.string().describe("Offline event set ID"),
      events: z.string().describe("JSON array of offline events"),
    },
    async ({ event_set_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.post(`/${event_set_id}/events`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── list_offline_event_sets ───────────────────────────────
  server.tool(
    "list_offline_event_sets",
    "List offline conversion data sets for the ad account.",
    {
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results to return"),
      after: z.string().optional().describe("Pagination cursor for next page"),
      account_id: z.string().optional().describe("Ad account ID to query (e.g. 'act_123' or '123'). Falls back to META_AD_ACCOUNT_ID env var if omitted."),
    },
    async ({ account_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.get(`${client.accountPath(account_id)}/offline_conversion_data_sets`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── create_offline_event_set ──────────────────────────────
  server.tool(
    "create_offline_event_set",
    "Create a new offline conversion data set.",
    {
      name: z.string().describe("Event set name"),
      description: z.string().optional().describe("Event set description"),
      account_id: z.string().optional().describe("Ad account ID to create the event set in (e.g. 'act_123' or '123'). Falls back to META_AD_ACCOUNT_ID env var if omitted."),
    },
    async ({ account_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.post(`${client.accountPath(account_id)}/offline_conversion_data_sets`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
