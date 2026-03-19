import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";

export function registerAuthTools(server: McpServer, client: AdsClient): void {
  // ─── exchange_token ───────────────────────────────────────────
  server.tool(
    "exchange_token",
    "Exchange a short-lived access token for a long-lived token. Requires META_APP_ID and META_APP_SECRET to be configured.",
    {
      short_lived_token: z.string().describe("Short-lived access token to exchange"),
    },
    async ({ short_lived_token }) => {
      try {
        const { data } = await client.exchangeToken(short_lived_token);
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── refresh_token ────────────────────────────────────────────
  server.tool(
    "refresh_token",
    "Refresh a long-lived access token to extend its expiration. Returns a new long-lived token.",
    {
      long_lived_token: z.string().describe("Long-lived access token to refresh"),
    },
    async ({ long_lived_token }) => {
      try {
        const { data } = await client.refreshToken(long_lived_token);
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── debug_token ──────────────────────────────────────────────
  server.tool(
    "debug_token",
    "Debug an access token to inspect its properties, permissions, expiration, and validity. Requires META_APP_ID and META_APP_SECRET.",
    {
      input_token: z.string().describe("Access token to debug/inspect"),
    },
    async ({ input_token }) => {
      try {
        const { data } = await client.debugToken(input_token);
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
