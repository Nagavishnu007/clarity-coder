import { useEffect, useState } from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViolationWarningProps {
  message: string;
  type: "violation" | "restored";
  visible: boolean;
}

export function ViolationWarning({ message, type, visible }: ViolationWarningProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, message]);

  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-lg border px-6 py-4 shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-top-4",
        type === "violation"
          ? "border-destructive/50 bg-destructive/10 text-destructive"
          : "border-primary/50 bg-primary/10 text-primary"
      )}
    >
      {type === "violation" ? (
        <AlertTriangle className="h-5 w-5 shrink-0" />
      ) : (
        <ShieldCheck className="h-5 w-5 shrink-0" />
      )}
      <span className="font-semibold text-sm">{message}</span>
    </div>
  );
}
