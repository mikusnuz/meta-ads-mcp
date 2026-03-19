import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";

export function registerAdLibraryTools(server: McpServer, client: AdsClient): void {
  // ─── search_ad_library ────────────────────────────────────────
  server.tool(
    "search_ad_library",
    "Search the Meta Ad Library for ads. Allows searching by keywords, countries, and ad type. Useful for competitive research and transparency.",
    {
      search_terms: z.string().describe("Keywords to search for in ads"),
      ad_reached_countries: z.string().describe("Comma-separated country codes where ads were shown (e.g. 'US,GB,KR')"),
      ad_type: z.string().optional().describe("Ad type filter: ALL, POLITICAL_AND_ISSUE_ADS, HOUSING_ADS, etc."),
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results (default 25)"),
      after: z.string().optional().describe("Pagination cursor for next page"),
      order_by: z.string().optional().describe("Sort order for results"),
    },
    async ({ search_terms, ad_reached_countries, ad_type, fields, limit, after, order_by }) => {
      try {
        const params: Record<string, unknown> = {
          search_terms,
          ad_reached_countries,
        };
        if (ad_type) params.ad_type = ad_type;
        if (fields) params.fields = fields;
        if (limit) params.limit = limit;
        if (after) params.after = after;
        if (order_by) params.order_by = order_by;
        const { data, rateLimit } = await client.get(`/ads_archive`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
