"use client";
import React from "react";
import Logo from "../components/Logo";
import { useFacebook } from "../context/FacebookContext";
import { useDiscord } from "@/context/DiscordLogContext";
import { useRouter } from "next/navigation";
import { Vortex } from "@/components/vortex";
import { FaFacebook } from "react-icons/fa6";

export default function Home() {
  const { login, accessToken } = useFacebook();
  const { logEvent } = useDiscord();
  const router = useRouter();

  React.useEffect(() => {
    if (accessToken) {
      router.push(`/accounts`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const handleLogin = async () => {
    await logEvent("LOGIN_BUTTON_CLICK");
    await login();
  };

  const handleSampleReportClick = async () => {
    await logEvent("SAMPLE_REPORT_LINK_CLICK");
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Vortex className="flex flex-col justify-center px-2 md:px-10 py-4 w-full h-[100vh]">
        <div>
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center h-[500px] px-4 sm:px-0">
          <div className="w-full max-w-5xl backdrop-blur-sm bg-white/5 rounded-3xl flex flex-col lg:flex-row shadow-2xl border border-gray-800">
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12">
              <div className="text-2xl sm:text-3xl lg:text-4xl text-center mb-6 lg:mb-8 font-satoshi">
                Get your Ad Account audited today
              </div>
              <button
                className="bg-white px-5 py-3 rounded-xl cursor-pointer border-none text-md font-satoshi text-black text-lg\\md flex items-center gap-2 transition-all duration-300"
                onClick={() => handleLogin()}
              >
                <FaFacebook size={18} />
                Continue with Facebook
              </button>
            </div>
            <div className="justify-center items-center flex lg:flex">
              <div className="w-full lg:w-px bg-white/12 mx-0 lg:mx-8 h-px lg:h-[280px]" />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12">
              <div className="text-2xl sm:text-3xl mb-4 lg:mb-6">Not Sure?</div>
              <a
                href="#"
                onClick={() => handleSampleReportClick()}
                className="inline-flex items-center text-lg sm:text-xl font-light text-white/60 no-underline transition-colors duration-300 hover:text-white text-center"
              >
                <span>Look at sample report here</span>
                <svg
                  className="ml-2 h-4 w-4 transition-transform duration-300 hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </Vortex>
    </main>
  );
}
