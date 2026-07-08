import { useEffect, useMemo, useRef, useState } from 'react';

import {
  analyzeFireDesign,
  buildBackendMessage,
  checkBackendStatus,
  createAnalysisController,
} from './api/fireDesignApi';
import HeroSection from './components/HeroSection';
import ModuleCards from './components/ModuleCards';
import OutputPanel from './components/OutputPanel';
import SettingsForm from './components/SettingsForm';
import UploadPanel from './components/UploadPanel';
import {
  DEFAULT_SETTINGS,
  MODULE_CARDS,
  STANDARD_BY_DISCIPLINE,
  WORKFLOW_STEPS,
} from './constants/fireDesignOptions';
import { getErrorMessage, isDwgFile, safeNumber } from './utils/formatters';

const NUMERIC_SETTING_KEYS = ['metres_per_pixel', 'min_room_area', 'socket_spacing'];

function profileToStandard(profile) {
  if (profile === 'nfpa_13r') return 'NFPA 13R';
  if (profile === 'nfpa_13d') return 'NFPA 13D';
  return 'NFPA 13';
}

function combinedStandardForProfile(profile) {
  return `${profileToStandard(profile)} + NFPA 72 + ASHRAE/NEC/IPC-style workflow`;
}

function applySmartSettingRules(current, key, value) {
  const next = {
    ...current,
    [key]: value,
  };

  if (key === 'discipline') {
    next.standard = STANDARD_BY_DISCIPLINE[value] || current.standard;

    if (value === 'sprinklers' && !next.sprinkler_standard_profile) {
      next.sprinkler_standard_profile = 'nfpa_13';
    }

    if (value === 'full_package') {
      next.sprinkler_standard_profile = current.sprinkler_standard_profile || 'nfpa_13';
    }
  }

  if (key === 'sprinkler_standard_profile') {
    if (next.discipline === 'sprinklers') {
      next.standard = profileToStandard(value);
    }

    if (next.discipline === 'full_package') {
      next.standard = combinedStandardForProfile(value);
    }

    if (value === 'nfpa_13r') {
      next.occupancy_type = current.occupancy_type || 'residential_low_rise';
      next.hazard_class = 'light';
    }

    if (value === 'nfpa_13d') {
      next.occupancy_type = 'residential_low_rise';
      next.hazard_class = 'light';
    }
  }

  if (key === 'standard') {
    if (value === 'NFPA 13') {
      next.sprinkler_standard_profile = 'nfpa_13';
    }

    if (value === 'NFPA 13R') {
      next.sprinkler_standard_profile = 'nfpa_13r';
      next.hazard_class = 'light';
    }

    if (value === 'NFPA 13D') {
      next.sprinkler_standard_profile = 'nfpa_13d';
      next.hazard_class = 'light';
    }
  }

  if (key === 'occupancy_type') {
    if (value === 'warehouse_storage') {
      next.hazard_class = 'ordinary_2';
      next.sprinkler_standard_profile = 'nfpa_13';

      if (next.discipline === 'sprinklers') {
        next.standard = 'NFPA 13';
      }
    }

    if (value === 'retail' || value === 'industrial_light') {
      next.hazard_class = current.hazard_class === 'light' ? 'ordinary_1' : current.hazard_class;
      next.sprinkler_standard_profile = 'nfpa_13';

      if (next.discipline === 'sprinklers') {
        next.standard = 'NFPA 13';
      }
    }

    if (value === 'residential_low_rise') {
      next.hazard_class = 'light';
      next.sprinkler_standard_profile = 'nfpa_13r';

      if (next.discipline === 'sprinklers') {
        next.standard = 'NFPA 13R';
      }
    }

    if (value === 'office_commercial' || value === 'education' || value === 'healthcare_clinic') {
      next.sprinkler_standard_profile = next.sprinkler_standard_profile || 'nfpa_13';
    }
  }

  return next;
}

function App() {
  const analysisControllerRef = useRef(null);

  const [file, setFile] = useState(null);
  const [settings, setSettings] = useState(() => ({ ...DEFAULT_SETTINGS }));
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [apiState, setApiState] = useState({
    status: 'checking',
    message: 'Checking backend connection',
    meta: null,
  });

  const [activeTab, setActiveTab] = useState('bom');

  const selectedModule = useMemo(() => {
    return MODULE_CARDS.find((module) => module.key === settings.discipline) || MODULE_CARDS[0];
  }, [settings.discipline]);

  const backendCapabilities = apiState.meta?.capabilities || {};

  function updateSetting(key, value) {
    setSettings((current) => {
      const parsedValue = NUMERIC_SETTING_KEYS.includes(key)
        ? safeNumber(value, current[key])
        : value;

      return applySmartSettingRules(current, key, parsedValue);
    });
  }

  function handleFileChange(nextFile) {
    setFile(nextFile);
    setResult(null);
    setError('');
    setActiveTab('bom');
  }

  function resetAll() {
    if (analysisControllerRef.current) {
      analysisControllerRef.current.cancel();
      analysisControllerRef.current.clear();
      analysisControllerRef.current = null;
    }

    setFile(null);
    setResult(null);
    setError('');
    setLoading(false);
    setActiveTab('bom');
  }

  function cancelAnalysis() {
    if (analysisControllerRef.current) {
      analysisControllerRef.current.cancel();
    }
  }

  async function checkApi() {
    setApiState({
      status: 'checking',
      message: 'Checking backend connection',
      meta: null,
    });

    try {
      const data = await checkBackendStatus();

      setApiState({
        status: 'connected',
        message: buildBackendMessage(data),
        meta: data,
      });
    } catch (err) {
      setApiState({
        status: 'offline',
        message: 'Backend offline at http://127.0.0.1:8020. Start FastAPI and try again.',
        meta: null,
      });
    }
  }

  useEffect(() => {
    checkApi();

    return () => {
      if (analysisControllerRef.current) {
        analysisControllerRef.current.cancel();
        analysisControllerRef.current.clear();
      }
    };
  }, []);

  async function handleAnalyze(event) {
    event.preventDefault();

    if (!file) {
      setError(
        'Choose a PNG, JPG, JPEG, WEBP, DXF, or DWG floor plan. DXF gives better accuracy than screenshots.',
      );
      return;
    }

    if (isDwgFile(file.name)) {
      setError(
        'DWG is proprietary. Convert DWG to DXF first, or connect a DWG conversion service.',
      );
      return;
    }

    const analysisController = createAnalysisController();
    analysisControllerRef.current = analysisController;

    setLoading(true);
    setError('');
    setResult(null);
    setActiveTab('bom');

    try {
      const data = await analyzeFireDesign({
        file,
        settings,
        signal: analysisController.signal,
      });

      setResult(data);

      setApiState((current) => ({
        ...current,
        status: 'connected',
        message: 'Backend connected · Analysis completed',
      }));
    } catch (err) {
      if (err?.name === 'AbortError') {
        setError('Analysis timed out or was cancelled. Try a smaller image or DXF file.');
      } else {
        setError(getErrorMessage(err?.message || err));
      }
    } finally {
      analysisController.clear();
      analysisControllerRef.current = null;
      setLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <HeroSection
        onUploadClick={() => document.getElementById('file-upload')?.click()}
        onCheckBackend={checkApi}
      />

      <ModuleCards
        selectedDiscipline={settings.discipline}
        onSelectDiscipline={(discipline) => updateSetting('discipline', discipline)}
      />

      <section className="workflow-section">
        <div className="section-heading">
          <span>How it works</span>
          <h2>From floor plan to FireDesign-style review package.</h2>
        </div>

        <div className="workflow-grid">
          {WORKFLOW_STEPS.slice(0, 6).map((step) => (
            <div className="workflow-card" key={step.number}>
              <strong>{step.number}</strong>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>

        {apiState.status === 'connected' && (
          <div className="accuracy-note capability-note">
            <strong>Backend capabilities</strong>
            <span>
              Ceasefire BOM:{' '}
              {backendCapabilities.ceasefire_bom_mapping ? 'available' : 'not available'} ·
              Updated DXF:{' '}
              {backendCapabilities.updated_dxf_export ? 'available' : 'not available'} ·
              Export ZIP:{' '}
              {backendCapabilities.export_package_zip ? 'available' : 'not available'}
            </span>
          </div>
        )}
      </section>

      <section className="workspace">
        <UploadPanel
          file={file}
          apiState={apiState}
          loading={loading}
          error={error}
          onFileChange={handleFileChange}
          onCheckBackend={checkApi}
          onSubmit={handleAnalyze}
          onReset={resetAll}
          onCancel={cancelAnalysis}
        >
          <SettingsForm
            settings={settings}
            selectedModule={selectedModule}
            onUpdateSetting={updateSetting}
          />
        </UploadPanel>

        <OutputPanel
          result={result}
          settings={settings}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </section>
    </main>
  );
}

export default App;