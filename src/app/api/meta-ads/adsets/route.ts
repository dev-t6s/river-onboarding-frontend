import { NextRequest, NextResponse } from "next/server";
import { MetaAdsService } from "@/utils/meta-ads-service";
import { ApiDataResponse, AdsetData } from "@/types/meta-ads";
import * as bizSdk from "facebook-nodejs-business-sdk";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiDataResponse<AdsetData[]>>> {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken =
      searchParams.get("access_token") ||
      request.headers.get("authorization")?.replace("Bearer ", "");
    const adAccountId = searchParams.get("ad_account_id");
    const campaignId = searchParams.get("campaign_id");

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Access token is required",
        },
        { status: 400 }
      );
    }

    if (!adAccountId) {
      return NextResponse.json(
        {
          success: false,
          error: "Ad account ID is required",
        },
        { status: 400 }
      );
    }

    const metaAdsService = new MetaAdsService(accessToken, adAccountId);

    // Get adset data directly
    const account = new bizSdk.AdAccount(`act_${adAccountId}`);

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    const timeRange = {
      since: startDate.toISOString().split("T")[0],
      until: endDate.toISOString().split("T")[0],
    };

    const adsetData = await metaAdsService.getAdsetData(
      account,
      timeRange,
      campaignId
    );

    return NextResponse.json({
      success: true,
      data: adsetData,
      summary: {
        records: adsetData.length,
        dateRange: `${timeRange.since} to ${timeRange.until}`,
      },
    });
  } catch (error) {
    console.error("Error fetching adset data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch adset data",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
