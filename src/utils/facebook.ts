import { DateRange } from "@/types/types";

declare global {
  interface Window {
    fbAsyncInit?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FB: any;
  }
}

const FACEBOOK_CONFIG_ID = process.env.NEXT_PUBLIC_FACEBOOK_CONFIG_ID;

if (!FACEBOOK_CONFIG_ID) {
  throw new Error("Missing Facebook Config ID in env.");
}

export function loadFacebookSDK(): Promise<void> {
  return new Promise((resolve) => {
    if (window.FB) return resolve();
    (function (d, s, id) {
      const js = d.createElement(s) as HTMLScriptElement;
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return resolve();
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      js.onload = () => resolve();
      fjs.parentNode!.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  });
}

export function fbInit(appId: string) {
  window.FB.init({
    appId,
    cookie: true,
    xfbml: false,
    version: "v19.0",
  });
}

interface AuthResponse {
  accessToken: string;
  userID: string;
}

interface FBLoginResponse {
  authResponse?: AuthResponse;
}

interface UserDataResponse {
  email?: string;
  name?: string;
  error?: {
    message: string;
    type: string;
    code: number;
  };
}

export function fbLogin(): Promise<{accessToken: string, accountID: string, email?: string, name?: string}> {
  return new Promise((resolve, reject) => {
    window.FB.login(
      (response: FBLoginResponse) => {
        if (!response.authResponse) {
          reject("User cancelled login or did not fully authorize.");
          return;
        }

        const { accessToken, userID } = response.authResponse;

        window.FB.api(
          '/me',
          { fields: 'email,name' },
          (userResponse: UserDataResponse) => {
            if (userResponse.error) {
              console.warn("Failed to fetch user data:", userResponse.error);
              resolve({
                accessToken,
                accountID: userID,
              });
            } else {
              resolve({
                accessToken,
                accountID: userID,
                email: userResponse.email,
                name: userResponse.name
              });
            }
          }
        );
      },
      { scope: "ads_read,email" },
      { config_id: FACEBOOK_CONFIG_ID }
    );
  });
}

export interface FBAdAccount {
  id: string;
  name: string;
  amount_spent: string;
  spend: number;
}

export function fbGetAdAccounts(accessToken: string): Promise<FBAdAccount[]> {
  return new Promise((resolve, reject) => {
    window.FB.api(
      "/me/adaccounts",
      "GET",
      {
        access_token: accessToken,
        fields: "id,name,amount_spent",
      },
      (response: { data?: FBAdAccount[]; error?: unknown }) => {
        if (!response || response.error) {
          reject(response?.error || "Unknown error");
        } else {
          resolve(response.data || []);
        }
      }
    );
  });
}

export async function getLastMonthSpendForAccounts(
  accessToken: string,
  accounts: FBAdAccount[]
): Promise<(FBAdAccount & { spend: number })[]> {
  const results = await Promise.all(
    accounts.map(
      (acc: FBAdAccount) =>
        new Promise<FBAdAccount & { spend: number }>((resolve) => {
          window.FB.api(
            `/${acc.id}/insights`,
            "GET",
            {
              access_token: accessToken,
              fields: "spend",
              date_preset: "last_month",
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (response: any) => {
              const spend =
                response && response.data && response.data[0]
                  ? Number(response.data[0].spend)
                  : 0;
              resolve({ ...acc, spend });
            }
          );
        })
    )
  );
  return results;
}

export async function getTotalSpendPerAdAccount(
  accessToken: string,
  dateRange: DateRange
): Promise<(FBAdAccount & { total_spend: number })[]> {
  try {
    // First get all ad accounts
    const accounts = await fbGetAdAccounts(accessToken);
    
    // Then get spend for each account in the specified date range
    const results = await Promise.all(
      accounts.map(
        (account) =>
          new Promise<FBAdAccount & { total_spend: number }>((resolve) => {
            window.FB.api(
              `/${account.id}/insights`,
              "GET",
              {
                access_token: accessToken,
                fields: "spend",
                time_range: JSON.stringify({
                  since: dateRange.since,
                  until: dateRange.until,
                }),
                level: "account",
              },
              (response: { data?: { spend: string }[]; error?: unknown }) => {
                if (response.error) {
                  console.error(`Error fetching spend for account ${account.id}:`, response.error);
                  // Return account with 0 spend if there's an error
                  resolve({ ...account, total_spend: 0 });
                } else {
                  const spend = response.data && response.data[0] 
                    ? parseFloat(response.data[0].spend) 
                    : 0;
                  resolve({ ...account, total_spend: spend });
                }
              }
            );
          })
      )
    );

    return results;
  } catch (error) {
    console.error('Error in getTotalSpendPerAdAccount:', error);
    throw error;
  }
}