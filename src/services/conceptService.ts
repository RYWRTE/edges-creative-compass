
import { supabase } from "@/integrations/supabase/client";
import { Concept } from "@/types/concept";
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

/**
 * Saves a concept evaluation to the Supabase database
 */
export async function saveConcept(concept: Concept): Promise<boolean> {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save concepts",
        variant: "destructive",
      });
      return false;
    }

    // Insert the concept into the evaluations table
    const { error } = await supabase
      .from('evaluations')
      .insert({
        user_id: user.id,
        concept_name: concept.name,
        entertaining: concept.entertaining,
        daring: concept.daring,
        gripping: concept.gripping,
        experiential: concept.experiential,
        subversive: concept.subversive,
        color: concept.color,
        source: concept.source || 'manual',
        asset_url: concept.assetUrl,
        kpis_objectives: concept.kpisObjectives,
        additional_context: concept.additionalContext
      });

    if (error) {
      console.error("Error saving concept:", error);
      toast({
        title: "Failed to save concept",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Concept saved",
      description: `"${concept.name}" has been saved to your account.`,
    });
    return true;
  } catch (error) {
    console.error("Error in saveConcept:", error);
    toast({
      title: "Error",
      description: "Failed to save the concept. Please try again.",
      variant: "destructive",
    });
    return false;
  }
}

/**
 * Fetches user's saved concepts from Supabase
 */
export async function fetchUserConcepts(): Promise<Concept[]> {
  try {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching concepts:", error);
      throw error;
    }

    // Map database records to Concept type
    return data.map(item => ({
      name: item.concept_name,
      entertaining: item.entertaining,
      daring: item.daring,
      gripping: item.gripping,
      experiential: item.experiential,
      subversive: item.subversive,
      color: item.color || undefined,
      source: item.source as 'manual' | 'ai-generated' | undefined,
      assetUrl: item.asset_url || undefined,
      kpisObjectives: item.kpis_objectives || undefined,
      additionalContext: item.additional_context || undefined
    }));
  } catch (error) {
    console.error("Error in fetchUserConcepts:", error);
    return [];
  }
}
