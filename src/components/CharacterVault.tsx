import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logError } from "@/lib/errorHandler";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CharacterVaultProps {
  projectId: string;
}

const CharacterVault = ({ projectId }: CharacterVaultProps) => {
  const [characters, setCharacters] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCharacter, setNewCharacter] = useState({
    name: "",
    role: "supporting",
    age: "",
    appearance: "",
    backstory: "",
    personality: "",
  });

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
      logError('CharacterVault.loadCharacters', error);
    }
  };

  const handleCreateCharacter = async () => {
    if (!newCharacter.name.trim()) {
      toast.error("Character name is required");
      return;
    }

    try {
      const { error } = await supabase.from("characters").insert([{
        project_id: projectId,
        name: newCharacter.name,
        role: newCharacter.role as "protagonist" | "antagonist" | "supporting",
        age: newCharacter.age ? parseInt(newCharacter.age) : null,
        appearance: newCharacter.appearance || null,
        backstory: newCharacter.backstory || null,
        personality: newCharacter.personality || null,
      }]);

      if (error) throw error;

      toast.success("Character created successfully");
      setIsDialogOpen(false);
      setNewCharacter({
        name: "",
        role: "supporting",
        age: "",
        appearance: "",
        backstory: "",
        personality: "",
      });
      loadCharacters();
    } catch (error) {
      logError('CharacterVault.handleCreateCharacter', error);
      toast.error("Failed to create character");
    }
  };

  return (
    <div className="space-y-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Character
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Character</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={newCharacter.name}
                onChange={(e) =>
                  setNewCharacter({ ...newCharacter, name: e.target.value })
                }
                placeholder="Character name"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={newCharacter.role}
                onValueChange={(value) =>
                  setNewCharacter({ ...newCharacter, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="protagonist">Protagonist</SelectItem>
                  <SelectItem value="antagonist">Antagonist</SelectItem>
                  <SelectItem value="supporting">Supporting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={newCharacter.age}
                onChange={(e) =>
                  setNewCharacter({ ...newCharacter, age: e.target.value })
                }
                placeholder="Character age"
              />
            </div>
            <div>
              <Label htmlFor="appearance">Appearance</Label>
              <Textarea
                id="appearance"
                value={newCharacter.appearance}
                onChange={(e) =>
                  setNewCharacter({ ...newCharacter, appearance: e.target.value })
                }
                placeholder="Physical description"
              />
            </div>
            <div>
              <Label htmlFor="personality">Personality</Label>
              <Textarea
                id="personality"
                value={newCharacter.personality}
                onChange={(e) =>
                  setNewCharacter({ ...newCharacter, personality: e.target.value })
                }
                placeholder="Character traits and behavior"
              />
            </div>
            <div>
              <Label htmlFor="backstory">Backstory</Label>
              <Textarea
                id="backstory"
                value={newCharacter.backstory}
                onChange={(e) =>
                  setNewCharacter({ ...newCharacter, backstory: e.target.value })
                }
                placeholder="Character history"
              />
            </div>
            <Button onClick={handleCreateCharacter} className="w-full">
              Create Character
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
