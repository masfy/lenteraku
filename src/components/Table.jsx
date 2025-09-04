import React from "react";

export default function Table({ columns, data, renderCell }) {
  return (
    <div className="overflow-auto rounded-lg border bg-white">
      <table className="table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="th px-3 py-2">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length ? data.map((row) => (
            <tr key={row.id}>
              {columns.map((c) => (
                <td key={c.key} className="td px-3 py-2">
                  {renderCell ? renderCell(c, row) : row[c.key]}
                </td>
              ))}
            </tr>
          )) : (
            <tr><td className="px-3 py-4 text-sm text-center text-onSurface/60" colSpan={columns.length}>Belum ada data</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
