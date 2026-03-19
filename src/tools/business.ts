import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";

export function registerBusinessTools(server: McpServer, client: AdsClient): void {
  // ─── list_businesses ──────────────────────────────────────────
  server.tool(
    "list_businesses",
    "List all businesses accessible by the current user. Returns paginated results.",
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
        const { data, rateLimit } = await client.get(`/me/businesses`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_business ─────────────────────────────────────────────
  server.tool(
    "get_business",
    "Get details of a specific business by ID.",
    {
      business_id: z.string().describe("Business ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
    },
    async ({ business_id, fields }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        const { data, rateLimit } = await client.get(`/${business_id}`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── list_business_ad_accounts ────────────────────────────────
  server.tool(
    "list_business_ad_accounts",
    "List ad accounts owned by the configured business. Requires META_BUSINESS_ID env var.",
    {
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results (default 25)"),
      after: z.string().optional().describe("Pagination cursor for next page"),
    },
    async ({ fields, limit, after }) => {
      try {
        let businessId: string;
        try {
          businessId = client.businessId;
        } catch {
          return { content: [{ type: "text" as const, text: "META_BUSINESS_ID environment variable is required for this operation. Please set it and restart the server." }], isError: true };
        }
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        if (limit) params.limit = limit;
        if (after) params.after = after;
        const { data, rateLimit } = await client.get(`/${businessId}/owned_ad_accounts`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── list_business_users ──────────────────────────────────────
  server.tool(
    "list_business_users",
    "List users of the configured business. Requires META_BUSINESS_ID env var.",
    {
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results (default 25)"),
      after: z.string().optional().describe("Pagination cursor for next page"),
    },
    async ({ fields, limit, after }) => {
      try {
        let businessId: string;
        try {
          businessId = client.businessId;
        } catch {
          return { content: [{ type: "text" as const, text: "META_BUSINESS_ID environment variable is required for this operation. Please set it and restart the server." }], isError: true };
        }
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        if (limit) params.limit = limit;
        if (after) params.after = after;
        const { data, rateLimit } = await client.get(`/${businessId}/business_users`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── add_business_user ────────────────────────────────────────
  server.tool(
    "add_business_user",
    "Add a user to the configured business by email. Requires META_BUSINESS_ID env var.",
    {
      email: z.string().describe("Email address of the user to add"),
      role: z.enum(["ADMIN", "EMPLOYEE"]).describe("Role for the new user"),
    },
    async ({ email, role }) => {
      try {
        let businessId: string;
        try {
          businessId = client.businessId;
        } catch {
          return { content: [{ type: "text" as const, text: "META_BUSINESS_ID environment variable is required for this operation. Please set it and restart the server." }], isError: true };
        }
        const params: Record<string, unknown> = { email, role };
        const { data, rateLimit } = await client.post(`/${businessId}/business_users`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── remove_business_user ─────────────────────────────────────
  server.tool(
    "remove_business_user",
    "Remove a user from the configured business. Requires META_BUSINESS_ID env var.",
    {
      user_id: z.string().describe("User ID to remove from the business"),
    },
    async ({ user_id }) => {
      try {
        let businessId: string;
        try {
          businessId = client.businessId;
        } catch {
          return { content: [{ type: "text" as const, text: "META_BUSINESS_ID environment variable is required for this operation. Please set it and restart the server." }], isError: true };
        }
        const { data, rateLimit } = await client.delete(`/${businessId}/userpermissions`, { user: user_id });
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: true, ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── list_system_users ────────────────────────────────────────
  server.tool(
    "list_system_users",
    "List system users of the configured business. Requires META_BUSINESS_ID env var.",
    {
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results (default 25)"),
      after: z.string().optional().describe("Pagination cursor for next page"),
    },
    async ({ fields, limit, after }) => {
      try {
        let businessId: string;
        try {
          businessId = client.businessId;
        } catch {
          return { content: [{ type: "text" as const, text: "META_BUSINESS_ID environment variable is required for this operation. Please set it and restart the server." }], isError: true };
        }
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        if (limit) params.limit = limit;
        if (after) params.after = after;
        const { data, rateLimit } = await client.get(`/${businessId}/system_users`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── create_system_user ───────────────────────────────────────
  server.tool(
    "create_system_user",
    "Create a new system user in the configured business. Requires META_BUSINESS_ID env var.",
    {
      name: z.string().describe("Name for the system user"),
      role: z.enum(["ADMIN", "EMPLOYEE"]).describe("Role for the system user"),
    },
    async ({ name, role }) => {
      try {
        let businessId: string;
        try {
          businessId = client.businessId;
        } catch {
          return { content: [{ type: "text" as const, text: "META_BUSINESS_ID environment variable is required for this operation. Please set it and restart the server." }], isError: true };
        }
        const params: Record<string, unknown> = { name, role };
        const { data, rateLimit } = await client.post(`/${businessId}/system_users`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
