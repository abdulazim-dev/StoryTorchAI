import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CharacterVaultProps {
  projectId: string;
}

const CharacterVault = ({ projectId }: CharacterVaultProps) => {
  const [characters, setCharacters] = useState<any[]>([]);

  useEffect(() => {
    loadCharacters();
  }, [projectId]);

  const loadCharacters = async () => {
    try {
      const { data } = await supabase
        .from("characters")
        .select("*")
        .eq("project_id", projectId);
      setCharacters(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      {characters.map((char) => (
        <Card key={char.id} className="p-4">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-primary" />
            <div>
              <h4 className="font-semibold">{char.name}</h4>
              <p className="text-xs text-muted-foreground capitalize">{char.role}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CharacterVault;
