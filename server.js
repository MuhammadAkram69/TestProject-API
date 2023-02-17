const express = require('express')
const mongoose=require('mongoose')
var cors = require('cors')
const app = express()
const port = 4000

app.use(express.json())
app.use(express.urlencoded({extended: false}))
// app.use(cors()) // Use this after the variable declaration


const corsOrigin ={
    origin:'http://localhost:3000', //or whatever port your frontend is using
    credentials:true,            
    optionSuccessStatus:200
}
app.use(cors(corsOrigin));

// // Local database connection //
// mongoose.connect('mongodb://localhost:27017/Rest-Api')
// .then(()=> {console.log("Mongodb connected..")})

// Online Atlas database connection //
mongoose.connect('mongodb+srv://Testing:project@cluster0.xmqtvgj.mongodb.net/TestingProject?retryWrites=true&w=majority')
 .then(()=> {console.log("Mongodb connected..")});

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const Certification =require('./src/Routes/CertificationRoute');
const Region =require('./src/Routes/RegionRoute');
const Category=require('./src/Routes/CategoryRoute');
const Product=require('./src/Routes/ProductRoute');

app.use('/certification',Certification);
app.use('/region',Region);
app.use('/categories',Category);
app.use('/products',Product);

//app listener ///
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// module.exports = app;