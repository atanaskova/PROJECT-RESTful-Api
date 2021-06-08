const mongoose = require("mongoose");

require('dotenv').config();

mongoose.connect(`mongodb+srv://Taci_1998:${process.env.MONGODB_PASSWORD}@restfulapi-cluster.4esez.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});