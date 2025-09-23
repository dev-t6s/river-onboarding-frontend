/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { MetaAdsService } from "@/utils/meta-ads-service";
import { ApiDataResponse, PlatformSpendSalesType} from "@/types/meta-ads";

export async function GET(
    request: NextRequest
): Promise<NextResponse<ApiDataResponse<PlatformSpendSalesType>>> {
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

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);

        const timeRange = {
            since: startDate.toISOString().split("T")[0],
            until: endDate.toISOString().split("T")[0],
        };

        const totalData = await metaAdsService.getPlatformSpendSalesData(timeRange, campaignId);

        return NextResponse.json({
            success: true,
            data: totalData,
            summary: {
                records: 0,
                dateRange: `${timeRange.since} to ${timeRange.until}`,
            },
        });
    } catch (error) {
        console.error("Error fetching platform spend vs sales data:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch platform spend vs sales data",
                message: (error as Error).message,
            },
            { status: 500 }
        );
    }
}