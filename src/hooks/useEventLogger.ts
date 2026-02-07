import { useCallback, useEffect, useState } from "react";
import { TestEvent, EventType, VIOLATION_EVENTS, SessionSummary } from "@/types/events";

const STORAGE_KEY = "secure_test_event_log";
const ATTEMPT_KEY = "secure_test_attempt_id";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function getAttemptId(): string {
  let id = localStorage.getItem(ATTEMPT_KEY);
  if (!id) {
    id = `ATT-${Date.now().toString(36).toUpperCase()}`;
    localStorage.setItem(ATTEMPT_KEY, id);
  }
  return id;
}

function loadEvents(): TestEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistEvents(events: TestEvent[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function useEventLogger() {
  const [events, setEvents] = useState<TestEvent[]>(loadEvents);
  const [attemptId] = useState<string>(getAttemptId);

  // Sync state from storage on mount
  useEffect(() => {
    setEvents(loadEvents());
  }, []);

  const logEvent = useCallback(
    (
      eventType: EventType,
      questionId: string = "Q1",
      extraMetadata: Record<string, unknown> = {}
    ) => {
      const event: TestEvent = {
        id: generateId(),
        eventType,
        timestamp: new Date().toISOString(),
        attemptId,
        questionId,
        metadata: {
          browserState: document.visibilityState,
          focusState: document.hasFocus() ? "focused" : "blurred",
          userAgent: navigator.userAgent,
          ...extraMetadata,
        },
      };

      setEvents((prev) => {
        const updated = [...prev, event];
        persistEvents(updated);
        return updated;
      });

      return event;
    },
    [attemptId]
  );

  const getViolationCount = useCallback((): number => {
    return events.filter((e) => VIOLATION_EVENTS.includes(e.eventType)).length;
  }, [events]);

  const getSummary = useCallback((): SessionSummary => {
    const breakdown: Record<string, number> = {};
    events.forEach((e) => {
      breakdown[e.eventType] = (breakdown[e.eventType] || 0) + 1;
    });

    return {
      totalEvents: events.length,
      totalViolations: events.filter((e) =>
        VIOLATION_EVENTS.includes(e.eventType)
      ).length,
      sessionStart: events.length > 0 ? events[0].timestamp : null,
      sessionEnd:
        events.length > 0 ? events[events.length - 1].timestamp : null,
      breakdownByType: breakdown,
    };
  }, [events]);

  const exportAsJson = useCallback((): void => {
    const data = JSON.stringify(events, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `event-log-${attemptId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [events, attemptId]);

  const clearLogs = useCallback((): void => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ATTEMPT_KEY);
    setEvents([]);
  }, []);

  return {
    events,
    attemptId,
    logEvent,
    getViolationCount,
    getSummary,
    exportAsJson,
    clearLogs,
  };
}
