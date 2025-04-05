
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchUserConcepts } from "@/services/conceptService";
import { Concept } from "@/types/concept";
import EdgesRadarChart from "@/components/EdgesRadarChart";
import { ArrowLeft, FileImage, BarChart3 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SubscriptionUsageTracker from "@/components/SubscriptionUsageTracker";

const Dashboard = () => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadConcepts = async () => {
      try {
        setLoading(true);
        const data = await fetchUserConcepts();
        setConcepts(data);
      } catch (error) {
        console.error("Error loading concepts:", error);
        toast({
          title: "Error loading evaluations",
          description: "There was a problem loading your evaluations. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadConcepts();
  }, [toast]);

  const groupConceptsByName = () => {
    const groups: { [key: string]: Concept[] } = {};
    
    concepts.forEach(concept => {
      if (!groups[concept.name]) {
        groups[concept.name] = [];
      }
      groups[concept.name].push(concept);
    });
    
    return groups;
  };

  const groupedConcepts = groupConceptsByName();

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 flex items-center gap-4">
        <Link 
          to="/" 
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Evaluator
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Evaluation Dashboard</h1>
      </div>

      <div className="mb-6">
        <SubscriptionUsageTracker />
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Evaluations</TabsTrigger>
          <TabsTrigger value="comparison">Compare Evaluations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 w-full bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : concepts.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No evaluations found</CardTitle>
                <CardDescription>
                  You haven't created any evaluations yet. Go back to the evaluator to get started.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {concepts.map((concept, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: concept.color || "#9b87f5" }}
                      ></span>
                      {concept.name}
                    </CardTitle>
                    <CardDescription>
                      {concept.source === "ai-generated" ? "AI Rated" : "Manual Rating"}
                      {concept.kpisObjectives && (
                        <span className="block mt-1 text-xs">
                          Objectives: {concept.kpisObjectives}
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 mb-2">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <BarChart3 size={14} />
                        <span>E: {concept.entertaining}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <BarChart3 size={14} />
                        <span>D: {concept.daring}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <BarChart3 size={14} />
                        <span>G: {concept.gripping}</span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <BarChart3 size={14} />
                        <span>E: {concept.experiential}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <BarChart3 size={14} />
                        <span>S: {concept.subversive}</span>
                      </div>
                    </div>
                    
                    {concept.assetUrl && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-purple-600">
                        <FileImage size={16} />
                        <a href={concept.assetUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          View Asset
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="comparison">
          <div className="grid gap-6 lg:grid-cols-2">
            {Object.entries(groupedConcepts).map(([name, conceptsGroup]) => (
              <Card key={name} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{name} ({conceptsGroup.length})</CardTitle>
                  <CardDescription>
                    Comparing {conceptsGroup.length} evaluation{conceptsGroup.length > 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <EdgesRadarChart concepts={conceptsGroup} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
