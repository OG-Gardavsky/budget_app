const express = require('express');
const path = require('path');
require('./db/mongoose');
const userRouter = require('./routers/user');
const accountRouter = require('./routers/account');
const transactionRouter = require('./routers/transaction');
const categoryRouter = require('./routers/category');

const app = express();
const port = process.env.port || 3000;

app.use(express.json());
app.use(userRouter);
app.use(accountRouter);
app.use(transactionRouter);
app.use(categoryRouter);



const publicDirectory = path.join(__dirname, '../../client/dist');

app.use('/', express.static(publicDirectory));



app.listen(port, () => {
    console.log('server is listening on port:' + port)
});
