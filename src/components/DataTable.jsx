import { toCellValue } from '../utils/formatters';

function formatColumnName(key) {
  return String(key)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getRowKey(row, index) {
  return (
    row.id ||
    row.item_code ||
    row.product_code ||
    row.node ||
    row.room ||
    row.room_id ||
    row.device_id ||
    row.route_id ||
    index
  );
}

function DataTable({ rows, emptyText = 'No data available.', maxRows = 100 }) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return <p className="muted">{emptyText}</p>;
  }

  const visibleRows = rows.slice(0, maxRows);

  const columns = Array.from(
    rows.reduce((columnSet, row) => {
      Object.keys(row || {}).forEach((key) => columnSet.add(key));
      return columnSet;
    }, new Set()),
  );

  return (
    <>
      <table>
        <thead>
          <tr>
            {columns.map((key) => (
              <th key={key}>{formatColumnName(key)}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {visibleRows.map((row, index) => (
            <tr key={getRowKey(row, index)}>
              {columns.map((key) => (
                <td key={key}>{toCellValue(row?.[key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {rows.length > maxRows && (
        <p className="muted">
          Showing first {maxRows} of {rows.length} rows.
        </p>
      )}
    </>
  );
}

export default DataTable;