import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";

export function registerAudienceTools(server: McpServer, client: AdsClient): void {
  // ─── list_custom_audiences ─────────────────────────────────
  server.tool(
    "list_custom_audiences",
    "List custom audiences in the ad account.",
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
        const { data, rateLimit } = await client.get(`${client.accountPath}/customaudiences`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_audience ──────────────────────────────────────────
  server.tool(
    "get_audience",
    "Get details of a specific custom audience by ID.",
    {
      audience_id: z.string().describe("Audience ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
    },
    async ({ audience_id, fields }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        const { data, rateLimit } = await client.get(`/${audience_id}`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── create_custom_audience ────────────────────────────────
  server.tool(
    "create_custom_audience",
    "Create a new custom audience. Subtype determines the audience source (CUSTOM, WEBSITE, APP, OFFLINE_CONVERSION, LOOKALIKE, ENGAGEMENT, etc.).",
    {
      name: z.string().describe("Audience name"),
      subtype: z.enum([
        "CUSTOM",
        "WEBSITE",
        "APP",
        "OFFLINE_CONVERSION",
        "CLAIM",
        "PARTNER",
        "MANAGED",
        "VIDEO",
        "LOOKALIKE",
        "ENGAGEMENT",
        "BAG_OF_ACCOUNTS",
        "STUDY_RULE_AUDIENCE",
        "FOX",
      ]).describe("Audience subtype"),
      description: z.string().optional().describe("Audience description"),
      customer_file_source: z.string().optional().describe("Source of customer file: USER_PROVIDED_ONLY, PARTNER_PROVIDED_ONLY, BOTH_USER_AND_PARTNER_PROVIDED"),
    },
    async ({ name, subtype, description, customer_file_source }) => {
      try {
        const params: Record<string, unknown> = { name, subtype };
        if (description) params.description = description;
        if (customer_file_source) params.customer_file_source = customer_file_source;
        const { data, rateLimit } = await client.post(`${client.accountPath}/customaudiences`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── update_audience ───────────────────────────────────────
  server.tool(
    "update_audience",
    "Update an existing custom audience. Only provided fields will be modified.",
    {
      audience_id: z.string().describe("Audience ID to update"),
      name: z.string().optional().describe("New audience name"),
      description: z.string().optional().describe("New audience description"),
    },
    async ({ audience_id, name, description }) => {
      try {
        const params: Record<string, unknown> = {};
        if (name) params.name = name;
        if (description) params.description = description;
        const { data, rateLimit } = await client.post(`/${audience_id}`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── delete_audience ───────────────────────────────────────
  server.tool(
    "delete_audience",
    "Delete a custom audience. This action is irreversible.",
    {
      audience_id: z.string().describe("Audience ID to delete"),
    },
    async ({ audience_id }) => {
      try {
        const { data, rateLimit } = await client.delete(`/${audience_id}`);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: true, ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── add_users_to_audience ─────────────────────────────────
  server.tool(
    "add_users_to_audience",
    "Add users to a custom audience. Payload must be a JSON string containing hashed user data with a schema array defining the data types (e.g. EMAIL, PHONE, FN, LN).",
    {
      audience_id: z.string().describe("Audience ID"),
      payload: z.string().describe("JSON string: {schema: ['EMAIL','PHONE',...], data: [['hash1','hash2',...], ...]}. All PII must be SHA-256 hashed."),
    },
    async ({ audience_id, payload }) => {
      try {
        const { data, rateLimit } = await client.post(`/${audience_id}/users`, { payload });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── remove_users_from_audience ────────────────────────────
  server.tool(
    "remove_users_from_audience",
    "Remove users from a custom audience. Payload format is the same as add_users_to_audience.",
    {
      audience_id: z.string().describe("Audience ID"),
      payload: z.string().describe("JSON string: {schema: ['EMAIL','PHONE',...], data: [['hash1','hash2',...], ...]}. All PII must be SHA-256 hashed."),
    },
    async ({ audience_id, payload }) => {
      try {
        const { data, rateLimit } = await client.delete(`/${audience_id}/users`, { payload });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── create_lookalike_audience ─────────────────────────────
  server.tool(
    "create_lookalike_audience",
    "Create a lookalike audience based on an existing custom audience. Ratio (1-10) determines how closely the new audience resembles the source.",
    {
      name: z.string().describe("Lookalike audience name"),
      origin_audience_id: z.string().describe("Source custom audience ID"),
      lookalike_spec: z.string().describe("JSON string: {country: 'US', ratio: 0.01-0.10} where ratio is the lookalike percentage (1%-10%)"),
    },
    async ({ name, origin_audience_id, lookalike_spec }) => {
      try {
        const params: Record<string, unknown> = {
          name,
          subtype: "LOOKALIKE",
          origin_audience_id,
          lookalike_spec,
        };
        const { data, rateLimit } = await client.post(`${client.accountPath}/customaudiences`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── list_saved_audiences ──────────────────────────────────
  server.tool(
    "list_saved_audiences",
    "List saved audiences in the ad account. Saved audiences are reusable targeting presets.",
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
        const { data, rateLimit } = await client.get(`${client.accountPath}/saved_audiences`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_saved_audience ────────────────────────────────────
  server.tool(
    "get_saved_audience",
    "Get details of a specific saved audience by ID.",
    {
      audience_id: z.string().describe("Saved audience ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
    },
    async ({ audience_id, fields }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        const { data, rateLimit } = await client.get(`/${audience_id}`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
