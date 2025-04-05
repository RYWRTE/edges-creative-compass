
import { Badge } from "@/components/ui/badge";
import { Concept } from "@/types/concept";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChartBadgesProps {
  concepts: Concept[];
  highlighted: string | null;
  onToggle: (name: string) => void;
}

export const ChartBadges = ({ concepts, highlighted, onToggle }: ChartBadgesProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`flex flex-wrap gap-2 ${isMobile ? 'gap-y-2' : 'gap-3'} justify-center mb-4`}>
      {concepts.map((concept) => (
        <Badge 
          key={concept.name}
          variant={highlighted === concept.name ? "default" : "outline"}
          className={`cursor-pointer ${isMobile ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'}`}
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
