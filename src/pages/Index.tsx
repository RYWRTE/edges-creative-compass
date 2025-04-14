
import React from "react";
import { useNavigate } from "react-router-dom";
import AssetUpload from "@/components/AssetUpload";
import { Button } from "@/components/ui/button";
import { LogInIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEvaluation } from "@/hooks/useEvaluation";
import PreviousEvaluations from "@/components/PreviousEvaluations";
import EditConceptDialog from "@/components/EditConceptDialog";
import EvaluationView from "@/components/EvaluationView";

const Index = () => {
  const {
    concepts,
    showForm,
    showEvaluation,
    user,
    editingConcept,
    setShowForm,
    setShowEvaluation,
    setEditingConcept,
    addConcept,
    removeConcept,
    updateConceptName,
  } = useEvaluation();
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleConceptGenerated = (concept: any) => {
    const newConcept = addConcept(concept);
    setShowEvaluation(true);
    
    toast({
      title: "Concept added",
      description: `"${newConcept.name}" has been added to your evaluation.`,
    });
  };

  const handleRemoveConcept = (index: number) => {
    const removedConcept = removeConcept(index);
    toast({
      title: "Concept removed",
      description: `"${removedConcept.name}" has been removed from your evaluation.`,
      variant: "destructive",
    });
  };

  const handleUpdateConceptName = () => {
    if (editingConcept) {
      const updatedConcept = updateConceptName(editingConcept.index, editingConcept.name);
      setEditingConcept(null);
      
      toast({
        title: "Concept updated",
        description: `"${updatedConcept.name}" has been updated.`,
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          EDGES Creative Evaluation
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Evaluate marketing concepts using five creative criteria: 
          Entertaining, Daring, Gripping, Experiential, and Subversive.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {!showEvaluation ? (
          showForm ? (
            <AssetUpload onConceptGenerated={handleConceptGenerated} />
          ) : (
            <>
              <PreviousEvaluations
                concepts={concepts}
                user={user}
                onEdit={(index) => setEditingConcept({ index, name: concepts[index].name })}
                onRemove={handleRemoveConcept}
                onSelect={() => setShowEvaluation(true)}
                onShowForm={() => setShowForm(true)}
              />
              {!user && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-center flex-col gap-2 py-2">
                      <p className="text-gray-600 text-center">
                        Sign in to save your concepts
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate("/auth")}
                        className="mt-2"
                      >
                        <LogInIcon size={16} className="mr-2" />
                        Sign In
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )
        ) : (
          <EvaluationView
            concepts={concepts}
            onBackToUpload={() => {
              setShowEvaluation(false);
              setShowForm(true);
            }}
            onShowForm={() => setShowForm(true)}
          />
        )}
      </div>

      <EditConceptDialog
        isOpen={editingConcept !== null}
        conceptName={editingConcept?.name || ''}
        onClose={() => setEditingConcept(null)}
        onChange={(name) => setEditingConcept(prev => prev ? {...prev, name} : null)}
        onSave={handleUpdateConceptName}
      />
    </div>
  );
};

export default Index;
