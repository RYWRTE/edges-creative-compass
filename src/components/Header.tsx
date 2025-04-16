
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  BarChart, 
  FileSpreadsheet,
  DollarSign,
  TestTube
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import AuthButton from "@/components/AuthButton";
import { cn } from "@/lib/utils";
import PricingModal from "@/components/PricingModal";

const Header = () => {
  const location = useLocation();
  const [testMode, setTestMode] = useState(false);

  const toggleTestMode = () => {
    setTestMode(!testMode);
    // Store test mode state in localStorage
    localStorage.setItem('testMode', (!testMode).toString());
  };
  
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex items-center justify-between py-3 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold text-gray-900">
            EDGES
          </Link>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Navigate</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-50 to-purple-100 p-6 no-underline outline-none focus:shadow-md"
                          to="/"
                        >
                          <BarChart className="h-6 w-6 text-purple-700" />
                          <div className="mb-2 mt-4 text-lg font-medium text-purple-900">
                            EDGES Platform
                          </div>
                          <p className="text-sm leading-tight text-purple-800">
                            Evaluate marketing concepts using five creative criteria
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/tool"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-purple-100 focus:bg-purple-100",
                            location.pathname === "/tool" && "bg-purple-100"
                          )}
                        >
                          <div className="flex items-center gap-2 text-sm font-medium leading-none text-purple-900">
                            <FileSpreadsheet className="h-4 w-4" />
                            <span>Evaluation Tool</span>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                            Create new concept evaluations
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/dashboard"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-purple-100 focus:bg-purple-100",
                            location.pathname === "/dashboard" && "bg-purple-100"
                          )}
                        >
                          <div className="flex items-center gap-2 text-sm font-medium leading-none text-purple-900">
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Dashboard</span>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                            View all your evaluations and comparisons
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <PricingModal trigger={
                          <div
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-purple-100 focus:bg-purple-100",
                              location.pathname === "/pricing" && "bg-purple-100"
                            )}
                          >
                            <div className="flex items-center gap-2 text-sm font-medium leading-none text-purple-900">
                              <DollarSign className="h-4 w-4" />
                              <span>Pricing</span>
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                              Explore our pricing plans
                            </p>
                          </div>
                        } />
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className={location.pathname === "/tool" ? "hidden" : ""}
          >
            <Link to="/tool">
              <BarChart className="h-4 w-4 mr-2" />
              Try the Tool
            </Link>
          </Button>
          
          {process.env.NODE_ENV === 'development' && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTestMode}
              className={`${location.pathname === "/tool" ? "hidden" : ""} ${testMode ? "bg-purple-100" : ""}`}
            >
              <TestTube className="h-4 w-4 mr-2" />
              Test Mode {testMode ? "On" : "Off"}
            </Button>
          )}

          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className={location.pathname === "/dashboard" ? "hidden" : ""}
          >
            <Link to="/dashboard">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          <AuthButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
