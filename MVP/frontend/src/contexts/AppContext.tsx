import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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

interface DistributorData {
  // Add distributor-specific data here
  [key: string]: any;
}

interface ValidatorData {
  // Add validator-specific data here
  [key: string]: any;
}

interface AppState {
  farmer: Farmer | null;
  batches: Batch[];
  distributorData: DistributorData;
  validatorData: ValidatorData;
}

interface AppContextType {
  // State
  farmer: Farmer | null;
  batches: Batch[];
  distributorData: DistributorData;
  validatorData: ValidatorData;

  // Actions
  setFarmer: (farmer: Farmer | null) => void;
  setBatches: (batches: Batch[]) => void;
  addBatch: (batch: Batch) => void;
  setDistributorData: (data: DistributorData) => void;
  setValidatorData: (data: ValidatorData) => void;
  clearAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = "agri-mvp-app-state";

const initialState: AppState = {
  farmer: null,
  batches: [],
  distributorData: {},
  validatorData: {},
};

// Helper function to safely parse JSON from localStorage
const loadFromStorage = (): AppState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects for batches
      if (parsed.batches) {
        parsed.batches = parsed.batches.map((batch: any) => ({
          ...batch,
          createdAt: new Date(batch.createdAt),
        }));
      }
      return { ...initialState, ...parsed };
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error);
  }
  return initialState;
};

// Helper function to save to localStorage
const saveToStorage = (state: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AppState>(initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const loadedState = loadFromStorage();
    setState(loadedState);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const setFarmer = (farmer: Farmer | null) => {
    setState((prev) => ({ ...prev, farmer }));
  };

  const setBatches = (batches: Batch[]) => {
    setState((prev) => ({ ...prev, batches }));
  };

  const addBatch = (batch: Batch) => {
    setState((prev) => ({ ...prev, batches: [...prev.batches, batch] }));
  };

  const setDistributorData = (distributorData: DistributorData) => {
    setState((prev) => ({ ...prev, distributorData }));
  };

  const setValidatorData = (validatorData: ValidatorData) => {
    setState((prev) => ({ ...prev, validatorData }));
  };

  const clearAllData = () => {
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  };

  const contextValue: AppContextType = {
    // State
    farmer: state.farmer,
    batches: state.batches,
    distributorData: state.distributorData,
    validatorData: state.validatorData,

    // Actions
    setFarmer,
    setBatches,
    addBatch,
    setDistributorData,
    setValidatorData,
    clearAllData,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export type { Farmer, Batch, DistributorData, ValidatorData };
