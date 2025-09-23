"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Logo from "../../components/Logo";
import { Vortex } from "@/components/vortex";
import { useFacebook } from "../../context/FacebookContext";

export default function SuccessPage() {
  const router = useRouter();
  const { adAccountID, accessToken, userEmail, resetAccessToken, userName } = useFacebook();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let isMounted = true;
    controllerRef.current = new AbortController();

    const triggerAudit = async () => {
      try {
        if (!adAccountID || !accessToken || !userEmail || !userName) {
          throw new Error("Missing required account information");
        }

        const cleanAccountId = adAccountID.startsWith('act_') 
          ? adAccountID.substring(4) 
          : String(adAccountID);

        // Validate account ID format
        if (!/^\d+$/.test(cleanAccountId)) {
          throw new Error("Invalid account ID format");
        }

        const response = await fetch(`/api/audit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accountId: cleanAccountId,
            accessToken: accessToken,
            userId: userEmail,
            name: userName,
          }),
          signal: controllerRef.current?.signal,
        });

        // First check if we got a response at all
        if (!response) {
          throw new Error("No response from server");
        }

        // Check if response has content
        const text = await response.text();
        if (!text) {
          throw new Error("Empty response from server");
        }

        const data = JSON.parse(text);

        if (!isMounted) return;

        if (!response.ok) {
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        setStatus("success");
      } catch (error) {
        if (!isMounted) return;

        setStatus("error");
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Failed to request audit report");
        }
        console.error("Error triggering audit:", error);
      }
    };

    if (adAccountID && accessToken && userEmail) {
      triggerAudit();
    } else {
      setStatus("error");
      setErrorMessage("Missing required account information");
    }

    return () => {
        isMounted = false;
        controllerRef.current?.abort();
      };
    }, [adAccountID, accessToken, userEmail, userName]);

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Vortex className="flex flex-col justify-center px-4 md:px-10 py-4 w-full h-[100vh]">
        <div className="flex justify-between items-center">
          <Logo />
        </div>

        <div className="flex flex-1 items-center justify-center mb-[10vh]">
          <div className="w-full max-w-2xl backdrop-blur-lg bg-white/5 rounded-2xl sm:rounded-3xl flex flex-col shadow-2xl border border-gray-700/50 p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />

            <div className="relative z-10 text-center mb-6 sm:mb-8">
              {status === "loading" && (
                <>
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6">
                    <div className="absolute inset-2 border-2 border-gradient-to-r from-[#5509d8] to-purple-400 rounded-full animate-spin border-t-[#5509d8] border-r-transparent border-b-[#AA336A] border-l-transparent"></div>
                    <div className="absolute inset-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                      <div className="relative w-full h-full">
                        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-blue-400 rounded-full animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-purple-400 rounded-full animate-pulse animation-delay-400 transform -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute top-2/3 left-2/3 w-1 h-1 bg-cyan-400 rounded-full animate-pulse animation-delay-400 transform -translate-x-1/2 -translate-y-1/2"></div>
                      </div>
                    </div>
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-white mb-3 sm:mb-4 font-satoshi">
                    Requesting Audit Report
                  </h1>
                  <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto mb-4 sm:mb-6 px-4 sm:px-0">
                    Please wait while we initiate your audit report...
                  </p>
                </>
              )}

              {status === "success" && (
                <>
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-full h-full text-green-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-white mb-3 sm:mb-4 font-satoshi">
                    Audit Report Request Received
                  </h1>
                  <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto mb-4 sm:mb-6 px-4 sm:px-0">
                    Your audit report is being generated and will be sent to{" "}
                    <span className="text-blue-400">{userEmail}</span> when ready.
                  </p>
                </>
              )}

              {status === "error" && (
                <>
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-full h-full text-red-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-white mb-3 sm:mb-4 font-satoshi">
                    Request Failed
                  </h1>
                  <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto mb-4 sm:mb-6 px-4 sm:px-0">
                    {errorMessage || "Failed to initiate audit report. Please try again."}
                  </p>
                </>
              )}

              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-700/50">
                <p className="text-gray-500 text-sm">
                  In case of any queries, please write to
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-1 sm:gap-2 mt-2">
                  <a
                    href="mailto:santosh@tryriver.ai"
                    className="text-blue-400 hover:text-blue-300 text-sm break-all sm:break-normal"
                  >
                    santosh@tryriver.ai
                  </a>
                  <span className="hidden sm:block text-gray-500">/</span>
                  <a
                    href="tel:+918722110229"
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    +91 8722110229
                  </a>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex justify-center mt-3 sm:mt-4">
              <button
                onClick={() => {
                  resetAccessToken();
                  router.push("/");
                }}
                className="bg-[#5509d8] cursor-pointer px-5 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-md font-satoshi text-white transition-all duration-300 hover:shadow-[0_0_0_4px_rgba(85,9,216,0.4)] w-full sm:w-auto"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </Vortex>
    </main>
  );
}