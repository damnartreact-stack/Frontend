import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

function normalizeWarning(warning) {
  if (typeof warning === 'string') {
    return {
      type: 'warning',
      title: 'Review note',
      detail: warning,
    };
  }

  if (typeof warning === 'object' && warning !== null) {
    return {
      type: warning.type || warning.level || warning.status || 'warning',
      title: warning.title || warning.name || warning.category || 'Review note',
      detail: warning.detail || warning.message || warning.reason || JSON.stringify(warning),
      reference: warning.reference || warning.standard || '',
    };
  }

  return {
    type: 'warning',
    title: 'Review note',
    detail: String(warning),
  };
}

function getIcon(type) {
  const value = String(type || '').toLowerCase();

  if (value.includes('pass') || value.includes('ok')) {
    return <CheckCircle2 size={16} />;
  }

  if (value.includes('info') || value.includes('note')) {
    return <Info size={16} />;
  }

  return <AlertTriangle size={16} />;
}

function ReviewWarnings({ warnings }) {
  const items = Array.isArray(warnings) ? warnings.map(normalizeWarning) : [];

  return (
    <section className="warning-list">
      <h2>Review Notes</h2>

      {items.length === 0 && (
        <p className="muted">No warnings returned.</p>
      )}

      {items.map((warning, index) => (
        <p key={`${warning.title}-${index}`}>
          {getIcon(warning.type)}

          <span>
            <strong>{warning.title}</strong>
            <br />
            {warning.detail}

            {warning.reference && (
              <>
                <br />
                <small>{warning.reference}</small>
              </>
            )}
          </span>
        </p>
      ))}
    </section>
  );
}

export default ReviewWarnings;