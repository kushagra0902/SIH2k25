import { useState } from "react";
import FarmerSection from "@/components/FarmerSection";
import ValidatorSection from "@/components/ValidatorSection";
import DistributorSection from "@/components/DistributorSection";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";

type ActiveSection = "home" | "farmers" | "validators" | "distributors";

const Index = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>("home");

  if (activeSection === "farmers") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-farm-green">🌱 Farm Supply Chain</h1>
            <Button onClick={() => setActiveSection("home")} variant="ghost">
              ← Back to Home
            </Button>
          </div>
          <FarmerSection />
        </div>
      </div>
    );
  }

  if (activeSection === "validators") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-sky-blue">✅ Farm Supply Chain</h1>
            <Button onClick={() => setActiveSection("home")} variant="ghost">
              ← Back to Home
            </Button>
          </div>
          <div className="flex justify-center">
            <ValidatorSection />
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === "distributors") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-crop-orange">🚛 Farm Supply Chain</h1>
            <Button onClick={() => setActiveSection("home")} variant="ghost">
              ← Back to Home
            </Button>
          </div>
          <div className="flex justify-center">
            <DistributorSection />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-secondary/20">
      <ThemeToggle />
      {/* Header */}
      <div className="text-center py-8 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-farm-green mb-2">
          🌱 Farm Supply Chain
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Simple, visual tracking from farm to table
        </p>
      </div>

      {/* Main Sections */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Farmers Section */}
          <div className="bg-card rounded-2xl shadow-card overflow-hidden hover:shadow-soft transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-farm p-8 text-center">
              <div className="text-6xl mb-4">🌱</div>
              <h2 className="text-2xl font-bold text-white mb-2">Farmers</h2>
              <p className="text-white/90">Register & Create Batches</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">✅ Register with just your name</p>
                <p className="text-sm text-muted-foreground">✅ Get your Farmer ID & QR code</p>
                <p className="text-sm text-muted-foreground">✅ Create batches with crop icons</p>
              </div>
              <Button
                onClick={() => setActiveSection("farmers")}
                variant="farm"
                size="xl"
                className="w-full"
              >
                Start Farming 🌾
              </Button>
            </div>
          </div>

          {/* Validators Section */}
          <div className="bg-card rounded-2xl shadow-card overflow-hidden hover:shadow-soft transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-sky p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-white mb-2">Validators</h2>
              <p className="text-white/90">Scan & Validate</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">✅ Scan farmer & batch QR codes</p>
                <p className="text-sm text-muted-foreground">✅ Verify authenticity</p>
                <p className="text-sm text-muted-foreground">✅ One-click validation</p>
              </div>
              <Button
                onClick={() => setActiveSection("validators")}
                variant="sky"
                size="xl"
                className="w-full"
              >
                Start Validating ✅
              </Button>
            </div>
          </div>

          {/* Distributors Section */}
          <div className="bg-card rounded-2xl shadow-card overflow-hidden hover:shadow-soft transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-earth p-8 text-center">
              <div className="text-6xl mb-4">🚛</div>
              <h2 className="text-2xl font-bold text-white mb-2">Distributors</h2>
              <p className="text-white/90">Scan & Purchase</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">✅ Scan validated batch QR codes</p>
                <p className="text-sm text-muted-foreground">✅ View crop details</p>
                <p className="text-sm text-muted-foreground">✅ One-click purchase</p>
              </div>
              <Button
                onClick={() => setActiveSection("distributors")}
                variant="crop"
                size="xl"
                className="w-full"
              >
                Start Distributing 🛒
              </Button>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-8 text-foreground">How it Works</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex items-center gap-4">
              <div className="bg-farm-green text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">1</div>
              <div className="text-left">
                <p className="font-semibold">Farmers Register</p>
                <p className="text-sm text-muted-foreground">Get ID & create batches</p>
              </div>
            </div>
            <div className="text-2xl">→</div>
            <div className="flex items-center gap-4">
              <div className="bg-sky-blue text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">2</div>
              <div className="text-left">
                <p className="font-semibold">Validators Check</p>
                <p className="text-sm text-muted-foreground">Scan & validate quality</p>
              </div>
            </div>
            <div className="text-2xl">→</div>
            <div className="flex items-center gap-4">
              <div className="bg-crop-orange text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">3</div>
              <div className="text-left">
                <p className="font-semibold">Distributors Buy</p>
                <p className="text-sm text-muted-foreground">Purchase validated batches</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
