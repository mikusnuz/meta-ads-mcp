import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";

export function registerBudgetTools(server: McpServer, client: AdsClient): void {
  // ─── list_budget_schedules ────────────────────────────────────
  server.tool(
    "list_budget_schedules",
    "List ad budget schedules for the ad account. Returns paginated results.",
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
        const { data, rateLimit } = await client.get(`${client.accountPath}/adbudgetschedules`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── create_budget_schedule ───────────────────────────────────
  server.tool(
    "create_budget_schedule",
    "Create a new ad budget schedule for the ad account.",
    {
      budget_value: z.string().describe("Budget amount in account currency cents"),
      budget_value_type: z.string().describe("Budget value type (e.g. ABSOLUTE, MULTIPLIER)"),
      time_start: z.string().describe("Schedule start time (ISO 8601 or Unix timestamp)"),
      time_end: z.string().describe("Schedule end time (ISO 8601 or Unix timestamp)"),
    },
    async ({ budget_value, budget_value_type, time_start, time_end }) => {
      try {
        const params: Record<string, unknown> = {
          budget_value,
          budget_value_type,
          time_start,
          time_end,
        };
        const { data, rateLimit } = await client.post(`${client.accountPath}/adbudgetschedules`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── update_budget_schedule ───────────────────────────────────
  server.tool(
    "update_budget_schedule",
    "Update an existing budget schedule. Only provided fields will be modified.",
    {
      schedule_id: z.string().describe("Budget schedule ID to update"),
      budget_value: z.string().optional().describe("New budget amount in account currency cents"),
      time_start: z.string().optional().describe("New schedule start time"),
      time_end: z.string().optional().describe("New schedule end time"),
    },
    async ({ schedule_id, budget_value, time_start, time_end }) => {
      try {
        const params: Record<string, unknown> = {};
        if (budget_value) params.budget_value = budget_value;
        if (time_start) params.time_start = time_start;
        if (time_end) params.time_end = time_end;
        const { data, rateLimit } = await client.post(`/${schedule_id}`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── delete_budget_schedule ───────────────────────────────────
  server.tool(
    "delete_budget_schedule",
    "Delete a budget schedule. This action is irreversible.",
    {
      schedule_id: z.string().describe("Budget schedule ID to delete"),
    },
    async ({ schedule_id }) => {
      try {
        const { data, rateLimit } = await client.delete(`/${schedule_id}`);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: true, ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
