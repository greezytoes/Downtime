import { useState } from 'react';
import { Clock, Wrench, AlertTriangle, Timer } from 'lucide-react';
import { MaintenanceRecord } from './types/maintenance';
import { useMaintenanceContext } from './context/MaintenanceContext';
import { MetricsCard } from './components/MetricsCard';
import { Timeline } from './components/Timeline';
import { MaintenanceFormModal } from './components/MaintenanceFormModal';
import { RecordModal } from './components/RecordModal';
import { EndCallModal } from './components/EndCallModal';
import { ColorPicker } from './components/ColorPicker';

function calculateMTTR(records: MaintenanceRecord[]): string {
  const completedRecords = records.filter(r => r.endTime != null);
  if (completedRecords.length === 0) return '0m';
  
  const totalMinutes = completedRecords.reduce((acc, record) => {
    const start = new Date(record.startTime);
    const end = new Date(record.endTime!);
    return acc + (end.getTime() - start.getTime()) / (1000 * 60);
  }, 0);
  
  return `${Math.round(totalMinutes / completedRecords.length)}m`;
}

function App() {
  const { state } = useMaintenanceContext();
  const [showNewRecordModal, setShowNewRecordModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [recordToEnd, setRecordToEnd] = useState<MaintenanceRecord | null>(null);
  const currentShift = new Date().getHours() >= 5 && new Date().getHours() < 17 ? 'day' : 'night';

  const activeRecords = state.records.filter(r => !r.endTime);
  const mttr = calculateMTTR(state.records);
  const downtimeIncidents = state.records.filter(r => r.causedDowntime).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Maintenance Time Logger</h1>
          <p className="text-slate-400">Track and manage maintenance activities efficiently</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Active Calls"
            value={activeRecords.length}
            icon={<Clock className="h-6 w-6" />}
            valueSize="large"
          />
          <MetricsCard
            title="Total Today"
            value={state.records.length}
            icon={<Wrench className="h-6 w-6" />}
            trend={2}
            trendIsGood={false}
          />
          <MetricsCard
            title="Downtime Incidents"
            value={downtimeIncidents}
            icon={<AlertTriangle className="h-6 w-6" />}
            trend={15}
            trendIsGood={false}
          />
          <MetricsCard
            title="Mean Time to Repair"
            value={mttr}
            icon={<Timer className="h-6 w-6" />}
            trend={8}
            trendIsGood={false}
          />
        </div>

        <div className="flex justify-end space-x-4 mb-6">
          <button
            onClick={() => setShowNewRecordModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Start Call
          </button>
          <button
            onClick={() => {
              const activeRecord = activeRecords[0];
              if (activeRecord) setRecordToEnd(activeRecord);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            disabled={activeRecords.length === 0}
          >
            End Call
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Today's Timeline</h2>
          <Timeline
            records={state.records}
            shift={currentShift}
            onRecordClick={setSelectedRecord}
          />
        </div>
      </div>

      {showNewRecordModal && (
        <MaintenanceFormModal onClose={() => setShowNewRecordModal(false)} />
      )}

      {selectedRecord && (
        <RecordModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}

      {recordToEnd && (
        <EndCallModal
          record={recordToEnd}
          onClose={() => setRecordToEnd(null)}
        />
      )}

      <ColorPicker />
    </div>
  );
}

export default App;