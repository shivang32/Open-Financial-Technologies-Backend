const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {connect} = require('./src/db/index')

const indexRouter = require('./src/routes/index');

const app = express();

// connect to the db

async function connectMongo() {
  const connection = await connect().catch(async (err) => {
    console.log(err);
  })
  if(connection){
    const cleanUp = (eventType) => {
      connection.close(() => {
           console.info('mongo connection closed');
       });
    };
    
    [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
      process.on(eventType, cleanUp.bind(null, eventType));
    })
  }
}

connectMongo();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header("Access-Control-Request-Headers", 'http');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-api-key");
  next();
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
