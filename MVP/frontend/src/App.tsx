import React, { useState, useEffect, useRef } from 'react';

// --- Type Augmentation for QRCode library ---
// This tells TypeScript that we expect a 'QRCode' object to be available on the global window object.
// This resolves the TS2339 error without changing runtime behavior.
declare global {
  interface Window {
    QRCode: any;
  }
}

// --- STYLES ---
// All the necessary CSS is included here to make this a single, self-contained component.
const AppStyles = () => (
  <style>{`
    /* --- Main Layout & Theme --- */
    .app-container {
      background-color: #111827; /* Dark background */
      color: #d1d5db; /* Light gray text */
      min-height: 100vh;
      font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    }

    /* --- Navigation Bar --- */
    .main-nav {
      background-color: #1f2937;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .nav-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: #34d399; /* Green accent */
    }

    .nav-links button {
      background: none;
      border: none;
      color: #d1d5db;
      padding: 0.5rem 1rem;
      margin-left: 0.5rem;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: background-color 0.2s, color 0.2s;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .nav-links button:hover {
      background-color: #374151;
    }

    .nav-links button.active {
      background-color: #34d399;
      color: #111827;
    }

    .nav-links button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* --- Main Content Area --- */
    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }

    .page-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .page-container h2 {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    /* --- Cards --- */
    .card {
      background-color: #1f2937;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      width: 100%;
    }

    .form-card {
      max-width: 500px;
    }

    .info-card {
      max-width: 500px;
      text-align: center;
    }

    .centered-card {
        margin: 0 auto;
    }

    /* --- Forms --- */
    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #9ca3af;
      margin-bottom: 0.5rem;
      text-align: left;
    }

    .form-group input {
      width: 100%;
      padding: 0.75rem 1rem;
      box-sizing: border-box;
      background-color: #374151;
      border: 1px solid #4b5563;
      border-radius: 0.375rem;
      color: #d1d5db;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-group input:focus {
      border-color: #34d399;
      box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.5);
    }
    
    .geo-input-group {
        display: flex;
        gap: 0.5rem;
    }

    .geo-input-group button {
        padding: 0.5rem 1rem;
        background-color: #374151;
        border: 1px solid #4b5563;
        color: #d1d5db;
        border-radius: 0.375rem;
        cursor: pointer;
    }
    .geo-input-group button:hover {
        background-color: #4b5563;
    }


    .form-group input[type="file"] {
        padding: 0;
    }

    .form-group input[type="file"]::file-selector-button {
        background-color: #34d399;
        color: #111827;
        border: none;
        padding: 0.75rem 1rem;
        margin-right: 1rem;
        cursor: pointer;
        font-weight: 600;
    }

    .form-info {
        font-size: 0.875rem;
        color: #9ca3af;
        margin-bottom: 1rem;
        text-align: left;
    }
    .form-info span {
        font-family: monospace;
        font-weight: bold;
        color: #d1d5db;
    }

    /* --- Buttons --- */
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.375rem;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.2s;
      width: 100%;
    }

    .btn-primary {
      background-color: #10b981;
      color: white;
    }

    .btn-primary:hover {
      background-color: #059669;
    }

    .btn:disabled {
      background-color: #4b5563;
      cursor: not-allowed;
    }

    /* --- Info & Credential Display --- */
    .credential-box {
      background-color: #374151;
      padding: 1rem;
      border-radius: 0.375rem;
      margin: 1.5rem 0;
    }

    .credential-label {
      font-size: 0.875rem;
      color: #9ca3af;
    }

    .credential-id {
      font-family: monospace;
      font-size: 1.125rem;
      word-break: break-all;
    }

    .qr-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .qr-canvas {
      background-color: white;
      padding: 0.5rem;
      border-radius: 0.375rem;
    }

    .qr-caption {
      font-size: 0.75rem;
      color: #6b7280;
      margin-top: 0.5rem;
    }

    /* --- Batch List --- */
    .layout-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      width: 100%;
      max-width: 1100px;
    }

    @media (min-width: 1024px) {
      .layout-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .list-card h3 {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 1rem;
        text-align: left;
    }

    .batch-list {
      max-height: 24rem;
      overflow-y: auto;
      padding-right: 0.5rem;
    }

    .batch-item {
      background-color: #374151;
      padding: 1rem;
      border-radius: 0.375rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .batch-info .batch-crop {
        font-weight: bold;
        text-align: left;
    }

    .batch-info .batch-id {
        font-size: 0.875rem;
        color: #9ca3af;
        font-family: monospace;
        text-align: left;
    }

    /* --- Utility Classes --- */
    .error-message {
      color: #f87171;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    .warning-text {
        color: #fbbf24;
        font-weight: bold;
    }
  `}</style>
);


// --- Type Definitions ---
interface Farmer {
  id: string;
  name: string;
  qrData: string;
}

// UPDATED: Batch interface to match backend response
interface Batch {
  batchId: string;
  farmerId: string;
  crop: string;
  quantity: string;
  harvestDate: string;
  qrDataUrl: string;
}

// --- CONFIGURATION ---
const API_BASE_URL = 'http://localhost:4000'; 


// --- Helper Components ---
const QRCodeGenerator: React.FC<{ data: string, size?: number }> = ({ data, size = 180 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Check if the QRCode library is available on the window object
    if (canvasRef.current && data && typeof window.QRCode !== 'undefined') {
      window.QRCode.toCanvas(canvasRef.current, data, { width: size, margin: 1 }, (error: any) => {
        if (error) {
            console.error("QRCode generation failed:", error);
        }
      });
    } else if (typeof window.QRCode === 'undefined') {
        console.error("QRCode library failed to load from script tag in index.html");
    }
  }, [data, size]);

  return <canvas ref={canvasRef} className="qr-canvas" />;
};


// --- Main App Component ---
const App: React.FC = () => {
  // --- State Management ---
  const [currentPage, setCurrentPage] = useState<'register' | 'createBatch' | 'trace'>('register');
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for form inputs
  const [farmerName, setFarmerName] = useState('');
  const [crop, setCrop] = useState('');
  const [quantity, setQuantity] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [geo, setGeo] = useState('');
  const [photos, setPhotos] = useState<FileList | null>(null);


  // --- API Calls ---
  const registerFarmer = async (name: string): Promise<Farmer> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to register farmer' }));
      throw new Error(errorData.message);
    }
    
    const responseData = await response.json();
    const farmerData = responseData.farmer;

    return { 
      id: farmerData.id, 
      name: farmerData.name, 
      qrData: farmerData.id 
    };
  };

  // UPDATED: createBatch function to match backend
  const createBatch = async (formData: FormData): Promise<Batch> => {
    const response = await fetch(`${API_BASE_URL}/api/batches/create`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to create batch' }));
        throw new Error(errorData.message);
    }

    const responseData = await response.json();
    console.log("Received from backend (createBatch):", responseData);
    
    const { batch, qr } = responseData;
    // Map backend response to our frontend Batch interface
    return {
      batchId: batch.id,
      farmerId: batch.farmerId,
      crop: batch.metadata.crop,
      quantity: batch.metadata.quantity,
      harvestDate: batch.metadata.harvestDate,
      qrDataUrl: qr
    };
  };


  // --- Handlers ---
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const newFarmer = await registerFarmer(farmerName.trim());
      setFarmer(newFarmer);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // UPDATED: Batch submission handler
  const handleCreateBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crop || !quantity || !harvestDate || !photos || photos.length === 0 || !farmer) {
      alert("Please fill all fields and upload at least one photo.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      // Append fields with the names your backend expects
      formData.append('crop', crop);
      formData.append('quantity', quantity);
      formData.append('harvestDate', harvestDate);
      formData.append('geo', geo);
      formData.append('farmerId', farmer.id);
      
      // Loop and append all files under the 'photos' field name
      for (let i = 0; i < photos.length; i++) {
        formData.append('photos', photos[i]);
      }
      
      const newBatch = await createBatch(formData);
      setBatches(prevBatches => [...prevBatches, newBatch]);
      
      // Clear form fields after successful submission
      setCrop('');
      setQuantity('');
      setHarvestDate('');
      setGeo('');
      setPhotos(null);
      (document.getElementById('photos') as HTMLInputElement).value = '';

      alert("Batch created successfully!");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // NEW: Handler to get user's geolocation
  const handleGetLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setGeo(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        }, () => {
            alert('Unable to retrieve your location.');
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
  };


  // --- UI Rendering ---
  const renderPage = () => {
    switch (currentPage) {
      case 'register':
        return (
          <div className="page-container">
            <h2>Farmer Registration</h2>
            {!farmer ? (
              <form onSubmit={handleRegisterSubmit} className="card form-card">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" disabled={isLoading} className="btn btn-primary">
                  {isLoading ? 'Registering...' : 'Get My ID & QR Code'}
                </button>
              </form>
            ) : (
              <div className="card info-card">
                  <h3>Registration Successful!</h3>
                  <p>Welcome, {farmer.name}. Here are your credentials.</p>
                  <div className="credential-box">
                      <p className="credential-label">Your Unique Farmer ID</p>
                      <p className="credential-id">{farmer.id}</p>
                  </div>
                  <div className="qr-container">
                      <p className="credential-label">Your Personal QR Code</p>
                      <QRCodeGenerator data={farmer.qrData} />
                      <p className="qr-caption">Save this QR code. You'll need it.</p>
                  </div>
              </div>
            )}
          </div>
        );
      case 'createBatch':
        if (!farmer) {
          return <div className="card info-card centered-card"><h3 className="warning-text">Please Register First</h3><p>You must register as a farmer before you can create a crop batch.</p></div>;
        }
        return (
          // UPDATED: The form fields now match your backend requirements
          <div className="page-container">
              <h2>Create New Crop Batch</h2>
              <div className="layout-grid">
                  <form onSubmit={handleCreateBatchSubmit} className="card form-card">
                      <p className="form-info">Farmer ID: <span>{farmer.id}</span></p>
                      <div className="form-group">
                          <label htmlFor="crop">Crop</label>
                          <input type="text" id="crop" value={crop} onChange={e => setCrop(e.target.value)} placeholder="e.g., Wheat, Tomato" required/>
                      </div>
                      <div className="form-group">
                          <label htmlFor="quantity">Quantity (in kg)</label>
                          <input type="number" id="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="e.g., 500" required/>
                      </div>
                      <div className="form-group">
                          <label htmlFor="harvestDate">Harvest Date</label>
                          <input type="date" id="harvestDate" value={harvestDate} onChange={e => setHarvestDate(e.target.value)} required/>
                      </div>
                      <div className="form-group">
                          <label htmlFor="geo">Geolocation (Lat, Lon)</label>
                          <div className="geo-input-group">
                            <input type="text" id="geo" value={geo} onChange={e => setGeo(e.target.value)} placeholder="e.g., 26.2124, 78.1772" />
                            <button type="button" onClick={handleGetLocation}>Get</button>
                          </div>
                      </div>
                      <div className="form-group">
                          <label htmlFor="photos">Crop Photos (up to 4)</label>
                          <input type="file" id="photos" onChange={e => setPhotos(e.target.files)} accept="image/*" multiple required/>
                      </div>
                      {error && <p className="error-message">{error}</p>}
                      <button type="submit" disabled={isLoading} className="btn btn-primary">
                          {isLoading ? 'Submitting...' : 'Create Batch'}
                      </button>
                  </form>
                  
                  <div className="card list-card">
                      <h3>My Batches</h3>
                      {batches.length === 0 ? (
                          <p>You haven't created any batches yet.</p>
                      ) : (
                          <div className="batch-list">
                              {batches.map(batch => (
                                  <div key={batch.batchId} className="batch-item">
                                      <div className="batch-info">
                                          <p className="batch-crop">{batch.crop} - {batch.quantity} kg</p>
                                          <p className="batch-id">{batch.batchId}</p>
                                      </div>
                                      <QRCodeGenerator data={batch.qrDataUrl} size={80} />
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              </div>
          </div>
        );
      case 'trace':
        return (
          <div className="card info-card centered-card">
              <h2>Trace a Product</h2>
              <p>This page will allow consumers to scan a batch QR code and see the product's history.</p>
              <p className="warning-text">Functionality to be built.</p>
          </div>
        );
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <>
      <AppStyles />
      <div className="app-container">
        <nav className="main-nav">
          <div className="nav-content">
            <h1 className="logo">AgriTrace</h1>
            <div className="nav-links">
              <button onClick={() => setCurrentPage('register')} className={currentPage === 'register' ? 'active' : ''}>Farmer</button>
              <button onClick={() => setCurrentPage('createBatch')} className={currentPage === 'createBatch' ? 'active' : ''} disabled={!farmer}>Create Batch</button>
              <button onClick={() => setCurrentPage('trace')} className={currentPage === 'trace' ? 'active' : ''}>Trace Product</button>
            </div>
          </div>
        </nav>
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </>
  );
};

export default App;

