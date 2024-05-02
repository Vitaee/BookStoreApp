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


type DataKey = 'books' | 'orders' | 'customers' | 'topSellingBooks';

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
};

export default function Home() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<DataKey>('books');

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEndpoint(event.target.value as DataKey);
  };

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p> Can İlgu <code className={styles.code}> - API Task Project</code></p>
      </div>

      <div className="flex justify-center">
        <label htmlFor="endpoint">Select an endpoint:</label>
        <select value={selectedEndpoint} onChange={handleSelectChange}>
          <option value="books">Books</option>
          <option value="topSellingBooks">Top Selling Books</option>
          <option value="orders">Orders</option>
          <option value="customers">Customers</option>
        </select>
        </div>

      <div className={styles.center}>
       
     
        <DataTable
          endpoint={dataConfig[selectedEndpoint].endpoint}
          columns={dataConfig[selectedEndpoint].columns}
        />
      </div>
    </main>
  );
}
