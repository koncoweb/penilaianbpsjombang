import { cn } from "@/lib/utils";
import { getAttendanceScoreColor, getAttendanceScoreLabel } from "@/utils/attendanceUtils";

interface AttendanceScoreProps {
  score: number;
  showLabel?: boolean;
  className?: string;
}

export function AttendanceScore({ score, showLabel = false, className }: AttendanceScoreProps) {
  const colorClass = getAttendanceScoreColor(score);
  const label = getAttendanceScoreLabel(score);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("px-2 py-1 rounded text-sm font-medium", colorClass)}>
        {score}%
      </span>
      {showLabel && (
        <span className="text-xs text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  );
}

interface AttendanceScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AttendanceScoreBadge({ score, size = "md", className }: AttendanceScoreBadgeProps) {
  const colorClass = getAttendanceScoreColor(score);
  const label = getAttendanceScoreLabel(score);
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span className={cn("rounded font-medium", sizeClasses[size], colorClass)}>
        {score}%
      </span>
      <span className={cn("text-muted-foreground", {
        "text-xs": size === "sm",
        "text-sm": size === "md",
        "text-base": size === "lg",
      })}>
        {label}
      </span>
    </div>
  );
}

interface AttendanceTrendProps {
  currentScore: number;
  previousScore?: number;
  className?: string;
}

export function AttendanceTrend({ currentScore, previousScore, className }: AttendanceTrendProps) {
  if (!previousScore) {
    return <AttendanceScore score={currentScore} className={className} />;
  }

  const difference = currentScore - previousScore;
  const isImproving = difference > 0;
  const isDeclining = difference < 0;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <AttendanceScore score={currentScore} />
      {difference !== 0 && (
        <span className={cn("text-xs font-medium", {
          "text-green-600": isImproving,
          "text-red-600": isDeclining,
          "text-gray-500": difference === 0,
        })}>
          {isImproving && "↗"} {isDeclining && "↘"} {Math.abs(difference)}%
        </span>
      )}
    </div>
  );
}
