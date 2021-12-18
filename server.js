const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv').config();

const indexRouter = require('./routes/index');

const corsOptions = {
  origin: "*"
};



const app = express();

app.use(cors(corsOptions))
  .use(morgan('tiny'))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(cookieParser('cookieParser'))
  .use(session({
    secret: 'somedddasdlfj2345rg%%57secret',
    cookie: {
      maxAge: 60000
    },
    resave: false,
    saveUninitialized: false
  }))
  .use('/', indexRouter)



// Error handling
const isProduction = false;

if (!isProduction) {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: "err",
      },
    });
  });
}
else {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: {},
      },
    });
  });
}


const PORT = process.env.PORT;
const DOMAIN = process.env.DOMAIN;

app.listen(PORT || 3000, () => {
  console.log('Server Started at http://' + DOMAIN + ':' + PORT);
});


