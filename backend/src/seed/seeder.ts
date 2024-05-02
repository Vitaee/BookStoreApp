import { Author } from '../models/Author';
import { Book }  from '../models/Book';
import { Customer } from '../models/Customer';
import { Order } from '../models/Order';
import { OrderDetails } from '../models/OrderDetails';

async function seedDatabase() {
  try {
    const authorCount = await Author.count();
    console.log('Author count:', authorCount);

    if (authorCount === 0) {
      await Author.bulkCreate([
        { name: 'J.K. Rowling' },
        { name: 'George R.R. Martin' },
        { name: 'Stephen King' },
        { name: 'Turgut Ozakman' },
        { name: 'Orhan Pamuk'},
        { name: 'Ahmet Hamdi Tanpinar' },
      ]);
    }

    const jkRowling = await Author.findOne({ where: { name: 'J.K. Rowling' } });
    const georgeRRMartin = await Author.findOne({ where: { name: 'George R.R. Martin' } });
    const stephenKing = await Author.findOne({ where: { name: 'Stephen King' } });
    const turgutOzakman = await Author.findOne({ where: { name: 'Turgut Ozakman' } });
    const orhanPamuk = await Author.findOne({ where: { name: 'Orhan Pamuk' } });
    const ahmetHamdiTanpinar = await Author.findOne({ where: { name: 'Ahmet Hamdi Tanpinar' } });

    const bookCount = await Book.count();
    console.log('Book count:', bookCount);

    if (bookCount === 0) {
      await Book.bulkCreate([
        { title: 'Harry Potter and the Sorcerer\'s Stone', author_id: jkRowling?.author_id, price: 19.99 },
        { title: 'A Game of Thrones', author_id: georgeRRMartin?.author_id, price: 24.99 },
        { title: 'The Shining', author_id: stephenKing?.author_id, price: 14.99 },
        { title: 'Birinci Dunya Savasi', author_id: turgutOzakman?.author_id, price: 24.99 },
        { title: 'Kirmizi Sacli Kadin', author_id: orhanPamuk?.author_id, price: 34.99 },
        { title: 'Huzur', author_id: ahmetHamdiTanpinar?.author_id, price: 24.99 }

      ]);
    }

    const customerCount = await Customer.count();
    if (customerCount === 0) {
      await Customer.bulkCreate([
        { name: 'Alice Smith', email: 'alice@example.com', address: '1234 Wonderland Drive' },
        { name: 'Bob Johnson', email: 'bob@example.com', address: '5678 Maple Street' },
        { name: 'Carol White', email: 'carol@example.com', address: '91011 Oak Avenue' },
        { name: 'David Black', email: 'davidblack@example.com', address: '213 1st Street' },
        { name: 'Eve Brown', email: 'evebrown@example.com', address: '456 2nd Street'},
        { name: 'Fiona Green', email: 'fionagreen@example.com', address: '789 3rd Street'}
      ]);
    }

    const orderCount = await Order.count();
    if (orderCount === 0) {
      await Order.bulkCreate([

        { customer_id: 1, order_date: new Date() },
        { customer_id: 2, order_date: new Date() },
        { customer_id: 3, order_date: new Date() },
        { customer_id: 4, order_date: new Date() },
        { customer_id: 5, order_date: new Date() },
        { customer_id: 6, order_date: new Date() }

      ]);
    }

    const orderDetailCount = await OrderDetails.count();
    if (orderDetailCount === 0) {
      await OrderDetails.bulkCreate([
        { order_id: 1, book_id: 1, quantity: 1 },
        { order_id: 1, book_id: 3, quantity: 2 },
        { order_id: 2, book_id: 2, quantity: 3 },
        { order_id: 3, book_id: 1, quantity: 1 },
        { order_id: 3, book_id: 2, quantity: 2 },
        { order_id: 3, book_id: 3, quantity: 1 },
        { order_id: 4, book_id: 4, quantity: 1 },
        { order_id: 4, book_id: 5, quantity: 2 },
        { order_id: 5, book_id: 6, quantity: 2 },
        { order_id: 6, book_id: 1, quantity: 3 },
        { order_id: 6, book_id: 2, quantity: 2 },
      ]);
    }

    console.log('Database seeded!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

export default seedDatabase;