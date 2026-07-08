export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8020';

export const API_TIMEOUT_MS = 180000;

export const ACCEPTED_FILE_TYPES = '.png,.jpg,.jpeg,.webp,.bmp,.tif,.tiff,.dxf,.dwg';

export const DEFAULT_SETTINGS = {
  discipline: 'full_package',
  standard: 'NFPA 13 + NFPA 72 + ASHRAE/NEC/IPC-style workflow',
  sprinkler_standard_profile: 'nfpa_13',
  occupancy_type: 'office_commercial',
  hazard_class: 'light',
  system_type: 'wet_pipe',
  metres_per_pixel: 0.01,
  min_room_area: 4,
  socket_spacing: 4,
};

export const STANDARD_BY_DISCIPLINE = {
  full_package: 'NFPA 13 + NFPA 72 + ASHRAE/NEC/IPC-style workflow',
  sprinklers: 'NFPA 13',
  fire_alarm: 'NFPA 72',
  hvac: 'ASHRAE-style workflow',
  electrical: 'NEC-style workflow',
  plumbing: 'IPC/NPC-style workflow',
};

export const SPRINKLER_STANDARD_OPTIONS = [
  {
    value: 'nfpa_13',
    label: 'NFPA 13 - Commercial sprinkler workflow',
    helper: 'Best for office, commercial, retail, warehouse and mixed-use feasibility review.',
  },
  {
    value: 'nfpa_13r',
    label: 'NFPA 13R - Residential low-rise workflow',
    helper: 'Use only when the building is confirmed as residential low-rise.',
  },
  {
    value: 'nfpa_13d',
    label: 'NFPA 13D - One/two-family dwelling workflow',
    helper: 'Use only for small dwelling proof-of-concept cases.',
  },
];

export const OCCUPANCY_OPTIONS = [
  {
    value: 'office_commercial',
    label: 'Office / Commercial',
  },
  {
    value: 'retail',
    label: 'Retail / Showroom',
  },
  {
    value: 'warehouse_storage',
    label: 'Warehouse / Storage',
  },
  {
    value: 'residential_low_rise',
    label: 'Residential low-rise',
  },
  {
    value: 'hospitality',
    label: 'Hotel / Hospitality',
  },
  {
    value: 'education',
    label: 'School / Training / Education',
  },
  {
    value: 'healthcare_clinic',
    label: 'Clinic / Healthcare',
  },
  {
    value: 'industrial_light',
    label: 'Light Industrial',
  },
];

export const MODULE_CARDS = [
  {
    key: 'full_package',
    title: 'Full MEP + Fire',
    badge: 'Recommended',
    text: 'One-click sprinkler, fire alarm, HVAC, electrical and plumbing feasibility package with review warnings, BOM and CAD export.',
  },
  {
    key: 'sprinklers',
    title: 'Sprinklers',
    badge: 'FireDesign-style',
    text: 'Head layout, riser seed, pipe routing, preliminary hydraulic schedule, pipe/fitting takeoff and NFPA-style review gates.',
  },
  {
    key: 'fire_alarm',
    title: 'Fire Alarms',
    badge: 'Automated',
    text: 'Smoke/heat detectors, MCPs, horn/strobes, extinguishers, signage, FACP and SLC/NAC cable routes.',
  },
  {
    key: 'hvac',
    title: 'HVAC',
    badge: 'Automated Seed',
    text: 'Diffusers, returns, exhaust, AHU seed, duct lengths and preliminary load placeholder.',
  },
  {
    key: 'electrical',
    title: 'Electrical',
    badge: 'Automated Seed',
    text: 'Lights, switches, sockets, DB seed, circuit lengths and connected-load placeholder.',
  },
  {
    key: 'plumbing',
    title: 'Plumbing',
    badge: 'Automated Seed',
    text: 'Wet-area fixtures, riser seed, water pipe and drainage route quantities.',
  },
];

export const WORKFLOW_STEPS = [
  {
    number: '001',
    title: 'Upload',
    text: 'Upload a DXF, DWG or raster floor plan. DWG is guided to conversion; DXF/raster files are processed directly.',
  },
  {
    number: '002',
    title: 'Validate',
    text: 'The backend checks file type, size, scale input, discipline, hazard profile, sprinkler workflow and system type.',
  },
  {
    number: '003',
    title: 'Detect',
    text: 'Rooms, boundaries, labels, area text, wet rooms, electrical/server/stair/store zones and route corridors are inferred.',
  },
  {
    number: '004',
    title: 'Generate',
    text: 'Sprinklers, alarms, HVAC, electrical and plumbing devices are placed using room classification, area and review-gate logic.',
  },
  {
    number: '005',
    title: 'Review',
    text: 'Compliance/review gates, warnings, calculation schedules and engineering notes are generated for manual review.',
  },
  {
    number: '006',
    title: 'Export',
    text: 'Download PNG, SVG, report, JSON, standard BOM, Ceasefire BOM, updated DXF and full ZIP package.',
  },
];

export const RESULT_TABS = [
  { key: 'bom', label: 'BOM' },
  { key: 'checks', label: 'Checks' },
  { key: 'hydraulic', label: 'Calc schedule' },
  { key: 'rooms', label: 'Rooms' },
  { key: 'features', label: 'Features' },
  { key: 'warnings', label: 'Warnings' },
];

export const STANDARD_OPTIONS = [
  'NFPA 13 + NFPA 72 + ASHRAE/NEC/IPC-style workflow',
  'NFPA 13',
  'NFPA 13R',
  'NFPA 13D',
  'NFPA 72',
  'ASHRAE-style workflow',
  'SMACNA-style workflow',
  'NEC-style workflow',
  'IEC-style workflow',
  'IPC/NPC-style workflow',
  'NBC-style workflow',
];

export const HAZARD_OPTIONS = [
  {
    value: 'light',
    label: 'Light Hazard',
    helper: 'Typical offices, reception, meeting rooms, corridors and low-combustibility rooms.',
  },
  {
    value: 'ordinary_1',
    label: 'Ordinary Hazard Group 1',
    helper: 'Moderate combustible loading such as light storage, service areas and back-of-house rooms.',
  },
  {
    value: 'ordinary_2',
    label: 'Ordinary Hazard Group 2',
    helper: 'Higher ordinary hazard areas such as warehouse, dense storage, loading and higher heat-release spaces.',
  },
];

export const SYSTEM_TYPE_OPTIONS = [
  { value: 'wet_pipe', label: 'Wet pipe' },
  { value: 'dry_pipe', label: 'Dry pipe' },
  { value: 'preaction', label: 'Pre-action' },
  { value: 'deluge', label: 'Deluge' },
];

export const DISCIPLINE_OPTIONS = [
  { value: 'full_package', label: 'Full MEP + Fire Package' },
  { value: 'sprinklers', label: 'Sprinklers only' },
  { value: 'fire_alarm', label: 'Fire Alarms only' },
  { value: 'hvac', label: 'HVAC only' },
  { value: 'electrical', label: 'Electrical only' },
  { value: 'plumbing', label: 'Plumbing only' },
];

export const DOWNLOAD_ACTIONS = [
  {
    key: 'png',
    label: 'PNG',
    description: 'Annotated layout preview',
  },
  {
    key: 'svg',
    label: 'SVG',
    description: 'Vector preview',
  },
  {
    key: 'report',
    label: 'Report',
    description: 'Engineering review text',
  },
  {
    key: 'json',
    label: 'JSON',
    description: 'Full design package data',
  },
  {
    key: 'bom',
    label: 'BOM',
    description: 'Standard backend BOM CSV',
  },
  {
    key: 'ceasefire_bom',
    label: 'Ceasefire BOM',
    description: 'Mapped product-code and price CSV',
  },
  {
    key: 'dxf',
    label: 'Updated DXF',
    description: 'CAD export with CEASEFIRE layers',
  },
  {
    key: 'zip',
    label: 'Export ZIP',
    description: 'Complete deliverable package',
  },
];

export const FIREDESIGN_COMPARISON_POINTS = [
  {
    feature: 'DXF/DWG workflow',
    status: 'partial',
    ourProject: 'DXF supported; DWG requires conversion guidance.',
  },
  {
    feature: 'Sprinkler layout',
    status: 'implemented',
    ourProject: 'Rule-based head placement, riser seed, pipe routes and preliminary hydraulic schedule.',
  },
  {
    feature: 'Hydraulic analysis',
    status: 'partial',
    ourProject: 'Preliminary calculation schedule only. Production needs true hydraulic solver.',
  },
  {
    feature: 'Compliance checks',
    status: 'partial',
    ourProject: 'Fail-closed review gates and warnings. Jurisdiction-specific approval rules are future scope.',
  },
  {
    feature: 'BOM/material list',
    status: 'implemented',
    ourProject: 'Standard BOM and Ceasefire-style mapped BOM with dummy product codes/prices.',
  },
  {
    feature: 'CAD export',
    status: 'implemented_poc',
    ourProject: 'Updated DXF with CEASEFIRE layers and POC symbols. Official blocks are future scope.',
  },
  {
    feature: 'Export package',
    status: 'implemented',
    ourProject: 'ZIP package contains preview, report, BOMs, JSON and updated DXF when available.',
  },
];

export const REVIEW_STATUS_LABELS = {
  pass: 'Pass',
  passed: 'Pass',
  ok: 'OK',
  warning: 'Warning',
  review: 'Review',
  fail: 'Fail',
  failed: 'Fail',
  blocked: 'Blocked',
};