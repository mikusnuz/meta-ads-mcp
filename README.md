# meta-ads-mcp

[![npm version](https://img.shields.io/npm/v/@mikusnuz/meta-ads-mcp.svg)](https://www.npmjs.com/package/@mikusnuz/meta-ads-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MCP server for the **Meta Marketing API v25.0** — 123 tools for managing Facebook & Instagram ad campaigns, audiences, creatives, insights, catalogs, and more.

## Installation

```json
{
  "mcpServers": {
    "meta-ads": {
      "command": "npx",
      "args": ["-y", "@mikusnuz/meta-ads-mcp"],
      "env": {
        "META_ADS_ACCESS_TOKEN": "your-access-token",
        "META_AD_ACCOUNT_ID": "123456789",
        "META_APP_ID": "your-app-id",
        "META_APP_SECRET": "your-app-secret",
        "META_BUSINESS_ID": "your-business-id",
        "META_PIXEL_ID": "your-pixel-id"
      }
    }
  }
}
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `META_ADS_ACCESS_TOKEN` | **Yes** | Meta Marketing API access token |
| `META_AD_ACCOUNT_ID` | **Yes** | Ad account ID (numeric, without `act_` prefix) |
| `META_APP_ID` | Optional | App ID — required for token exchange/debug |
| `META_APP_SECRET` | Optional | App secret — required for token exchange/debug |
| `META_BUSINESS_ID` | Optional | Business Manager ID — required for business tools |
| `META_PIXEL_ID` | Optional | Pixel ID — required for conversion tools |

## Tools (123)

### Campaign Management (22)

| Tool | Description |
|---|---|
| `list_campaigns` | List campaigns with filtering and pagination |
| `get_campaign` | Get campaign details by ID |
| `create_campaign` | Create a new campaign |
| `update_campaign` | Update campaign settings |
| `delete_campaign` | Delete a campaign |
| `get_campaign_adsets` | List ad sets within a campaign |
| `get_campaign_ads` | List ads within a campaign |
| `get_campaign_leads` | Get leads from a campaign |
| `list_adsets` | List ad sets with filtering |
| `get_adset` | Get ad set details by ID |
| `create_adset` | Create a new ad set |
| `update_adset` | Update ad set settings |
| `delete_adset` | Delete an ad set |
| `get_adset_ads` | List ads within an ad set |
| `get_adset_leads` | Get leads from an ad set |
| `list_ads` | List ads with filtering |
| `get_ad` | Get ad details by ID |
| `create_ad` | Create a new ad |
| `update_ad` | Update ad settings |
| `delete_ad` | Delete an ad |
| `get_ad_preview` | Generate ad preview HTML |
| `get_delivery_estimate` | Get delivery estimate for an ad |

### Creatives (5)

| Tool | Description |
|---|---|
| `list_creatives` | List ad creatives |
| `get_creative` | Get creative details |
| `create_creative` | Create a new ad creative |
| `update_creative` | Update an ad creative |
| `create_dynamic_creative` | Create a dynamic creative |

### Media Assets (12)

| Tool | Description |
|---|---|
| `list_images` | List ad images |
| `upload_image` | Upload an image from URL |
| `get_image` | Get image details |
| `delete_image` | Delete an image |
| `list_videos` | List ad videos |
| `upload_video` | Upload a video from URL |
| `get_video` | Get video details |
| `delete_video` | Delete a video |
| `list_canvases` | List Instant Experience canvases |
| `get_canvas` | Get canvas details |
| `create_canvas` | Create a canvas |
| `delete_canvas` | Delete a canvas |

### Audiences & Targeting (15)

| Tool | Description |
|---|---|
| `list_custom_audiences` | List custom audiences |
| `get_audience` | Get audience details |
| `create_custom_audience` | Create a custom audience |
| `update_audience` | Update audience settings |
| `delete_audience` | Delete an audience |
| `add_users_to_audience` | Add users to a custom audience |
| `remove_users_from_audience` | Remove users from a custom audience |
| `create_lookalike_audience` | Create a lookalike audience |
| `list_saved_audiences` | List saved audiences |
| `get_saved_audience` | Get saved audience details |
| `search_targeting` | Search targeting interests, behaviors, demographics |
| `search_locations` | Search targetable locations |
| `search_targeting_map` | Browse targeting category tree |
| `get_reach_estimate` | Estimate audience reach for targeting spec |
| `get_targeting_suggestions` | Get related targeting suggestions |

### Insights & Reporting (6)

| Tool | Description |
|---|---|
| `get_account_insights` | Account-level performance metrics |
| `get_campaign_insights` | Campaign-level performance metrics |
| `get_adset_insights` | Ad set-level performance metrics |
| `get_ad_insights` | Ad-level performance metrics |
| `create_async_report` | Create an async insights report |
| `get_async_report` | Poll async report status and results |

### Leads (4)

| Tool | Description |
|---|---|
| `get_form_leads` | Get leads from a lead form |
| `get_lead` | Get a single lead by ID |
| `list_lead_forms` | List lead gen forms for a page |
| `get_lead_form` | Get lead form details |

### Catalog & Commerce (15)

| Tool | Description |
|---|---|
| `list_catalogs` | List product catalogs |
| `get_catalog` | Get catalog details |
| `create_catalog` | Create a product catalog |
| `update_catalog` | Update a catalog |
| `list_product_sets` | List product sets in a catalog |
| `create_product_set` | Create a product set |
| `get_product_set` | Get product set details |
| `update_product_set` | Update a product set |
| `list_products` | List products in a catalog |
| `get_product` | Get product details |
| `update_product` | Update a product |
| `list_feeds` | List data feeds for a catalog |
| `create_feed` | Create a data feed |
| `upload_feed` | Upload data to a feed |
| `get_feed_uploads` | Get feed upload history |

### Automation & Rules (5)

| Tool | Description |
|---|---|
| `list_rules` | List automated rules |
| `get_rule` | Get rule details |
| `create_rule` | Create an automated rule |
| `update_rule` | Update a rule |
| `delete_rule` | Delete a rule |

### Experiments (5)

| Tool | Description |
|---|---|
| `list_experiments` | List A/B test experiments |
| `create_experiment` | Create an experiment |
| `get_experiment` | Get experiment details |
| `update_experiment` | Update an experiment |
| `get_experiment_results` | Get experiment results |

### Conversions (4)

| Tool | Description |
|---|---|
| `send_conversion_event` | Send server-side conversion event via Conversions API |
| `send_offline_event` | Send an offline conversion event |
| `list_offline_event_sets` | List offline event sets |
| `create_offline_event_set` | Create an offline event set |

### Budget & Planning (8)

| Tool | Description |
|---|---|
| `list_budget_schedules` | List budget schedules |
| `create_budget_schedule` | Create a budget schedule |
| `update_budget_schedule` | Update a budget schedule |
| `delete_budget_schedule` | Delete a budget schedule |
| `list_rf_predictions` | List Reach & Frequency predictions |
| `create_rf_prediction` | Create a Reach & Frequency prediction |
| `get_rf_prediction` | Get prediction details |
| `delete_rf_prediction` | Delete a prediction |

### Brand Safety (5)

| Tool | Description |
|---|---|
| `list_block_lists` | List publisher block lists |
| `create_block_list` | Create a block list |
| `add_to_block_list` | Add URLs/domains to a block list |
| `remove_from_block_list` | Remove entries from a block list |
| `delete_block_list` | Delete a block list |

### Account & Business (13)

| Tool | Description |
|---|---|
| `get_ad_account` | Get ad account details |
| `list_ad_accounts` | List ad accounts for a business |
| `update_ad_account` | Update ad account settings |
| `get_account_activities` | Get account activity log |
| `list_account_users` | List users with access to the account |
| `list_businesses` | List businesses you have access to |
| `get_business` | Get business details |
| `list_business_ad_accounts` | List ad accounts in a business |
| `list_business_users` | List users in a business |
| `add_business_user` | Add a user to a business |
| `remove_business_user` | Remove a user from a business |
| `list_system_users` | List system users for a business |
| `create_system_user` | Create a system user |

### Auth & Token (3)

| Tool | Description |
|---|---|
| `exchange_token` | Exchange short-lived token for long-lived token |
| `refresh_token` | Refresh a long-lived token |
| `debug_token` | Debug/inspect token metadata |

### Ad Library (1)

| Tool | Description |
|---|---|
| `search_ad_library` | Search Meta Ad Library for public ad data |

## Resources (3)

| URI | Description |
|---|---|
| `ads://account` | Ad account overview — status, balance, currency, timezone, and total spend |
| `ads://campaigns-overview` | All active campaigns with budget information |
| `ads://spending-today` | Today's spending summary — spend, impressions, clicks, and reach |

## Prompts (3)

| Prompt | Description |
|---|---|
| `campaign_wizard` | Step-by-step guide to create a full ad campaign from scratch |
| `performance_report` | Analyze ad performance with detailed breakdowns and recommendations |
| `audience_builder` | Build and refine target audiences using Meta's targeting tools |

## Permissions Required

Your Meta access token needs the following permissions depending on which tools you use:

| Permission | Tools |
|---|---|
| `ads_management` | All campaign, ad set, ad, and creative CRUD operations |
| `ads_read` | All read/list operations and insights |
| `business_management` | Business tools, system users, account assignments |
| `leads_retrieval` | Lead form and lead data tools |
| `catalog_management` | Catalog, product set, product, and feed tools |
| `pages_read_engagement` | Lead forms linked to pages |

## License

MIT
