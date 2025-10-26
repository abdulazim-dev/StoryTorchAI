import { Card } from "@/components/ui/card";
import { BookOpen, FileText, Target, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface EditorStatsProps {
  totalWords: number;
  totalChapters: number;
  targetWords?: number;
  averageWordsPerChapter: number;
}

const EditorStats = ({ totalWords, totalChapters, targetWords = 50000, averageWordsPerChapter }: EditorStatsProps) => {
  const progress = (totalWords / targetWords) * 100;

  return (
    <div className="space-y-4 p-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        Writing Progress
      </h3>

      <Card className="glass-card p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-semibold">{totalWords.toLocaleString()} / {targetWords.toLocaleString()}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">{progress.toFixed(1)}% complete</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs">Total Words</span>
            </div>
            <p className="text-2xl font-bold gradient-text">{totalWords.toLocaleString()}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span className="text-xs">Chapters</span>
            </div>
            <p className="text-2xl font-bold gradient-text">{totalChapters}</p>
          </div>

          <div className="col-span-2 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="h-4 w-4" />
              <span className="text-xs">Avg. Words/Chapter</span>
            </div>
            <p className="text-xl font-semibold">{averageWordsPerChapter.toLocaleString()}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EditorStats;
