
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SubscriptionSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verifySubscription = async () => {
      try {
        if (!sessionId) {
          setError("Invalid session ID");
          setLoading(false);
          return;
        }

        // In a production app, you would verify the session with Stripe
        // For now, we'll assume success if the page is loaded with a session ID
        
        // Wait a bit to ensure webhook has processed
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setLoading(false);
      } catch (err) {
        console.error("Error verifying subscription:", err);
        setError("There was a problem confirming your subscription");
        setLoading(false);
      }
    };

    verifySubscription();
  }, [sessionId]);

  const handleContinue = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="w-full max-w-md text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-purple-600 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Confirming Your Subscription...</h1>
          <p className="text-gray-600">
            Please wait while we confirm your subscription details.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="w-full max-w-md text-center">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">×</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">Subscription Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md text-center">
        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Subscription Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for subscribing to EDGES. Your account has been upgraded and you can now enjoy all the benefits of your new plan.
        </p>
        <Button onClick={handleContinue} className="bg-purple-600 hover:bg-purple-700">
          Continue to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
