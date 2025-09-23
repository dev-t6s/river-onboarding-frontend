/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { publishAuditJob } from "@/lib/rabbitmq";

export async function POST(request: NextRequest) {
  try {
    // First verify we have a readable body
    if (!request.body) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request",
          message: "Request body is required",
        },
        { status: 400 }
      );
    }

    // Read the body as text first
    const bodyText = await request.text();
    
    // Check if body is empty
    if (!bodyText) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request",
          message: "Request body cannot be empty",
        },
        { status: 400 }
      );
    }

    // Parse the JSON
    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (parseError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON",
          message: `Request body must be valid JSON: ${parseError}`,
        },
        { status: 400 }
      );
    }

    const { accountId, accessToken, userId, name } = body;

    // Validate required fields
    if (!accountId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required field",
          message: "accountId is required",
        },
        { status: 400 }
      );
    }

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required field",
          message: "accessToken is required",
        },
        { status: 400 }
      );
    }

    // Validate accountId format (basic validation)
    if (!/^\d+$/.test(String(accountId))) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid accountId format",
          message: "accountId must be a numeric string",
        },
        { status: 400 }
      );
    }

    // Validate accessToken format (basic validation)
    if (typeof accessToken !== "string" || accessToken.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid accessToken format",
          message: "accessToken must be a valid string",
        },
        { status: 400 }
      );
    }

    // Get client IP address properly
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Prepare job data
    const jobData = {
      accountId: String(accountId).trim(),
      accessToken: accessToken.trim(),
      userId: userId || null,
      username: name,
      requestedAt: new Date().toISOString(),
      status: "pending" as const,
      metadata: {
        userAgent: request.headers.get("user-agent") || undefined,
        ip: ip,
        source: "web-dashboard" as const,
      },
    };

    // Publish job to RabbitMQ
    const jobPublished = await publishAuditJob(jobData);

    if (jobPublished) {
      return NextResponse.json(
        {
          success: true,
          message: "Audit job queued successfully",
          data: {
            userName: jobData.username,
            accountId: jobData.accountId,
            status: "queued",
            estimatedTime: "5-10 minutes",
          },
        },
        { status: 202 }
      );
    } else {
      throw new Error("Failed to publish job to queue");
    }
  } catch (error: unknown) {
    console.error("Error in audit API:", error);

    // Return appropriate error response
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    if (errorMessage.includes("connect")) {
      return NextResponse.json(
        {
          success: false,
          error: "Service unavailable",
          message: "Unable to process audit request at this time. Please try again later.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}