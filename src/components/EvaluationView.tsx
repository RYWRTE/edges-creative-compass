
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeftIcon, PlusIcon } from "lucide-react";
import EdgesRadarChart from "@/components/EdgesRadarChart";
import { Concept } from "@/types/concept";

interface EvaluationViewProps {
  concepts: Concept[];
  onBackToUpload: () => void;
  onShowForm: () => void;
}

const EvaluationView = ({
  concepts,
  onBackToUpload,
  onShowForm,
}: EvaluationViewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBackToUpload}
          className="mb-4"
        >
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          Back to Upload
        </Button>
        <Button
          onClick={onShowForm}
          variant="outline"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Another Asset
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="w-full max-w-4xl mx-auto">
            <EdgesRadarChart concepts={concepts} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvaluationView;
