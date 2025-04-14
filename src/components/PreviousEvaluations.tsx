
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PencilIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { Concept } from "@/types/concept";
import { saveConcept } from "@/services/conceptService";

interface PreviousEvaluationsProps {
  concepts: Concept[];
  user: any;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
  onSelect: () => void;
  onShowForm: () => void;
}

const PreviousEvaluations = ({
  concepts,
  user,
  onEdit,
  onRemove,
  onSelect,
  onShowForm,
}: PreviousEvaluationsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <Button onClick={onShowForm} className="w-full">
        Upload New Asset
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Previous Evaluations</CardTitle>
          <CardDescription>
            Select a concept to view its evaluation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {concepts.length > 0 ? (
            <ul className="space-y-2">
              {concepts.map((concept, index) => (
                <li 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-white rounded-md border cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={onSelect}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: concept.color }}
                    />
                    <div>
                      <span className="font-medium">{concept.name}</span>
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        {concept.source === 'ai-generated' ? 'AI Rated' : 'Manual'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(index);
                      }}
                      aria-label={`Edit ${concept.name}`}
                    >
                      <PencilIcon size={16} />
                    </Button>
                    {user && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          saveConcept(concept);
                        }}
                        aria-label={`Save ${concept.name}`}
                      >
                        <SaveIcon size={16} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(index);
                      }}
                      aria-label={`Remove ${concept.name}`}
                    >
                      <Trash2Icon size={16} />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">No concepts added yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PreviousEvaluations;
