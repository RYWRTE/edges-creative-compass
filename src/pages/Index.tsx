import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EdgesRadarChart from "@/components/EdgesRadarChart";
import AssetUpload from "@/components/AssetUpload";
import { Concept, BrandCollection } from "@/types/concept";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2Icon, SaveIcon, LogInIcon, PencilIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { saveConcept, fetchUserConcepts } from "@/services/conceptService";
import AuthButton from "@/components/AuthButton";
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [collections, setCollections] = useState<BrandCollection[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [editingConcept, setEditingConcept] = useState<{index: number, name: string} | null>(null);
  const [expandedView, setExpandedView] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          loadUserConcepts();
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadUserConcepts();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (concepts.length > 0) {
      setExpandedView(true);
    } else {
      setExpandedView(false);
    }
  }, [concepts.length]);

  const loadUserConcepts = async () => {
    const userConcepts = await fetchUserConcepts();
    if (userConcepts.length > 0) {
      setConcepts(userConcepts);
      setShowForm(false);
      
      const brandGroups = userConcepts.reduce((groups: Record<string, Concept[]>, concept) => {
        const brandName = concept.brandName || 'Uncategorized';
        if (!groups[brandName]) {
          groups[brandName] = [];
        }
        groups[brandName].push(concept);
        return groups;
      }, {});
      
      const brandCollections: BrandCollection[] = Object.entries(brandGroups).map(([name, concepts]) => ({
        id: uuidv4(),
        name,
        concepts,
        createdAt: new Date()
      }));
      
      setCollections(brandCollections);
    }
  };

  const addConcept = (concept: Concept) => {
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
    
    if (!concept.source) {
      concept.source = 'manual';
    }
    
    setConcepts([...concepts, concept]);
    
    if (concept.brandName) {
      updateCollections(concept);
    }
    
    setShowForm(false);
    
    toast({
      title: "Concept added",
      description: `"${concept.name}" has been added to your evaluation.`,
    });
  };

  const updateCollections = (concept: Concept) => {
    const brandName = concept.brandName || 'Uncategorized';
    const existingCollectionIndex = collections.findIndex(c => c.name === brandName);
    
    if (existingCollectionIndex >= 0) {
      const updatedCollections = [...collections];
      updatedCollections[existingCollectionIndex].concepts.push(concept);
      setCollections(updatedCollections);
    } else {
      const newCollection: BrandCollection = {
        id: uuidv4(),
        name: brandName,
        concepts: [concept],
        createdAt: new Date()
      };
      setCollections([...collections, newCollection]);
    }
  };

  const removeConcept = (index: number) => {
    const updatedConcepts = [...concepts];
    const removedConcept = updatedConcepts[index];
    updatedConcepts.splice(index, 1);
    setConcepts(updatedConcepts);
    
    if (removedConcept.brandName) {
      const updatedCollections = collections.map(collection => {
        if (collection.name === removedConcept.brandName) {
          return {
            ...collection,
            concepts: collection.concepts.filter(c => c !== removedConcept)
          };
        }
        return collection;
      }).filter(collection => collection.concepts.length > 0);
      
      setCollections(updatedCollections);
    }
    
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

  const handleEditConcept = (index: number) => {
    setEditingConcept({
      index,
      name: concepts[index].name
    });
  };

  const handleUpdateConceptName = () => {
    if (editingConcept) {
      const updatedConcepts = [...concepts];
      updatedConcepts[editingConcept.index] = {
        ...updatedConcepts[editingConcept.index],
        name: editingConcept.name
      };
      
      setConcepts(updatedConcepts);

      const updatedConcept = updatedConcepts[editingConcept.index];
      if (updatedConcept.brandName) {
        const updatedCollections = collections.map(collection => {
          if (collection.name === updatedConcept.brandName) {
            return {
              ...collection,
              concepts: collection.concepts.map(c => 
                c === concepts[editingConcept.index] ? updatedConcept : c
              )
            };
          }
          return collection;
        });
        
        setCollections(updatedCollections);
      }
      
      setEditingConcept(null);
      
      toast({
        title: "Concept updated",
        description: `"${updatedConcept.name}" has been updated.`,
      });
    }
  };

  const toggleExpandedView = () => {
    setExpandedView(!expandedView);
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">EDGES Creative Evaluation</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Evaluate marketing concepts using five creative criteria: 
          Entertaining, Daring, Gripping, Experiential, and Subversive.
        </p>
      </div>

      <div className={`grid gap-8 ${expandedView ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
        {(!expandedView || concepts.length === 0) && (
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
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditConcept(index)}
                                aria-label={`Edit ${concept.name}`}
                              >
                                <PencilIcon size={16} />
                              </Button>
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
        )}

        <div className={expandedView ? "w-full max-w-5xl mx-auto" : ""}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              {concepts.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleExpandedView}
                  className="ml-2"
                >
                  {expandedView ? (
                    <>
                      <ChevronLeftIcon size={16} className="mr-1" />
                      Show List
                    </>
                  ) : (
                    <>
                      Expand View
                      <ChevronRightIcon size={16} className="ml-1" />
                    </>
                  )}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {concepts.length > 0 ? (
                <div className={`w-full mx-auto ${expandedView ? 'max-w-4xl' : 'max-w-md'}`}>
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

      <Dialog open={editingConcept !== null} onOpenChange={(open) => !open && setEditingConcept(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Asset Name</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              id="edit-asset-name"
              value={editingConcept?.name || ''}
              onChange={(e) => setEditingConcept(prev => prev ? {...prev, name: e.target.value} : null)}
              placeholder="Enter new asset name"
              className="w-full mb-4"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingConcept(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateConceptName}
              disabled={!editingConcept?.name}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
