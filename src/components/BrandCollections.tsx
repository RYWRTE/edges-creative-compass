
import React from "react";
import { BrandCollection } from "@/types/concept";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderIcon, ChevronRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BrandCollectionsProps {
  collections: BrandCollection[];
}

const BrandCollections = ({ collections }: BrandCollectionsProps) => {
  const navigate = useNavigate();

  if (collections.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Collections</CardTitle>
        <CardDescription>
          Concepts grouped by brand
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {collections.map((collection) => (
            <div 
              key={collection.id} 
              className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FolderIcon className="h-5 w-5 text-gray-500" />
                <div>
                  <h3 className="font-medium">{collection.name}</h3>
                  <p className="text-sm text-gray-500">
                    {collection.concepts.length} concept{collection.concepts.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(`/dashboard?brand=${encodeURIComponent(collection.name)}`)}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandCollections;
