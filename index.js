const express = require('express');
const app = express()
const cors = require('cors');
const port =  5000 ;


// use the middleware
app.use(express.json());
app.use(cors());



app.get('/' ,(req,res) => {
    res.send('Hello Developer Sifat');
    console.log('Everything is ok')
});


app.listen(port, () => {
    console.log(`Listening to the ${port} successfully`);
})