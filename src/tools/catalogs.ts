import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";

export function registerCatalogTools(server: McpServer, client: AdsClient): void {
  // ─── list_catalogs ─────────────────────────────────────────
  server.tool(
    "list_catalogs",
    "List product catalogs for the ad account.",
    {
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results to return"),
      after: z.string().optional().describe("Pagination cursor for next page"),
    },
    async (params) => {
      try {
        const { data, rateLimit } = await client.get(`${client.accountPath}/product_catalogs`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_catalog ───────────────────────────────────────────
  server.tool(
    "get_catalog",
    "Get details of a specific product catalog.",
    {
      catalog_id: z.string().describe("Product catalog ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
    },
    async ({ catalog_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.get(`/${catalog_id}`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── create_catalog ────────────────────────────────────────
  server.tool(
    "create_catalog",
    "Create a new product catalog for the ad account.",
    {
      name: z.string().describe("Catalog name"),
      vertical: z.string().optional().describe("Catalog vertical: commerce, hotels, flights, destinations, home_listings, vehicles"),
    },
    async (params) => {
      try {
        const { data, rateLimit } = await client.post(`${client.accountPath}/product_catalogs`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── update_catalog ────────────────────────────────────────
  server.tool(
    "update_catalog",
    "Update an existing product catalog.",
    {
      catalog_id: z.string().describe("Product catalog ID"),
      name: z.string().optional().describe("New catalog name"),
    },
    async ({ catalog_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.post(`/${catalog_id}`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── list_product_sets ─────────────────────────────────────
  server.tool(
    "list_product_sets",
    "List product sets within a catalog.",
    {
      catalog_id: z.string().describe("Product catalog ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results to return"),
      after: z.string().optional().describe("Pagination cursor for next page"),
    },
    async ({ catalog_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.get(`/${catalog_id}/product_sets`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── create_product_set ────────────────────────────────────
  server.tool(
    "create_product_set",
    "Create a new product set within a catalog.",
    {
      catalog_id: z.string().describe("Product catalog ID"),
      name: z.string().describe("Product set name"),
      filter: z.string().optional().describe("JSON string of filter rules for the product set"),
    },
    async ({ catalog_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.post(`/${catalog_id}/product_sets`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_product_set ───────────────────────────────────────
  server.tool(
    "get_product_set",
    "Get details of a specific product set.",
    {
      set_id: z.string().describe("Product set ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
    },
    async ({ set_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.get(`/${set_id}`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── update_product_set ────────────────────────────────────
  server.tool(
    "update_product_set",
    "Update an existing product set.",
    {
      set_id: z.string().describe("Product set ID"),
      name: z.string().optional().describe("New product set name"),
      filter: z.string().optional().describe("JSON string of updated filter rules"),
    },
    async ({ set_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.post(`/${set_id}`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── list_products ─────────────────────────────────────────
  server.tool(
    "list_products",
    "List products within a catalog.",
    {
      catalog_id: z.string().describe("Product catalog ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results to return"),
      after: z.string().optional().describe("Pagination cursor for next page"),
      filter: z.string().optional().describe("JSON string of filter rules"),
    },
    async ({ catalog_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.get(`/${catalog_id}/products`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_product ───────────────────────────────────────────
  server.tool(
    "get_product",
    "Get details of a specific product.",
    {
      product_id: z.string().describe("Product ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
    },
    async ({ product_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.get(`/${product_id}`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── update_product ────────────────────────────────────────
  server.tool(
    "update_product",
    "Update an existing product in a catalog.",
    {
      product_id: z.string().describe("Product ID"),
      name: z.string().optional().describe("Product name"),
      description: z.string().optional().describe("Product description"),
      price: z.string().optional().describe("Product price (e.g. '9.99 USD')"),
      url: z.string().optional().describe("Product URL"),
      image_url: z.string().optional().describe("Product image URL"),
      availability: z.string().optional().describe("Product availability: in stock, out of stock, etc."),
    },
    async ({ product_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.post(`/${product_id}`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── batch_products ────────────────────────────────────────
  server.tool(
    "batch_products",
    "Batch create, update, or delete products in a catalog. Supports up to 5,000 items per request. Update operations support upsert.",
    {
      catalog_id: z.string().describe("Product catalog ID"),
      requests: z.string().describe("JSON array of batch requests. Each: {method: 'CREATE'|'UPDATE'|'DELETE', retailer_id: string, data?: {name, description, price, url, image_url, availability, ...}}"),
      allow_upsert: z.boolean().optional().default(false).describe("Allow UPDATE to create items if they don't exist (default false)"),
    },
    async ({ catalog_id, requests, allow_upsert }) => {
      try {
        const params: Record<string, unknown> = {
          requests,
          item_type: "PRODUCT_ITEM",
        };
        if (allow_upsert) params.allow_upsert = allow_upsert;
        const { data, rateLimit } = await client.post(`/${catalog_id}/items_batch`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_batch_status ──────────────────────────────────────
  server.tool(
    "get_batch_status",
    "Check the status of a catalog batch operation.",
    {
      catalog_id: z.string().describe("Product catalog ID"),
      handle: z.string().describe("Batch handle returned from batch_products"),
    },
    async ({ catalog_id, handle }) => {
      try {
        const { data, rateLimit } = await client.get(`/${catalog_id}/check_batch_request_status`, { handle });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
