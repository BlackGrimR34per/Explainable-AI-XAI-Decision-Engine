import { useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import CustomerView from './components/views/CustomerView';
import OfficerView from './components/views/OfficerView';
import RegulatorView from './components/views/RegulatorView';
import { mockApplications } from './data/mockData';

const PERSONAS = {
  customer: { label: 'Customer', icon: '👤', component: CustomerView },
  officer: { label: 'Loan Officer', icon: '💼', component: OfficerView },
  regulator: { label: 'Regulator', icon: '🏛️', component: RegulatorView },
};

export default function App() {
  const [activePersona, setActivePersona] = useState('customer');
  const [selectedApplication, setSelectedApplication] = useState(mockApplications[0]);
  const [whatIfValues, setWhatIfValues] = useState(null);

  const ActiveView = PERSONAS[activePersona].component;

  // Reset what-if when application changes
  const handleApplicationChange = (app) => {
    setSelectedApplication(app);
    setWhatIfValues(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <Header
          personas={PERSONAS}
          activePersona={activePersona}
          onPersonaChange={setActivePersona}
        />

        <div className="flex">
          <Sidebar
            applications={mockApplications}
            selectedApplication={selectedApplication}
            onSelect={handleApplicationChange}
          />

          <main className="flex-1 p-6 ml-72">
            <ActiveView
              application={selectedApplication}
              whatIfValues={whatIfValues}
              onWhatIfChange={setWhatIfValues}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
