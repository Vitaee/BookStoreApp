/** @jsxImportSource react */
'use client';

import React, { useState, useEffect } from 'react';

interface DataTableProps {
  endpoint: string;
  columns: {
    key: string;
    header: string;
    render?: (data: any) => JSX.Element;
  }[];
}

const DataTable: React.FC<DataTableProps> = ({ endpoint, columns }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1/api/${endpoint}/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        console.log(jsonData);
        setData(jsonData);
      } catch (error) {
        console.error(`Failed to fetch data from ${endpoint}:`, error);
      }
      setLoading(false);
    };

    fetchData();
  }, [endpoint]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((column) => (
            <th key={column.key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
  {data.map((item, index) => (
    console.log(item),
    console.log(index),
    <tr key={index}>

      {columns.map((column) => (
        <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {column.render ? column.render(item[column.key]) : item[column.key]}
        </td>
      ))}
    </tr>
  ))}
</tbody>
    </table>
  );
};

export default DataTable;
