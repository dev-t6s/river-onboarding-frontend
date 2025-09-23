import { NextRequest, NextResponse } from "next/server";
import { MetaAdsService } from "@/utils/meta-ads-service";
import { ApiResponse, AdAccount } from "@/types/meta-ads";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<AdAccount[]>>> {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken =
      searchParams.get("access_token") ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Access token is required",
        },
        { status: 400 }
      );
    }

    const metaAdsService = new MetaAdsService(accessToken);
    const accounts = await metaAdsService.getAdAccounts();

    return NextResponse.json({
      success: true,
      data: accounts,
    });
  } catch (error) {
    console.error("Error fetching ad accounts:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch ad accounts",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
