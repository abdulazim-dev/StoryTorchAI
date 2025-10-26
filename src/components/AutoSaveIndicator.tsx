import { Check, Loader2, Cloud } from "lucide-react";
import { useEffect, useState } from "react";

interface AutoSaveIndicatorProps {
  status: "saving" | "saved" | "idle";
  lastSaved?: Date;
}

const AutoSaveIndicator = ({ status, lastSaved }: AutoSaveIndicatorProps) => {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    if (lastSaved) {
      const updateTimeAgo = () => {
        const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
        if (seconds < 60) setTimeAgo("just now");
        else if (seconds < 3600) setTimeAgo(`${Math.floor(seconds / 60)}m ago`);
        else setTimeAgo(`${Math.floor(seconds / 3600)}h ago`);
      };

      updateTimeAgo();
      const interval = setInterval(updateTimeAgo, 10000);
      return () => clearInterval(interval);
    }
  }, [lastSaved]);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {status === "saving" && (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Saving...</span>
        </>
      )}
      {status === "saved" && (
        <>
          <Check className="h-4 w-4 text-green-500" />
          <span>Saved {timeAgo}</span>
        </>
      )}
      {status === "idle" && (
        <>
          <Cloud className="h-4 w-4" />
          <span>Auto-save enabled</span>
        </>
      )}
    </div>
  );
};

export default AutoSaveIndicator;
