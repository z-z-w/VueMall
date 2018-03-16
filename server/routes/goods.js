const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Goods = require('../models/goods');
const User = require('../models/users');

mongoose.connect('mongodb://localhost:27017/mall', (err) => {
  if(err) {
    console.log(err);
  } else {
    console.log('MongoDB connected success.');
  }
});

//查询商品列表数据
router.get('/list', (req, res, next) => {
  let page = parseInt(req.query.page);
  let pageSize = parseInt(req.query.pageSize);
  let sort = parseInt(req.query.sort);
  let skip = (page-1)*pageSize;
  let params = {};

  let priceLevel = req.query.priceLevel;
  let priceGt = '';
  let priceLte = '';
  if(priceLevel !== 'all'){
    switch (priceLevel){
      case '0': priceGt=0; priceLte=100; break;
      case '1': priceGt=100; priceLte=500; break;
      case '2': priceGt=500; priceLte=1000; break;
      case '3': priceGt=1000; priceLte=5000; break;
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }


  Goods.find(params).sort({salePrice: sort}).skip(skip).limit(pageSize).then((doc,err) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message
      });
    }else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      });
    }
  })
});

//加入到购物车
router.post('/addCart', (req, res, next) => {
  let userName = req.cookies.userName;
  let productId = req.body.productId;
  let goodsItem = '';
  User.findOne({
    userName: userName
  }).then((user) => {
    user.cartList.forEach((item) => {
      if (item.productId === productId) {
        goodsItem = item;
        item.productNum++;
      }
    });
    if(goodsItem) {
      return User.update({userName: user.userName},user);
    }else{
      Goods.findOne({
        productId: productId
      }).then((product) => {
        product.productNum = 1;
        product.checked = true;
        user.cartList.push(product);
        return user.save();
      });
    }
  }).then(() => {
    res.json({
      status: '0',
      msg: '',
      result: ''
    })
  });
});

module.exports = router;

