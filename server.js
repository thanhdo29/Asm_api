const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 
const connectDB = require('./db');

const routerCar = require('./router/api');
const routerUser = require('./router/routerUser');
const port = 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB(); // Gọi hàm connectDB để kết nối đến cơ sở dữ liệu MongoDB

app.use('/api', routerCar);
app.use('/user', routerUser);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
