import { useMemo } from "react";
import { useEventLogger } from "@/hooks/useEventLogger";
import { VIOLATION_EVENTS } from "@/types/events";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Download,
  Trash2,
  AlertTriangle,
  Info,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function eventLabel(type: string): string {
  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const RESTORED_EVENTS = ["visibility_visible", "window_focus", "tab_return"];

export default function EventLogViewer() {
  const { events, getSummary, exportAsJson, clearLogs } = useEventLogger();
  const summary = useMemo(() => getSummary(), [getSummary]);

  const sortedEvents = useMemo(
    () => [...events].reverse(),
    [events]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-sm font-bold tracking-tight sm:text-base">
              Event Log Viewer
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportAsJson} className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export JSON</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={clearLogs}
              className="gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl py-8 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{summary.totalEvents}</div>
              <p className="text-xs text-muted-foreground">Total Events</p>
            </CardContent>
          </Card>
          <Card className={cn(summary.totalViolations > 0 && "border-destructive/40")}>
            <CardContent className="pt-6">
              <div className={cn("text-2xl font-bold", summary.totalViolations > 0 && "text-destructive")}>
                {summary.totalViolations}
              </div>
              <p className="text-xs text-muted-foreground">Violations</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-1">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium">Start</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {summary.sessionStart ? formatTimestamp(summary.sessionStart) : "—"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-1">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium">Latest</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {summary.sessionEnd ? formatTimestamp(summary.sessionEnd) : "—"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Breakdown */}
        {Object.keys(summary.breakdownByType).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Breakdown by Event Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(summary.breakdownByType).map(([type, count]) => {
                  const isViolation = VIOLATION_EVENTS.includes(type as any);
                  return (
                    <Badge
                      key={type}
                      variant={isViolation ? "destructive" : "secondary"}
                      className="gap-1 text-xs"
                    >
                      {eventLabel(type)}: {count}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Event Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              All Events ({sortedEvents.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {sortedEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Info className="h-8 w-8 mb-2" />
                <p className="text-sm">No events recorded yet.</p>
                <p className="text-xs">
                  Go to the test environment to generate events.
                </p>
              </div>
            ) : (
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]"></TableHead>
                      <TableHead>Event Type</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead className="hidden sm:table-cell">Attempt ID</TableHead>
                      <TableHead className="hidden sm:table-cell">Question</TableHead>
                      <TableHead className="hidden md:table-cell">Metadata</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedEvents.map((event) => {
                      const isViolation = VIOLATION_EVENTS.includes(event.eventType);
                      const isRestored = RESTORED_EVENTS.includes(event.eventType);

                      return (
                        <TableRow
                          key={event.id}
                          className={cn(
                            isViolation && "bg-destructive/5",
                            isRestored && "bg-primary/5"
                          )}
                        >
                          <TableCell>
                            {isViolation ? (
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                            ) : isRestored ? (
                              <ShieldCheck className="h-4 w-4 text-primary" />
                            ) : (
                              <Info className="h-4 w-4 text-muted-foreground" />
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                isViolation
                                  ? "destructive"
                                  : isRestored
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {eventLabel(event.eventType)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs font-mono text-muted-foreground">
                            {formatTimestamp(event.timestamp)}
                          </TableCell>
                          <TableCell className="text-xs font-mono hidden sm:table-cell">
                            {event.attemptId}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant="outline" className="text-xs">
                              {event.questionId}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate hidden md:table-cell">
                            {event.metadata.focusState} / {event.metadata.browserState}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
