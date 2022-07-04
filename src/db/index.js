const mongoose = require('mongoose')
const localURI = "mongodb://localhost:27017/Open-Financial-Technologies"

// connect to db
const connect = async () => {
  await mongoose.connect(localURI);
  return mongoose.connection;
};

module.exports = {connect}