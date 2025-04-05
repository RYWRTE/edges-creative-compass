
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const InfoCard = () => {
  const criteria = [
    {
      name: "ENTERTAINING",
      description: "Does the idea draw the audience in with compelling, dramatic narratives?",
    },
    {
      name: "DARING",
      description: "Is this idea challenging expectations or hijacking a medium/moment?",
    },
    {
      name: "GRIPPING",
      description: "Is this work able to stop and grab attention to engage the brand/promotion?",
    },
    {
      name: "EXPERIENTIAL",
      description: "Is this idea actively involving and interacting with consumers?",
    },
    {
      name: "SUBVERSIVE",
      description: "Is this work challenging category rules & conventions with a new path forward?",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>About EDGES Evaluation</CardTitle>
        <CardDescription>
          Understanding the five creative criteria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {criteria.map((criterion, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-medium">
                  {criterion.name}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{criterion.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
