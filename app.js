import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()


app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(cors());
app.use(cookieParser());



import UserRouter from './src/routes/user.routes.js' 

app.use('/api/user', UserRouter)



import CategoryRouter from  './src/routes/category.routes.js';

app.use('/api/category', CategoryRouter)



import ProductRouter from './src/routes/product.routes.js';

app.use('/api/product', ProductRouter)



import CartRouter from './src/routes/cart.routes.js';

app.use('/api/cart', CartRouter)



import OrderRouter from './src/routes/order.routes.js'

app.use('/api/order', OrderRouter)



export default app