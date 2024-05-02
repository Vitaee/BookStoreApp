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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 3; 

    const offset = (page - 1) * limit;

    const books = await Book.findAndCountAll({
      attributes: ['title', 'price'],
      limit: limit,
      offset: offset,
      order: [['book_id', 'ASC']] 
    });

    const totalPages = Math.ceil(books.count / limit);

    return res.send({
      totalItems: books.count,
      data: books.rows,
      totalPages: totalPages,
      currentPage: page
    });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

app.get('/api/books/author/:authorId/', async (req:Request, res:Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 3; 

    const offset = (page - 1) * limit;

    const books = await Book.findAndCountAll({
      where: { author_id: req.params.authorId },
      include: [ Author],
      limit: limit,
      offset: offset,
    });

    const totalPages = Math.ceil(books.count / limit);

    return res.send({
      totalItems: books.count,
      data: books.rows,
      totalPages: totalPages,
      currentPage: page
    });

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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 3; 

    const offset = (page - 1) * limit;

    const topSellingBooks = await OrderDetails.findAndCountAll({
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
      limit: limit,
      offset: offset
    });
    const totalPages = Math.ceil(topSellingBooks.count.length / limit);

    res.send({
      totalItems: topSellingBooks.count.length,
      data: topSellingBooks.rows.map(row => ({
        book_id: row.book_id,
        totalSold: row.dataValues.totalSold,
        book: row.book 
      })),
      totalPages: totalPages,
      currentPage: page
    });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});



app.get('/api/orders/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 3;
    const offset = (page - 1) * limit;

    const orders = await Order.findAndCountAll({
      include: [
        {
          model: Customer,
          attributes: ['name'] 
        },
        {
          model: OrderDetails,
          include: [{
            model: Book,
            include: [{
              model: Author,
              attributes: ['name']
            }],
            attributes: ['title', 'price']
          }],
          attributes: ['quantity']
        }
      ],
      limit: limit,
      offset: offset,
      order: [['order_id', 'ASC']] 
    });

    const totalPages = Math.ceil(orders.count / limit);

    const responseData = orders.rows.map(order => ({
      orderId: order.order_id, 
      customer: order.customer.name,
      orderDetails: order.orderDetails.map(detail => ({
        bookTitle: detail.book.title,
        author: detail.book.author.name,
        price: detail.book.price,
        quantity: detail.quantity
      }))
    }));
    

    res.status(200).json({
      totalItems: orders.count,
      totalPages: totalPages,
      currentPage: page,
      data: responseData
    });
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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 3; 

    const offset = (page - 1) * limit;

    const customers = await Customer.findAndCountAll({ 
      limit: limit,
      offset: offset
    });

    const totalPages = Math.ceil(customers.count / limit);

    return res.send({
      totalItems: customers.count,
      data: customers.rows,
      totalPages: totalPages,
      currentPage: page
    });

  } catch (error) {
    console.error('Failed to retrieve customers:', error);
    res.status(500).send('Server error while retrieving customers.');
  }
});

app.get('/api/customers/top-spenders/', async (req: Request, res: Response) => {
  try {

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 3; 

    const offset = (page - 1) * limit;

    const topSpenders = await Order.findAll({
      attributes: [
        'customer_id',
        [sequelize.fn('SUM', sequelize.literal('`orderDetails`.`quantity` * `book`.`price`')), 'total_spent']      
      ],
      include: [
        {
          model: OrderDetails,
          attributes: [], 
          as: 'orderDetails',
          include: [
            {
            model: Book,
              as: 'book', 
              attributes: [] 
            }
          ]
        },
        {
          model: Customer,
          attributes: ['name']
        }
      ],
      group: ['customer_id'],
      order: [[sequelize.literal('total_spent'), 'DESC']],
      limit: limit,
      offset: offset
  });

  const totalPages = Math.ceil(topSpenders.length / limit);

  return res.send({
    totalItems: topSpenders.length,
    data: topSpenders,
    totalPages: totalPages,
    currentPage: page
  });
        
  } catch (error: any) {
    console.log(error.message)
    res.status(500).send(error.message);
  }
});
