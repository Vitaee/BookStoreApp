import env from "./envconfig";
import { Sequelize } from 'sequelize-typescript';


export class Database {
  private client: Sequelize;

  constructor() {
    this.client = new Sequelize({
        host: 'db',
        database: 'bookstore',
        dialect: 'mysql',
        username: 'root',
        password: '123456',
        models: ['/app/src/models'],  // path to the models directory
      });

      
  }

  public getClient(): Sequelize {
    return this.client;
  }


  public async connect(): Promise<void> {
    try {

        await this.client.sync();
        console.log('Connected to MySQL database.');
    } catch (error) {
      console.error('Failed to connect to MySQL database:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.client) {
        await this.client.close();
        console.log('Disconnected from MySQL database.');
      } else {
        console.log('No active database connection to disconnect from.');
      }
    } catch (error) {
      console.error('Failed to disconnect from MySQL database:', error);
      throw error;
    }
  }
}
export default Database