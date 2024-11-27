import express from 'express';
import morgan from 'morgan';
import { json } from 'express';
import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';
import { name } from '../package.json';
import productRouter from './routes/productRoutes';
import responseInterceptor from './interceptors/response.interceptor';
import  exceptionInterceptor  from './interceptors/exception.interceptor';
import connectDB from './utils/dbConnector'
import swaggerSpec from './swagger';
import cartRouter from './routes/cartRoutes';

const port = process.env.PORT as string;
const serverPrefix: string = `/api/${name}`;
const cors = require('cors');

const app = express();
app.use(morgan('dev'));
app.use(json()); 
app.use(`${serverPrefix}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const corsOptions = {
    origin: 'http://localhost:4321',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));

//Connection with Database
connectDB();

//Global Response Interceptor
app.use(responseInterceptor(name))

// Routes
app.use(`${serverPrefix}/products`, productRouter);
app.use(`${serverPrefix}/carts`, cartRouter);

// Global Exception Handler
app.use(exceptionInterceptor(name));

app.listen(port, () => {
  console.log(`Server is Up`);
});

export default app;
