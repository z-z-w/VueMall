const mongoose = require('mongoose');
const UsersSchema = new mongoose.Schema({
  "userName": String,
  "userPwd": String,
  "orderList": Array,
  "cartList": [
    {
      "productId": String,
      "productName": String,
      "salePrice": Number,
      "productImage": String,
      "checked": Boolean,
      "productNum": Number
    }
  ],
  "addressList": [
    {
      "addressId": String,
      "userName" : String,
      "streetName" : String,
      "tel" : Number,
      "isDefault": Boolean
    }
  ]
});

module.exports = mongoose.model('User', UsersSchema);