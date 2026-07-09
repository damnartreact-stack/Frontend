import { Download, FileJson, TableProperties } from 'lucide-react';

import { RESULT_TABS } from '../constants/fireDesignOptions';
import {
  downloadCsv,
  downloadDxfPayload,
  downloadImage,
  downloadJson,
  downloadReport,
  downloadSvg,
  downloadZipPayload,
} from '../utils/downloads';
import { getRoomName, statusClass, statusLabel } from '../utils/formatters';

import DataTable from './DataTable';
import ReviewWarnings from './ReviewWarnings';



function JsonBlock({ title, value }) {
  if (!value) return null;

  return (
    <>
      <h2>{title}</h2>
      <pre className="summary-json">{JSON.stringify(value, null, 2)}</pre>
    </>
  );
}

function StatusBadge({ label, status }) {
  if (!status) return null;

  const statusText =
    typeof status === 'string'
      ? status
      : status.status || status.message || status.available || 'available';

  return (
    <div className="accuracy-note small-note">
      <strong>{label}</strong>
      <span>
        {typeof statusText === 'boolean'
          ? statusText
            ? 'Available'
            : 'Not available'
          : String(statusText)}
      </span>
    </div>
  );
}

function ResultTabs({ result, settings, activeTab, onTabChange }) {
  const report = result?.report || {};
  const downloads = result?.downloads || {};

  const visibleChecks = report.compliance_checks || [];
  const hydraulicRows = report.hydraulic?.nodes || [];
  const roomRows = report.rooms || [];
  const warnings = report.warnings || [];
  const ceasefireBomRows = report.ceasefire_bom || [];

  const hasAnnotatedPng = Boolean(result?.annotated_png);
  const hasSvg = Boolean(downloads.svg);
  const hasReport = Boolean(downloads.engineering_report_txt);
  const hasJson = Boolean(downloads.report_json);
  const hasBom = Boolean(downloads.bom_csv || report.bom?.length);
  const hasCalcCsv = Boolean(downloads.hydraulic_csv || hydraulicRows.length);
  const hasCeasefireBom = Boolean(downloads.ceasefire_bom_csv || ceasefireBomRows.length);
  const hasUpdatedDxf = Boolean(downloads.updated_dxf?.content_base64);
  const hasExportZip = Boolean(downloads.export_package_zip?.content_base64);

  return (
    <>
      <div className="actions">
        <button
          type="button"
          disabled={!hasAnnotatedPng}
          onClick={() => downloadImage(result.annotated_png)}
          title={hasAnnotatedPng ? 'Download annotated PNG preview' : 'PNG preview not available'}
        >
          <Download size={18} />
          PNG
        </button>

        <button
          type="button"
          disabled={!hasSvg}
          onClick={() => downloadSvg('review_preview.svg', downloads.svg)}
          title={hasSvg ? 'Download SVG preview' : 'SVG preview not available'}
        >
          <Download size={18} />
          SVG
        </button>

        <button
          type="button"
          disabled={!hasReport}
          onClick={() => downloadReport('engineering_report.txt', downloads.engineering_report_txt)}
          title={hasReport ? 'Download engineering report' : 'Report not available'}
        >
          <Download size={18} />
          Report
        </button>

        <button
          type="button"
          disabled={!hasJson}
          onClick={() => downloadJson('design_package.json', downloads.report_json)}
          title={hasJson ? 'Download JSON design package' : 'JSON not available'}
        >
          <FileJson size={18} />
          JSON
        </button>

        <button
          type="button"
          disabled={!hasBom}
          onClick={() => downloadCsv('bom.csv', downloads.bom_csv)}
          title={hasBom ? 'Download standard BOM' : 'BOM not available'}
        >
          <TableProperties size={18} />
          BOM
        </button>

        <button
          type="button"
          disabled={!hasCalcCsv}
          onClick={() => downloadCsv('calculation_schedule.csv', downloads.hydraulic_csv)}
          title={hasCalcCsv ? 'Download calculation schedule' : 'Calculation schedule not available'}
        >
          <TableProperties size={18} />
          Calc CSV
        </button>

        <button
          type="button"
          disabled={!hasCeasefireBom}
          onClick={() => downloadCsv('ceasefire_bom.csv', downloads.ceasefire_bom_csv)}
          title={hasCeasefireBom ? 'Download Ceasefire-style mapped BOM' : 'Ceasefire BOM not available'}
        >
          <TableProperties size={18} />
          Ceasefire BOM
        </button>

        <button
          type="button"
          disabled={!hasUpdatedDxf}
          onClick={() => downloadDxfPayload(downloads.updated_dxf)}
          title={hasUpdatedDxf ? 'Download updated DXF drawing' : 'Updated DXF not available'}
        >
          <Download size={18} />
          Updated DXF
        </button>
        <button
          type="button"
          disabled={!hasExportZip}
          onClick={() => downloadZipPayload(downloads.export_package_zip)}
          title={hasExportZip ? 'Download full export package ZIP' : 'Export ZIP not available'}
          >
  <Download size={18} />
  Export ZIP
        </button>
      </div>

      <div className="result-status-row">
        <StatusBadge label="Ceasefire BOM" status={result.ceasefire_bom_status} />
        <StatusBadge label="DXF Export" status={result.dxf_export_status} />
        <StatusBadge label="Export Package" status={result.export_package_status} />
      </div>

      <div className="tabs">
        {RESULT_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={activeTab === tab.key ? 'active' : ''}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'bom' && (
        <section className="table-wrap">
          <h2>Bill of Materials</h2>
          <DataTable rows={report.bom || []} emptyText="No BOM generated." />

          <h2 className="sub-heading">Ceasefire-Style Mapped BOM</h2>
          <DataTable
            rows={ceasefireBomRows}
            emptyText="No Ceasefire mapped BOM generated. Check backend/bom_mapper.py, backend/routes.py and restart backend."
          />

          {result.ceasefire_bom_status && (
            <>
              <h2 className="sub-heading">Ceasefire BOM Status</h2>
              <pre className="summary-json">
                {JSON.stringify(result.ceasefire_bom_status, null, 2)}
              </pre>
            </>
          )}
        </section>
      )}

      {activeTab === 'checks' && (
        <section className="check-grid">
          {visibleChecks.length === 0 && (
            <p className="muted">No compliance checks returned.</p>
          )}

          {visibleChecks.map((check) => (
            <article
              key={check.id}
              className={`check-card ${statusClass(check.status)}`}
            >
              <span>
                {check.id} · {statusLabel(check.status)}
              </span>
              <h3>{check.name}</h3>
              <p>{check.detail}</p>
              <small>{check.reference}</small>
            </article>
          ))}
        </section>
      )}

      {activeTab === 'hydraulic' && (
        <section className="table-wrap">
          <h2>
            {settings.discipline === 'sprinklers'
              ? 'Hydraulic Schedule'
              : 'MEP Calculation Schedule'}
          </h2>

          <pre className="summary-json">
            {JSON.stringify(report.hydraulic?.summary || {}, null, 2)}
          </pre>

          <DataTable
            rows={hydraulicRows}
            emptyText="No calculation rows returned."
            maxRows={60}
          />
        </section>
      )}

      {activeTab === 'rooms' && (
        <section className="table-wrap">
          <h2>Detected Rooms / Zones</h2>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Room name</th>
                <th>Area class</th>
                <th>Tags</th>
                <th>Area m²</th>
                <th>Area source</th>
                <th>Width m</th>
                <th>Depth m</th>
                <th>Confidence</th>
              </tr>
            </thead>

            <tbody>
              {roomRows.map((room) => (
                <tr key={room.id}>
                  <td>{room.id}</td>
                  <td>{getRoomName(room)}</td>
                  <td>{room.area_class}</td>
                  <td>{Array.isArray(room.tags) ? room.tags.join(', ') : ''}</td>
                  <td>{room.area_m2}</td>
                  <td>{room.area_source || room.detection_method || 'geometry'}</td>
                  <td>{room.width_m}</td>
                  <td>{room.depth_m}</td>
                  <td>{room.confidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {activeTab === 'features' && (
        <section className="table-wrap">
          <JsonBlock title="Image / CAD Feature Analysis" value={report.features || {}} />
          <JsonBlock title="Accuracy Guidance" value={result.accuracy_guidance} />
          <JsonBlock title="Research Brief Alignment" value={result.research_brief_alignment} />
          <JsonBlock title="FireDesign-Style Feature Metadata" value={result.firedesign_style_features} />
          <JsonBlock title="DXF Export Status" value={result.dxf_export_status} />
          <JsonBlock title="CAD Export Metadata" value={result.cad_export} />
          <JsonBlock title="Export Package Status" value={result.export_package_status} />
        </section>
      )}

      {activeTab === 'warnings' && (
        <ReviewWarnings warnings={warnings} />
      )}
    </>
  );
}

export default ResultTabs;