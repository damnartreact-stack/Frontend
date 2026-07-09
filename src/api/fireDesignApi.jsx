export const API_BASE_URL = 'https://backend-x6uw.onrender.com';

const ANALYSIS_TIMEOUT_MS = 180000;

function parseBackendError(error) {
  if (!error) return 'Analysis failed.';

  if (typeof error === 'string') return error;

  if (Array.isArray(error)) {
    return error
      .map((item) => item?.msg || item?.message || item?.reason || JSON.stringify(item))
      .join(' | ');
  }

  if (typeof error === 'object') {
    if (error.message && error.reason) {
      const recommendedFix = Array.isArray(error.recommended_fix)
        ? `\n\nRecommended fix:\n${error.recommended_fix.map((item) => `• ${item}`).join('\n')}`
        : '';

      return `${error.message}: ${error.reason}${recommendedFix}`;
    }

    if (error.detail) return parseBackendError(error.detail);
    if (error.message) return error.message;
    if (error.reason) return error.reason;
    if (error.error) return parseBackendError(error.error);

    return JSON.stringify(error, null, 2);
  }

  return String(error);
}

export async function checkBackendStatus() {
  const response = await fetch(`${API_BASE_URL}/api/status`, {
    method: 'GET',
  });

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

  const formData = new FormData();
  formData.append('file', file);

  Object.entries(settings).forEach(([key, value]) => {
    formData.append(key, String(value));
  });

  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    body: formData,
    signal,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(parseBackendError(data.detail || data));
  }

  return data;
}

export function createAnalysisController() {
  const controller = new AbortController();

  const timeout = window.setTimeout(() => {
    controller.abort();
  }, ANALYSIS_TIMEOUT_MS);

  return {
    controller,
    signal: controller.signal,
    cancel: () => controller.abort(),
    clear: () => window.clearTimeout(timeout),
  };
}

export function buildBackendMessage(data) {
  return `${data?.service || 'Backend'} · ${
    Array.isArray(data?.accepted_files)
      ? data.accepted_files.join(', ').toUpperCase()
      : 'FILES OK'
  }`;
}