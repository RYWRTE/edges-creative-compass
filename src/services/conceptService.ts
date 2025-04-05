
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

    return data.map((evaluation) => ({
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
      brandName: '' // Default to empty string as brand_name is not in the database schema yet
    }));
  } catch (error) {
    console.error('Error fetching concepts:', error);
    return [];
  }
};
