import { createContext, useContext, useReducer, ReactNode } from 'react';
import { MaintenanceRecord } from '../types/maintenance';

interface MaintenanceState {
  records: MaintenanceRecord[];
}

type MaintenanceAction = 
  | { type: 'ADD_RECORD'; payload: MaintenanceRecord }
  | { type: 'UPDATE_RECORD'; payload: MaintenanceRecord };

const initialState: MaintenanceState = {
  records: []
};

const MaintenanceContext = createContext<{
  state: MaintenanceState;
  dispatch: React.Dispatch<MaintenanceAction>;
} | undefined>(undefined);

function maintenanceReducer(state: MaintenanceState, action: MaintenanceAction): MaintenanceState {
  switch (action.type) {
    case 'ADD_RECORD':
      return {
        ...state,
        records: [...state.records, action.payload]
      };
    case 'UPDATE_RECORD':
      return {
        ...state,
        records: state.records.map(record => 
          record.id === action.payload.id ? action.payload : record
        )
      };
    default:
      return state;
  }
}

export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(maintenanceReducer, initialState);

  return (
    <MaintenanceContext.Provider value={{ state, dispatch }}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenanceContext() {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error('useMaintenanceContext must be used within a MaintenanceProvider');
  }
  return context;
}