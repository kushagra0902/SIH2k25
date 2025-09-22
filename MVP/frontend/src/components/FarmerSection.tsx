import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import QRCode from "qrcode";
import { registerFarmerAPI } from "@/api/farmerAPI";
import { createBatch } from "@/api/batch.api";

interface Farmer {
  id: string;
  name: string;
  qrCode: string;
}

interface Batch {
  id: string;
  farmerId: string;
  cropType: string;
  qrCode: string;
  createdAt: Date;
}

interface BatchForm {
  crop: string;
  quantity: string;
  harvestDate: string;
  geo: string;
  photos: FileList | null;
}

export default function FarmerSection() {
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [farmerName, setFarmerName] = useState("");
  const [batches, setBatches] = useState<Batch[]>([]);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCreatingBatch, setIsCreatingBatch] = useState(false);
  const [batchForm, setBatchForm] = useState<BatchForm>({
    crop: "",
    quantity: "",
    harvestDate: "",
    geo: "",
    photos: null,
  });

  const registerFarmer = async () => {
    setIsRegistering(true);
    let resp = await registerFarmerAPI(farmerName);
    console.log(resp);
    try {
      const qrCodeData = await QRCode.toDataURL(`FARMER:${resp.farmer.id}`);
      console.log(resp.farmer.id);
      setFarmer({
        id: resp.farmer.id,
        name: resp.farmer.name,
        qrCode: qrCodeData,
      });
      setFarmerName("");
      console.log("Farmer Name :", farmerName);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }

    setIsRegistering(false);
  };
  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !farmer ||
      !batchForm.crop ||
      !batchForm.quantity ||
      !batchForm.harvestDate
    )
      return;

    setIsCreatingBatch(true);

    try {
      const formData = new FormData();
      formData.append("farmerId", farmer.id);
      formData.append("crop", batchForm.crop);
      formData.append("quantity", batchForm.quantity);
      formData.append("harvestDate", batchForm.harvestDate);
      formData.append("geo", batchForm.geo || "Unknown Location");

      if (batchForm.photos) {
        for (let i = 0; i < Math.min(batchForm.photos.length, 4); i++) {
          formData.append("photos", batchForm.photos[i]);
        }
      }

      const response = await createBatch(formData);

      if (response.ok && response.batch) {
        const newBatch: Batch = {
          id: response.batch.id,
          farmerId: farmer.id,
          cropType: batchForm.crop,
          qrCode: response.qr,
          createdAt: new Date(),
        };

        setBatches([newBatch, ...batches]);
        setShowBatchForm(false);
        setBatchForm({
          crop: "",
          quantity: "",
          harvestDate: "",
          geo: "",
          photos: null,
        });
      }
    } catch (error) {
      console.error("Error creating batch:", error);
    }

    setIsCreatingBatch(false);
  };

  const handleInputChange = (
    field: keyof BatchForm,
    value: string | FileList | null
  ) => {
    setBatchForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!farmer) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-card">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-farm-green flex items-center justify-center gap-2">
            🌱 Farmers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Input
              placeholder="Enter your name"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              className="text-lg h-12 rounded-xl border-2 text-center"
              onKeyPress={(e) => e.key === "Enter" && registerFarmer()}
            />
            <Button
              onClick={registerFarmer}
              disabled={!farmerName.trim() || isRegistering}
              variant="farm"
              size="xl"
              className="w-full"
            >
              {isRegistering ? "Registering..." : "Register 📝"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Farmer Info Card */}
      <Card className="shadow-card">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl font-bold text-farm-green">
            Welcome, {farmer.name}! 👋
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <p className="text-lg font-semibold">Your Farmer ID:</p>
            <p className="text-2xl font-bold text-farm-green bg-muted p-3 rounded-xl">
              {farmer.id}
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold">Your QR Code:</p>
            <div className="flex justify-center">
              <img
                src={farmer.qrCode}
                alt="Farmer QR Code"
                className="w-48 h-48 border-4 border-farm-green rounded-xl"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Batch Section */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          {!showBatchForm ? (
            <Button
              onClick={() => setShowBatchForm(true)}
              variant="farm"
              size="xl"
              className="w-full"
            >
              🌱 Create Batch
            </Button>
          ) : (
            <form onSubmit={handleBatchSubmit} className="space-y-4">
              <h3 className="text-center text-lg font-semibold mb-4">
                Create New Batch
              </h3>

              <div className="space-y-2">
                <Label htmlFor="crop">🌾 Crop Name</Label>
                <Input
                  id="crop"
                  placeholder="Enter crop name (e.g., Wheat, Rice)"
                  value={batchForm.crop}
                  onChange={(e) => handleInputChange("crop", e.target.value)}
                  className="text-lg h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">📦 Quantity</Label>
                <Input
                  id="quantity"
                  placeholder="Enter quantity (e.g., 100 kg)"
                  value={batchForm.quantity}
                  onChange={(e) =>
                    handleInputChange("quantity", e.target.value)
                  }
                  className="text-lg h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="harvestDate">📅 Harvest Date</Label>
                <Input
                  id="harvestDate"
                  type="date"
                  value={batchForm.harvestDate}
                  onChange={(e) =>
                    handleInputChange("harvestDate", e.target.value)
                  }
                  className="text-lg h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="geo">📍 Location (Optional)</Label>
                <Input
                  id="geo"
                  placeholder="Enter location (e.g., Farm Field A)"
                  value={batchForm.geo}
                  onChange={(e) => handleInputChange("geo", e.target.value)}
                  className="text-lg h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photos">📸 Photos (Optional, max 4)</Label>
                <Input
                  id="photos"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleInputChange("photos", e.target.files)}
                  className="text-lg h-12"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  variant="farm"
                  className="flex-1"
                  disabled={
                    isCreatingBatch ||
                    !batchForm.crop ||
                    !batchForm.quantity ||
                    !batchForm.harvestDate
                  }
                >
                  {isCreatingBatch ? "Creating..." : "Create Batch ✅"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowBatchForm(false)}
                  variant="ghost"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Batches List */}
      {batches.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-center">Your Batches:</h3>
          {batches.map((batch) => (
            <Card key={batch.id} className="shadow-card">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">🌾</span>
                  <span className="text-lg font-semibold">
                    {batch.cropType}
                  </span>
                </div>
                <p className="font-semibold">Batch ID: {batch.id}</p>
                <div className="flex justify-center">
                  <img
                    src={batch.qrCode}
                    alt="Batch QR Code"
                    className="w-32 h-32 border-2 border-harvest-gold rounded-xl"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Created: {batch.createdAt.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
