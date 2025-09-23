/* eslint-disable @typescript-eslint/no-explicit-any */
import ServerErrorSection from '@/components/ServerErrorSection';
import CreativeDashboardClient from './CreativeDashboardClient';
import { AdAccount, AdSetCreativeData, CreativeAnalyticsData, CreativeData } from '@/types/meta-ads';
import type { Metadata } from 'next';
import Link from 'next/link';

interface AuditData {
  error:string;
  status: string;
  accountId: string;
  auditResults: {
    getAdAccounts_result: AdAccount[];
    getCreativeData_result: CreativeData;
    creativeAnalyticsData_result: CreativeAnalyticsData;
    getAdsetData_result: [AdSetCreativeData];
  };
  updatedAt: string;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ jobId: string }>
}): Promise<Metadata> {
  const { jobId } = await params;
  return {
    title: `Creative Dashboard - ${jobId}`,
  };
}

async function getAuditData(jobId: string): Promise<AuditData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/api/audit/${jobId}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
        
    if (!response.ok) {
      if (response.status === 404) return null;
      if (response.status === 500) {
        return {
          error: 'server_error',
          message: 'Our servers are experiencing issues. Please try again later.',
          statusCode: 500
        } as any;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
        
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching audit data:', error);
    return null;
  }
}

export default async function CreativeDashboardPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const data = await getAuditData(jobId);

  if (data && data.error === 'server_error') {
    return (
      <ServerErrorSection 
        jobId={jobId}
      />
    );
  }
    
  if (!data || data.status.toLowerCase()=='failed') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
        <div className="bg-white rounded-lg shadow-xl p-8 sm:p-10 max-w-md w-full text-center border border-blue-200 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
            Audit Report Not Found
          </h1>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Let&apos;s create a new audit report for you!
          </p>
          <div className="flex justify-center">
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Generate New Report
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (data.status.toLowerCase()=='processing') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
        <div className="bg-white rounded-lg shadow-xl p-8 sm:p-10 max-w-lg w-full text-center border border-blue-200 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Generating Your Audit Report
          </h2>
          
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            We&apos;re analyzing your ad performance and creating a comprehensive audit report.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-6 py-5 rounded-lg">
            <div className="flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold">Email Notification</span>
            </div>
            <p className="text-sm">
              You&apos;ll receive an email at your registered email address once the report is ready.
            </p>
          </div>
        </div>
      </div>
    );
  }
    
  const {
    accountId: adAccountId,
    auditResults: {
      getAdAccounts_result: accounts,
      getCreativeData_result: creativeData,
      creativeAnalyticsData_result: creativeAnalyticsData,
      getAdsetData_result: adsSetData
    },
    updatedAt: updatedAt,
  } = data;
    
  const accountId = adAccountId.includes('_')
    ? adAccountId.split('_')[1]
    : adAccountId;
    
  const currentAccount = accounts.find(
    (acc: AdAccount) => acc.id === accountId
  );
    
  return (
    <CreativeDashboardClient
      initialData={{
        adAccountInfo: currentAccount || null,
        creativeData,
        jobId,
        creativeAnalyticsData,
        adsSetData
      }}
      updatedAt={updatedAt}
    />
  );
}