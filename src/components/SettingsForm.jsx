import {
  DISCIPLINE_OPTIONS,
  HAZARD_OPTIONS,
  OCCUPANCY_OPTIONS,
  SPRINKLER_STANDARD_OPTIONS,
  STANDARD_OPTIONS,
  SYSTEM_TYPE_OPTIONS,
} from '../constants/fireDesignOptions';

function SettingsForm({ settings, onUpdateSetting }) {
  const selectedHazard = HAZARD_OPTIONS.find(
    (option) => option.value === settings.hazard_class,
  );

  const selectedSprinklerProfile = SPRINKLER_STANDARD_OPTIONS.find(
    (option) => option.value === settings.sprinkler_standard_profile,
  );

  return (
    <>
      <label>
        <span>Module</span>
        <select
          value={settings.discipline}
          onChange={(event) => onUpdateSetting('discipline', event.target.value)}
        >
          {DISCIPLINE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="two-col">
        <label>
          <span>Standard basis</span>
          <select
            value={settings.standard}
            onChange={(event) => onUpdateSetting('standard', event.target.value)}
          >
            {STANDARD_OPTIONS.map((standard) => (
              <option key={standard} value={standard}>
                {standard}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Sprinkler workflow</span>
          <select
            value={settings.sprinkler_standard_profile}
            onChange={(event) =>
              onUpdateSetting('sprinkler_standard_profile', event.target.value)
            }
          >
            {SPRINKLER_STANDARD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {selectedSprinklerProfile?.helper && (
        <div className="accuracy-note small-note">
          <strong>Sprinkler workflow note</strong>
          <span>{selectedSprinklerProfile.helper}</span>
        </div>
      )}

      <div className="two-col">
        <label>
          <span>Occupancy type</span>
          <select
            value={settings.occupancy_type}
            onChange={(event) => onUpdateSetting('occupancy_type', event.target.value)}
          >
            {OCCUPANCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Hazard / design profile</span>
          <select
            value={settings.hazard_class}
            onChange={(event) => onUpdateSetting('hazard_class', event.target.value)}
          >
            {HAZARD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {selectedHazard?.helper && (
        <div className="accuracy-note small-note">
          <strong>Hazard note</strong>
          <span>{selectedHazard.helper}</span>
        </div>
      )}

      <div className="two-col">
        <label>
          <span>Scale metres per pixel</span>
          <input
            type="number"
            min="0.001"
            max="5"
            step="0.001"
            value={settings.metres_per_pixel}
            onChange={(event) => onUpdateSetting('metres_per_pixel', event.target.value)}
          />
        </label>

        <label>
          <span>Minimum room area m²</span>
          <input
            type="number"
            min="1"
            max="100"
            step="1"
            value={settings.min_room_area}
            onChange={(event) => onUpdateSetting('min_room_area', event.target.value)}
          />
        </label>
      </div>

      <div className="two-col">
        <label>
          <span>Socket / device spacing helper m</span>
          <input
            type="number"
            min="1"
            max="20"
            step="0.5"
            value={settings.socket_spacing}
            onChange={(event) => onUpdateSetting('socket_spacing', event.target.value)}
          />
        </label>

        <label>
          <span>Sprinkler system type</span>
          <select
            value={settings.system_type}
            onChange={(event) => onUpdateSetting('system_type', event.target.value)}
          >
            {SYSTEM_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="accuracy-note">
        <strong>Accuracy tip</strong>
        <span>
          For 9/10 accuracy, use DXF with clean WALL/ROOM/DOOR layers or a
          high-resolution PNG/JPG with visible room names and area labels.
        </span>
      </div>

      <div className="accuracy-note">
        <strong>FireDesign-style output</strong>
        <span>
          The backend can now return Ceasefire mapped BOM, updated DXF and export ZIP.
          Final output still requires engineer/AHJ review.
        </span>
      </div>
    </>
  );
}

export default SettingsForm;