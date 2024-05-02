/** @jsxImportSource react */
'use client';

import styles from "./page.module.css";
import DataTable from "@/components/DynamicTable";
import React, { useState } from "react";

interface OrderDetail {
  bookTitle: string;
  author: string;
  price: number;
  quantity: number;
}

interface TopSellingBook {
  book_id: number;
  totalSold: string; // If this should be an integer, consider converting it during fetch or in the backend
  book: BookDetail
}

interface BookDetail {
  title: string;
}

interface Customer { 
  name: string;
}


type DataKey = 'books' | 'orders' | 'customers' | 'topSellingBooks' | 'topSpenders';

interface DataConfig {
  endpoint: string;
  columns: {
    key: string;
    header: string;
    render?: (data: any) => JSX.Element;
  }[];
}

const dataConfig: Record<DataKey, DataConfig> = {
  books: {
    endpoint: 'books',
    columns: [
      { key: 'title', header: 'Title' },
      { key: 'price', header: 'Price' }
    ]
  },
  orders: {
    endpoint: 'orders',
    columns: [
      { key: 'orderId', header: 'Order ID' },
      { key: 'customer', header: 'Customer' },
      {
        key: 'orderDetails',
        header: 'Order Details',
        render: (orderDetails: OrderDetail[] | undefined) => (
          <ul>
            {orderDetails ? orderDetails.map((detail, index) => (
              <li key={index}>
                {`${detail.bookTitle} by ${detail.author} - $${detail.price} x ${detail.quantity}`}
              </li>
            )) : <li>No details available</li>}
          </ul>
        )
      }
    ]
  },
  customers: {
    endpoint: 'customers',
    columns: [
      { key: 'name', header: 'Name' },
      { key: 'email', header: 'Email' },
      { key: 'address', header: 'Address' }
    ]
  },
  topSellingBooks: {
    endpoint: 'books/top-selling',
    columns: [
      {
        key: 'book',
        header: 'Book Title',
        render: (data: BookDetail) => <span>{data?.title || 'No title available'}</span>
      },
      { key: 'totalSold', header: 'Total Sold' }
    ]
  },
  topSpenders: {
    endpoint: 'customers/top-spenders',
    columns: [
      { key: 'customer_id', header: 'Customer ID' },
      { key: 'total_spent', header: 'Total Spent'},
      { key: 'name', header: 'Name', render: (  (data: Customer) => <span> {data?.name}</span>) },
     ]
  }
};

export default function Home() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<DataKey>('books');

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEndpoint(event.target.value as DataKey);
  };

  return (
    <main className="max-h-screen bg-gray-100 p-5">
      <div className={styles.description}>
        <p>Can İlgu<code className={styles.code}> - API Task Project</code></p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 my-4 mt-2 mb-2">
        <label htmlFor="endpoint" className="font-medium">Select an endpoint:</label>
        <select
          id="endpoint"
          className="mt-1 block w-full lg:w-64 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={selectedEndpoint}
          onChange={handleSelectChange}
        >
          <option value="books">Books</option>
          <option value="topSellingBooks">Top Selling Books</option>
          <option value="orders">Orders</option>
          <option value="customers">Customers</option>
          <option value="topSpenders">Top Spenders</option>
        </select>
      </div>

      <DataTable
        endpoint={dataConfig[selectedEndpoint].endpoint}
        columns={dataConfig[selectedEndpoint].columns}
      />

      
    </main>
  );
}
