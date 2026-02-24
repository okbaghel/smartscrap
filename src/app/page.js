"use client";

// import Navbar from "@/components/Navbar";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignUpButton, SignInButton } from "@clerk/nextjs";
import { Leaf, Recycle, CreditCard, MapPin, Shield, ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn && user) {
      const userRole = user?.publicMetadata?.role || "user";

      // Redirect based on role
      if (userRole === "user") router.push("/dashboard/user");
      else if (userRole === "supervisor") router.push("/dashboard/supervisor");
      else if (userRole === "company") router.push("/dashboard/company");
      else if (userRole === "admin") router.push("/dashboard/admin");
    }
  }, [isSignedIn, user, router]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
  
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white py-20 md:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Waste Management</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-slide-up">
              Transform Waste into{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">
                  Opportunity
                </span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-yellow-300/30 -rotate-1"></span>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl mb-10 text-emerald-50 max-w-2xl mx-auto leading-relaxed animate-slide-up-delay">
              Join SmartScrap's innovative platform to make waste segregation smarter, recycling easier, and help build a sustainable future.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up-delay-2">
              
              <SignInButton mode="modal">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-emerald-700 hover:bg-white hover:text-emerald-700 font-semibold px-8 py-6 text-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  Sign In
                </Button>
              </SignInButton>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1">10K+</div>
                <div className="text-sm text-emerald-100">Active Users</div>
              </div>
              <div className="text-center border-x border-white/20">
                <div className="text-3xl md:text-4xl font-bold mb-1">50K+</div>
                <div className="text-sm text-emerald-100">Waste Segregated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1">95%</div>
                <div className="text-sm text-emerald-100">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor" className="text-slate-50 dark:text-slate-950"/>
          </svg>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-block bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              FEATURES
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
              Everything You Need to Make a Difference
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Powerful features designed to make waste management effortless and rewarding
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard 
              icon={<Recycle className="w-10 h-10" />} 
              title="Smart Waste Segregation" 
              description="AI-powered image recognition to categorize waste into organic, recyclable, or hazardous with 99% accuracy."
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard 
              icon={<CreditCard className="w-10 h-10" />} 
              title="Sell Your Waste" 
              description="Generate tickets for your waste and sell it to recycling companies easily. Turn trash into cash instantly."
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard 
              icon={<MapPin className="w-10 h-10" />} 
              title="Clean & Earn" 
              description="Complete cleaning tasks in your area and earn reward points. Make your community cleaner while earning."
              gradient="from-amber-500 to-orange-500"
            />
            <FeatureCard 
              icon={<Shield className="w-10 h-10" />} 
              title="Supervised Collection" 
              description="Area supervisors manage waste collection and ensure fair rewards distribution across all participants."
              gradient="from-emerald-500 to-teal-500"
            />
            <FeatureCard 
              icon={<Leaf className="w-10 h-10" />} 
              title="Eco-Friendly Impact" 
              description="Track your contributions towards a greener planet through our comprehensive analytics dashboard."
              gradient="from-green-500 to-lime-500"
            />
            <FeatureCard 
              icon={<TrendingUp className="w-10 h-10" />} 
              title="Real-time Analytics" 
              description="Monitor your environmental impact with detailed insights and see how you're making a difference."
              gradient="from-indigo-500 to-blue-500"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-block bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              HOW IT WORKS
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
              Get Started in Three Simple Steps
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Join thousands of users making a positive environmental impact
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
            <StepCard 
              step="1" 
              title="Sign Up & Log In" 
              description="Create your free account in seconds and explore SmartScrap's powerful features. No credit card required."
              color="emerald"
            />
            <StepCard 
              step="2" 
              title="Segregate & Sell" 
              description="Use our AI-powered recognition to categorize your waste and connect with recycling companies instantly."
              color="blue"
            />
            <StepCard 
              step="3" 
              title="Earn & Track" 
              description="Complete cleaning tasks, earn rewards, and track your environmental impact with real-time analytics."
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Join the Green Revolution</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Start Making an Impact Today!
            </h2>
            <p className="text-lg md:text-xl mb-10 text-emerald-50 max-w-2xl mx-auto">
              Join SmartScrap and help create a cleaner, greener planet. Every action counts towards a sustainable future.
            </p>
            
            <SignUpButton mode="modal">
              <Button 
                size="lg"
                className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold px-10 py-7 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </SignUpButton>

            <p className="mt-6 text-emerald-100 text-sm">
              Free to start • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Recycle className="w-6 h-6 text-emerald-500" />
              <span className="text-xl font-bold text-white">SmartScrap</span>
            </div>
            <p className="text-sm text-slate-400">
              Making the world a cleaner place, one smart decision at a time.
            </p>
            <p className="text-xs text-slate-500 mt-4">
              © 2024 SmartScrap. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description, gradient }) {
  return (
    <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white dark:bg-slate-800">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      <CardContent className="p-8 relative z-10">
        <div className={`mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

// Step Card Component
function StepCard({ step, title, description, color }) {
  const colorClasses = {
    emerald: "from-emerald-500 to-teal-500 group-hover:from-emerald-600 group-hover:to-teal-600",
    blue: "from-blue-500 to-cyan-500 group-hover:from-blue-600 group-hover:to-cyan-600",
    purple: "from-purple-500 to-pink-500 group-hover:from-purple-600 group-hover:to-pink-600"
  };

  return (
    <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white dark:bg-slate-800">
      <CardContent className="p-8 text-center relative">
        <div className="relative inline-block mb-6">
          <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} blur-xl opacity-50 group-hover:opacity-70 transition-opacity`}></div>
          <div className={`relative text-5xl md:text-6xl font-black bg-gradient-to-br ${colorClasses[color]} bg-clip-text text-transparent`}>
            {step}
          </div>
        </div>
        <h3 className="text-xl md:text-2xl font-bold mb-4 text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </CardContent>
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colorClasses[color]} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
    </Card>
  );
}