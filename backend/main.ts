import { NextFunction, Request, Response } from 'express';
import env from "./src/config/envconfig";
import App from './src/app';
import { Author } from './src/models/Author';
import { Book } from './src/models/Book';
import { OrderDetails } from './src/models/OrderDetails';
import { Order } from './src/models/Order';


const port = parseInt(env.getEnvironmentVariable('APP_PORT') || '4000');
App.start(port);

const app = App.getApp();

app.get('/', (req: Request, res: Response) => {
  res.send(`Server is running on port ${port}!`);
});

//app.use("/api/v1/",userRouter)




const sequelize = App.getDb();


app.get('/books', async (req: Request, res: Response) => {
  try {
    const books = await Book.findAll({
      attributes: ['title', 'price']
    });
    res.send(books);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});


app.get('/books/author/:authorId/', async (req:Request, res:Response) => {
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

app.get('/books/sold/total/', async (req, res) => {
  try {
    const totalBooksSold = await OrderDetails.sum('quantity');
    res.send({ totalBooksSold });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});


app.get('/orders/revenue/total/', async (req:Request, res:Response) => {
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


app.get('/books/top-selling/', async (req:Request, res:Response) => {
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


app.get('/customers/top-spenders', async (req, res) => {
  try {
    const topSpenders = await Order.findAll({
      attributes: [
      'customer_id',
      [sequelize.literal('SUM(`OrderDetails`.`quantity` * `Books`.`price`)'), 'total_spent']
      ],
      include: [
      {
      model: OrderDetails,
      attributes: []
      },
      {
      model: Book,
      attributes: []
      }
      ],
      group: ['customer_id'],
      order: [[sequelize.literal('total_spent'), 'DESC']],
      limit: 5 });
    res.json(topSpenders);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});