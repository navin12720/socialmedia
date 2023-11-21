const mongoose = require("mongoose");
class database {
  constructor() {
    this.connect();
  }
  connect() {
    return mongoose
      .connect("mongodb://127.0.0.1:27017/social")
      .then(() => {
        console.log("Database connected");
      })
      .catch((err) => {
        console.log("MongoDB Connection Error: ", err);
      });
  }
}
module.exports = new database();
