
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, CheckCircle, BarChart, Target } from "lucide-react";
import { Link } from "react-router-dom";
import InfoCard from "@/components/InfoCard";
import { Card, CardContent } from "@/components/ui/card";

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-indigo-100 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                EDGES: Creative Evaluation, Reimagined
              </h1>
              <p className="text-xl text-gray-700">
                The fast, structured, and smart way to assess marketing ideas—before they hit the market.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/auth">
                    Start Free Trial <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link to="/">
                    Explore the Tool <BarChart className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0">
              <div className="w-full max-w-md aspect-square bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <img 
                  src="/placeholder.svg" 
                  alt="EDGES Radar Chart Visualization" 
                  className="w-full h-full object-contain" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is EDGES */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What is EDGES?</h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              EDGES is a SaaS platform designed to help brand marketers and creative teams evaluate campaign concepts and executions in seconds—not weeks.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed mt-4">
              Using a proprietary five-point framework and intuitive radar charts, EDGES gives you data-backed clarity on which ideas are breakthrough—and which ones fall flat.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed mt-4 font-medium">
              No focus groups. No endless email threads. Just sharper, faster decisions.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
            <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
              Upload a creative concept, link to an execution, or describe an idea in your own words. EDGES analyzes and scores it across five dimensions proven to drive consumer response:
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="md:col-span-2">
                <InfoCard />
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Each idea is scored from 1 (boring) to 10 (breakthrough) per dimension and visualized as a radar chart in clockwise order—giving you an instant read on creative strength and strategic alignment.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col items-center justify-center h-full">
                  <BarChart className="h-16 w-16 text-purple-700 mb-4" />
                  <p className="text-lg text-gray-800 text-center font-medium">
                    Visualize and compare your concepts side-by-side
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/">
                  Try It Yourself <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose EDGES */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Why Marketers and Agencies Choose EDGES
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4 items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Reduce Creative Testing Costs</h3>
                    <p className="text-gray-700">
                      No more overpaying for research on ideas that won't fly. Get fast, affordable, directional insights early.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4 items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Make Faster, Smarter Creative Decisions</h3>
                    <p className="text-gray-700">
                      Compare concepts side-by-side and align your team on what's working (and why)—without waiting weeks for feedback.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4 items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Add Objectivity to the Review Process</h3>
                    <p className="text-gray-700">
                      Say goodbye to "gut feel." EDGES brings structure, consistency, and transparency to creative evaluations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4 items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Designed for Any Format, Any Stage</h3>
                    <p className="text-gray-700">
                      From scripts and storyboards to finished film, stunts, social posts, and more—EDGES works across formats and phases.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Built For */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Built for:</h2>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100 flex items-center gap-4">
                <Target className="h-6 w-6 text-purple-600" />
                <p className="text-gray-800">Brand Marketing Teams vetting early creative territories</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100 flex items-center gap-4">
                <Target className="h-6 w-6 text-purple-600" />
                <p className="text-gray-800">Agencies pitching or refining big ideas</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100 flex items-center gap-4">
                <Target className="h-6 w-6 text-purple-600" />
                <p className="text-gray-800">Strategy & Insights Leads bringing rigor to the review process</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100 flex items-center gap-4">
                <Target className="h-6 w-6 text-purple-600" />
                <p className="text-gray-800">CMOs & Directors who want to greenlight work with confidence</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Stop guessing. Start knowing.</h3>
              <p className="text-xl text-gray-700">
                Use EDGES to unlock creative potential—faster, cheaper, and with less bias.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 pt-6">
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/auth">
                    Start Free Trial <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Book a Demo <BookOpen className="ml-2" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link to="/">
                    Explore the Framework <BarChart className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">EDGES</h3>
              <p className="mb-4">
                The fast, structured, and smart way to assess marketing ideas—before they hit the market.
              </p>
              <p className="text-sm">© {new Date().getFullYear()} EDGES. All rights reserved.</p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-white transition-colors">Tool</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
