"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "../../components/Logo";
import { useFacebook } from "../../context/FacebookContext";
import { useDiscord } from "@/context/DiscordLogContext";
import { Vortex } from "@/components/vortex";

interface AdAccount {
  id: string;
  name: string;
  total_spend: number;
  spend: number;
}

export default function AccountsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<AdAccount[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken, setAdAccountID, getTotalSpendPerAdAccountFacebookProvider } = useFacebook();
  const { logEvent } = useDiscord();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      router.push("/");
    }
  }, [accessToken, router]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        setError(null);

        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);

        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        const dateRange = {
          since: formatDate(oneMonthAgo),
          until: formatDate(today)
        };

        const getTotalSpendPerAdAccount = await getTotalSpendPerAdAccountFacebookProvider(dateRange);
        const mapped: AdAccount[] = getTotalSpendPerAdAccount.map((acc) => ({
          id: acc.id,
          name: acc.name,
          total_spend: Number(acc.total_spend) || 0,
          spend: acc.total_spend || 0,
        }));
        setAccounts(mapped.sort((a, b) => b.spend - a.spend));
      } catch (err) {
        setError("Failed to load ad accounts. Please try again.");
        console.error("Error fetching accounts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, router]);

  const handleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selected.length === accounts.length) {
      setSelected([]);
    } else {
      setSelected(accounts.map((acc) => acc.id));
    }
  };

  const handleAuditAll = async () => {
    if (!setAdAccountID) {
      console.error("setAdAccountID is not defined");
      return;
    }

    const accountId = selected[0] || null;
    setAdAccountID(accountId!);
    await logEvent("AD_ACCOUNT_AUDIT_BUTTON_CLICK", {
      selected_accounts: selected,
      total_accounts: accounts.length,
    });
    router.push("/success");
  };

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await handleAuditAll();
    } catch (error) {
      console.error('Audit error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalSpend1 = accounts
    .filter((acc) => selected.length === 0 || selected.includes(acc.id))
    .reduce((sum, acc) => sum + acc.total_spend, 0);

  const totalSpend2 = accounts
    .filter((acc) => selected.length === 0 || selected.includes(acc.id))
    .reduce((sum, acc) => sum + acc.spend, 0);

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col overflow-hidden">
      <Vortex className="flex flex-col justify-center px-4 md:px-10 py-4 w-full h-screen">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0 invisible sm:visible sm:static absolute">
          <Logo />
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-400 ">
            <span>{accounts.length} accounts found</span>
            {totalSpend1 > 0 && (
              <span className="px-2 sm:px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs sm:text-sm">
                ₹{totalSpend1.toLocaleString()} Total Spend
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center pb-4 mt-[3vh] sm:mb-[5vh] sm:mt-0">
          <div className="w-full max-w-3xl backdrop-blur-lg bg-white/10 rounded-2xl sm:rounded-3xl flex flex-col shadow-2xl border border-gray-700/50 p-4 sm:p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />

            <div className="relative z-10 text-center mb-4 sm:mb-6 mt-2 sm:mt-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-white mb-2 sm:mb-3 font-satoshi">
                Select Ad Accounts to Audit
              </h1>
              <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-2 sm:px-0 hidden sm:block">
                Choose the ad accounts you want to analyze. Our AI will audit
                performance, identify optimization opportunities, and provide
                actionable insight.
              </p>
            </div>

            {accounts.length > 0 && (
              <div className="relative z-10 flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <div className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-800/50 rounded-lg sm:rounded-xl border border-gray-700">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs sm:text-sm text-gray-300">
                    {accounts.length} Total Accounts
                  </span>
                </div>
                <div className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-800/50 rounded-lg sm:rounded-xl border border-gray-700">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-xs sm:text-sm text-gray-300">
                    {selected.length} Selected
                  </span>
                </div>
                {totalSpend2 > 0 && (
                  <div className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-green-500/10 rounded-lg sm:rounded-xl border border-green-500/30">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs sm:text-sm text-green-400">
                      ₹{totalSpend2.toLocaleString()} Combined Spend
                    </span>
                  </div>
                )}
              </div>
            )}

            {loading && (
              <div className="relative z-10 flex flex-col items-center justify-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
                <p className="text-gray-400 text-base sm:text-lg">
                  Loading your ad accounts...
                </p>
              </div>
            )}

            {error && (
              <div className="relative z-10 text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <p className="text-red-400 text-base sm:text-lg mb-4">
                  {error}
                </p>
                <button
                  onClick={() => {}}
                  className="px-4 sm:px-6 py-2 bg-red-500/20 text-red-400 rounded-lg sm:rounded-xl border border-red-500/30 hover:bg-red-500/30 transition-all duration-200 text-sm sm:text-base"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && accounts.length > 0 && (
              <div className="relative z-10 flex-1">
                <div className="flex justify-between items-center mb-3">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg sm:rounded-xl border border-gray-700 transition-all duration-200 text-xs sm:text-sm"
                  >
                    <div
                      className={`w-3 h-3 sm:w-4 sm:h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                        selected.length === accounts.length
                          ? "bg-purple-500 border-purple-500"
                          : "border-gray-500"
                      }`}
                    >
                      {selected.length === accounts.length && (
                        <svg
                          className="w-2 h-2 sm:w-3 sm:h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-300">
                      {selected.length === accounts.length
                        ? "Deselect All"
                        : "Select All"}
                    </span>
                  </button>
                </div>

                <div className="space-y-2 mb-4 max-h-[40vh] sm:max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                  {accounts.map((acc) => (
                    <label
                      key={acc.id}
                      className={`flex items-center border border-gray-500 rounded-lg px-3 sm:px-4 py-2 sm:py-3 justify-between ${(acc.spend==0 || acc.total_spend===0) ? 'cursor-not-allowed' : 'cursor-pointer'} bg-gray-800 hover:bg-gray-700/50 transition-colors duration-200`}
                    >
                      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                        <input
                          type="checkbox"
                          checked={selected.includes(acc.id)}
                          disabled={acc.spend==0 || acc.total_spend===0}
                          onChange={() => handleSelect(acc.id)}
                          className={`w-4 h-4 sm:w-5 sm:h-5 accent-blue-600 rounded border-gray-500 flex-shrink-0 ${(acc.spend==0 || acc.total_spend===0) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        />
                        <span className="text-base sm:text-lg font-satoshi truncate">
                          {acc.name}
                        </span>
                      </div>
                      <span className="text-gray-300 font-satoshi whitespace-nowrap ml-2 sm:ml-4 text-xs sm:text-base">
                        ₹ {acc.spend.toLocaleString()}
                        <span className="hidden sm:inline">
                          {" "}
                          spend this month
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {!loading && !error && accounts.length === 0 && (
              <div className="relative z-10 text-center py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-300 mb-2">
                  No Ad Accounts Found
                </h3>
                <p className="text-gray-500 mb-4 sm:mb-6 max-w-md mx-auto px-4 sm:px-0 text-sm sm:text-base">
                  We couldn&apos;t find any ad accounts associated with your
                  Facebook account. Make sure you have access to Facebook Ads
                  Manager.
                </p>
              </div>
            )}

            {!loading && !error && accounts.length > 0 && (
              <div className="relative z-10 flex justify-center mt-2">
                <button
                  className={`border px-4 sm:px-5 py-2 sm:py-3 cursor-pointer rounded-xl sm:rounded-2xl border-none text-base sm:text-lg font-satoshi transition-all duration-300 w-full sm:w-auto ${
                    isLoading || accounts.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#5509d8] hover:shadow-[0_0_0_4px_rgba(85,9,216,0.4)]'
                  }`}
                  onClick={handleClick}
                  disabled={accounts.length === 0 || isLoading}
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        <span>
                          {selected.length > 0
                            ? `Audit ${selected.length} Selected Account${
                                selected.length > 1 ? "s" : ""
                              }`
                            : "Audit All Accounts"}
                        </span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-3 text-center block sm:hidden">
              Powered by River AI
            </p>
          </div>
        </div>
      </Vortex>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </main>
  );
}
