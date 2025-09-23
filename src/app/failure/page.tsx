"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Logo from "../../components/Logo";
import { Vortex } from "@/components/vortex";
import { useFacebook } from "../../context/FacebookContext";
import { useDiscord } from "@/context/DiscordLogContext";

export default function ErrorPage() {
  const router = useRouter();
  const { resetAccessToken } = useFacebook();
  const { logEvent } = useDiscord();

  React.useEffect(() => {
    const handleError = async () => {
      await logEvent("FAILURE_ENDPOINT_HIT");
    };

    handleError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-white mb-3 sm:mb-4 font-satoshi">
                Something went wrong
              </h1>
              <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto mb-4 sm:mb-6 px-4 sm:px-0">
                Don&apos;t worry, our team has been informed
              </p>

              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-700/50">
                <p className="text-gray-500 text-sm">
                  If the issue persists, please write to
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

            <div className="relative z-10 flex justify-center gap-2 sm:gap-4 mt-3 sm:mt-4">
              <button
                onClick={() => {
                  resetAccessToken();
                  router.push("/");
                }}
                className="bg-[#5509d8] px-4 sm:px-5 py-2 sm:py-3 rounded-xl border-none text-sm sm:text-md font-satoshi transition-all duration-300 hover:shadow-[0_0_0_4px_rgba(85,9,216,0.4)] w-full sm:w-auto"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </Vortex>
    </main>
  );
}
