
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type SubscriptionInfo = {
  evaluationsUsed: number;
  monthlyLimit: number;
  tier: string;
}

const SubscriptionUsageTracker = () => {
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      try {
        setLoading(true);
        
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }
        
        // Fetch the user's subscription information
        const { data, error } = await supabase
          .from('subscriptions')
          .select('evaluations_used, monthly_evaluation_limit, tier')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching subscription info:", error);
          toast({
            title: "Error",
            description: "Could not load your subscription information",
            variant: "destructive",
          });
        } else if (data) {
          setSubscriptionInfo({
            evaluationsUsed: data.evaluations_used,
            monthlyLimit: data.monthly_evaluation_limit,
            tier: data.tier,
          });
        }
      } catch (error) {
        console.error("Error in fetchSubscriptionInfo:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscriptionInfo();
  }, [toast]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-3"></div>
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (!subscriptionInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Please sign in to view your subscription details</p>
        </CardContent>
      </Card>
    );
  }

  const percentUsed = Math.min(
    Math.round((subscriptionInfo.evaluationsUsed / subscriptionInfo.monthlyLimit) * 100), 
    100
  );

  // Format tier name to be more user-friendly
  const formatTierName = (tier: string) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Subscription Usage</span>
          <span className="text-sm font-medium bg-purple-100 text-purple-800 py-1 px-2 rounded">
            {formatTierName(subscriptionInfo.tier)} Plan
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">
                Monthly evaluations: {subscriptionInfo.evaluationsUsed} of {subscriptionInfo.monthlyLimit} used
              </span>
              <span className="text-sm font-medium">{percentUsed}%</span>
            </div>
            <Progress 
              value={percentUsed} 
              className={`h-2 ${percentUsed > 90 ? 'bg-red-100' : 'bg-gray-100'}`}
            />
            {percentUsed > 90 && (
              <p className="text-xs text-red-500 mt-1">
                You're approaching your monthly evaluation limit
              </p>
            )}
            {percentUsed >= 100 && (
              <p className="text-xs text-red-600 mt-1">
                You've reached your monthly evaluation limit
              </p>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Your evaluation count resets at the beginning of each billing cycle.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionUsageTracker;
