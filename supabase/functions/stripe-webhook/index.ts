
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
  });

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    // Verify the webhook signature
    // In production, use a proper webhook secret
    // const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
    // const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    
    // For simplicity, we'll parse the event directly in this example
    const event = JSON.parse(body);
    
    console.log(`Processing webhook event: ${event.type}`);

    // Handle specific Stripe events
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Extract the metadata
      const userId = session.metadata.user_id;
      const planId = session.metadata.plan_id;
      const monthlyLimit = parseInt(session.metadata.monthly_evaluation_limit || "0");
      
      if (!userId || !planId) {
        throw new Error("Missing user_id or plan_id in session metadata");
      }
      
      // Update user's subscription in the database
      const { error } = await supabaseClient
        .from('subscriptions')
        .update({
          tier: planId,
          monthly_evaluation_limit: monthlyLimit,
          evaluations_used: 0,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      console.log(`Updated subscription for user ${userId} to ${planId} plan`);
    } 
    else if (event.type === 'customer.subscription.updated') {
      // Handle subscription updates if needed
    }
    else if (event.type === 'customer.subscription.deleted') {
      // Handle subscription cancellations
      const subscription = event.data.object;
      
      // Find user with this subscription ID
      const { data: subscriptionData, error: findError } = await supabaseClient
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', subscription.id)
        .single();
      
      if (findError || !subscriptionData) {
        console.error("Could not find user with subscription ID:", subscription.id);
        throw new Error("Subscription not found");
      }
      
      // Update user's subscription to free tier
      const { error: updateError } = await supabaseClient
        .from('subscriptions')
        .update({
          tier: 'free',
          monthly_evaluation_limit: 5,
          stripe_subscription_id: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', subscriptionData.user_id);
      
      if (updateError) throw updateError;
      
      console.log(`Reset subscription for user ${subscriptionData.user_id} to free plan`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
