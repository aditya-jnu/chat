const express=require('express');
const app=express();

const cors=require('cors');
app.use(cors({ origin: '*', credentials: true }));

require('dotenv').config();
const PORT=process.env.PORT||5000;

app.use(express.json());

const dbConnect=require('./config/databse.js');
dbConnect();

const appRoute=require('./routes/appRoute.js')
app.use('/api/v1',appRoute);

app.listen(PORT,()=>{
    console.log(`App listening on PORT ${PORT}`)
})