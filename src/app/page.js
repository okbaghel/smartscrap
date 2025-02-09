"use client";

// import Navbar from "@/components/Navbar";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignUpButton, SignInButton } from "@clerk/nextjs";
import { Leaf, Recycle, CreditCard, MapPin, Shield } from "lucide-react";
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
    <div className="flex flex-col min-h-screen">
  
      {/* Hero Section */}
      <header className="bg-primary text-primary-foreground py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">
            Transform Waste into Opportunity with <span className="text-secondary">SmartScrap</span>
          </h1>
          <p className="text-lg mb-8">
            Join our innovative platform to make waste segregation smarter, recycling easier, and help the environment.
          </p>
          <div className="flex justify-center space-x-4">
            <SignUpButton mode="modal">
              <Button variant="secondary">Get Started</Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button variant="secondary">Sign In</Button>
            </SignInButton>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={<Recycle className="w-10 h-10 text-primary" />} title="Smart Waste Segregation" description="AI-powered image recognition to categorize waste into organic, recyclable, or hazardous." />
            <FeatureCard icon={<CreditCard className="w-10 h-10 text-primary" />} title="Sell Your Waste" description="Generate tickets for your waste and sell it to recycling companies easily." />
            <FeatureCard icon={<MapPin className="w-10 h-10 text-primary" />} title="Clean & Earn" description="Complete cleaning tasks in your area and earn reward points." />
            <FeatureCard icon={<Shield className="w-10 h-10 text-primary" />} title="Supervised Collection" description="Area supervisors manage waste collection and ensure rewards distribution." />
            <FeatureCard icon={<Leaf className="w-10 h-10 text-primary" />} title="Eco-Friendly Impact" description="Track your contributions towards a greener planet through our dashboard." />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard step="1" title="Sign Up & Log In" description="Create an account and explore SmartScrap's features." />
            <StepCard step="2" title="Segregate & Sell" description="Use AI-powered recognition to categorize waste and sell it." />
            <StepCard step="3" title="Earn & Track" description="Complete cleaning tasks, earn rewards, and track your impact." />
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Start Making an Impact Today!</h2>
          <p className="text-lg mb-6">Join SmartScrap and help create a cleaner, greener planet.</p>
          <SignUpButton mode="modal">
            <Button variant="secondary">Get Started Now</Button>
          </SignUpButton>
        </div>
      </section>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description }) {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="mb-4 flex justify-center">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

// Step Card Component
function StepCard({ step, title, description }) {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="text-4xl font-bold text-primary mb-4">{step}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
