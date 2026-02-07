import { useEffect, useRef } from "react";
import { EventType } from "@/types/events";
import { toast } from "sonner";

interface UseViolationDetectorOptions {
  onViolation: (eventType: EventType, meta?: Record<string, unknown>) => void;
  enabled?: boolean;
}

export function useViolationDetector({
  onViolation,
  enabled = true,
}: UseViolationDetectorOptions) {
  const onViolationRef = useRef(onViolation);
  onViolationRef.current = onViolation;

  useEffect(() => {
    if (!enabled) return;

    // Tab visibility change detection
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        onViolationRef.current("visibility_hidden");
        toast.error("⚠️ Tab switch detected!", {
          description: "You navigated away from the test window.",
          duration: 4000,
        });
      } else {
        onViolationRef.current("visibility_visible");
        toast.success("✅ Focus restored", {
          description: "You returned to the test window.",
          duration: 2000,
        });
      }
    };

    // Window blur/focus detection
    const handleBlur = () => {
      onViolationRef.current("window_blur");
      toast.error("⚠️ Window focus lost!", {
        description: "The test window lost focus.",
        duration: 4000,
      });
    };

    const handleFocus = () => {
      onViolationRef.current("window_focus");
      toast.success("✅ Window focus restored", {
        description: "The test window regained focus.",
        duration: 2000,
      });
    };

    // Copy/Paste prevention
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      onViolationRef.current("copy_attempt");
      toast.error("🚫 Copy disabled!", {
        description: "Copying is not allowed during the test.",
        duration: 3000,
      });
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      onViolationRef.current("paste_attempt");
      toast.error("🚫 Paste disabled!", {
        description: "Pasting is not allowed during the test.",
        duration: 3000,
      });
    };

    // Prevent context menu (right-click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [enabled]);
}
