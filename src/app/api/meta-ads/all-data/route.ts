import { NextRequest, NextResponse } from "next/server";
import { MetaAdsService } from "@/utils/meta-ads-service";
import { ApiResponse, ConsolidatedData } from "@/types/meta-ads";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<ConsolidatedData>>> {
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
    const allData = await metaAdsService.fetchAllData(campaignId);

    return NextResponse.json({
      success: true,
      data: allData,
    });
  } catch (error) {
    console.error("Error fetching all data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch all data",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
