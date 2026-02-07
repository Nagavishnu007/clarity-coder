import { useCallback, useEffect, useState } from "react";
import { useEventLogger } from "@/hooks/useEventLogger";
import { useViolationDetector } from "@/hooks/useViolationDetector";
import { StatusBar } from "@/components/StatusBar";
import { ViolationWarning } from "@/components/ViolationWarning";
import { EventType } from "@/types/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

const VIOLATION_TYPES: EventType[] = [
  "tab_switch",
  "window_blur",
  "copy_attempt",
  "paste_attempt",
  "visibility_hidden",
];

export default function TestEnvironment() {
  const { logEvent, getViolationCount, attemptId } = useEventLogger();
  const [isFocused, setIsFocused] = useState(document.hasFocus());
  const [isVisible, setIsVisible] = useState(
    document.visibilityState === "visible"
  );
  const [warningMsg, setWarningMsg] = useState("");
  const [warningType, setWarningType] = useState<"violation" | "restored">(
    "violation"
  );
  const [warningKey, setWarningKey] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const handleViolation = useCallback(
    (eventType: EventType, meta?: Record<string, unknown>) => {
      logEvent(eventType, "Q1", meta);

      const isViolation = VIOLATION_TYPES.includes(eventType);

      const messages: Record<string, string> = {
        tab_switch: "Tab switch detected!",
        visibility_hidden: "Tab switch detected!",
        visibility_visible: "Focus restored",
        window_blur: "Window focus lost!",
        window_focus: "Window focus restored",
        copy_attempt: "Copy attempt blocked!",
        paste_attempt: "Paste attempt blocked!",
      };

      setWarningMsg(messages[eventType] || eventType);
      setWarningType(isViolation ? "violation" : "restored");
      setWarningKey((k) => k + 1);

      // Update focus/visibility state
      if (eventType === "window_blur") setIsFocused(false);
      if (eventType === "window_focus") setIsFocused(true);
      if (eventType === "visibility_hidden") setIsVisible(false);
      if (eventType === "visibility_visible") setIsVisible(true);
    },
    [logEvent]
  );

  useViolationDetector({ onViolation: handleViolation, enabled: true });

  // Log session start
  useEffect(() => {
    logEvent("session_start", "Q1");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background select-none">
      <StatusBar
        violationCount={getViolationCount()}
        attemptId={attemptId}
        isFocused={isFocused}
        isVisible={isVisible}
      />

      <ViolationWarning
        key={warningKey}
        message={warningMsg}
        type={warningType}
        visible={true}
      />

      <main className="container max-w-3xl py-8 space-y-6">
        {/* Security Notice */}
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <ShieldAlert className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-destructive">
                Secure Environment Active
              </p>
              <p className="text-xs text-muted-foreground">
                This test is being monitored. Tab switches, window focus loss,
                and copy/paste attempts are recorded and will be flagged as
                violations. Stay on this page to avoid violations.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sample Test Question */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Question 1 of 1</CardTitle>
              <span className="text-xs text-muted-foreground font-mono">
                ID: Q1
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm leading-relaxed text-foreground">
              Which of the following best describes the purpose of a browser's{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                visibilitychange
              </code>{" "}
              event?
            </p>

            <RadioGroup
              value={selectedAnswer}
              onValueChange={setSelectedAnswer}
              className="space-y-3"
            >
              {[
                {
                  value: "a",
                  label:
                    "It fires when the DOM content has finished loading.",
                },
                {
                  value: "b",
                  label:
                    "It fires when the page's visibility state changes (e.g., tab switch).",
                },
                {
                  value: "c",
                  label:
                    "It fires when the user scrolls to a new section of the page.",
                },
                {
                  value: "d",
                  label:
                    "It fires when a CSS animation completes.",
                },
              ].map((option) => (
                <div
                  key={option.value}
                  className="flex items-start space-x-3 rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors"
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`option-${option.value}`}
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor={`option-${option.value}`}
                    className="text-sm cursor-pointer leading-relaxed"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-end pt-2">
              <Button
                disabled={!selectedAnswer}
                onClick={() => {
                  logEvent("session_end", "Q1", {
                    selectedAnswer,
                  });
                }}
              >
                Submit Answer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Test Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>Do not switch tabs or windows during the test</li>
              <li>Copy and paste are disabled in the test area</li>
              <li>Right-click context menu is disabled</li>
              <li>All violations are logged with timestamps</li>
              <li>
                Your attempt ID:{" "}
                <code className="font-mono text-foreground">{attemptId}</code>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
