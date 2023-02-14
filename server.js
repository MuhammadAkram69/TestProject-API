const express = require('express')
const mongoose=require('mongoose')
const app = express()
const port = 3002

app.use(express.json())
app.use(express.urlencoded({extended: false}))
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