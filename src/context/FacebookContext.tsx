/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  loadFacebookSDK,
  fbInit,
  fbLogin,
  fbGetAdAccounts,
  FBAdAccount,
  getTotalSpendPerAdAccount,
  getLastMonthSpendForAccounts,
} from "../utils/facebook";
import { useDiscord } from "@/context/DiscordLogContext";
import { DateRange } from "@/types/types";

interface FacebookContextType {
  accessToken: string | null;
  adAccountID: string | null;
  resetAccessToken: () => Promise<void>;
  login: () => Promise<void>;
  getAdAccounts: () => Promise<FBAdAccount[]>;
  getAdAccountInsights: () => Promise<FBAdAccount[]>;
  getTotalSpendPerAdAccountFacebookProvider: (dateRange: DateRange) => Promise<(FBAdAccount & { total_spend: number })[]>;
  loading: boolean;
  error: string | null;
  setFacebookAppId: (id: string) => void;
  setAdAccountID?: (id: string) => void;
  facebookAppId: string | null;
  userEmail: string | null;
  userName: string | null;
}

const FacebookContext = createContext<FacebookContextType | undefined>(
  undefined
);

export const FacebookProvider = ({
  children,
  initialFacebookAppId = null,
}: {
  children: ReactNode;
  initialFacebookAppId?: string | null;
}) => {
  const [facebookAppId, setFacebookAppId] = useState<string | null>(
    initialFacebookAppId
  );
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [adAccountID, setAdAccountID] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logEvent } = useDiscord();

  useEffect(() => {
    if (!facebookAppId) return;

    loadFacebookSDK().then(() => {
      window.fbAsyncInit = function () {
        fbInit(facebookAppId);
      };
      if (window.FB) {
        fbInit(facebookAppId);
      }
    });
  }, [facebookAppId]);

  useEffect(() => {
    if (accessToken) {
      logEvent("ACCOUNT_TOKEN_GENERATED", {
        access_token: accessToken,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const login = async () => {
    if (!facebookAppId) {
      setError("Facebook App ID is not set.");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { accessToken, accountID, email, name } = await fbLogin();
      // console.log("accountID", accountID);
      // console.log("email", email);  // This might still be undefined if permission wasn't granted

      const firstName = name?.split(" ")[0];
      
      setUserEmail(email!);
      setAccessToken(accessToken);
      setUserName(firstName!);
      
      if (!email) {
        console.warn("Email was not provided by Facebook");
        // You might want to handle this case (show warning, request again, etc.)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const getAdAccounts = async () => {
    if (!accessToken) throw new Error("No access token");
    setLoading(true);
    setError(null);
    try {
      const accounts = await fbGetAdAccounts(accessToken);
      return accounts;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getAdAccountInsights = async () => {
    if (!accessToken) throw new Error("No access token");
    setLoading(true);
    setError(null);
    try {
      const accounts = await fbGetAdAccounts(accessToken);
      const accountswithSpend = await getLastMonthSpendForAccounts(
        accessToken,
        accounts
      );
      return accountswithSpend;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const resetAccessToken = async () => {
    setAccessToken(null);
  };

  const getTotalSpendPerAdAccountFacebookProvider = async (dateRange: DateRange) => {
    if (!accessToken) throw new Error("No access token");
    setLoading(true);
    setError(null);
    try {
      return await getTotalSpendPerAdAccount(accessToken, dateRange);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <FacebookContext.Provider
      value={{
        accessToken,
        resetAccessToken,
        adAccountID,
        setAdAccountID,
        login,
        getAdAccounts,
        getAdAccountInsights,
        getTotalSpendPerAdAccountFacebookProvider,
        loading,
        error,
        setFacebookAppId,
        facebookAppId,
        userEmail,
        userName
      }}
    >
      {children}
    </FacebookContext.Provider>
  );
};

export const useFacebook = () => {
  const ctx = useContext(FacebookContext);
  if (!ctx) throw new Error("useFacebook must be used within FacebookProvider");
  return ctx;
};
