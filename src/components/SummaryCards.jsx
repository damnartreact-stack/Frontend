import { MODULE_CARDS } from '../constants/fireDesignOptions';
import { getAccuracyScore } from '../utils/formatters';

function getDownloadStatus(result, key) {
  const downloads = result?.downloads || {};

  if (key === 'ceasefire_bom') {
    return Boolean(downloads.ceasefire_bom_csv || result?.report?.ceasefire_bom?.length);
  }

  if (key === 'updated_dxf') {
    return Boolean(downloads.updated_dxf?.content_base64);
  }

  if (key === 'export_zip') {
    return Boolean(downloads.export_package_zip?.content_base64);
  }

  return false;
}

function yesNo(value) {
  return value ? 'Yes' : 'No';
}

function SummaryCards({ result, settings }) {
  const summary = result?.report?.summary;

  if (!summary) return null;

  const selectedModule =
    MODULE_CARDS.find((module) => module.key === settings.discipline) || MODULE_CARDS[0];

  const accuracyScore = getAccuracyScore(result);

  const hasCeasefireBom = getDownloadStatus(result, 'ceasefire_bom');
  const hasUpdatedDxf = getDownloadStatus(result, 'updated_dxf');
  const hasExportZip = getDownloadStatus(result, 'export_zip');

  return (
    <div className="summary-grid">
      <div>
        <span>Accuracy</span>
        <strong>{accuracyScore}</strong>
      </div>

      <div>
        <span>Rooms</span>
        <strong>{summary.rooms ?? 0}</strong>
      </div>

      <div>
        <span>Devices / heads</span>
        <strong>{summary.devices ?? 0}</strong>
      </div>

      <div>
        <span>Routes</span>
        <strong>{summary.routes ?? 0}</strong>
      </div>

      <div>
        <span>Checks</span>
        <strong>
          {summary.checks_passed ?? 0}/{summary.checks_total ?? 0}
        </strong>
      </div>

      <div>
        <span>Review gates</span>
        <strong>{summary.checks_review ?? 0}</strong>
      </div>

      <div>
        <span>Route length</span>
        <strong>{summary.route_length_m ?? 0} m</strong>
      </div>

      <div>
        <span>Module</span>
        <strong>{selectedModule.title}</strong>
      </div>

      <div>
        <span>Ceasefire BOM</span>
        <strong>{yesNo(hasCeasefireBom)}</strong>
      </div>

      <div>
        <span>Updated DXF</span>
        <strong>{yesNo(hasUpdatedDxf)}</strong>
      </div>

      <div>
        <span>Export ZIP</span>
        <strong>{yesNo(hasExportZip)}</strong>
      </div>

      <div>
        <span>Sprinkler profile</span>
        <strong>{settings.sprinkler_standard_profile || 'nfpa_13'}</strong>
      </div>
    </div>
  );
}

export default SummaryCards;