# meta-ads-mcp

[![npm version](https://img.shields.io/npm/v/meta-ads-mcp.svg)](https://www.npmjs.com/package/meta-ads-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Meta Marketing API v25.0** MCP 서버 — Facebook & Instagram 광고 캠페인 관리를 위한 123개 도구를 제공합니다.

## 설치

```json
{
  "mcpServers": {
    "meta-ads": {
      "command": "npx",
      "args": ["-y", "meta-ads-mcp"],
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

## 환경 변수

| 변수 | 필수 | 설명 |
|---|---|---|
| `META_ADS_ACCESS_TOKEN` | **필수** | Meta Marketing API 액세스 토큰 |
| `META_AD_ACCOUNT_ID` | **필수** | 광고 계정 ID (숫자, `act_` 접두사 없이) |
| `META_APP_ID` | 선택 | 앱 ID — 토큰 교환/디버그에 필요 |
| `META_APP_SECRET` | 선택 | 앱 시크릿 — 토큰 교환/디버그에 필요 |
| `META_BUSINESS_ID` | 선택 | 비즈니스 매니저 ID — 비즈니스 도구에 필요 |
| `META_PIXEL_ID` | 선택 | 픽셀 ID — 전환 도구에 필요 |

## 도구 (123개)

### 캠페인 관리 (22)

| 도구 | 설명 |
|---|---|
| `list_campaigns` | 필터링 및 페이지네이션으로 캠페인 목록 조회 |
| `get_campaign` | ID로 캠페인 상세 조회 |
| `create_campaign` | 새 캠페인 생성 |
| `update_campaign` | 캠페인 설정 수정 |
| `delete_campaign` | 캠페인 삭제 |
| `get_campaign_adsets` | 캠페인 내 광고 세트 목록 조회 |
| `get_campaign_ads` | 캠페인 내 광고 목록 조회 |
| `get_campaign_leads` | 캠페인 리드 데이터 조회 |
| `list_adsets` | 필터링으로 광고 세트 목록 조회 |
| `get_adset` | ID로 광고 세트 상세 조회 |
| `create_adset` | 새 광고 세트 생성 |
| `update_adset` | 광고 세트 설정 수정 |
| `delete_adset` | 광고 세트 삭제 |
| `get_adset_ads` | 광고 세트 내 광고 목록 조회 |
| `get_adset_leads` | 광고 세트 리드 데이터 조회 |
| `list_ads` | 필터링으로 광고 목록 조회 |
| `get_ad` | ID로 광고 상세 조회 |
| `create_ad` | 새 광고 생성 |
| `update_ad` | 광고 설정 수정 |
| `delete_ad` | 광고 삭제 |
| `get_ad_preview` | 광고 미리보기 HTML 생성 |
| `get_delivery_estimate` | 광고 전달 예측 조회 |

### 크리에이티브 (5)

| 도구 | 설명 |
|---|---|
| `list_creatives` | 광고 크리에이티브 목록 조회 |
| `get_creative` | 크리에이티브 상세 조회 |
| `create_creative` | 새 광고 크리에이티브 생성 |
| `update_creative` | 광고 크리에이티브 수정 |
| `create_dynamic_creative` | 다이나믹 크리에이티브 생성 |

### 미디어 에셋 (12)

| 도구 | 설명 |
|---|---|
| `list_images` | 광고 이미지 목록 조회 |
| `upload_image` | URL에서 이미지 업로드 |
| `get_image` | 이미지 상세 조회 |
| `delete_image` | 이미지 삭제 |
| `list_videos` | 광고 동영상 목록 조회 |
| `upload_video` | URL에서 동영상 업로드 |
| `get_video` | 동영상 상세 조회 |
| `delete_video` | 동영상 삭제 |
| `list_canvases` | Instant Experience 캔버스 목록 조회 |
| `get_canvas` | 캔버스 상세 조회 |
| `create_canvas` | 캔버스 생성 |
| `delete_canvas` | 캔버스 삭제 |

### 오디언스 & 타겟팅 (15)

| 도구 | 설명 |
|---|---|
| `list_custom_audiences` | 맞춤 타겟 목록 조회 |
| `get_audience` | 오디언스 상세 조회 |
| `create_custom_audience` | 맞춤 타겟 생성 |
| `update_audience` | 오디언스 설정 수정 |
| `delete_audience` | 오디언스 삭제 |
| `add_users_to_audience` | 맞춤 타겟에 사용자 추가 |
| `remove_users_from_audience` | 맞춤 타겟에서 사용자 제거 |
| `create_lookalike_audience` | 유사 타겟 생성 |
| `list_saved_audiences` | 저장된 타겟 목록 조회 |
| `get_saved_audience` | 저장된 타겟 상세 조회 |
| `search_targeting` | 관심사, 행동, 인구통계 타겟팅 검색 |
| `search_locations` | 타겟팅 가능한 위치 검색 |
| `search_targeting_map` | 타겟팅 카테고리 트리 탐색 |
| `get_reach_estimate` | 타겟팅 스펙에 대한 도달 예측 |
| `get_targeting_suggestions` | 관련 타겟팅 제안 조회 |

### 인사이트 & 보고서 (6)

| 도구 | 설명 |
|---|---|
| `get_account_insights` | 계정 수준 성과 지표 |
| `get_campaign_insights` | 캠페인 수준 성과 지표 |
| `get_adset_insights` | 광고 세트 수준 성과 지표 |
| `get_ad_insights` | 광고 수준 성과 지표 |
| `create_async_report` | 비동기 인사이트 보고서 생성 |
| `get_async_report` | 비동기 보고서 상태 및 결과 조회 |

### 리드 (4)

| 도구 | 설명 |
|---|---|
| `get_form_leads` | 리드 양식에서 리드 데이터 조회 |
| `get_lead` | ID로 단일 리드 조회 |
| `list_lead_forms` | 페이지의 리드 생성 양식 목록 조회 |
| `get_lead_form` | 리드 양식 상세 조회 |

### 카탈로그 & 커머스 (15)

| 도구 | 설명 |
|---|---|
| `list_catalogs` | 제품 카탈로그 목록 조회 |
| `get_catalog` | 카탈로그 상세 조회 |
| `create_catalog` | 제품 카탈로그 생성 |
| `update_catalog` | 카탈로그 수정 |
| `list_product_sets` | 카탈로그 내 제품 세트 목록 조회 |
| `create_product_set` | 제품 세트 생성 |
| `get_product_set` | 제품 세트 상세 조회 |
| `update_product_set` | 제품 세트 수정 |
| `list_products` | 카탈로그 내 제품 목록 조회 |
| `get_product` | 제품 상세 조회 |
| `update_product` | 제품 수정 |
| `list_feeds` | 카탈로그의 데이터 피드 목록 조회 |
| `create_feed` | 데이터 피드 생성 |
| `upload_feed` | 피드에 데이터 업로드 |
| `get_feed_uploads` | 피드 업로드 이력 조회 |

### 자동화 & 규칙 (5)

| 도구 | 설명 |
|---|---|
| `list_rules` | 자동화 규칙 목록 조회 |
| `get_rule` | 규칙 상세 조회 |
| `create_rule` | 자동화 규칙 생성 |
| `update_rule` | 규칙 수정 |
| `delete_rule` | 규칙 삭제 |

### 실험 (5)

| 도구 | 설명 |
|---|---|
| `list_experiments` | A/B 테스트 실험 목록 조회 |
| `create_experiment` | 실험 생성 |
| `get_experiment` | 실험 상세 조회 |
| `update_experiment` | 실험 수정 |
| `get_experiment_results` | 실험 결과 조회 |

### 전환 (4)

| 도구 | 설명 |
|---|---|
| `send_conversion_event` | Conversions API로 서버 사이드 전환 이벤트 전송 |
| `send_offline_event` | 오프라인 전환 이벤트 전송 |
| `list_offline_event_sets` | 오프라인 이벤트 세트 목록 조회 |
| `create_offline_event_set` | 오프라인 이벤트 세트 생성 |

### 예산 & 기획 (8)

| 도구 | 설명 |
|---|---|
| `list_budget_schedules` | 예산 스케줄 목록 조회 |
| `create_budget_schedule` | 예산 스케줄 생성 |
| `update_budget_schedule` | 예산 스케줄 수정 |
| `delete_budget_schedule` | 예산 스케줄 삭제 |
| `list_rf_predictions` | 도달 & 빈도 예측 목록 조회 |
| `create_rf_prediction` | 도달 & 빈도 예측 생성 |
| `get_rf_prediction` | 예측 상세 조회 |
| `delete_rf_prediction` | 예측 삭제 |

### 브랜드 세이프티 (5)

| 도구 | 설명 |
|---|---|
| `list_block_lists` | 퍼블리셔 차단 목록 조회 |
| `create_block_list` | 차단 목록 생성 |
| `add_to_block_list` | 차단 목록에 URL/도메인 추가 |
| `remove_from_block_list` | 차단 목록에서 항목 제거 |
| `delete_block_list` | 차단 목록 삭제 |

### 계정 & 비즈니스 (13)

| 도구 | 설명 |
|---|---|
| `get_ad_account` | 광고 계정 상세 조회 |
| `list_ad_accounts` | 비즈니스의 광고 계정 목록 조회 |
| `update_ad_account` | 광고 계정 설정 수정 |
| `get_account_activities` | 계정 활동 로그 조회 |
| `list_account_users` | 계정 접근 권한 사용자 목록 조회 |
| `list_businesses` | 접근 가능한 비즈니스 목록 조회 |
| `get_business` | 비즈니스 상세 조회 |
| `list_business_ad_accounts` | 비즈니스 내 광고 계정 목록 조회 |
| `list_business_users` | 비즈니스 내 사용자 목록 조회 |
| `add_business_user` | 비즈니스에 사용자 추가 |
| `remove_business_user` | 비즈니스에서 사용자 제거 |
| `list_system_users` | 비즈니스 시스템 사용자 목록 조회 |
| `create_system_user` | 시스템 사용자 생성 |

### 인증 & 토큰 (3)

| 도구 | 설명 |
|---|---|
| `exchange_token` | 단기 토큰을 장기 토큰으로 교환 |
| `refresh_token` | 장기 토큰 갱신 |
| `debug_token` | 토큰 메타데이터 디버그/검사 |

### 광고 라이브러리 (1)

| 도구 | 설명 |
|---|---|
| `search_ad_library` | Meta 광고 라이브러리에서 공개 광고 데이터 검색 |

## 리소스 (3)

| URI | 설명 |
|---|---|
| `ads://account` | 광고 계정 개요 — 상태, 잔액, 통화, 시간대, 총 지출 |
| `ads://campaigns-overview` | 활성 캠페인 목록 및 예산 정보 |
| `ads://spending-today` | 오늘의 지출 요약 — 지출, 노출, 클릭, 도달 |

## 프롬프트 (3)

| 프롬프트 | 설명 |
|---|---|
| `campaign_wizard` | 처음부터 전체 광고 캠페인을 만드는 단계별 가이드 |
| `performance_report` | 상세 분석 및 추천이 포함된 광고 성과 분석 |
| `audience_builder` | Meta 타겟팅 도구를 활용한 타겟 오디언스 구축 가이드 |

## 필요한 권한

사용하는 도구에 따라 Meta 액세스 토큰에 다음 권한이 필요합니다:

| 권한 | 도구 |
|---|---|
| `ads_management` | 모든 캠페인, 광고 세트, 광고, 크리에이티브 CRUD 작업 |
| `ads_read` | 모든 읽기/목록 조회 및 인사이트 |
| `business_management` | 비즈니스 도구, 시스템 사용자, 계정 할당 |
| `leads_retrieval` | 리드 양식 및 리드 데이터 도구 |
| `catalog_management` | 카탈로그, 제품 세트, 제품, 피드 도구 |
| `pages_read_engagement` | 페이지에 연결된 리드 양식 |

## 라이선스

MIT
