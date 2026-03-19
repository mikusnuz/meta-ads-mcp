export interface AdsConfig {
  accessToken: string;
  adAccountId: string;
  appId: string;
  appSecret: string;
  businessId: string;
  pixelId: string;
}

export function loadConfig(): AdsConfig {
  return {
    accessToken: process.env.META_ADS_ACCESS_TOKEN || "",
    adAccountId: process.env.META_AD_ACCOUNT_ID || "",
    appId: process.env.META_APP_ID || "",
    appSecret: process.env.META_APP_SECRET || "",
    businessId: process.env.META_BUSINESS_ID || "",
    pixelId: process.env.META_PIXEL_ID || "",
  };
}
