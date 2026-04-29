import dotenv from 'dotenv'
dotenv.config({
    path: './.env'
})

import { connectCloudinary } from './src/services/cloudinary.js'
connectCloudinary();


import app from "./app.js";
import { DB_Connection } from "./src/db/index.js";



DB_Connection().then(() => {
    app.listen(process.env.PORT, () => {
        console.log('Server is running on PORT:',process.env.PORT);
    })
}).catch((error) => {
    console.log('Errr!',error); 
})

