
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Concept } from "@/types/concept";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AssetUploadProps {
  onConceptGenerated: (concept: Concept) => void;
}

const AssetUpload = ({ onConceptGenerated }: AssetUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [assetUrl, setAssetUrl] = useState<string>("");
  const [assetName, setAssetName] = useState<string>("");
  const [brandName, setBrandName] = useState<string>("");
  const [kpisObjectives, setKpisObjectives] = useState<string>("");
  const [additionalContext, setAdditionalContext] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const criteria = [
    {
      name: "ENTERTAINING",
      description: "Does the idea draw the audience in with compelling, dramatic narratives?",
    },
    {
      name: "DARING",
      description: "Is this idea challenging expectations or hijacking a medium/moment?",
    },
    {
      name: "GRIPPING",
      description: "Is this work able to stop and grab attention to engage the brand/promotion?",
    },
    {
      name: "EXPERIENTIAL",
      description: "Is this idea actively involving and interacting with consumers?",
    },
    {
      name: "SUBVERSIVE",
      description: "Is this work challenging category rules & conventions with a new path forward?",
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setAssetName(selectedFile.name.split('.')[0]); // Set default name from filename
      
      // Create local URL for preview
      const objectUrl = URL.createObjectURL(selectedFile);
      setAssetUrl(objectUrl);
    }
  };

  const handleAssetNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssetName(e.target.value);
  };

  const handleBrandNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrandName(e.target.value);
  };

  const handleKpisObjectivesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setKpisObjectives(e.target.value);
  };

  const handleAdditionalContextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAdditionalContext(e.target.value);
  };

  const generateAIRatings = async () => {
    setIsLoading(true);
    
    try {
      // In a real application, you would send the file to an API
      // For this demo, we'll simulate AI-generated ratings
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate random ratings between 3 and 9 to simulate AI
      const newConcept: Concept = {
        name: assetName || "Unnamed Asset",
        entertaining: Math.floor(Math.random() * 7) + 3, // 3-9
        daring: Math.floor(Math.random() * 7) + 3,
        gripping: Math.floor(Math.random() * 7) + 3,
        experiential: Math.floor(Math.random() * 7) + 3,
        subversive: Math.floor(Math.random() * 7) + 3,
        source: 'ai-generated',
        assetUrl: assetUrl,
        kpisObjectives: kpisObjectives || undefined,
        additionalContext: additionalContext || undefined,
        brandName: brandName || undefined
      };
      
      onConceptGenerated(newConcept);
      
      // Reset form
      setFile(null);
      setAssetUrl("");
      setAssetName("");
      setBrandName("");
      setKpisObjectives("");
      setAdditionalContext("");
      
      toast({
        title: "EDGES Evaluation Complete",
        description: `"${newConcept.name}" has been evaluated by EDGES.`,
      });
    } catch (error) {
      toast({
        title: "Evaluation Failed",
        description: "There was an error generating EDGES ratings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Asset for EDGES Evaluation</CardTitle>
        <CardDescription>
          Upload an image or video asset to generate EDGES ratings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="asset-upload" className="block text-sm font-medium">
            Upload Asset
          </label>
          <Input
            id="asset-upload"
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </div>
        
        {assetUrl && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Preview</p>
            <div className="relative aspect-video w-full max-h-48 overflow-hidden rounded-md bg-gray-100">
              <img
                src={assetUrl}
                alt="Asset preview"
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="asset-name" className="block text-sm font-medium">
            Asset Name
          </label>
          <Input
            id="asset-name"
            type="text"
            value={assetName}
            onChange={handleAssetNameChange}
            placeholder="Enter a name for this asset"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="brand-name" className="block text-sm font-medium">
            Brand Name
          </label>
          <Input
            id="brand-name"
            type="text"
            value={brandName}
            onChange={handleBrandNameChange}
            placeholder="Enter the brand name"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="kpis-objectives" className="text-sm font-medium">
            KPIs / Objectives (optional)
          </Label>
          <Textarea
            id="kpis-objectives"
            value={kpisObjectives}
            onChange={handleKpisObjectivesChange}
            placeholder="Enter KPIs or objectives for this asset"
            disabled={isLoading}
            className="min-h-24"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additional-context" className="text-sm font-medium">
            Additional Context (optional)
          </Label>
          <Textarea
            id="additional-context"
            value={additionalContext}
            onChange={handleAdditionalContextChange}
            placeholder="Enter any additional context that should be considered when evaluating"
            disabled={isLoading}
            className="min-h-24"
          />
        </div>
        
        <Button 
          className="w-full" 
          onClick={generateAIRatings} 
          disabled={!file || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating EDGES Evaluation...
            </>
          ) : (
            "Generate EDGES Evaluation"
          )}
        </Button>

        <Separator className="my-4" />

        <div className="space-y-4">
          <h3 className="font-medium text-sm">EDGES Evaluation Criteria</h3>
          <div className="space-y-4">
            {criteria.map((criterion, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">
                    {criterion.name}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{criterion.description}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetUpload;
