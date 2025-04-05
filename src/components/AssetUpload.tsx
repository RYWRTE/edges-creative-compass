
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Concept } from "@/types/concept";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface AssetUploadProps {
  onConceptGenerated: (concept: Concept) => void;
}

const AssetUpload = ({ onConceptGenerated }: AssetUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [assetUrl, setAssetUrl] = useState<string>("");
  const [assetName, setAssetName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

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
        assetUrl: assetUrl
      };
      
      onConceptGenerated(newConcept);
      
      // Reset form
      setFile(null);
      setAssetUrl("");
      setAssetName("");
      
      toast({
        title: "AI Evaluation Complete",
        description: `"${newConcept.name}" has been evaluated by AI.`,
      });
    } catch (error) {
      toast({
        title: "Evaluation Failed",
        description: "There was an error generating AI ratings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Asset for AI Evaluation</CardTitle>
        <CardDescription>
          Upload an image asset to generate EDGES ratings using AI
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
            accept="image/*"
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
            "Generate AI Evaluation"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssetUpload;
