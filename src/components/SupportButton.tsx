"use client";

import React, { useEffect, useState } from "react";
import { loadGurshaScript } from "../loader";

export interface BaseSupportProps {
  /** The GurshaPlus username (e.g., 'daniel') */
  creator: string;
  /** The interaction style */
  variant: "popup" | "floating";
  /** Custom label for the button and modal header */
  label?: string;
  /** Custom emoji for the button and modal */
  emoji?: string;
  /** Standard CSS class name */
  className?: string;
  /** Inline styles for the button */
  style?: React.CSSProperties;
  /** Button content (overrides default label rendering) */
  children?: React.ReactNode;
}

export type SupportButtonProps = BaseSupportProps &
  (
    | {
        variant: "floating";
        /** Custom position for the widget (left|right) */
        position?: "left" | "right";
      }
    | {
        variant: "popup";
        /**
         * @deprecated Position is only supported in 'floating' mode.
         * Please remove it or change variant to 'floating'.
         */
        position?: never;
      }
  );

/**
 * A lightweight, production-ready React component to trigger GurshaPlus payments.
 * It handles script loading and modal interaction automatically.
 */
export function SupportButton(props: SupportButtonProps) {
  const {
    creator,
    label = "Give a Gursha",
    emoji = "🤌",
    position = "right",
    variant,
    className = "",
    style,
    children,
  } = props;

  const [, setIsReady] = useState(false);

  useEffect(() => {
    // Pre-load script for snappier response
    loadGurshaScript({ creator, label, emoji, position, variant })
      .then(async () => {
        setIsReady(true);
        if (variant === "floating" && window.GurshaPlus) {
          await window.GurshaPlus.support({
            creator,
            label,
            emoji,
            position,
            variant,
          });
        }
      })
      .catch((err) => console.error("GurshaPlus Load Error:", err));
  }, [creator, label, emoji, position, variant]);

  const handleClick = async () => {
    try {
      await loadGurshaScript({ creator, label, emoji, position, variant });

      if (window.GurshaPlus) {
        await window.GurshaPlus.support({
          creator,
          label,
          emoji,
          variant,
          ...(variant !== "popup" && { position }),
        });
      }
    } catch (error) {
      console.error("GurshaPlus Payment Error:", error);
    }
  };

  if (variant === "floating") return null;

  return (
    <button
      onClick={handleClick}
      className={`gurshaplus-support-btn ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        cursor: "pointer",
        padding: "10px 20px",
        borderRadius: "12px",
        border: "none",
        fontWeight: "bold",
        transition: "all 0.2s ease",
        ...(!className && {
          backgroundColor: "var(--primary)",
          color: "var(--primary-foreground)",
        }),
        ...style,
      }}
    >
      {children ? (
        children
      ) : (
        <>
          <span style={{ fontSize: "20px" }}>{emoji}</span>
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
