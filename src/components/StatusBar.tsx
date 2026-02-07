import { Badge } from "@/components/ui/badge";
import { Shield, Eye, MonitorSmartphone, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface StatusBarProps {
  violationCount: number;
  attemptId: string;
  isFocused: boolean;
  isVisible: boolean;
}

export function StatusBar({ violationCount, attemptId, isFocused, isVisible }: StatusBarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="text-sm font-bold tracking-tight sm:text-base">
            Secure Test Environment
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Badge
            variant={violationCount > 0 ? "destructive" : "secondary"}
            className="gap-1.5 text-xs"
          >
            <AlertTriangle className="h-3 w-3" />
            Violations: {violationCount}
          </Badge>

          <Badge
            variant={isFocused ? "default" : "destructive"}
            className="gap-1.5 text-xs hidden sm:inline-flex"
          >
            <MonitorSmartphone className="h-3 w-3" />
            {isFocused ? "Focused" : "Blurred"}
          </Badge>

          <Badge
            variant={isVisible ? "default" : "destructive"}
            className="gap-1.5 text-xs hidden sm:inline-flex"
          >
            <Eye className="h-3 w-3" />
            {isVisible ? "Visible" : "Hidden"}
          </Badge>

          <Badge variant="outline" className="text-xs font-mono hidden md:inline-flex">
            {attemptId}
          </Badge>

          <Button variant="outline" size="sm" asChild className="ml-2">
            <Link to="/event-log">View Logs</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
