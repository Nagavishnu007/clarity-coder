export type EventType =
  | "tab_switch"
  | "tab_return"
  | "window_blur"
  | "window_focus"
  | "copy_attempt"
  | "paste_attempt"
  | "visibility_hidden"
  | "visibility_visible"
  | "session_start"
  | "session_end";

export const VIOLATION_EVENTS: EventType[] = [
  "tab_switch",
  "window_blur",
  "copy_attempt",
  "paste_attempt",
  "visibility_hidden",
];

export interface TestEvent {
  id: string;
  eventType: EventType;
  timestamp: string;
  attemptId: string;
  questionId: string;
  metadata: {
    browserState: string;
    focusState: string;
    userAgent?: string;
    [key: string]: unknown;
  };
}

export interface SessionSummary {
  totalEvents: number;
  totalViolations: number;
  sessionStart: string | null;
  sessionEnd: string | null;
  breakdownByType: Record<string, number>;
}
