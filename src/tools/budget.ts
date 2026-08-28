import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";
import { buildBudgetSchedulePath } from "../services/api-contracts.js";

export function registerBudgetTools(server: McpServer, client: AdsClient): void {
  // ─── list_budget_schedules ────────────────────────────────────
  server.tool(
    "list_budget_schedules",
    "List budget schedules attached to a campaign or ad set. Returns paginated results.",
    {
      parent_id: z.string().min(1).describe("Campaign or ad set ID that owns the budget schedules"),
      parent_type: z.enum(["campaign", "adset"]).default("campaign").describe("Type of parent object"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().int().positive().optional().default(25).describe("Number of results (default 25)"),
      after: z.string().optional().describe("Pagination cursor for next page"),
    },
    async ({ parent_id, parent_type, fields, limit, after }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        if (limit) params.limit = limit;
        if (after) params.after = after;
        const { data, rateLimit } = await client.get(
          buildBudgetSchedulePath(parent_id, parent_type),
          params
        );
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── create_budget_schedule ───────────────────────────────────
  server.tool(
    "create_budget_schedule",
    "Create a budget schedule on a campaign or ad set.",
    {
      parent_id: z.string().min(1).describe("Campaign or ad set ID that will own the budget schedule"),
      parent_type: z.enum(["campaign", "adset"]).default("campaign").describe("Type of parent object"),
      budget_value: z.number().int().positive().describe("Unsigned value interpreted according to budget_value_type (ABSOLUTE uses currency minor units)"),
      budget_value_type: z.enum(["ABSOLUTE", "MULTIPLIER"]).describe("How budget_value is applied"),
      time_start: z.number().int().positive().describe("Schedule start time as a Unix timestamp"),
      time_end: z.number().int().positive().describe("Schedule end time as a Unix timestamp"),
    },
    async ({ parent_id, parent_type, budget_value, budget_value_type, time_start, time_end }) => {
      try {
        if (time_end <= time_start) {
          throw new Error("time_end must be later than time_start.");
        }
        const params: Record<string, unknown> = {
          budget_value,
          budget_value_type,
          time_start,
          time_end,
        };
        const { data, rateLimit } = await client.post(
          buildBudgetSchedulePath(parent_id, parent_type),
          params
        );
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
      budget_value: z.number().int().positive().optional().describe("New unsigned value interpreted according to budget_value_type"),
      budget_value_type: z.enum(["ABSOLUTE", "MULTIPLIER"]).optional().describe("How budget_value is applied"),
      time_start: z.number().int().positive().optional().describe("New start time as a Unix timestamp"),
      time_end: z.number().int().positive().optional().describe("New end time as a Unix timestamp"),
    },
    async ({ schedule_id, budget_value, budget_value_type, time_start, time_end }) => {
      try {
        if (
          time_start !== undefined &&
          time_end !== undefined &&
          time_end <= time_start
        ) {
          throw new Error("time_end must be later than time_start.");
        }
        const params: Record<string, unknown> = {};
        if (budget_value !== undefined) params.budget_value = budget_value;
        if (budget_value_type !== undefined) params.budget_value_type = budget_value_type;
        if (time_start !== undefined) params.time_start = time_start;
        if (time_end !== undefined) params.time_end = time_end;
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
