import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";

export function registerReachFrequencyTools(server: McpServer, client: AdsClient): void {
  // ─── list_rf_predictions ──────────────────────────────────────
  server.tool(
    "list_rf_predictions",
    "List reach & frequency predictions for the ad account. Returns paginated results.",
    {
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results (default 25)"),
      after: z.string().optional().describe("Pagination cursor for next page"),
    },
    async ({ fields, limit, after }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        if (limit) params.limit = limit;
        if (after) params.after = after;
        const { data, rateLimit } = await client.get(`${client.accountPath}/reachfrequencypredictions`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── create_rf_prediction ─────────────────────────────────────
  server.tool(
    "create_rf_prediction",
    "Create a new reach & frequency prediction. Provide targeting spec as JSON string, budget in cents, and scheduling info.",
    {
      target_spec: z.string().describe("JSON string of targeting specification"),
      start_time: z.string().describe("Prediction start time (ISO 8601 or Unix timestamp)"),
      stop_time: z.string().describe("Prediction stop time (ISO 8601 or Unix timestamp)"),
      budget: z.number().describe("Budget in account currency cents"),
      frequency_cap: z.number().describe("Maximum frequency cap per user"),
      destination_id: z.string().describe("Destination ID (e.g. Facebook Page ID)"),
    },
    async ({ target_spec, start_time, stop_time, budget, frequency_cap, destination_id }) => {
      try {
        const params: Record<string, unknown> = {
          target_spec,
          start_time,
          stop_time,
          budget,
          frequency_cap,
          destination_id,
        };
        const { data, rateLimit } = await client.post(`${client.accountPath}/reachfrequencypredictions`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_rf_prediction ────────────────────────────────────────
  server.tool(
    "get_rf_prediction",
    "Get details of a specific reach & frequency prediction by ID.",
    {
      prediction_id: z.string().describe("Prediction ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
    },
    async ({ prediction_id, fields }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        const { data, rateLimit } = await client.get(`/${prediction_id}`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── delete_rf_prediction ─────────────────────────────────────
  server.tool(
    "delete_rf_prediction",
    "Delete a reach & frequency prediction. This action is irreversible.",
    {
      prediction_id: z.string().describe("Prediction ID to delete"),
    },
    async ({ prediction_id }) => {
      try {
        const { data, rateLimit } = await client.delete(`/${prediction_id}`);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: true, ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
