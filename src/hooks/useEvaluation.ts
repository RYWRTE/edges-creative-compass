
import { useState, useEffect } from "react";
import { Concept, BrandCollection } from "@/types/concept";
import { supabase } from "@/integrations/supabase/client";
import { fetchUserConcepts } from "@/services/conceptService";
import { v4 as uuidv4 } from 'uuid';

export const useEvaluation = () => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [collections, setCollections] = useState<BrandCollection[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [editingConcept, setEditingConcept] = useState<{index: number, name: string} | null>(null);

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
      "#3B82F6", "#EF4444", "#10B981", "#F59E0B", 
      "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"
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
    return concept;
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
    
    return removedConcept;
  };

  const updateConceptName = (index: number, newName: string) => {
    const updatedConcepts = [...concepts];
    updatedConcepts[index] = {
      ...updatedConcepts[index],
      name: newName
    };
    
    setConcepts(updatedConcepts);
    const updatedConcept = updatedConcepts[index];

    if (updatedConcept.brandName) {
      const updatedCollections = collections.map(collection => {
        if (collection.name === updatedConcept.brandName) {
          return {
            ...collection,
            concepts: collection.concepts.map(c => 
              c === concepts[index] ? updatedConcept : c
            )
          };
        }
        return collection;
      });
      
      setCollections(updatedCollections);
    }
    
    return updatedConcept;
  };

  return {
    concepts,
    collections,
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
  };
};
