import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugPanel() {
  const { farmer, batches, clearAllData } = useAppContext();

  return (
    <Card className="w-full max-w-md mx-auto shadow-card">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-lg font-bold text-red-600">
          🔧 Debug Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          <div className="mb-2">
            <strong>Farmer:</strong> {farmer ? farmer.name : "None"}
          </div>
          <div className="mb-2">
            <strong>Batches:</strong> {batches.length}
          </div>
          {batches.length > 0 && (
            <div className="text-xs bg-gray-100 p-2 rounded">
              {batches.map((batch, index) => (
                <div key={batch.id} className="mb-1">
                  {index + 1}. {batch.cropType} (ID: {batch.id})
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={clearAllData}
          variant="destructive"
          size="sm"
          className="w-full"
        >
          Clear All Data
        </Button>

        <div className="text-xs text-gray-500 text-center">
          Data is automatically saved to localStorage
        </div>
      </CardContent>
    </Card>
  );
}
