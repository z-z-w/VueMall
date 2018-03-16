const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  "productId": String,
  "productName": String,
  "salePrice": Number,
  "productImage": String,
  "checked":Boolean,
  "productNum":Number,
});

module.exports = mongoose.model('Goods', productSchema);