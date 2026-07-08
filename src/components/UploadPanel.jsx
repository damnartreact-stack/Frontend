import { ImageUp, RotateCcw, Upload, Wifi, WifiOff } from 'lucide-react';

import { ACCEPTED_FILE_TYPES } from '../constants/fireDesignOptions';
import { getFileInfo } from '../utils/formatters';

function getModeLabel(fileInfo) {
  if (!fileInfo) return '';

  if (fileInfo.isDwg) {
    return 'DWG conversion required';
  }

  if (fileInfo.isDxf) {
    return 'CAD geometry mode';
  }

  if (fileInfo.isRaster) {
    return 'Raster OCR mode';
  }

  return 'Unsupported file type';
}

function UploadPanel({
  file,
  apiState,
  loading,
  error,
  onFileChange,
  onCheckBackend,
  onSubmit,
  onReset,
  onCancel,
  children,
}) {
  const fileInfo = getFileInfo(file);
  const modeLabel = getModeLabel(fileInfo);

  return (
    <aside className="control-panel" aria-label="Analysis controls">
      <div className="brand">
        <Upload size={22} />

        <div>
          <h2>Design Console</h2>
          <p>
            Configure the design basis, upload the plan and generate the
            FireDesign-style review package.
          </p>
        </div>
      </div>

      <div className={`connection ${apiState.status}`}>
        {apiState.status === 'offline' ? <WifiOff size={18} /> : <Wifi size={18} />}

        <div>
          <strong>
            {apiState.status === 'connected'
              ? 'Connected'
              : apiState.status === 'offline'
                ? 'Offline'
                : 'Checking'}
          </strong>

          <span>{apiState.message}</span>
        </div>

        <button
          type="button"
          className="icon-button"
          onClick={onCheckBackend}
          aria-label="Check backend connection"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="controls">
        <label className="upload-zone">
          <ImageUp size={32} />

          <span>{file ? file.name : 'Upload DXF, PNG, JPG, WEBP'}</span>

          <small>
            DXF gives highest accuracy. PNG/JPG works best with clear room names,
            room boundaries and area labels.
          </small>

          {fileInfo && (
            <small>
              {fileInfo.size} · {modeLabel}
            </small>
          )}

          {fileInfo?.isDwg && (
            <small>
              DWG is proprietary. Convert it to DXF before analysis.
            </small>
          )}

          {fileInfo && !fileInfo.isSupported && (
            <small>
              This file type is not supported. Use DXF, PNG, JPG, JPEG, WEBP, BMP,
              TIF or TIFF.
            </small>
          )}

          <input
            id="file-upload"
            type="file"
            accept={ACCEPTED_FILE_TYPES}
            onChange={(event) => onFileChange(event.target.files?.[0] || null)}
          />
        </label>

        {children}

        <div className="button-row">
          <button
            type="submit"
            disabled={loading || apiState.status === 'offline'}
            title={
              apiState.status === 'offline'
                ? 'Start backend first, then generate package'
                : 'Generate review package'
            }
          >
            {loading ? <span className="loader-dot" /> : <Upload size={18} />}
            {loading ? 'Generating package' : 'Generate review package'}
          </button>

          {loading ? (
            <button type="button" className="ghost" onClick={onCancel}>
              <RotateCcw size={18} />
              Cancel
            </button>
          ) : (
            <button type="button" className="ghost" onClick={onReset}>
              <RotateCcw size={18} />
              Reset
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="alert">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}
    </aside>
  );
}

export default UploadPanel;