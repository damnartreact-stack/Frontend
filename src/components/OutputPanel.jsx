import { Cable } from 'lucide-react';

import ResultTabs from './ResultTabs';
import SummaryCards from './SummaryCards';

function OutputPanel({ result, settings, activeTab, onTabChange }) {
  const summary = result?.report?.summary || null;
  const pipeline = Array.isArray(result?.report?.pipeline)
    ? result.report.pipeline
    : [];

  const hasResult = Boolean(result);
  const hasSummary = Boolean(summary);
  const hasAnnotatedPreview = Boolean(result?.annotated_png);

  return (
    <section className="output-panel">
      {!hasResult && (
        <div className="empty-state">
          <Cable size={42} />
          <h2>Design output appears here</h2>
          <p>
            Generate a package to view annotated drawings, BOM, Ceasefire mapped BOM,
            calculation schedules, compliance gates, updated DXF, export ZIP and review notes.
          </p>
        </div>
      )}

      {hasResult && (
        <>
          {hasSummary && (
            <SummaryCards result={result} settings={settings} />
          )}

          {!hasSummary && (
            <div className="empty-state compact">
              <Cable size={32} />
              <h2>Report summary not returned</h2>
              <p>
                The backend returned a response, but the summary section was missing.
                Check backend analysis.py and routes.py response structure.
              </p>
            </div>
          )}

          {pipeline.length > 0 && (
            <div className="pipeline-row">
              {pipeline.map((step, index) => (
                <div key={step.step || index}>
                  <strong>{step.step || `STEP ${index + 1}`}</strong>
                  <span>{step.status || 'Completed'}</span>
                  <small>{step.detail || 'No detail returned.'}</small>
                </div>
              ))}
            </div>
          )}

          {hasAnnotatedPreview && (
            <div className="layout-view">
              <img src={result.annotated_png} alt="Annotated FireDesign layout" />
            </div>
          )}

          {!hasAnnotatedPreview && (
            <div className="empty-state compact">
              <Cable size={32} />
              <h2>No annotated image returned</h2>
              <p>
                The backend returned a report, but no PNG preview was included.
                You can still check BOM, review gates, JSON, DXF and ZIP outputs below.
              </p>
            </div>
          )}

          <ResultTabs
            result={result}
            settings={settings}
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
        </>
      )}
    </section>
  );
}

export default OutputPanel;