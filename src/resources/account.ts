import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";

export function registerResources(server: McpServer, client: AdsClient) {
  server.resource(
    "account-info",
    "ads://account",
    {
      description: "Ad account overview — status, balance, currency, timezone, and total spend",
      mimeType: "application/json",
    },
    async () => {
      const { data } = await client.get(`${client.accountPath}`, {
        fields: "id,name,account_status,balance,currency,timezone_name,amount_spent,business_name",
      });
      return {
        contents: [
          {
            uri: "ads://account",
            mimeType: "application/json",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  server.resource(
    "campaigns-overview",
    "ads://campaigns-overview",
    {
      description: "All active campaigns with budget information",
      mimeType: "application/json",
    },
    async () => {
      const { data } = await client.get(`${client.accountPath}/campaigns`, {
        fields: "id,name,status,objective,daily_budget,lifetime_budget",
        effective_status: '["ACTIVE"]',
        limit: "100",
      });
      return {
        contents: [
          {
            uri: "ads://campaigns-overview",
            mimeType: "application/json",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  server.resource(
    "spending-today",
    "ads://spending-today",
    {
      description: "Today's spending summary — spend, impressions, clicks, and reach",
      mimeType: "application/json",
    },
    async () => {
      const { data } = await client.get(`${client.accountPath}/insights`, {
        date_preset: "today",
        fields: "spend,impressions,clicks,reach",
      });
      return {
        contents: [
          {
            uri: "ads://spending-today",
            mimeType: "application/json",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );
}
