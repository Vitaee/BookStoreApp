import express, { Application, NextFunction, Request, Response, ErrorRequestHandler } from "express";
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit'
import Database from "./config/database";
import seedDatabase from "./seed/seeder";
import { Sequelize } from "sequelize";

class App {
	private static instance: App;
	private app: Application;
    private db: Database;

	constructor() {
		this.app = express();
		this.configureApp();
        this.db = new Database();
		this.dbConnect();
	}
	
	public static getInstance(): App {
		if (!this.instance) {
			this.instance = new App();
		}
		return App.instance;
	}
    
	public async dbConnect() {
		 await this.db.connect()
		await seedDatabase();
	
	}

	public getDb(): Sequelize { 
		return this.db.getClient();
	}

	private errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
		console.error(error);
		res.status(500).json({
			message: 'An error occurred on the server',
			error: error.message,
		});
		next()
	};
	configureApp(): void {

		const limiter = rateLimit({
			windowMs: 15 * 60 * 1000, // 15 minutes
			max: 75, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
			standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
			legacyHeaders: false, // Disable the `X-RateLimit-*` headers
		});


		this.app.use(helmet());
		this.app.use(morgan('dev'));
        this.app.use(express.json());
		//this.app.set('trust proxy', true);
		this.app.use(this.errorHandler);
		this.app.use(limiter);

		this.app.use((req: Request, res: Response, next: NextFunction) => {
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Headers',
				'Origin, X-Requested-With, Content-Type, Accept, Authorization');
			res.header('Content-Security-Policy-Report-Only', 'default-src: https:');
			if (req.method === 'OPTIONS') {
				res.header('Access-Control-Allow-Methods', 'PUT POST PATCH DELETE, GET');
				return res.status(200).json({});
			}
			next();
		});

	}
	public getApp(): Application {
		return this.app;
	}

	public start(port: number) {
		this.app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	}

}
export default App.getInstance();