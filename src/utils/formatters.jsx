export function normalizeStatus(status) {
  const text = String(status || '').toLowerCase().trim();

  if (['pass', 'passed', 'ok', 'complete', 'completed', 'available', 'true'].includes(text)) {
    return 'pass';
  }

  if (['fail', 'failed', 'error', 'blocked', 'missing', 'not_available', 'false'].includes(text)) {
    return 'fail';
  }

  return 'review';
}

export function statusLabel(status) {
  const normalized = normalizeStatus(status);

  if (normalized === 'pass') return 'Pass';
  if (normalized === 'fail') return 'Fail';

  return 'Review';
}

export function statusClass(status) {
  return normalizeStatus(status);
}

export function formatBytes(bytes) {
  if (!bytes) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  let value = Number(bytes);
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export function safeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function formatNumber(value, digits = 2) {
  const number = safeNumber(value, null);

  if (number === null) return '';

  return number.toLocaleString('en-IN', {
    maximumFractionDigits: digits,
  });
}

export function formatMetres(value) {
  const number = safeNumber(value, 0);
  return `${formatNumber(number, 2)} m`;
}

export function formatCurrency(value, currency = 'INR') {
  const number = safeNumber(value, 0);

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(number);
}

export function getErrorMessage(detail) {
  if (!detail) return 'Analysis failed.';

  if (typeof detail === 'string') return detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item) => item?.msg || item?.message || item?.reason || JSON.stringify(item))
      .join(' | ');
  }

  if (typeof detail === 'object') {
    if (detail.message && detail.reason) {
      const fixes = Array.isArray(detail.recommended_fix)
        ? `\n\nRecommended fix:\n${detail.recommended_fix.map((item) => `• ${item}`).join('\n')}`
        : '';

      return `${detail.message}: ${detail.reason}${fixes}`;
    }

    if (detail.detail) return getErrorMessage(detail.detail);
    if (detail.message) return detail.message;
    if (detail.reason) return detail.reason;
    if (detail.error) return getErrorMessage(detail.error);

    return JSON.stringify(detail, null, 2);
  }

  return String(detail);
}

export function getRoomName(room) {
  return (
    room?.display_name ||
    room?.room_name ||
    room?.name ||
    room?.label ||
    room?.zone ||
    room?.id ||
    'Room'
  );
}

export function isRasterFile(fileName = '') {
  return /\.(png|jpg|jpeg|webp|bmp|tif|tiff)$/i.test(fileName);
}

export function isDxfFile(fileName = '') {
  return /\.dxf$/i.test(fileName);
}

export function isDwgFile(fileName = '') {
  return /\.dwg$/i.test(fileName);
}

export function isSupportedFile(fileName = '') {
  return /\.(png|jpg|jpeg|webp|bmp|tif|tiff|dxf|dwg)$/i.test(fileName);
}

export function getAccuracyScore(result) {
  const direct =
    result?.report?.accuracy?.score ||
    result?.report?.summary?.accuracy_score ||
    result?.accuracy_score ||
    result?.report?.score;

  if (direct) return direct;

  const summary = result?.report?.summary;

  if (!summary) return 'Review';

  const total = safeNumber(summary.checks_total);
  const passed = safeNumber(summary.checks_passed);
  const review = safeNumber(summary.checks_review);
  const failed = safeNumber(summary.checks_failed);

  if (!total) return 'Review';

  const rawScore = (passed / total) * 10 - review * 0.15 - failed * 0.5;
  const score = Math.max(0, Math.min(10, rawScore));

  return `${score.toFixed(1)} / 10`;
}

export function getDownloadAvailability(result) {
  const downloads = result?.downloads || {};
  const report = result?.report || {};

  return {
    png: Boolean(result?.annotated_png),
    svg: Boolean(downloads.svg),
    report: Boolean(downloads.engineering_report_txt),
    json: Boolean(downloads.report_json),
    bom: Boolean(downloads.bom_csv || report.bom?.length),
    calculationCsv: Boolean(downloads.hydraulic_csv || report.hydraulic?.nodes?.length),
    ceasefireBom: Boolean(downloads.ceasefire_bom_csv || report.ceasefire_bom?.length),
    updatedDxf: Boolean(downloads.updated_dxf?.content_base64),
    exportZip: Boolean(downloads.export_package_zip?.content_base64),
  };
}

export function yesNo(value) {
  return value ? 'Yes' : 'No';
}

export function toCellValue(value) {
  if (value === null || value === undefined) return '';

  if (typeof value === 'boolean') {
    return yesNo(value);
  }

  if (typeof value === 'number') {
    return formatNumber(value, 3);
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

export function getFileInfo(file) {
  if (!file) return null;

  return {
    name: file.name,
    size: formatBytes(file.size),
    type: file.type || 'unknown',
    isRaster: isRasterFile(file.name),
    isDxf: isDxfFile(file.name),
    isDwg: isDwgFile(file.name),
    isSupported: isSupportedFile(file.name),
  };
}