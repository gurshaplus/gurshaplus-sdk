/**
 * GurshaPlus Script Loader Utility
 */

const GURSHA_SCRIPT_URL =
  window.location.hostname === "staging.gurshaplus.com"
    ? "https://staging.gurshaplus.com/widget/widget.min.js"
    : "https://gurshaplus.com/widget/widget.min.js";

declare global {
  interface Window {
    GurshaPlus?: {
      support: (options: {
        creator: string;
        label?: string;
        emoji?: string;
        position?: "left" | "right";
        variant?: "popup" | "floating";
      }) => Promise<void>;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

export const loadGurshaScript = (): Promise<void> => {
  if (!GURSHA_SCRIPT_URL) {
    throw new Error("GURSHA_SCRIPT_URL is not defined");
  }
  if (typeof window === "undefined") return Promise.resolve();

  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${GURSHA_SCRIPT_URL}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = GURSHA_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Failed to load GurshaPlus widget script"));
    };
    document.body.appendChild(script);
  });

  return scriptPromise;
};
