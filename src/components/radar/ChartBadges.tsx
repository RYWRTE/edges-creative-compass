
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
    <div className={`flex flex-wrap gap-${isMobile ? '1' : '2'} justify-center mb-${isMobile ? '2' : '4'}`}>
      {concepts.map((concept) => {
        // For mobile, truncate long names in the display
        const displayName = isMobile && concept.name.length > 12 
          ? `${concept.name.substring(0, 10)}...` 
          : concept.name;
        
        return (
          <Badge 
            key={concept.name}
            variant={highlighted === concept.name ? "default" : "outline"}
            className={`cursor-pointer ${isMobile ? 'px-1.5 py-0.5 text-[10px]' : 'px-4 py-2 text-sm'}`}
            style={{ 
              backgroundColor: highlighted === concept.name ? concept.color : 'transparent',
              borderColor: concept.color,
              color: highlighted === concept.name ? 'white' : concept.color
            }}
            onClick={() => onToggle(concept.name)}
            title={concept.name} // Full name in tooltip for truncated mobile names
          >
            {displayName}
          </Badge>
        );
      })}
    </div>
  );
};
