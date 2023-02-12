const express = require('express')
const mongoose=require('mongoose')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({extended: false}))
//database connection//
mongoose.connect('mongodb://localhost:27017/Online-shop')
.then(()=> {console.log("Mongodb connected..")})

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