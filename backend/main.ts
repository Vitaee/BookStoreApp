import { NextFunction, Request, Response } from 'express';
import env from "./src/config/envconfig";
import App from './src/app';
import { Author } from './src/models/Author';
import { Book } from './src/models/Book';
import { OrderDetails } from './src/models/OrderDetails';
import { Order } from './src/models/Order';
import { Customer } from './src/models/Customer';


const port = parseInt(env.getEnvironmentVariable('APP_PORT') || '4000');
App.start(port);

const app = App.getApp();
const sequelize = App.getDb();


app.get('/', (req: Request, res: Response) => {
  res.send(`Server is running on port ${port}!`);
});

//app.use("/api/v1/",userRouter)


app.get('/api/books/', async (req: Request, res: Response) => {
  try {
    const books = await Book.findAll({
      attributes: ['title', 'price']
    });
    res.send(books);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

app.get('/api/books/author/:authorId/', async (req:Request, res:Response) => {
  try {
    const books = await Book.findAll({
      where: { author_id: req.params.authorId },
      include: [ Author]
    });
    return res.send(books);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

app.get('/api/books/sold/total/', async (req, res) => {
  try {
    const totalBooksSold = await OrderDetails.sum('quantity');
    res.send({ totalBooksSold });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

app.get('/api/books/top-selling/', async (req:Request, res:Response) => {
  try {
    const topSellingBooks = await OrderDetails.findAll({
      include: [{
        model: Book,
        attributes: ['title']
      }],
      attributes: [
        'book_id',
        [sequelize.fn('sum', sequelize.col('OrderDetails.quantity')), 'totalSold']
      ],
      group: ['book_id'],
      order: [[sequelize.fn('sum', sequelize.col('OrderDetails.quantity')), 'DESC']],
      limit: 5
    });
    res.send(topSellingBooks);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});



app.get('/api/orders/', async (req: Request, res: Response) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: Customer,
          attributes: ['name', 'email', 'address'] 
        },
        {
          model: OrderDetails,
          include: [{
            model: Book,
            include: [Author]
          }]
        }
      ]
    });

     // Simplifying the response to focus on each order with details
     const responseData = orders.map(order => ({
      orderId: order.order_id,
      customer: order.customer.name,
      orderDetails: order.orderDetails.map(detail => ({
        bookTitle: detail.book.title,
        author: detail.book.author.name,
        price: detail.book.price,
        quantity: detail.quantity
      }))
    }));

   
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Failed to retrieve orders:', error);
    res.status(500).send('Server error while retrieving orders.');
  }
});

app.get('/api/orders/revenue/total/', async (req:Request, res:Response) => {
  try {
    const totalRevenue = await OrderDetails.findAll({
      include: [{
        model: Book,
        as: 'book', // Specify an alias
        attributes: []
      }],
      attributes: [
        [sequelize.fn('sum', sequelize.literal('book.price * OrderDetails.quantity')), 'totalRevenue']
      ],
      group: ['OrderDetails.id'], // or any other unique column
      raw: true,

    });

    // Since the query returns an array, ensure you're sending back appropriate response:
    res.send({ totalRevenue: totalRevenue[0] });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});



app.get('/api/customers/', async (req: Request, res: Response) => {
  try {
    const customers = await Customer.findAll();
    res.status(200).json(customers);
  } catch (error) {
    console.error('Failed to retrieve customers:', error);
    res.status(500).send('Server error while retrieving customers.');
  }
});

app.get('/api/customers/top-spenders/', async (req: Request, res: Response) => {
  try {
    const topSpenders = await Order.findAll({
      attributes: [
    'customer_id',
    [sequelize.fn('SUM', sequelize.literal('`orderDetails`.`quantity` * `orderDetails->book`.`price`')), 'total_spent']
    ],
    include: [
      {
        model: OrderDetails,
        attributes: [], // Bu sorguda OrderDetails'den herhangi bir sütun çekmeye gerek yok
        include: [
          {
            model: Book,
            as: 'book', // Bu, ilişkisel yolda kullanılan takma adı doğru belirtir
            attributes: [] // Bu sorguda Book'tan herhangi bir sütun çekmeye gerek yok
          }
        ]
      },
      {
        model: Customer,
        attributes: ['name']
      }
    ],
    group: ['customer_id'],
    order: [[sequelize.literal('total_spent'), 'DESC']]
  });
        
    res.json(topSpenders);
  } catch (error: any) {
    console.log(error.message)
    res.status(500).send(error.message);
  }
});
