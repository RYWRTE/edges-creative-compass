
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EdgesRadarChart from "@/components/EdgesRadarChart";
import AssetUpload from "@/components/AssetUpload";
import { Concept } from "@/types/concept";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2Icon, SaveIcon, LogInIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { saveConcept, fetchUserConcepts } from "@/services/conceptService";
import AuthButton from "@/components/AuthButton";

const Index = () => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        
        // If user is logged in, fetch their concepts
        if (session?.user) {
          loadUserConcepts();
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      
      // If user is logged in, fetch their concepts
      if (session?.user) {
        loadUserConcepts();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserConcepts = async () => {
    const userConcepts = await fetchUserConcepts();
    if (userConcepts.length > 0) {
      setConcepts(userConcepts);
      setShowForm(false);
    }
  };

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

  const handleSaveConcept = async (concept: Concept) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save concepts",
        variant: "destructive",
      });
      return;
    }
    
    await saveConcept(concept);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 sm:px-6">
        <header className="mb-8 flex justify-between items-center">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">EDGES Creative Evaluation</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Evaluate marketing concepts using five creative criteria: 
              Entertaining, Daring, Gripping, Experiential, and Subversive.
            </p>
          </div>
          <div>
            <AuthButton />
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {showForm ? (
              <AssetUpload onConceptGenerated={addConcept} />
            ) : (
              <div className="flex flex-col gap-4">
                <Button 
                  onClick={() => setShowForm(true)} 
                  className="w-full"
                >
                  <PlusIcon size={16} className="mr-2" />
                  Upload New Asset
                </Button>
                
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
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                  {concept.source === 'ai-generated' ? 'AI Rated' : 'Manual'}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {user && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleSaveConcept(concept)}
                                  aria-label={`Save ${concept.name}`}
                                >
                                  <SaveIcon size={16} />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeConcept(index)}
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
                {!user && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-center flex-col gap-2 py-2">
                        <p className="text-gray-600 text-center">Sign in to save your concepts</p>
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
                    <p className="text-gray-500 mb-4">Upload an asset to see the radar chart visualization</p>
                    {!showForm && (
                      <Button onClick={() => setShowForm(true)} variant="outline">
                        Upload Asset
                      </Button>
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
