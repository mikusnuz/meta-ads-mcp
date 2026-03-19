import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";

export function registerRuleTools(server: McpServer, client: AdsClient): void {
  // ─── list_rules ────────────────────────────────────────────
  server.tool(
    "list_rules",
    "List automated rules for the ad account.",
    {
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results to return"),
      after: z.string().optional().describe("Pagination cursor for next page"),
    },
    async (params) => {
      try {
        const { data, rateLimit } = await client.get(`${client.accountPath}/adrules_library`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_rule ──────────────────────────────────────────────
  server.tool(
    "get_rule",
    "Get details of a specific automated rule.",
    {
      rule_id: z.string().describe("Rule ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
    },
    async ({ rule_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.get(`/${rule_id}`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── create_rule ───────────────────────────────────────────
  server.tool(
    "create_rule",
    "Create a new automated rule for the ad account.",
    {
      name: z.string().describe("Rule name"),
      evaluation_spec: z.string().describe("JSON string defining rule conditions"),
      execution_spec: z.string().describe("JSON string defining rule actions"),
      schedule_spec: z.string().optional().describe("JSON string defining rule schedule"),
    },
    async (params) => {
      try {
        const { data, rateLimit } = await client.post(`${client.accountPath}/adrules_library`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── update_rule ───────────────────────────────────────────
  server.tool(
    "update_rule",
    "Update an existing automated rule.",
    {
      rule_id: z.string().describe("Rule ID"),
      name: z.string().optional().describe("New rule name"),
      evaluation_spec: z.string().optional().describe("JSON string defining updated rule conditions"),
      execution_spec: z.string().optional().describe("JSON string defining updated rule actions"),
      schedule_spec: z.string().optional().describe("JSON string defining updated rule schedule"),
      status: z.string().optional().describe("Rule status: ENABLED, DISABLED"),
    },
    async ({ rule_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.post(`/${rule_id}`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── delete_rule ───────────────────────────────────────────
  server.tool(
    "delete_rule",
    "Delete an automated rule.",
    {
      rule_id: z.string().describe("Rule ID"),
    },
    async ({ rule_id }) => {
      try {
        const { data, rateLimit } = await client.delete(`/${rule_id}`);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
