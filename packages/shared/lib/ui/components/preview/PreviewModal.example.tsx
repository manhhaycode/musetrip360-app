import React, { useState } from 'react';
import { PreviewModal } from './PreviewModal';

// Example component demonstrating lazy children mounting
export function PreviewModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [mountLog, setMountLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setMountLog((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const ExpensiveChildComponent = () => {
    React.useEffect(() => {
      addLog('ExpensiveChildComponent mounted');
      return () => addLog('ExpensiveChildComponent unmounted');
    }, []);

    return (
      <div className="p-8 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Expensive Child Component</h3>
        <p className="text-gray-700 mb-4">
          This component simulates an expensive component that should only mount after the modal animation completes.
        </p>

        {/* Simulate expensive operations */}
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="h-8 bg-blue-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">PreviewModal with Lazy Children</h2>
        <p className="text-gray-600 mb-4">
          This example demonstrates the lazy children mounting feature where children only mount after the open
          animation completes and unmount when close starts.
        </p>

        <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Open Modal with Lazy Children
        </button>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Mount/Unmount Log:</h3>
        <div className="bg-gray-100 p-3 rounded-lg max-h-40 overflow-y-auto">
          {mountLog.length === 0 ? (
            <p className="text-gray-500">No events yet...</p>
          ) : (
            mountLog.map((log, i) => (
              <div key={i} className="text-sm font-mono">
                {log}
              </div>
            ))
          )}
        </div>
        <button
          onClick={() => setMountLog([])}
          className="mt-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
        >
          Clear Log
        </button>
      </div>

      {/* Modal with lazy children */}
      <PreviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Lazy Children Demo"
        size="lg"
        lazyChildren={true}
        onOpenComplete={() => addLog('Modal open animation completed')}
        onCloseStart={() => addLog('Modal close animation started')}
      >
        <ExpensiveChildComponent />
      </PreviewModal>

      {/* Regular modal for comparison */}
      <PreviewModal isOpen={false} onClose={() => {}} title="Regular Modal" size="lg" lazyChildren={false}>
        <div className="p-4">
          <p>This is a regular modal where children are always rendered when isOpen is true.</p>
        </div>
      </PreviewModal>
    </div>
  );
}
