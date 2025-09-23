"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface DiscordLog {
  action: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

interface DiscordContextType {
  logEvent: (
    eventType: EventType,
    specific_metadata?: Record<string, unknown> | null
  ) => Promise<void>;
  logs: DiscordLog[];
  clearLogs: () => void;
  loading: boolean;
  error: string | null;
}

type EventType =
  | "LOGIN_BUTTON_CLICK"
  | "SAMPLE_REPORT_LINK_CLICK"
  | "AD_ACCOUNT_AUDIT_BUTTON_CLICK"
  | "ACCOUNT_TOKEN_GENERATED"
  | "FAILURE_ENDPOINT_HIT";

const DiscordContext = createContext<DiscordContextType | undefined>(undefined);

interface DiscordProviderProps {
  children: ReactNode;
  webhookUrl: string;
  defaultMetadata?: Record<string, unknown>;
  threadId?: string;
}

export const DiscordProvider = ({
  children,
  webhookUrl,
  defaultMetadata = {},
  threadId,
}: DiscordProviderProps) => {
  const [logs, setLogs] = useState<DiscordLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWebhookUrl = useCallback(() => {
    let url = webhookUrl;
    if (threadId) {
      url += url.includes("?")
        ? `&thread_id=${threadId}`
        : `?thread_id=${threadId}`;
    }
    return url;
  }, [webhookUrl, threadId]);

  const collectMetadata = useCallback(async () => {
    try {
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const { ip } = await ipResponse.json();

      const userAgent = navigator.userAgent;
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const currentUrl = window.location.href;

      return {
        ip,
        currentUrl,
        userAgent,
        screenResolution: `${screenWidth}x${screenHeight}`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error collecting metadata:", error);
      return {
        error: "Failed to collect some metadata",
        timestamp: new Date().toISOString(),
      };
    }
  }, []);

  const getEventDetails = useCallback((eventType: EventType) => {
    const baseDetails = {
      color: 0x5865f2,
      timestamp: new Date().toISOString(),
    };

    switch (eventType) {
      case "LOGIN_BUTTON_CLICK":
        return {
          ...baseDetails,
          title: "User Login Attempt",
          description: "User clicked the login button",
          color: 0x00ff00,
        };
      case "SAMPLE_REPORT_LINK_CLICK":
        return {
          ...baseDetails,
          title: "Sample Report Viewed",
          description: "User clicked on the sample report link",
          color: 0x0099ff,
        };
      case "AD_ACCOUNT_AUDIT_BUTTON_CLICK":
        return {
          ...baseDetails,
          title: "Ad Account Audit Initiated",
          description: "User clicked the ad account audit button",
          color: 0xffa500,
        };
      case "ACCOUNT_TOKEN_GENERATED":
        return {
          ...baseDetails,
          title: "Access Token Generated",
          description: "A new access token was generated",
          color: 0x800080,
        };
      case "FAILURE_ENDPOINT_HIT":
        return {
          ...baseDetails,
          title: "Failure Endpoint Triggered",
          description: "A failure endpoint was hit",
          color: 0xff0000,
        };
      default:
        return {
          ...baseDetails,
          title: "Unknown Event",
          description: "An unknown event occurred",
        };
    }
  }, []);

  const logEvent = useCallback(
    async (
      eventType: EventType,
      specific_metadata?: Record<string, unknown> | null
    ) => {
      setLoading(true);
      setError(null);

      try {
        const metadata = await collectMetadata();
        const eventDetails = getEventDetails(eventType);

        const logEntry: DiscordLog = {
          action: eventType,
          metadata: { ...specific_metadata, ...defaultMetadata, ...metadata },
          timestamp: new Date(),
        };

        setLogs((prev) => [...prev, logEntry]);

        const embedFields = Object.entries(logEntry.metadata || {})
          .filter(([, value]) => value !== undefined)
          .map(([name, value]) => ({
            name,
            value:
              typeof value === "object"
                ? JSON.stringify(value, null, 2)
                : String(value),
            inline: name.length < 15,
          }));

        const response = await fetch(getWebhookUrl(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            embeds: [
              {
                ...eventDetails,
                fields: embedFields,
              },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Discord webhook failed with status ${response.status}`
          );
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Failed to log to Discord:", errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [collectMetadata, defaultMetadata, getEventDetails, getWebhookUrl]
  );

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return (
    <DiscordContext.Provider
      value={{
        logEvent,
        logs,
        clearLogs,
        loading,
        error,
      }}
    >
      {children}
    </DiscordContext.Provider>
  );
};

export const useDiscord = (): DiscordContextType => {
  const context = useContext(DiscordContext);
  if (!context) {
    throw new Error("useDiscord must be used within a DiscordProvider");
  }
  return context;
};
