const mongoose = require('mongoose');

const dbConnection = async() => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_CON);
    console.log('Base de datos conectada');
  } catch (error) {
    console.log(error);
    throw new Error('Error al conectar la base de datos');
  }
}

module.exports = {
  dbConnection
}