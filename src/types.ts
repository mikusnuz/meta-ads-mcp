// --- Core API types ---

export interface RateLimit {
  callCount?: number;
  totalCpuTime?: number;
  totalTime?: number;
}

export interface BusinessRateLimit {
  callCount: number;
  totalCpuTime: number;
  totalTime: number;
  type: string;
  estimatedTimeToRegainAccess?: number;
}

export interface ApiResponse<T = unknown> {
  data: T;
  rateLimit?: RateLimit;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  paging?: {
    cursors?: { before?: string; after?: string };
    next?: string;
    previous?: string;
  };
}

// --- Campaign Management types ---

export interface Campaign {
  id: string;
  name?: string;
  status?: CampaignStatus;
  effective_status?: string;
  objective?: CampaignObjective;
  buying_type?: string;
  bid_strategy?: BidStrategy;
  daily_budget?: string;
  lifetime_budget?: string;
  budget_remaining?: string;
  special_ad_categories?: string[];
  created_time?: string;
  updated_time?: string;
  start_time?: string;
  stop_time?: string;
}

export type CampaignStatus = "ACTIVE" | "PAUSED" | "DELETED" | "ARCHIVED";

export type CampaignObjective =
  | "OUTCOME_AWARENESS"
  | "OUTCOME_ENGAGEMENT"
  | "OUTCOME_LEADS"
  | "OUTCOME_SALES"
  | "OUTCOME_TRAFFIC"
  | "OUTCOME_APP_PROMOTION";

export type BidStrategy =
  | "LOWEST_COST_WITHOUT_CAP"
  | "LOWEST_COST_WITH_BID_CAP"
  | "COST_CAP"
  | "LOWEST_COST_WITH_MIN_ROAS";

// --- Ad Set types ---

export interface AdSet {
  id: string;
  name?: string;
  campaign_id?: string;
  status?: AdSetStatus;
  effective_status?: string;
  daily_budget?: string;
  lifetime_budget?: string;
  budget_remaining?: string;
  bid_amount?: number;
  bid_strategy?: BidStrategy;
  billing_event?: BillingEvent;
  optimization_goal?: OptimizationGoal;
  targeting?: Targeting;
  start_time?: string;
  end_time?: string;
  created_time?: string;
  updated_time?: string;
}

export type AdSetStatus = "ACTIVE" | "PAUSED" | "DELETED" | "ARCHIVED";

export type BillingEvent = "IMPRESSIONS" | "LINK_CLICKS" | "APP_INSTALLS" | "THRUPLAY";

export type OptimizationGoal =
  | "IMPRESSIONS"
  | "REACH"
  | "LINK_CLICKS"
  | "LANDING_PAGE_VIEWS"
  | "OFFSITE_CONVERSIONS"
  | "APP_INSTALLS"
  | "LEAD_GENERATION"
  | "VALUE"
  | "THRUPLAY"
  | "ENGAGED_USERS";

// --- Targeting types ---

export interface Targeting {
  age_min?: number;
  age_max?: number;
  genders?: number[];
  geo_locations?: GeoLocation;
  interests?: TargetingEntity[];
  behaviors?: TargetingEntity[];
  custom_audiences?: TargetingEntity[];
  excluded_custom_audiences?: TargetingEntity[];
  lookalike_audiences?: TargetingEntity[];
  publisher_platforms?: string[];
  facebook_positions?: string[];
  instagram_positions?: string[];
  device_platforms?: string[];
  locales?: number[];
}

export interface GeoLocation {
  countries?: string[];
  regions?: GeoEntity[];
  cities?: GeoEntity[];
  zips?: GeoEntity[];
  location_types?: string[];
}

export interface GeoEntity {
  key: string;
  name?: string;
}

export interface TargetingEntity {
  id: string;
  name?: string;
}

// --- Ad types ---

export interface Ad {
  id: string;
  name?: string;
  adset_id?: string;
  campaign_id?: string;
  status?: AdStatus;
  effective_status?: string;
  creative?: AdCreativeRef;
  created_time?: string;
  updated_time?: string;
  tracking_specs?: Record<string, unknown>[];
  conversion_specs?: Record<string, unknown>[];
}

export type AdStatus = "ACTIVE" | "PAUSED" | "DELETED" | "ARCHIVED";

export interface AdCreativeRef {
  id: string;
  creative_id?: string;
}

// --- Ad Creative types ---

export interface AdCreative {
  id: string;
  name?: string;
  title?: string;
  body?: string;
  object_story_spec?: ObjectStorySpec;
  image_hash?: string;
  image_url?: string;
  thumbnail_url?: string;
  url_tags?: string;
  call_to_action_type?: string;
  asset_feed_spec?: AssetFeedSpec;
}

export interface ObjectStorySpec {
  page_id: string;
  instagram_actor_id?: string;
  link_data?: LinkData;
  photo_data?: PhotoData;
  video_data?: VideoData;
}

export interface LinkData {
  link: string;
  message?: string;
  name?: string;
  description?: string;
  caption?: string;
  image_hash?: string;
  call_to_action?: CallToAction;
}

export interface PhotoData {
  image_hash?: string;
  url?: string;
  caption?: string;
}

export interface VideoData {
  video_id?: string;
  image_hash?: string;
  title?: string;
  message?: string;
  call_to_action?: CallToAction;
}

export interface CallToAction {
  type: string;
  value?: Record<string, unknown>;
}

export interface AssetFeedSpec {
  images?: { hash: string }[];
  videos?: { video_id: string; thumbnail_hash?: string }[];
  bodies?: { text: string }[];
  titles?: { text: string }[];
  descriptions?: { text: string }[];
  link_urls?: { website_url: string }[];
  call_to_action_types?: string[];
}

// --- Insights types ---

export interface InsightData {
  account_id?: string;
  campaign_id?: string;
  adset_id?: string;
  ad_id?: string;
  date_start?: string;
  date_stop?: string;
  impressions?: string;
  reach?: string;
  clicks?: string;
  spend?: string;
  cpc?: string;
  cpm?: string;
  ctr?: string;
  cpp?: string;
  frequency?: string;
  actions?: ActionBreakdown[];
  conversions?: ActionBreakdown[];
  cost_per_action_type?: ActionBreakdown[];
  video_avg_time_watched_actions?: ActionBreakdown[];
}

export interface ActionBreakdown {
  action_type: string;
  value: string;
}

// --- Custom Audience types ---

export interface CustomAudience {
  id: string;
  name?: string;
  description?: string;
  subtype?: string;
  approximate_count_lower_bound?: number;
  approximate_count_upper_bound?: number;
  time_created?: string;
  time_updated?: string;
  delivery_status?: { status: string };
  operation_status?: { status: number; description: string };
  permission_for_actions?: Record<string, unknown>;
  data_source?: { type: string; sub_type: string };
  lookalike_spec?: Record<string, unknown>;
  rule?: string;
  retention_days?: number;
  customer_file_source?: string;
}

// --- Ad Image / Video types ---

export interface AdImage {
  hash: string;
  url?: string;
  name?: string;
  width?: number;
  height?: number;
  permalink_url?: string;
  status?: string;
  created_time?: string;
  updated_time?: string;
}

export interface AdVideo {
  id: string;
  title?: string;
  description?: string;
  source?: string;
  picture?: string;
  length?: number;
  status?: { video_status: string };
  created_time?: string;
  updated_time?: string;
}

// --- Pixel / Conversion types ---

export interface Pixel {
  id: string;
  name?: string;
  code?: string;
  creation_time?: string;
  last_fired_time?: string;
  is_created_by_business?: boolean;
}

export interface CustomConversion {
  id: string;
  name?: string;
  pixel?: { id: string };
  rule?: string;
  default_conversion_value?: number;
  custom_event_type?: string;
  event_source_type?: string;
}

// --- Business Manager types ---

export interface BusinessInfo {
  id: string;
  name?: string;
  primary_page?: { id: string; name?: string };
  created_time?: string;
  updated_time?: string;
  timezone_id?: number;
  verification_status?: string;
}

// --- Reporting / Scheduled Report types ---

export interface AdReportRun {
  id: string;
  account_id?: string;
  async_status?: string;
  async_percent_completion?: number;
  date_start?: string;
  date_stop?: string;
  time_completed?: string;
}
