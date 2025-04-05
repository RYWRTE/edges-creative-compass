
import { useState } from "react";
import { Concept } from "@/types/concept";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface ConceptFormProps {
  onSubmit: (concept: Concept) => void;
}

const ConceptForm = ({ onSubmit }: ConceptFormProps) => {
  const [concept, setConcept] = useState<Concept>({
    name: "",
    entertaining: 5,
    daring: 5,
    gripping: 5,
    experiential: 5,
    subversive: 5,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConcept({ ...concept, [name]: value });
  };

  const handleSliderChange = (name: keyof Omit<Concept, "name" | "color">, value: number[]) => {
    setConcept({ ...concept, [name]: value[0] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.name.trim()) {
      return;
    }
    onSubmit(concept);
    setConcept({
      name: "",
      entertaining: 5,
      daring: 5,
      gripping: 5,
      experiential: 5,
      subversive: 5,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Concept Name</Label>
        <Input
          id="name"
          name="name"
          value={concept.name}
          onChange={handleChange}
          placeholder="Enter concept name"
          required
        />
      </div>

      {[
        { key: "entertaining", label: "ENTERTAINING", description: "Drawing audience in with compelling narratives" },
        { key: "daring", label: "DARING", description: "Challenging expectations or hijacking medium/moment" },
        { key: "gripping", label: "GRIPPING", description: "Stopping and grabbing attention to engage" },
        { key: "experiential", label: "EXPERIENTIAL", description: "Actively involving and interacting with consumers" },
        { key: "subversive", label: "SUBVERSIVE", description: "Challenging category rules with a new path forward" },
      ].map(({ key, label, description }) => (
        <div key={key} className="space-y-2">
          <div className="flex justify-between items-end">
            <Label htmlFor={key} className="font-semibold">
              {label}
              <p className="text-xs font-normal text-gray-500 mt-1">{description}</p>
            </Label>
            <span className="text-lg font-bold text-blue-600">
              {concept[key as keyof Omit<Concept, "name" | "color">]}
            </span>
          </div>
          <Slider
            id={key}
            min={1}
            max={10}
            step={1}
            value={[concept[key as keyof Omit<Concept, "name" | "color">]]}
            onValueChange={(value) => 
              handleSliderChange(key as keyof Omit<Concept, "name" | "color">, value)
            }
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1</span>
            <span>10</span>
          </div>
        </div>
      ))}

      <Button type="submit" className="w-full">
        Add to Evaluation
      </Button>
    </form>
  );
};

export default ConceptForm;
