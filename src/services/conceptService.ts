
import { supabase } from "@/integrations/supabase/client";
import { Concept } from "@/types/concept";

export const saveConcept = async (concept: Concept) => {
  try {
    const { error } = await supabase.from('evaluations').insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      concept_name: concept.name,
      entertaining: concept.entertaining,
      daring: concept.daring,
      gripping: concept.gripping,
      experiential: concept.experiential,
      subversive: concept.subversive,
      color: concept.color,
      source: concept.source,
      asset_url: concept.assetUrl,
      kpis_objectives: concept.kpisObjectives,
      additional_context: concept.additionalContext,
      brand_name: concept.brandName
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving concept:', error);
    return false;
  }
};

export const fetchUserConcepts = async () => {
  try {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (error) throw error;

    // Explicitly type the evaluation object to include brand_name
    return data.map((evaluation: {
      concept_name: string;
      entertaining: number;
      daring: number;
      gripping: number;
      experiential: number;
      subversive: number;
      color: string | null;
      source: string | null;
      asset_url: string | null;
      kpis_objectives: string | null;
      additional_context: string | null;
      brand_name: string | null;
      // Include other properties as needed
    }) => ({
      name: evaluation.concept_name,
      entertaining: evaluation.entertaining,
      daring: evaluation.daring,
      gripping: evaluation.gripping,
      experiential: evaluation.experiential,
      subversive: evaluation.subversive,
      color: evaluation.color,
      source: evaluation.source as 'manual' | 'ai-generated',
      assetUrl: evaluation.asset_url,
      kpisObjectives: evaluation.kpis_objectives,
      additionalContext: evaluation.additional_context,
      brandName: evaluation.brand_name || '' // Now we can properly fetch the brand_name from database
    }));
  } catch (error) {
    console.error('Error fetching concepts:', error);
    return [];
  }
};
