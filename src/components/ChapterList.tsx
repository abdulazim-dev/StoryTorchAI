import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface Chapter {
  id: string;
  title: string;
  content: string | null;
  chapter_number: number;
}

interface ChapterListProps {
  chapters: Chapter[];
  currentChapter: Chapter | null;
  onSelectChapter: (chapter: Chapter) => void;
}

const ChapterList = ({ chapters, currentChapter, onSelectChapter }: ChapterListProps) => {
  const getWordCount = (content: string | null) => {
    if (!content) return 0;
    return content.trim().split(/\s+/).filter(Boolean).length;
  };

  return (
    <div className="space-y-2">
      {chapters.map((chapter, index) => {
        const wordCount = getWordCount(chapter.content);
        const isActive = currentChapter?.id === chapter.id;
        
        return (
          <Card
            key={chapter.id}
            className={`cursor-pointer p-4 transition-spring hover-lift group ${
              isActive
                ? "border-primary bg-primary/10 shadow-elevated animate-glow-pulse"
                : "hover:border-primary/50 hover:bg-card/50"
            }`}
            onClick={() => onSelectChapter(chapter)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg transition-colors ${
                isActive 
                  ? "bg-primary/20 text-primary" 
                  : "bg-muted group-hover:bg-primary/10"
              }`}>
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className={`font-medium transition-colors ${
                  isActive ? "text-primary" : ""
                }`}>
                  {chapter.title}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Chapter {chapter.chapter_number}</span>
                  <span>•</span>
                  <span>{wordCount.toLocaleString()} words</span>
                </div>
              </div>
              {isActive && (
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ChapterList;
