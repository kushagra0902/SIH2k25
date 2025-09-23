import { useState } from "react";
import FarmerSection from "@/components/FarmerSection";
import ValidatorSection from "@/components/ValidatorSection";
import DistributorSection from "@/components/DistributorSection";
import DebugPanel from "@/components/DebugPanel";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAppContext, type UserRole } from "@/contexts/AppContext";

type ActiveSection = "home" | "farmers" | "validators" | "distributors";

interface IndexProps {
  userRole: UserRole;
  onBackToRoleSelection: () => void;
}

const Index = ({ userRole, onBackToRoleSelection }: IndexProps) => {
  const [activeSection, setActiveSection] = useState<ActiveSection>("home");
  const { farmer, batches } = useAppContext();

  if (activeSection === "farmers") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-farm-green">
              🌱 Farm Supply Chain
            </h1>
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
            <h1 className="text-3xl font-bold text-sky-blue">
              ✅ Farm Supply Chain
            </h1>
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
            <h1 className="text-3xl font-bold text-crop-orange">
              🚛 Farm Supply Chain
            </h1>
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
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <ThemeToggle />
        <Button onClick={onBackToRoleSelection} variant="outline" size="sm">
          ← Change Role
        </Button>
      </div>

      {/* Header */}
      <div className="text-center py-8 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-farm-green mb-2">
          🌱 Farm Supply Chain
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {userRole === "farmer" && "Register crops and create batches"}
          {userRole === "validator" && "Scan and validate authenticity"}
          {userRole === "distributor" && "Purchase validated produce"}
        </p>
        <div className="mt-4 inline-block bg-muted px-4 py-2 rounded-full text-sm font-medium">
          Role: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
        </div>
      </div>

      {/* Role-Specific Section */}
      <div className="max-w-2xl mx-auto px-4 pb-12">
        <div className="flex justify-center">
          {userRole === "farmer" && (
            <div className="w-full max-w-md bg-card rounded-2xl shadow-card overflow-hidden hover:shadow-soft transition-all duration-300">
              <div className="bg-gradient-farm p-8 text-center">
                <div className="text-6xl mb-4">🌱</div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Farmer Dashboard
                </h2>
                <p className="text-white/90">Register & Create Batches</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    ✅ Register with just your name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ✅ Get your Farmer ID & QR code
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ✅ Create batches with crop icons
                  </p>
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
          )}

          {userRole === "validator" && (
            <div className="w-full max-w-md bg-card rounded-2xl shadow-card overflow-hidden hover:shadow-soft transition-all duration-300">
              <div className="bg-gradient-sky p-8 text-center">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Validator Dashboard
                </h2>
                <p className="text-white/90">Scan & Validate</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    ✅ Scan farmer & batch QR codes
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ✅ Verify authenticity
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ✅ One-click validation
                  </p>
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
          )}

          {userRole === "distributor" && (
            <div className="w-full max-w-md bg-card rounded-2xl shadow-card overflow-hidden hover:shadow-soft transition-all duration-300">
              <div className="bg-gradient-earth p-8 text-center">
                <div className="text-6xl mb-4">🚛</div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Distributor Dashboard
                </h2>
                <p className="text-white/90">Scan & Purchase</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    ✅ Scan validated batch QR codes
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ✅ View crop details
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ✅ One-click purchase
                  </p>
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
          )}
        </div>

        {/* Current Status */}
        {(farmer || batches.length > 0) && (
          <div className="mt-8 bg-card rounded-2xl shadow-card p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold mb-4 text-center">
              📊 Current Status
            </h3>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              {farmer && (
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-green-600 font-semibold">
                    👨‍🌾 Farmer Registered
                  </div>
                  <div className="text-sm text-green-700">{farmer.name}</div>
                </div>
              )}
              {batches.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-blue-600 font-semibold">
                    📦 Batches Created
                  </div>
                  <div className="text-sm text-blue-700">
                    {batches.length} batches
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Debug Panel */}
        <div className="mt-8 max-w-2xl mx-auto">
          <DebugPanel />
        </div>
      </div>
    </div>
  );
};

export default Index;
