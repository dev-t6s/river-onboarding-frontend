// src/app/api/audit/[jobId]/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import AuditJob from "@/models/AuditJob.model";

interface RouteParams {
  params: Promise<{ jobId: string }>;
}

export async function GET(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // Await params to get the actual values
    const { jobId } = await params;

    // Validate jobId
    if (!jobId || typeof jobId !== "string" || jobId.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid jobId",
          message: "A valid jobId is required",
        },
        { status: 400 }
      );
    }

    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URL!);
    }

    // Find the job in database
    const job = await AuditJob.findOne({ jobId }).lean();

    if (!job) {
      return NextResponse.json(
        {
          success: false,
          error: "Job not found",
          message: "No audit job found with the provided jobId",
        },
        { status: 404 }
      );
    }

    // Calculate processing time if completed
    let processingTime = null;
    if (job.status === 'completed' && job.processingStartedAt && job.processingCompletedAt) {
      processingTime = (job.processingCompletedAt.getTime() - job.processingStartedAt.getTime()) / 1000;
    }

    // Prepare response data
    const responseData = {
      ...job,
      processingTime: processingTime || job.processingDuration,
    };

    return NextResponse.json(
      {
        success: true,
        data: responseData,
      },
      { status: 200 }
    );
   
  } catch (error) {
    console.error("Error fetching audit job:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "An unexpected error occurred while fetching the audit job",
      },
      { status: 500 }
    );
  }
}