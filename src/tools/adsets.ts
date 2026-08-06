import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";

export function registerAdsetTools(server: McpServer, client: AdsClient): void {
  // ─── list_adsets ───────────────────────────────────────────
  server.tool(
    "list_adsets",
    "List ad sets in the ad account. Optionally filter by campaign or status.",
    {
      campaign_id: z.string().optional().describe("Filter by campaign ID"),
      status: z.string().optional().describe("Filter by status: ACTIVE, PAUSED, DELETED, ARCHIVED"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results (default 25)"),
      after: z.string().optional().describe("Pagination cursor for next page"),
      account_id: z.string().optional().describe("Ad account ID to query (e.g. 'act_123' or '123'). Falls back to META_AD_ACCOUNT_ID env var if omitted."),
    },
    async ({ campaign_id, status, fields, limit, after, account_id }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        if (limit) params.limit = limit;
        if (after) params.after = after;
        if (campaign_id) params.campaign_id = campaign_id;
        if (status) params.effective_status = `["${status}"]`;
        const { data, rateLimit } = await client.get(`${client.accountPath(account_id)}/adsets`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_adset ─────────────────────────────────────────────
  server.tool(
    "get_adset",
    "Get details of a specific ad set by ID.",
    {
      adset_id: z.string().describe("Ad set ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
    },
    async ({ adset_id, fields }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        const { data, rateLimit } = await client.get(`/${adset_id}`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── create_adset ──────────────────────────────────────────
  server.tool(
    "create_adset",
    "Create a new ad set. Requires name, campaign_id, budget, optimization_goal, billing_event, and targeting. Defaults to PAUSED status.",
    {
      name: z.string().describe("Ad set name"),
      campaign_id: z.string().describe("Parent campaign ID"),
      daily_budget: z.string().optional().describe("Daily budget in currency cents (e.g. '5000' = $50.00)"),
      lifetime_budget: z.string().optional().describe("Lifetime budget in currency cents"),
      optimization_goal: z.string().describe("Optimization goal: NONE, APP_INSTALLS, AD_RECALL_LIFT, ENGAGED_USERS, EVENT_RESPONSES, IMPRESSIONS, LEAD_GENERATION, QUALITY_LEAD, LINK_CLICKS, OFFSITE_CONVERSIONS, PAGE_LIKES, POST_ENGAGEMENT, QUALITY_CALL, REACH, LANDING_PAGE_VIEWS, VISIT_INSTAGRAM_PROFILE, ENGAGED_PAGE_VIEWS, VALUE, THRUPLAY, DERIVED_EVENTS, APP_INSTALLS_AND_OFFSITE_CONVERSIONS, CONVERSATIONS, IN_APP_VALUE, MESSAGING_PURCHASE_CONVERSION, MESSAGING_DEEP_CONVERSATION_AND_FOLLOW, SUBSCRIBERS, REMINDERS_SET, MEANINGFUL_CALL_ATTEMPT, PROFILE_VISIT, PROFILE_AND_PAGE_ENGAGEMENT, ADVERTISER_SILOED_VALUE, AUTOMATIC_OBJECTIVE, MESSAGING_APPOINTMENT_CONVERSION"),
      billing_event: z.string().describe("Billing event: APP_INSTALLS, CLICKS, IMPRESSIONS, LINK_CLICKS, NONE, OFFER_CLAIMS, PAGE_LIKES, POST_ENGAGEMENT, THRUPLAY, PURCHASE, LISTING_INTERACTION"),
      bid_strategy: z.string().optional().describe("Bid strategy: LOWEST_COST_WITHOUT_CAP, LOWEST_COST_WITH_BID_CAP, COST_CAP, LOWEST_COST_WITH_MIN_ROAS"),
      targeting: z.string().describe("JSON string of targeting spec (age_min, age_max, genders, geo_locations, interests, etc.). Advantage+ Audience automation and other flags go inside this object too, e.g. targeting_automation: {\"advantage_audience\":1}. As of v26.0, ad sets in the Housing, Employment, or Financial Products and Services (HEC-F) special ad categories with relaxable (non-broad) targeting must explicitly set targeting.targeting_automation.advantage_audience to 1 or 0 — omitting it now returns ADS_TARGETING__REQUIRE_EXPLICIT_ADVANTAGE_AUDIENCE_FLAG. Not required for broad/default audience setups. Also note: as of Marketing API v26.0, the Instagram Explore Feed placement was removed (explicitly specifying it in publisher_platforms/instagram_positions now returns an error) and the 'story' value in messenger_positions is silently dropped."),
      promoted_object: z.string().optional().describe("JSON string of the promoted_object spec. Required for many objectives, e.g. OUTCOME_SALES needs {\"pixel_id\":\"...\",\"custom_event_type\":\"PURCHASE\"}, OUTCOME_APP_PROMOTION needs {\"application_id\":\"...\",\"object_store_url\":\"...\"}, OUTCOME_ENGAGEMENT page-like ads need {\"page_id\":\"...\"}. Omitting it when the objective requires one causes ad set creation to fail."),
      start_time: z.string().optional().describe("Start time (ISO 8601)"),
      end_time: z.string().optional().describe("End time (ISO 8601)"),
      status: z.string().optional().default("PAUSED").describe("Ad set status (default PAUSED)"),
      account_id: z.string().optional().describe("Ad account ID to create the ad set in (e.g. 'act_123' or '123'). Falls back to META_AD_ACCOUNT_ID env var if omitted."),
    },
    async ({ name, campaign_id, daily_budget, lifetime_budget, optimization_goal, billing_event, bid_strategy, targeting, promoted_object, start_time, end_time, status, account_id }) => {
      try {
        const params: Record<string, unknown> = {
          name,
          campaign_id,
          optimization_goal,
          billing_event,
          targeting,
          status,
        };
        if (daily_budget) params.daily_budget = daily_budget;
        if (lifetime_budget) params.lifetime_budget = lifetime_budget;
        if (bid_strategy) params.bid_strategy = bid_strategy;
        if (promoted_object) params.promoted_object = promoted_object;
        if (start_time) params.start_time = start_time;
        if (end_time) params.end_time = end_time;
        const { data, rateLimit } = await client.post(`${client.accountPath(account_id)}/adsets`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── update_adset ──────────────────────────────────────────
  server.tool(
    "update_adset",
    "Update an existing ad set. Only provided fields will be modified.",
    {
      adset_id: z.string().describe("Ad set ID to update"),
      name: z.string().optional().describe("New ad set name"),
      status: z.string().optional().describe("New status: ACTIVE, PAUSED, DELETED, ARCHIVED"),
      daily_budget: z.string().optional().describe("New daily budget in currency cents"),
      lifetime_budget: z.string().optional().describe("New lifetime budget in currency cents"),
      targeting: z.string().optional().describe("New targeting spec as JSON string. Advantage+ Audience automation flags go inside this object, e.g. targeting_automation: {\"advantage_audience\":1} — required for HEC-F (Housing/Employment/Financial Products and Services) ad sets with relaxable, non-broad targeting as of v26.0. Note: the Instagram Explore Feed placement was removed in Marketing API v26.0 — requests that explicitly include it now return an error."),
      start_time: z.string().optional().describe("New start time (ISO 8601)"),
      end_time: z.string().optional().describe("New end time (ISO 8601)"),
      bid_amount: z.string().optional().describe("New bid amount in currency cents"),
    },
    async ({ adset_id, name, status, daily_budget, lifetime_budget, targeting, start_time, end_time, bid_amount }) => {
      try {
        const params: Record<string, unknown> = {};
        if (name) params.name = name;
        if (status) params.status = status;
        if (daily_budget) params.daily_budget = daily_budget;
        if (lifetime_budget) params.lifetime_budget = lifetime_budget;
        if (targeting) params.targeting = targeting;
        if (start_time) params.start_time = start_time;
        if (end_time) params.end_time = end_time;
        if (bid_amount) params.bid_amount = bid_amount;
        const { data, rateLimit } = await client.post(`/${adset_id}`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── delete_adset ──────────────────────────────────────────
  server.tool(
    "delete_adset",
    "Delete an ad set. This action is irreversible.",
    {
      adset_id: z.string().describe("Ad set ID to delete"),
    },
    async ({ adset_id }) => {
      try {
        const { data, rateLimit } = await client.delete(`/${adset_id}`);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: true, ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── copy_adset ─────────────────────────────────────────────
  server.tool(
    "copy_adset",
    "Copy an existing ad set. Creates a duplicate within the same or different campaign.",
    {
      adset_id: z.string().describe("Source ad set ID to copy"),
      campaign_id: z.string().optional().describe("Target campaign ID. If omitted, copies to same campaign"),
      name: z.string().optional().describe("Name for the copied ad set"),
      status: z.string().optional().default("PAUSED").describe("Status for copied ad set (default PAUSED)"),
      deep_copy: z.boolean().optional().default(true).describe("Copy ads within the ad set (default true)"),
    },
    async ({ adset_id, campaign_id, name, status, deep_copy }) => {
      try {
        const params: Record<string, unknown> = {};
        if (campaign_id) params.campaign_id = campaign_id;
        if (name) params.rename_options = JSON.stringify({ rename_suffix: "", rename_prefix: "", new_name_prefix: name });
        if (status) params.status_option = status;
        if (deep_copy !== undefined) params.deep_copy = deep_copy;
        const { data, rateLimit } = await client.post(`/${adset_id}/copies`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_adset_targeting_sentence ──────────────────────────
  server.tool(
    "get_adset_targeting_sentence",
    "Get human-readable targeting description for an ad set. Converts targeting spec into readable sentences.",
    {
      adset_id: z.string().describe("Ad set ID"),
    },
    async ({ adset_id }) => {
      try {
        const { data, rateLimit } = await client.get(`/${adset_id}/targetingsentencelines`);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_adset_ads ─────────────────────────────────────────
  server.tool(
    "get_adset_ads",
    "Get all ads belonging to a specific ad set.",
    {
      adset_id: z.string().describe("Ad set ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results (default 25)"),
      after: z.string().optional().describe("Pagination cursor for next page"),
    },
    async ({ adset_id, fields, limit, after }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        if (limit) params.limit = limit;
        if (after) params.after = after;
        const { data, rateLimit } = await client.get(`/${adset_id}/ads`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_adset_leads ───────────────────────────────────────
  server.tool(
    "get_adset_leads",
    "Get leads generated by a specific ad set. Requires leads_retrieval permission.",
    {
      adset_id: z.string().describe("Ad set ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results (default 25)"),
      after: z.string().optional().describe("Pagination cursor for next page"),
    },
    async ({ adset_id, fields, limit, after }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        if (limit) params.limit = limit;
        if (after) params.after = after;
        const { data, rateLimit } = await client.get(`/${adset_id}/leads`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
