import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";

export function registerTargetingTools(server: McpServer, client: AdsClient): void {
  // ─── search_targeting ──────────────────────────────────────
  server.tool(
    "search_targeting",
    "Search for targeting options (interests, behaviors, demographics, etc.) by keyword. Use this to find valid targeting IDs for ad set targeting specs.",
    {
      q: z.string().describe("Search query (e.g. 'fitness', 'technology', 'cooking')"),
      type: z.string().optional().describe("Targeting type filter: adinterest, adgeolocation, adeducationschool, adeducationmajor, adworkemployer, adworkposition, adlocale, etc."),
      limit: z.number().optional().default(25).describe("Number of results (default 25)"),
    },
    async ({ q, type, limit }) => {
      try {
        const params: Record<string, unknown> = { q };
        if (type) params.type = type;
        if (limit) params.limit = limit;
        const { data, rateLimit } = await client.get(`${client.accountPath}/targetingsearch`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── search_locations ──────────────────────────────────────
  server.tool(
    "search_locations",
    "Search for geographic locations (countries, regions, cities, zip codes) for ad targeting.",
    {
      q: z.string().describe("Search query (e.g. 'New York', 'California', 'United States')"),
      location_types: z.string().optional().describe("Comma-separated location types: country, region, city, zip, geo_market, electoral_district"),
      limit: z.number().optional().default(25).describe("Number of results (default 25)"),
    },
    async ({ q, location_types, limit }) => {
      try {
        const params: Record<string, unknown> = { q, type: "adgeolocation" };
        if (location_types) params.location_types = location_types;
        if (limit) params.limit = limit;
        const { data, rateLimit } = await client.get(`/search`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── search_targeting_map ──────────────────────────────────
  server.tool(
    "search_targeting_map",
    "Map targeting IDs to their full details (names, types, paths). Useful for resolving IDs obtained from other endpoints.",
    {
      targeting_list: z.string().describe("JSON array of targeting IDs to look up"),
    },
    async ({ targeting_list }) => {
      try {
        const { data, rateLimit } = await client.get(`${client.accountPath}/targetingsearchmap`, { targeting_list });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_reach_estimate ────────────────────────────────────
  server.tool(
    "get_reach_estimate",
    "Get estimated audience reach for a given targeting specification. Useful for planning campaigns before creating them.",
    {
      targeting_spec: z.string().describe("JSON string of targeting spec (same format as ad set targeting)"),
    },
    async ({ targeting_spec }) => {
      try {
        const { data, rateLimit } = await client.get(`${client.accountPath}/reachestimate`, { targeting_spec });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_targeting_suggestions ─────────────────────────────
  server.tool(
    "get_targeting_suggestions",
    "Get targeting suggestions based on existing targeting criteria. Meta suggests related interests, behaviors, and demographics.",
    {
      targeting_list: z.string().describe("JSON string of current targeting criteria to get suggestions for"),
    },
    async ({ targeting_list }) => {
      try {
        const { data, rateLimit } = await client.get(`${client.accountPath}/targetingsuggestions`, { targeting_list });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
