
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface PricingFeature {
  name: string;
  included: boolean | string;
  info?: string;
}

interface PricingTier {
  name: string;
  price: string;
  description: string;
  buttonText: string;
  buttonVariant?: "default" | "outline" | "secondary";
  highlighted?: boolean;
  features: PricingFeature[];
  badge?: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    description: "Try EDGES with limited features",
    buttonText: "Start Free",
    buttonVariant: "outline",
    features: [
      { name: "5 evaluations per month", included: true },
      { name: "Basic radar chart visualizations", included: true },
      { name: "Single user account", included: true },
      { name: "Email support", included: false },
      { name: "Team collaboration", included: false },
      { name: "Export & sharing options", included: false },
      { name: "Priority support", included: false },
      { name: "White-label reports", included: false },
    ],
  },
  {
    name: "Professional",
    price: "$29",
    description: "Perfect for individual marketers and small agencies",
    buttonText: "Subscribe Now",
    highlighted: true,
    badge: "Most Popular",
    features: [
      { name: "50 evaluations per month", included: true },
      { name: "Advanced radar chart visualizations", included: true },
      { name: "Single user account", included: true },
      { name: "Email support", included: true },
      { name: "Team collaboration", included: "Up to 3 members", info: "Share and collaborate with up to 3 team members" },
      { name: "Export & sharing options", included: true },
      { name: "Priority support", included: false },
      { name: "White-label reports", included: false },
    ],
  },
  {
    name: "Enterprise",
    price: "$99",
    description: "For marketing teams and large agencies",
    buttonText: "Contact Sales",
    buttonVariant: "secondary",
    features: [
      { name: "Unlimited evaluations", included: true },
      { name: "Advanced radar chart visualizations", included: true },
      { name: "Unlimited user accounts", included: true, info: "Add as many team members as needed" },
      { name: "Email support", included: true },
      { name: "Team collaboration", included: "Unlimited", info: "Collaborate with your entire organization" },
      { name: "Export & sharing options", included: true },
      { name: "Priority support", included: true },
      { name: "White-label reports", included: true, info: "Remove EDGES branding from reports" },
    ],
  },
];

interface PricingModalProps {
  trigger?: React.ReactNode;
}

const PricingModal = ({ trigger }: PricingModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="rounded-full">
            View Pricing
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Choose Your Plan
          </DialogTitle>
          <DialogDescription className="text-center max-w-lg mx-auto">
            Select the plan that best fits your needs. All plans include access to our core EDGES framework and evaluation tools.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {pricingTiers.map((tier) => (
            <div 
              key={tier.name}
              className={`border rounded-xl p-6 flex flex-col relative ${
                tier.highlighted 
                  ? "border-purple-400 shadow-lg bg-purple-50" 
                  : "border-gray-200"
              }`}
            >
              {tier.badge && (
                <Badge className="absolute -top-2 right-6 bg-purple-600">
                  {tier.badge}
                </Badge>
              )}
              <h3 className="text-xl font-bold">{tier.name}</h3>
              <div className="mt-2 flex items-baseline">
                <span className="text-3xl font-bold">{tier.price}</span>
                {tier.name !== "Free" && (
                  <span className="text-gray-500 ml-1">/month</span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1 mb-4">
                {tier.description}
              </p>
              
              <div className="flex-grow">
                <ul className="space-y-3 my-6">
                  {tier.features.map((feature) => (
                    <li key={feature.name} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <span className="h-5 w-5 flex items-center justify-center text-gray-300 flex-shrink-0">
                          ✕
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <span className={!feature.included ? "text-gray-500" : ""}>
                          {typeof feature.included === "string" 
                            ? `${feature.name}: ${feature.included}` 
                            : feature.name}
                        </span>
                        {feature.info && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-gray-400 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[200px]">
                                <p>{feature.info}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button 
                variant={tier.buttonVariant || "default"} 
                className={`mt-4 w-full ${
                  tier.highlighted 
                    ? "bg-purple-600 hover:bg-purple-700" 
                    : ""
                }`}
              >
                {tier.buttonText}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>All plans include our core EDGES framework and email support.</p>
          <p className="mt-1">Need a custom plan? <a href="#" className="text-purple-600 font-medium">Contact our sales team</a>.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
