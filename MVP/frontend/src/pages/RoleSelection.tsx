import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type UserRole = "farmer" | "validator" | "distributor";

interface RoleSelectionProps {
  onRoleSelect: (role: UserRole) => void;
}

export default function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-farm-green via-sky-blue to-crop-orange bg-clip-text text-transparent mb-4">
            🌾 Farm Supply Chain
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Transparent • Traceable • Trustworthy
          </p>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Choose Your Role
          </h2>
          <p className="text-muted-foreground">
            Select how you want to participate in the supply chain
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Farmer Card */}
          <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-farm-green/50">
            <CardHeader className="text-center pb-4">
              <div className="bg-gradient-farm rounded-2xl p-8 mb-4">
                <div className="text-6xl mb-4">👨‍🌾</div>
                <CardTitle className="text-2xl font-bold text-white">
                  Farmer
                </CardTitle>
                <p className="text-white/90 mt-2">Grow & Register</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  ✅ Register your farm
                </p>
                <p className="text-sm text-muted-foreground">
                  ✅ Create crop batches
                </p>
                <p className="text-sm text-muted-foreground">
                  ✅ Generate QR codes
                </p>
                <p className="text-sm text-muted-foreground">
                  ✅ Track your produce
                </p>
              </div>
              <Button
                onClick={() => onRoleSelect("farmer")}
                variant="farm"
                size="xl"
                className="w-full"
              >
                Start as Farmer 🌾
              </Button>
            </CardContent>
          </Card>

          {/* Validator Card */}
          <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-sky-blue/50">
            <CardHeader className="text-center pb-4">
              <div className="bg-gradient-sky rounded-2xl p-8 mb-4">
                <div className="text-6xl mb-4">✅</div>
                <CardTitle className="text-2xl font-bold text-white">
                  Validator
                </CardTitle>
                <p className="text-white/90 mt-2">Verify & Validate</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  ✅ Scan QR codes
                </p>
                <p className="text-sm text-muted-foreground">
                  ✅ Verify authenticity
                </p>
                <p className="text-sm text-muted-foreground">
                  ✅ Quality assurance
                </p>
                <p className="text-sm text-muted-foreground">
                  ✅ One-click validation
                </p>
              </div>
              <Button
                onClick={() => onRoleSelect("validator")}
                variant="sky"
                size="xl"
                className="w-full"
              >
                Start as Validator ✅
              </Button>
            </CardContent>
          </Card>

          {/* Distributor Card */}
          <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-crop-orange/50">
            <CardHeader className="text-center pb-4">
              <div className="bg-gradient-earth rounded-2xl p-8 mb-4">
                <div className="text-6xl mb-4">🚛</div>
                <CardTitle className="text-2xl font-bold text-white">
                  Distributor
                </CardTitle>
                <p className="text-white/90 mt-2">Purchase & Distribute</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  ✅ Scan validated batches
                </p>
                <p className="text-sm text-muted-foreground">
                  ✅ View crop details
                </p>
                <p className="text-sm text-muted-foreground">
                  ✅ Purchase products
                </p>
                <p className="text-sm text-muted-foreground">
                  ✅ Track distribution
                </p>
              </div>
              <Button
                onClick={() => onRoleSelect("distributor")}
                variant="crop"
                size="xl"
                className="w-full"
              >
                Start as Distributor 🛒
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-8 text-foreground">
            How it Works
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex items-center gap-4">
              <div className="bg-farm-green text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div className="text-left">
                <p className="font-semibold">Farmers Register</p>
                <p className="text-sm text-muted-foreground">
                  Get ID & create batches
                </p>
              </div>
            </div>
            <div className="text-2xl">→</div>
            <div className="flex items-center gap-4">
              <div className="bg-sky-blue text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div className="text-left">
                <p className="font-semibold">Validators Check</p>
                <p className="text-sm text-muted-foreground">
                  Scan & validate quality
                </p>
              </div>
            </div>
            <div className="text-2xl">→</div>
            <div className="flex items-center gap-4">
              <div className="bg-crop-orange text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div className="text-left">
                <p className="font-semibold">Distributors Buy</p>
                <p className="text-sm text-muted-foreground">
                  Purchase validated batches
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { UserRole };
