/* eslint-disable react-hooks/exhaustive-deps */
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
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(3);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        console.log('Fetching data from:', endpoint);
        const url = `http://127.0.0.1/api/${endpoint}/?page=${currentPage}&limit=${itemsPerPage}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setData(jsonData.data);
        setFilteredData(jsonData.data); // initialize filtered data
      } catch (error) {
        console.error(`Failed to fetch data from ${endpoint}:`, error);
      }
      setLoading(false);
    };

    fetchData();
  }, [endpoint, currentPage, itemsPerPage]);

  useEffect(() => {
    let filtered = data.filter(item => 
      columns.some(column =>
        item[column.key].toString().toLowerCase().includes(filter.toLowerCase())
      )
    );

    if (sortKey) {
      filtered.sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(filtered);
  }, [filter, sortKey, sortDirection, data]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
      <div className="p-4">
        <input
          type="text"
          className="input input-bordered w-full max-w-xs"
          placeholder="Filter..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>
      {/* Pagination controls here */}
      <div>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
        </button>
          <span> Page {currentPage} </span>
        <button onClick={() => handlePageChange(currentPage + 1)}>
          Next
        </button>
      </div>
      {/* Table starts here */}
      <table className="table-auto w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => {
                  if (sortKey === column.key) {
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortKey(column.key);
                    setSortDirection('asc');
                  }
                }}>
                {column.header}
                {sortKey === column.key ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredData.map((item, index) => (
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
    </div>
  );
};

export default DataTable;
