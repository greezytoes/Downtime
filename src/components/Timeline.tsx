import { useMemo } from 'react';
import { MaintenanceRecord } from '../types/maintenance';
import { GlassCard } from './GlassCard';
import { useMaintenanceContext } from '../context/MaintenanceContext';

interface TimelineProps {
  shift: 'day' | 'night';
  onRecordClick: (record: MaintenanceRecord) => void;
}

export function Timeline({ shift, onRecordClick }: TimelineProps) {
  const { state } = useMaintenanceContext();
  const { records } = state;

  const timelineItems = useMemo(() => {
    const startHour = shift === 'day' ? 5 : 17;
    const totalHours = 12;
    const timelineWidth = 100;

    return records
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .map(record => {
        const start = new Date(record.startTime);
        const end = record.endTime ? new Date(record.endTime) : new Date();
        
        const startPosition = ((start.getHours() + start.getMinutes() / 60 - startHour) / totalHours) * timelineWidth;
        const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        const width = (duration / totalHours) * timelineWidth;

        return {
          record,
          left: Math.max(0, startPosition),
          width: Math.min(width, timelineWidth - startPosition)
        };
    });
  }, [records, shift]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <GlassCard className="p-4">
      <div className="relative">
        {/* Time markers */}
        <div className="flex justify-between text-slate-300 mb-4 relative">
          {Array.from({ length: 13 }).map((_, i) => (
            <div key={i} className="text-sm">
              {((shift === 'day' ? 5 : 17) + i) % 24}:00
            </div>
          ))}
          {/* Grid lines */}
          <div className="absolute inset-0 top-6 grid grid-cols-12 gap-0 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="border-l border-slate-700/30 h-full"
              />
            ))}
          </div>
        </div>

        {/* Timeline items */}
        <div className="space-y-2">
          {timelineItems.map((item) => (
            <div
              key={item.record.id}
              className="relative h-16"
            >
              <button
                onClick={() => onRecordClick(item.record)}
                className="absolute h-full transition-all duration-300 ease-in-out group"
                style={{
                  left: `${item.left}%`,
                  width: `${item.width}%`
                }}
              >
                <div className={`
                  h-full rounded-md p-2 text-xs text-white truncate
                  transition-all duration-200
                  ${item.record.endTime 
                    ? 'bg-emerald-600/40 border border-emerald-500/50 hover:bg-emerald-600/50'
                    : 'bg-indigo-600/40 border border-indigo-500/50 hover:bg-indigo-600/50'
                  }
                  ${item.record.causedDowntime ? 'border-red-500 border-2' : ''}
                `}>
                  <div className="font-medium mb-1">{item.record.description}</div>
                  <div className="text-slate-200">
                    {formatTime(new Date(item.record.startTime))}
                    {item.record.endTime && ` - ${formatTime(new Date(item.record.endTime))}`}
                  </div>
                </div>

                {/* Hover tooltip */}
                <div className="absolute bottom-full left-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  <div className="bg-slate-800 text-white text-xs rounded-lg shadow-lg p-2 whitespace-nowrap">
                    <div className="font-medium">{item.record.description}</div>
                    <div className="text-slate-300 mt-1">Location: {item.record.location}</div>
                    <div className="text-slate-300">Tech: {item.record.technician}</div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}