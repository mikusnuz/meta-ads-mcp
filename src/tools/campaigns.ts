import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";

export function registerCampaignTools(server: McpServer, client: AdsClient): void {
  // ─── list_campaigns ────────────────────────────────────────
  server.tool(
    "list_campaigns",
    "List campaigns in the ad account. Supports filtering by status and objective. Returns paginated results.",
    {
      status: z.string().optional().describe("Filter by status: ACTIVE, PAUSED, DELETED, ARCHIVED"),
      objective: z.string().optional().describe("Filter by objective: OUTCOME_AWARENESS, OUTCOME_ENGAGEMENT, OUTCOME_LEADS, OUTCOME_SALES, OUTCOME_TRAFFIC, OUTCOME_APP_PROMOTION"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results (default 25)"),
      after: z.string().optional().describe("Pagination cursor for next page"),
      before: z.string().optional().describe("Pagination cursor for previous page"),
      account_id: z.string().optional().describe("Ad account ID to query (e.g. 'act_123' or '123'). Falls back to META_AD_ACCOUNT_ID env var if omitted."),
    },
    async ({ status, objective, fields, limit, after, before, account_id }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        if (limit) params.limit = limit;
        if (after) params.after = after;
        if (before) params.before = before;
        if (status) params.effective_status = `["${status}"]`;
        if (objective) params.objective = objective;
        const { data, rateLimit } = await client.get(`${client.accountPath(account_id)}/campaigns`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_campaign ──────────────────────────────────────────
  server.tool(
    "get_campaign",
    "Get details of a specific campaign by ID.",
    {
      campaign_id: z.string().describe("Campaign ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
    },
    async ({ campaign_id, fields }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        const { data, rateLimit } = await client.get(`/${campaign_id}`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── create_campaign ───────────────────────────────────────
  server.tool(
    "create_campaign",
    "Create a new ad campaign. Defaults to PAUSED status. Requires name and objective. Budget can be set at campaign or ad set level.",
    {
      name: z.string().describe("Campaign name"),
      objective: z.enum([
        "OUTCOME_AWARENESS",
        "OUTCOME_ENGAGEMENT",
        "OUTCOME_LEADS",
        "OUTCOME_SALES",
        "OUTCOME_TRAFFIC",
        "OUTCOME_APP_PROMOTION",
      ]).describe("Campaign objective"),
      status: z.string().optional().default("PAUSED").describe("Campaign status (default PAUSED)"),
      daily_budget: z.string().optional().describe("Daily budget in account currency cents (e.g. '5000' = $50.00)"),
      lifetime_budget: z.string().optional().describe("Lifetime budget in account currency cents"),
      special_ad_categories: z.string().optional().describe("JSON array of special ad categories: HOUSING, EMPLOYMENT, FINANCIAL_PRODUCTS_SERVICES, ISSUES_ELECTIONS_POLITICS, NONE. This field is required by Meta on every campaign — pass '[]' or '[\"NONE\"]' if none apply. CREDIT was renamed to FINANCIAL_PRODUCTS_SERVICES; the old name is no longer accepted."),
      special_ad_category_country: z.string().optional().describe("JSON array of ISO 3166-1 alpha-2 country codes, e.g. '[\"US\"]'. Required for ISSUES_ELECTIONS_POLITICS (which also requires authorization to run ads in those countries). For HOUSING, EMPLOYMENT, and FINANCIAL_PRODUCTS_SERVICES it is optional and defaults to the ad account's listed tax country if omitted."),
      start_time: z.string().optional().describe("Campaign start time (ISO 8601 format)"),
      stop_time: z.string().optional().describe("Campaign stop time (ISO 8601 format)"),
      bid_strategy: z.string().optional().describe("Bid strategy: LOWEST_COST_WITHOUT_CAP, LOWEST_COST_WITH_BID_CAP, COST_CAP, LOWEST_COST_WITH_MIN_ROAS. Meta defaults new campaigns to LOWEST_COST_WITH_BID_CAP, which requires a bid_amount on every ad set — pass LOWEST_COST_WITHOUT_CAP to avoid that."),
      spend_cap: z.string().optional().describe("Lifetime spend cap for the campaign, in account currency cents. Once set it cannot be removed, only raised or reset — pass '0' to reset/clear it."),
      is_adset_budget_sharing_enabled: z.boolean().optional().describe("Whether ad sets under this campaign can share budget with each other. Required on some newer ad accounts — omitting it can cause campaign creation to fail with 'Must specify True or False in is_adset_budget_sharing_enabled'."),
      account_id: z.string().optional().describe("Ad account ID to create the campaign in (e.g. 'act_123' or '123'). Falls back to META_AD_ACCOUNT_ID env var if omitted."),
    },
    async ({ name, objective, status, daily_budget, lifetime_budget, special_ad_categories, special_ad_category_country, start_time, stop_time, bid_strategy, spend_cap, is_adset_budget_sharing_enabled, account_id }) => {
      try {
        const params: Record<string, unknown> = { name, objective, status };
        if (daily_budget) params.daily_budget = daily_budget;
        if (lifetime_budget) params.lifetime_budget = lifetime_budget;
        if (special_ad_categories) params.special_ad_categories = special_ad_categories;
        if (special_ad_category_country) params.special_ad_category_country = special_ad_category_country;
        if (start_time) params.start_time = start_time;
        if (stop_time) params.stop_time = stop_time;
        if (bid_strategy) params.bid_strategy = bid_strategy;
        if (spend_cap) params.spend_cap = spend_cap;
        if (is_adset_budget_sharing_enabled !== undefined) params.is_adset_budget_sharing_enabled = is_adset_budget_sharing_enabled;
        const { data, rateLimit } = await client.post(`${client.accountPath(account_id)}/campaigns`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── update_campaign ───────────────────────────────────────
  server.tool(
    "update_campaign",
    "Update an existing campaign. Only provided fields will be modified.",
    {
      campaign_id: z.string().describe("Campaign ID to update"),
      name: z.string().optional().describe("New campaign name"),
      status: z.string().optional().describe("New status: ACTIVE, PAUSED, DELETED, ARCHIVED"),
      daily_budget: z.string().optional().describe("New daily budget in currency cents"),
      lifetime_budget: z.string().optional().describe("New lifetime budget in currency cents"),
      start_time: z.string().optional().describe("New start time (ISO 8601)"),
      stop_time: z.string().optional().describe("New stop time (ISO 8601)"),
      bid_strategy: z.string().optional().describe("New bid strategy: LOWEST_COST_WITHOUT_CAP, LOWEST_COST_WITH_BID_CAP, COST_CAP, LOWEST_COST_WITH_MIN_ROAS"),
      spend_cap: z.string().optional().describe("Lifetime spend cap for the campaign, in account currency cents. Once set it cannot be removed, only raised or reset — pass '0' to reset/clear it."),
    },
    async ({ campaign_id, name, status, daily_budget, lifetime_budget, start_time, stop_time, bid_strategy, spend_cap }) => {
      try {
        const params: Record<string, unknown> = {};
        if (name) params.name = name;
        if (status) params.status = status;
        if (daily_budget) params.daily_budget = daily_budget;
        if (lifetime_budget) params.lifetime_budget = lifetime_budget;
        if (start_time) params.start_time = start_time;
        if (stop_time) params.stop_time = stop_time;
        if (bid_strategy) params.bid_strategy = bid_strategy;
        if (spend_cap) params.spend_cap = spend_cap;
        const { data, rateLimit } = await client.post(`/${campaign_id}`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── delete_campaign ───────────────────────────────────────
  server.tool(
    "delete_campaign",
    "Delete a campaign. This action is irreversible.",
    {
      campaign_id: z.string().describe("Campaign ID to delete"),
    },
    async ({ campaign_id }) => {
      try {
        const { data, rateLimit } = await client.delete(`/${campaign_id}`);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: true, ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── copy_campaign ──────────────────────────────────────────
  server.tool(
    "copy_campaign",
    "Copy an existing campaign. Creates a duplicate with optional name override. Copies structure including ad sets and ads.",
    {
      campaign_id: z.string().describe("Source campaign ID to copy"),
      name: z.string().optional().describe("Name for the copied campaign. Defaults to 'Copy of <original>'"),
      status: z.string().optional().default("PAUSED").describe("Status for copied campaign (default PAUSED)"),
      deep_copy: z.boolean().optional().default(true).describe("Copy ad sets and ads within the campaign (default true)"),
    },
    async ({ campaign_id, name, status, deep_copy }) => {
      try {
        const params: Record<string, unknown> = {};
        if (name) params.rename_options = JSON.stringify({ rename_suffix: "", rename_prefix: "", new_name_prefix: name });
        if (status) params.status_option = status;
        if (deep_copy !== undefined) params.deep_copy = deep_copy;
        const { data, rateLimit } = await client.post(`/${campaign_id}/copies`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_campaign_adsets ───────────────────────────────────
  server.tool(
    "get_campaign_adsets",
    "Get all ad sets belonging to a specific campaign.",
    {
      campaign_id: z.string().describe("Campaign ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results (default 25)"),
      after: z.string().optional().describe("Pagination cursor for next page"),
    },
    async ({ campaign_id, fields, limit, after }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        if (limit) params.limit = limit;
        if (after) params.after = after;
        const { data, rateLimit } = await client.get(`/${campaign_id}/adsets`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_campaign_ads ──────────────────────────────────────
  server.tool(
    "get_campaign_ads",
    "Get all ads belonging to a specific campaign.",
    {
      campaign_id: z.string().describe("Campaign ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results (default 25)"),
      after: z.string().optional().describe("Pagination cursor for next page"),
    },
    async ({ campaign_id, fields, limit, after }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        if (limit) params.limit = limit;
        if (after) params.after = after;
        const { data, rateLimit } = await client.get(`/${campaign_id}/ads`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_campaign_leads ────────────────────────────────────
  server.tool(
    "get_campaign_leads",
    "Get leads generated by a specific campaign. Requires leads_retrieval permission.",
    {
      campaign_id: z.string().describe("Campaign ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results (default 25)"),
      after: z.string().optional().describe("Pagination cursor for next page"),
    },
    async ({ campaign_id, fields, limit, after }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        if (limit) params.limit = limit;
        if (after) params.after = after;
        const { data, rateLimit } = await client.get(`/${campaign_id}/leads`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
