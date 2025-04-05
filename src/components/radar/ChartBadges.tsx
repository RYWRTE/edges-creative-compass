
import { Badge } from "@/components/ui/badge";
import { Concept } from "@/types/concept";

interface ChartBadgesProps {
  concepts: Concept[];
  highlighted: string | null;
  onToggle: (name: string) => void;
}

export const ChartBadges = ({ concepts, highlighted, onToggle }: ChartBadgesProps) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-6">
      {concepts.map((concept) => (
        <Badge 
          key={concept.name}
          variant={highlighted === concept.name ? "default" : "outline"}
          className="cursor-pointer px-4 py-2 text-sm"
          style={{ 
            backgroundColor: highlighted === concept.name ? concept.color : 'transparent',
            borderColor: concept.color,
            color: highlighted === concept.name ? 'white' : concept.color
          }}
          onClick={() => onToggle(concept.name)}
        >
          {concept.name}
        </Badge>
      ))}
    </div>
  );
};
