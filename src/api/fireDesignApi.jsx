import { API_TIMEOUT_MS, API_URL } from '../constants/fireDesignOptions';
import { getErrorMessage } from '../utils/formatters';

export async function checkBackendStatus() {
  const response = await fetch(`${API_URL}/api/status`);

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(`Backend returned ${response.status}`);
  }

  return data;
}

export async function analyzeFireDesign({ file, settings, signal }) {
  if (!file) {
    throw new Error('Please upload a floor plan first.');
  }

  const body = new FormData();
  body.append('file', file);

  Object.entries(settings).forEach(([key, value]) => {
    body.append(key, String(value));
  });

  const response = await fetch(`${API_URL}/api/analyze`, {
    method: 'POST',
    body,
    signal,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(getErrorMessage(data.detail || data));
  }

  return data;
}

export function createAnalysisController() {
  const controller = new AbortController();

  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, API_TIMEOUT_MS);

  return {
    controller,
    signal: controller.signal,
    cancel: () => controller.abort(),
    clear: () => window.clearTimeout(timeoutId),
  };
}

export function buildBackendMessage(data) {
  const service = data?.service || 'Backend';
  const files = Array.isArray(data?.accepted_files)
    ? data.accepted_files.join(', ').toUpperCase()
    : 'FILES OK';

  return `${service} · ${files}`;
}