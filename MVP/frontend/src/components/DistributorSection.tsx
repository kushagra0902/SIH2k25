import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { validateBatch } from "@/api/validator.api";
import QrScanner from "react-qr-scanner";
import { purchaseBatch } from "@/api/distributor.api";
// dynamic import to avoid SSR issues in Next.js


interface ScannedData {
  type: "FARMER" | "batch";
  id: string;
  name?: string;
  farmerId?: string;
  cropType?: string;
}

export default function ValidatorSection() {
  const [scannedData, setScannedData] = useState<ScannedData | null>(null);
  const [manualInput, setManualInput] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user"); // default to front (user)
  const [scannerKey, setScannerKey] = useState(0); // force remount when toggling camera
  const [cameraError, setCameraError] = useState<string | null>(null);

  // robust parse for scanned text
  const parseData = (raw: string | null | undefined) => {
    const data = (raw ?? "").toString().trim();
    if (!data) return;
    try {
      const parts = data.split(":");
      if (parts[0].toUpperCase() === "FARMER") {
        setScannedData({
          type: "FARMER",
          id: parts[1],
          name: parts[2] || "Unknown Farmer",
        });
      } else if (parts[0].toUpperCase() === "BATCH") {
        setScannedData({
          type: "batch",
          id: parts[1],
          farmerId: parts[2],
          cropType: parts[3],
        });
      } else {
        // fallback: put entire scanned string as id if format unknown
        setScannedData({ type: "batch", id: data });
      }
      setIsValidated(false);
      setManualInput("");
      setCameraActive(false); // close camera after successful scan
      setCameraError(null);
    } catch (error) {
      console.error("Error parsing QR data:", error);
    }
  };

  const handleScanManual = () => {
    if (!manualInput.trim()) return;
    parseData(manualInput.trim());
  };

  const handleValidate = async () => {
    if (!scannedData) return;
    await purchaseBatch(scannedData.id);
    setIsValidated(true);
    setTimeout(() => {
      setScannedData(null);
      setIsValidated(false);
    }, 3000);
  };

  const reset = () => {
    setScannedData(null);
    setIsValidated(false);
    setManualInput("");
    setCameraActive(false);
    setCameraError(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-card">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-crop-orange flex items-center justify-center gap-2">

          🚛 Distributors

        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {!scannedData ? (
          <div className="space-y-4">
            <div className="text-center space-y-4">
              {!cameraActive ? (
                <>
                  <div className="space-y-4">
                    <Input
                      placeholder="Scan QR or paste QR data here"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      className="text-center h-12 rounded-xl border-2"
                      onKeyPress={(e) => e.key === "Enter" && handleScanManual()}
                    />
                    <Button
                      onClick={handleScanManual}
                      disabled={!manualInput.trim()}
                      variant="crop"
                      size="xl"
                      className="w-full"                                          
                    >
                      📱 QR Input
                    </Button>
                    <Button
                      onClick={() => {
                        setCameraError(null);
                        setCameraActive(true);
                        // ensure scanner mounts fresh
                        setScannerKey((k) => k + 1);
                      }}
                      variant="farm"
                      size="xl"
                      className="w-full"
                    >
                      🎥 Open Camera
                    </Button>
                  </div>

                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>💡 To test, copy QR data from Farmers or Distributors sections</p>
                    <p>Example formats:</p>
                    <p className="font-mono text-xs bg-muted p-2 rounded">
                      FARMER:FARM-ABC123:John<br />
                      BATCH:BATCH-XYZ789:FARM-ABC123:wheat
                    </p>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  {/* camera error message */}
                  {cameraError && (
                    <div className="text-sm text-red-600">
                      Camera error: {cameraError}
                    </div>
                  )}

                  <QrScanner
                    key={scannerKey} // force remount when this changes
                    delay={300}
                    style={{ width: "100%" }}
                    // Use a proper MediaStreamConstraints shape. `ideal` is more flexible.
                    constraints={{
                      video: { facingMode: { ideal: facingMode } },
                    }}
                    onError={(err: any) => {
                      console.error("QR Scanner error:", err);
                      const msg =
                        (err && err.message) ||
                        (err && err.name) ||
                        "Could not open camera";
                      setCameraError(msg);
                    }}
                    onScan={(result: any) => {
                      if (!result) return;
                      // react-qr-scanner may return a string or an object with `.text`
                      let text: string | null = null;
                      if (typeof result === "string") text = result;
                      else if (typeof result === "object" && "text" in result)
                        text = result.text;
                      else if (result && result.data) text = result.data;
                      else text = String(result);
                      if (text) parseData(text);
                    }}
                  />

                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        // toggle and force remount
                        setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
                        setScannerKey((k) => k + 1);
                        setCameraError(null);
                      }}
                      variant="sky"
                      className="w-full"
                    >
                      🔄 Switch Camera
                    </Button>
                    <Button
                      onClick={() => {
                        setCameraActive(false);
                        setCameraError(null);
                      }}
                      variant="ghost"
                      className="w-full"
                    >
                      ❌ Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {isValidated ? (
              <div className="text-center space-y-4">
                <div className="text-6xl animate-bounce">✅</div>
                <div className="text-2xl font-bold text-farm-green">PURCHASED!</div>
                <p className="text-lg">
                  {scannedData.type === "FARMER" ? "Farmer" : "Batch"} verified successfully
                </p>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <div className="bg-muted p-4 rounded-xl space-y-2">
                    <p className="font-semibold text-lg">
                      {scannedData.type === "FARMER" ? "👨‍🌾 Farmer Scanned" : "📦 Batch Scanned"}
                    </p>
                    <p className="font-bold text-xl">{scannedData.id}</p>
                    {scannedData.name && <p className="text-lg">Name: {scannedData.name}</p>}
                    {scannedData.farmerId && <p className="text-lg">Farmer: {scannedData.farmerId}</p>}
                    {scannedData.cropType && <p className="text-lg">Crop: {scannedData.cropType}</p>}
                  </div>
                </div>

                <div className="space-y-3">
                  <Button onClick={handleValidate} variant="farm" size="xl" className="w-full">
                    ✅ Confirm Purchase
                  </Button>
                  <Button onClick={reset} variant="ghost" className="w-full">
                    Scan Another
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
