import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface BatchData {
  id: string;
  farmerId: string;
  cropType: string;
  isValidated: boolean;
}

export default function DistributorSection() {
  const [batchData, setBatchData] = useState<BatchData | null>(null);
  const [manualInput, setManualInput] = useState("");
  const [isPurchased, setIsPurchased] = useState(false);

  const handleScan = () => {
    if (!manualInput.trim()) return;
    
    try {
      const parts = manualInput.split(":");
      if (parts[0] === "BATCH") {
        setBatchData({
          id: parts[1],
          farmerId: parts[2],
          cropType: parts[3] || "Unknown Crop",
          isValidated: Math.random() > 0.3, // Simulate validation status
        });
      }
      setIsPurchased(false);
      setManualInput("");
    } catch (error) {
      console.error("Error parsing batch data:", error);
    }
  };

  const handlePurchase = () => {
    setIsPurchased(true);
    // In a real app, this would process the purchase
    setTimeout(() => {
      setBatchData(null);
      setIsPurchased(false);
    }, 3000);
  };

  const reset = () => {
    setBatchData(null);
    setIsPurchased(false);
    setManualInput("");
  };

  const getCropEmoji = (cropType: string) => {
    const cropMap: Record<string, string> = {
      wheat: "🌾",
      rice: "🍚",
      vegetables: "🥦",
      fruits: "🍎",
      corn: "🌽",
      tomatoes: "🍅",
    };
    return cropMap[cropType.toLowerCase()] || "🌱";
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-card">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-crop-orange flex items-center justify-center gap-2">
          🚛 Distributors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!batchData ? (
          <div className="space-y-4">
            <div className="text-center space-y-4">
              <div className="space-y-4">
                <Input
                  placeholder="Scan Batch QR or paste batch data"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="text-center h-12 rounded-xl border-2"
                  onKeyPress={(e) => e.key === "Enter" && handleScan()}
                />
                <Button
                  onClick={handleScan}
                  disabled={!manualInput.trim()}
                  variant="crop"
                  size="xl"
                  className="w-full"
                >
                  📱 Scan Batch
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p>💡 Scan batch QR codes from farmers</p>
                <p>Example format:</p>
                <p className="font-mono text-xs bg-muted p-2 rounded">
                  BATCH:BATCH-XYZ789:FARM-ABC123:wheat
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {isPurchased ? (
              <div className="text-center space-y-4">
                <div className="text-6xl animate-bounce">🛒</div>
                <div className="text-2xl font-bold text-farm-green">
                  PURCHASED!
                </div>
                <p className="text-lg">Batch acquired successfully</p>
                <div className="bg-farm-green/10 p-4 rounded-xl">
                  <p className="text-sm">
                    ✅ Transaction recorded
                    <br />
                    📋 Supply chain updated
                    <br />
                    🚚 Ready for distribution
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center space-y-4">
                  <div className="bg-muted p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl">{getCropEmoji(batchData.cropType)}</span>
                      <span className="text-xl font-bold capitalize">{batchData.cropType}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-semibold">Batch ID:</p>
                      <p className="font-mono text-sm bg-background p-2 rounded">
                        {batchData.id}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-semibold">Farmer ID:</p>
                      <p className="font-mono text-sm bg-background p-2 rounded">
                        {batchData.farmerId}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2">
                      {batchData.isValidated ? (
                        <>
                          <span className="text-green-600">✅</span>
                          <span className="text-green-600 font-semibold">Validated</span>
                        </>
                      ) : (
                        <>
                          <span className="text-yellow-600">⚠️</span>
                          <span className="text-yellow-600 font-semibold">Not Validated</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button
                    onClick={handlePurchase}
                    variant={batchData.isValidated ? "farm" : "secondary"}
                    size="xl"
                    className="w-full"
                    disabled={!batchData.isValidated}
                  >
                    {batchData.isValidated ? "🛒 PURCHASE" : "❌ Cannot Purchase (Not Validated)"}
                  </Button>
                  
                  {!batchData.isValidated && (
                    <div className="text-center text-sm text-muted-foreground bg-yellow-50 p-3 rounded-xl">
                      ⚠️ This batch needs to be validated by a validator before purchase
                    </div>
                  )}
                  
                  <Button
                    onClick={reset}
                    variant="ghost"
                    className="w-full"
                  >
                    Scan Another Batch
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}