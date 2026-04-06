/**
 * GurshaPlus Iframe Bridge Loader
 */

const getWidgetBaseUrl = () => {
  if (typeof window === "undefined") return "https://gurshaplus.com/widget";
  return window.location.hostname === "staging.gurshaplus.com"
    ? "https://staging.gurshaplus.com/widget"
    : "https://gurshaplus.com/widget";
};

export interface GurshaPlusOptions {
  creator: string;
  label?: string;
  emoji?: string;
  position?: "left" | "right";
  variant?: "popup" | "floating";
}

declare global {
  interface Window {
    GurshaPlus?: {
      support: (options: GurshaPlusOptions) => Promise<void>;
    };
  }
}

let scriptPromise: Promise<void> | null = null;
let isReady = false;

export const loadGurshaScript = (
  options?: GurshaPlusOptions,
): Promise<void> => {
  if (typeof window === "undefined") return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve) => {
    const existingIframe = document.getElementById(
      "gurshaplus-iframe",
    ) as HTMLIFrameElement;
    if (existingIframe) {
      if (isReady) resolve();
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.id = "gurshaplus-iframe";
    iframe.name = "gurshaplus-iframe";

    const variantConfig = options?.variant || "floating";
    const posConfig = options?.position || "right";

    // Initial styles - keep small to only show the launcher if in floating mode, or 0 if popup.
    Object.assign(iframe.style, {
      position: "fixed",
      bottom: "0px",
      top: "auto",
      left: posConfig === "left" ? "0px" : "auto",
      right: posConfig === "right" ? "0px" : "auto",
      width: variantConfig === "popup" ? "0px" : "100px",
      height: variantConfig === "popup" ? "0px" : "100px",
      border: "none",
      zIndex: "2147483647",
      background: "transparent",
      overflow: "hidden",
      colorScheme: "light",
    });

    // Build URL with initial config
    const url = new URL(getWidgetBaseUrl());
    if (options?.creator) {
      Object.entries(options).forEach(([key, val]) => {
        if (val) url.searchParams.set(key, val as string);
      });
    }
    iframe.src = url.toString();

    // Setup global API bridge
    window.GurshaPlus = {
      support: async (opts) => {
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            { type: "gursha-init", options: opts },
            "*",
          );
        }
      },
    };

    // Listen for messages from iframe
    window.addEventListener("message", (event) => {
      // In production, validate event.origin matches GURSHA_WIDGET_BASE_URL
      const { type, position = "right", variant = "floating" } = event.data;

      if (type === "gursha-ready") {
        isReady = true;
        resolve();
      } else if (type === "gursha-open") {
        // Expand iframe to full viewport to show the modal (instant size change)
        Object.assign(iframe.style, {
          width: "100vw",
          height: "100vh",
          top: "0",
          left: "0",
          bottom: "auto",
          right: "auto",
        });
      } else if (type === "gursha-close") {
        // Shrink back to launcher size/position
        const actualVariant = variant || variantConfig;
        const actualPosition = position || posConfig;

        Object.assign(iframe.style, {
          width: actualVariant === "popup" ? "0px" : "100px",
          height: actualVariant === "popup" ? "0px" : "100px",
          top: "auto",
          bottom: "0px",
          left: actualPosition === "left" ? "0px" : "auto",
          right: actualPosition === "right" ? "0px" : "auto",
        });
      }
    });

    document.body.appendChild(iframe);
  });

  return scriptPromise;
};
