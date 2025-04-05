
import { useState } from "react";
import ConceptForm from "@/components/ConceptForm";
import EdgesRadarChart from "@/components/EdgesRadarChart";
import AssetUpload from "@/components/AssetUpload";
import InfoCard from "@/components/InfoCard";
import { Concept } from "@/types/concept";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("manual");
  const { toast } = useToast();

  const addConcept = (concept: Concept) => {
    // Generate a new color for this concept
    const colors = [
      "#3B82F6", // blue
      "#EF4444", // red
      "#10B981", // green
      "#F59E0B", // amber
      "#8B5CF6", // purple
      "#EC4899", // pink
      "#06B6D4", // cyan
      "#F97316", // orange
    ];
    
    concept.color = colors[concepts.length % colors.length];
    
    // Set source if not already specified
    if (!concept.source) {
      concept.source = 'manual';
    }
    
    setConcepts([...concepts, concept]);
    setShowForm(false);
    
    toast({
      title: "Concept added",
      description: `"${concept.name}" has been added to your evaluation.`,
    });
  };

  const removeConcept = (index: number) => {
    const updatedConcepts = [...concepts];
    const removedConcept = updatedConcepts[index];
    updatedConcepts.splice(index, 1);
    setConcepts(updatedConcepts);
    
    toast({
      title: "Concept removed",
      description: `"${removedConcept.name}" has been removed from your evaluation.`,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 sm:px-6">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">EDGES Creative Evaluation</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Evaluate marketing concepts using five creative criteria: 
            Entertaining, Daring, Gripping, Experiential, and Subversive.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {showForm ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="manual">Manual Input</TabsTrigger>
                  <TabsTrigger value="upload">Upload Asset</TabsTrigger>
                </TabsList>
                <TabsContent value="manual">
                  <ConceptForm onSubmit={addConcept} />
                </TabsContent>
                <TabsContent value="upload">
                  <AssetUpload onConceptGenerated={addConcept} />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      setShowForm(true);
                      setActiveTab("manual");
                    }} 
                    className="flex items-center gap-2"
                  >
                    <PlusIcon size={16} />
                    Add Manual Concept
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowForm(true);
                      setActiveTab("upload");
                    }} 
                    variant="outline" 
                    className="flex items-center gap-2"
                  >
                    <UploadIcon size={16} />
                    Upload Asset
                  </Button>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Evaluated Concepts</CardTitle>
                    <CardDescription>
                      Compare your concepts side by side
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {concepts.length > 0 ? (
                      <ul className="space-y-2">
                        {concepts.map((concept, index) => (
                          <li key={index} className="flex items-center justify-between p-3 bg-white rounded-md border">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: concept.color }}></div>
                              <div>
                                <span className="font-medium">{concept.name}</span>
                                {concept.source === 'ai-generated' && (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">AI Rated</span>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeConcept(index)}
                              aria-label={`Remove ${concept.name}`}
                            >
                              <Trash2Icon size={16} />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No concepts added yet</p>
                    )}
                  </CardContent>
                </Card>
                
                <InfoCard />
              </div>
            )}
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>
                  {concepts.length === 0
                    ? "EDGES Creative Evaluation"
                    : concepts.length === 1
                    ? `EDGES Creative Evaluation: ${concepts[0].name}`
                    : "EDGES Creative Evaluation Comparison"}
                </CardTitle>
                <CardDescription>
                  Visualization of your creative evaluation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {concepts.length > 0 ? (
                  <div className="w-full aspect-square max-w-md mx-auto">
                    <EdgesRadarChart concepts={concepts} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <p className="text-gray-500 mb-4">Add a concept to see the radar chart visualization</p>
                    {!showForm && (
                      <div className="flex gap-2">
                        <Button onClick={() => {
                          setShowForm(true);
                          setActiveTab("manual");
                        }} variant="outline">
                          Add Manual Concept
                        </Button>
                        <Button onClick={() => {
                          setShowForm(true);
                          setActiveTab("upload");
                        }} variant="outline">
                          Upload Asset
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
