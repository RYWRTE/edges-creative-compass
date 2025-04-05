
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const SubscriptionCanceled = () => {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Subscription Canceled</h1>
        <p className="text-gray-600 mb-6">
          Your subscription process was canceled. No charges were made to your account. You can try again whenever you're ready.
        </p>
        <Button 
          onClick={handleReturn} 
          variant="outline" 
          className="border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Return to Dashboard
        </Button>
        <p className="mt-4 text-sm text-gray-500">
          If you have any questions or concerns, please contact our support team.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionCanceled;
