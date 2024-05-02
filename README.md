# Book Store App
Book Store App,  a simple application that displays data from a backend express api with pagination, filtering and sorting features with dynamic table.

# Start Frontend Project
- npm i

- npm run dev

Should be ready on ``` http://localhost:3000 ```

# Start Backend Project
- docker compose build

- docker compose up -d

Should be ready on ```http://localhost:4000```


And thats it our frontend and backed project is ready!

# Sample Documentation
Here is the some api endpoints and their responses.

• URL: ``/api/orders``

• Method: GET

• Description: Retrieve information about all orders in the database including
book details.

• Response:
```json
{
    "totalItems": 11,
    "totalPages": 4,
    "currentPage": 1,
    "data": [
        {
            "orderId": 1,
            "customer": "Alice Smith",
            "orderDetails": [
                {
                    "bookTitle": "Harry Potter and the Sorcerer's Stone",
                    "author": "J.K. Rowling",
                    "price": 20,
                    "quantity": 1
                },
                {
                    "bookTitle": "The Shining",
                    "author": "Stephen King",
                    "price": 15,
                    "quantity": 2
                }
            ]
        },
        {
            "orderId": 2,
            "customer": "Bob Johnson",
            "orderDetails": [
                {
                    "bookTitle": "A Game of Thrones",
                    "author": "George R.R. Martin",
                    "price": 25,
                    "quantity": 3
                }
            ]
        },
    ]
```
• Status Code: 200 OK

---
• URL: ``/api/books/top-selling/``

• Method: GET

• Description: Retrieve information about top selling books.

• Response:
```json
{
    "totalItems": 6,
    "data": [
        {
            "book_id": 2,
            "totalSold": "7",
            "book": {
                "title": "A Game of Thrones"
            }
        },
        {
            "book_id": 1,
            "totalSold": "5",
            "book": {
                "title": "Harry Potter and the Sorcerer's Stone"
            }
        },
    ]
}
```
• Status Code: 200 OK