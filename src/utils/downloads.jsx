export function downloadText(name, type, text) {
  const blob = new Blob([text || ''], { type });
  downloadBlob(name, blob);
}

export function downloadImage(dataUrl, fileName = 'review_ready_layout.png') {
  if (!dataUrl) return;

  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function downloadJson(name, data) {
  const text = typeof data === 'string' ? data : JSON.stringify(data || {}, null, 2);
  downloadText(name, 'application/json;charset=utf-8', text);
}

export function downloadCsv(name, csvText) {
  downloadText(name, 'text/csv;charset=utf-8', csvText || '');
}

export function downloadSvg(name, svgText) {
  downloadText(name, 'image/svg+xml;charset=utf-8', svgText || '');
}

export function downloadReport(name, reportText) {
  downloadText(name, 'text/plain;charset=utf-8', reportText || '');
}

export function cleanBase64(base64) {
  if (!base64) return '';

  const text = String(base64).trim();

  if (text.includes(',') && text.toLowerCase().startsWith('data:')) {
    return text.split(',').pop();
  }

  return text;
}

export function base64ToBlob(base64, mimeType = 'application/octet-stream') {
  const cleanValue = cleanBase64(base64);

  if (!cleanValue) {
    return new Blob([], { type: mimeType });
  }

  try {
    const byteCharacters = window.atob(cleanValue);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);

      for (let index = 0; index < slice.length; index += 1) {
        byteNumbers[index] = slice.charCodeAt(index);
      }

      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: mimeType });
  } catch (error) {
    console.error('Could not decode base64 download payload:', error);
    return new Blob([], { type: mimeType });
  }
}

export function downloadBlob(name, blob) {
  if (!blob) return;

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = name || 'download.bin';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

export function downloadBase64File({
  fileName = 'download.bin',
  base64,
  mimeType = 'application/octet-stream',
}) {
  if (!base64) return;

  const blob = base64ToBlob(base64, mimeType);
  downloadBlob(fileName, blob);
}

export function downloadBase64Payload(payload, fallbackName = 'download.bin') {
  if (!payload?.content_base64) return;

  downloadBase64File({
    fileName: payload.filename || fallbackName,
    base64: payload.content_base64,
    mimeType: payload.mime_type || 'application/octet-stream',
  });
}

export function downloadDxfPayload(payload) {
  if (!payload?.content_base64) return;

  downloadBase64Payload(payload, 'ceasefire_updated_layout.dxf');
}

export function downloadDxfBase64(
  base64,
  fileName = 'ceasefire_updated_layout.dxf',
) {
  downloadBase64File({
    fileName,
    base64,
    mimeType: 'application/dxf',
  });
}

export function downloadZipPayload(payload) {
  if (!payload?.content_base64) return;

  downloadBase64Payload(payload, 'firedesign_ceasefire_export_package.zip');
}

export function downloadExportPackagePayload(payload) {
  downloadZipPayload(payload);
}

export function downloadNamedPayload(payload, fallbackName = 'download.bin') {
  if (!payload) return;

  if (payload.content_base64) {
    downloadBase64Payload(payload, fallbackName);
    return;
  }

  if (payload.text) {
    downloadText(payload.filename || fallbackName, payload.mime_type || 'text/plain', payload.text);
    return;
  }

  if (payload.json) {
    downloadJson(payload.filename || fallbackName, payload.json);
  }
}