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
  return (
    <div className="space-y-2">
      {chapters.map((chapter) => (
        <Card
          key={chapter.id}
          className={`cursor-pointer p-4 transition-all ${
            currentChapter?.id === chapter.id
              ? "border-primary bg-primary/10"
              : "hover:border-primary/50"
          }`}
          onClick={() => onSelectChapter(chapter)}
        >
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4" />
            <div className="flex-1">
              <p className="font-medium">{chapter.title}</p>
              <p className="text-xs text-muted-foreground">
                Chapter {chapter.chapter_number}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ChapterList;
