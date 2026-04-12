# Meta Ads Management

This project uses **meta-ads-mcp** to manage Facebook & Instagram advertising via MCP tools.

## Available Tools (135)

Use `mcp__meta-ads__<tool>` for all Meta advertising operations.

### Campaign Lifecycle
| Tool | When to Use |
|---|---|
| `create_campaign` | Create a new campaign (choose objective: CONVERSIONS, TRAFFIC, etc.) |
| `create_adset` | Create an ad set within a campaign (targeting, budget, schedule) |
| `create_ad` | Create an ad within an ad set (links a creative) |
| `create_creative` | Create an ad creative (image, video, carousel, etc.) |
| `update_campaign` / `update_adset` / `update_ad` | Modify settings, pause/resume |
| `delete_campaign` / `delete_adset` / `delete_ad` | Remove entities |

### Performance & Reporting
| Tool | When to Use |
|---|---|
| `get_account_insights` | Account-level metrics (spend, impressions, clicks, conversions) |
| `get_campaign_insights` | Campaign-level breakdown |
| `get_adset_insights` | Ad set-level breakdown |
| `get_ad_insights` | Ad-level breakdown |
| `create_async_report` | Large reports that take time to generate |
| `get_async_report` | Poll and retrieve async report results |

### Audiences & Targeting
| Tool | When to Use |
|---|---|
| `create_custom_audience` | Create audience from customer data |
| `create_lookalike_audience` | Create lookalike from existing audience |
| `search_targeting` | Find interests, behaviors, demographics to target |
| `get_reach_estimate` | Estimate audience size for a targeting spec |
| `add_users_to_audience` | Add users to a custom audience |

### Media Assets
| Tool | When to Use |
|---|---|
| `upload_image` | Upload an ad image from URL |
| `upload_video` | Upload an ad video from URL |
| `list_images` / `list_videos` | Browse existing media assets |

### Automation & Testing
| Tool | When to Use |
|---|---|
| `create_rule` | Set up automated rules (pause if CPA > X, etc.) |
| `create_experiment` | Create A/B test between ad sets |
| `get_experiment_results` | Check A/B test outcomes |

### Catalog & Commerce
| Tool | When to Use |
|---|---|
| `create_catalog` | Create a product catalog for dynamic ads |
| `create_feed` | Set up a product data feed |
| `upload_feed` | Push product data to a feed |

### Ad Library & Research
| Tool | When to Use |
|---|---|
| `search_ad_library` | Search public ad data (competitor research) |

## Common Workflows

### Create a full campaign from scratch
1. `create_campaign` with objective
2. `upload_image` or `upload_video` for ad media
3. `create_creative` with the uploaded media
4. `create_adset` with targeting, budget, schedule
5. `create_ad` linking the creative to the ad set

### Check performance and optimize
1. `get_campaign_insights` with date range and breakdowns
2. Identify underperformers
3. `update_adset` to pause low-ROAS ad sets or adjust budgets
4. `create_rule` to automate future optimizations

### A/B test creatives
1. Create two ad sets with different creatives
2. `create_experiment` to set up the test
3. `get_experiment_results` after sufficient data

### Build a lookalike audience
1. `create_custom_audience` from customer list
2. `add_users_to_audience` with hashed emails/phones
3. `create_lookalike_audience` from the custom audience

## Resources

- `ads://account` — Account overview (status, balance, currency)
- `ads://campaigns-overview` — Active campaigns with budgets
- `ads://spending-today` — Today's spend, impressions, clicks, reach

## Important Notes

- Ad account ID should be numeric without the `act_` prefix
- Use `exchange_token` to convert short-lived tokens to long-lived ones
- `debug_token` helps diagnose permission issues
- Async reports are needed for large date ranges or many breakdowns
- All monetary values are in the account's currency (check with `get_ad_account`)
