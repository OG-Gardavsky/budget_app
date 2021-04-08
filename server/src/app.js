const express = require('express');
require('./db/mongoose');
const path = require('path');
const userRouter = require('./routers/user');
const accountRouter = require('./routers/account');
const transactionRouter = require('./routers/transaction');
const categoryRouter = require('./routers/category');
const statsRouter = require('./routers/stats');
const process = require('process');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 3000;


app.use(helmet());

app.use(express.json());
app.use(userRouter);
app.use(accountRouter);
app.use(transactionRouter);
app.use(categoryRouter);
app.use(statsRouter);



const publicDirectory = path.join(__dirname, '../../client/dist');

app.use('/', express.static(publicDirectory));



app.listen(port, () => {
    console.log('server is listening on port:' + port)
});
