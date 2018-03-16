const express = require('express');
const router = express.Router();
const User = require('../models/users');
require('../util/util');

//登录
router.post('/login', (req, res, next) => {
  let userName = req.body.userName;
  let userPwd = req.body.userPwd;

  User.findOne({
    userName: userName
  }).then((user) => {
    if(!user){
      res.json({
        status: '1',
        msg: '用户不存在'
      })
    } else {
      if(user.userPwd !== userPwd){
        res.json({
          status: '1',
          msg: '密码错误'
        });
      }else{
        res.cookie('userName', user.userName, {
          path: '/',
          maxAge: 1000*60*60  //存一小时
        });
        //req.session.user = user;
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: user.userName
          }
        })
      }
    }
  });
});

//登出
router.post('/logout', (req, res, next) => {
  res.cookie("userName", "", {
    path: '/',
    maxAge: -1
  });
  res.json({
    status: '0',
    msg: '',
    result: ''
  })
});

//检查是否登录
router.get('/checkLogin', (req, res, next) => {
  if(req.cookies.userName) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName
    })
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    })
  }
});

//注册
router.post('/signup', (req, res, next) => {
  let userName = req.body.userName;
  let userPwd = req.body.userPwd;
  User.findOne({
    userName: userName
  }).then((user) => {
    if(user){
      res.json({
        status: '1',
        msg: '用户名已存在',
        result: ''
      });
    } else {
      let _user = new User({
        userName: userName,
        userPwd: userPwd
      })
      return _user.save();
    }
  }).then((user, err) => {
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    }else {
      res.cookie('userName', user.userName, {
        path: '/',
        maxAge: 1000*60*60  //存一小时
      });
      //req.session.user = user;
      res.json({
        status: '0',
        msg: '注册成功',
        result: {
          userName: user.userName
        }
      });
    }
  });
});




//获取购物车列表
router.get('/cartList', (req, res, next) => {
  let userName = req.cookies.userName;
  if(userName) {
    User.findOne({
      userName: userName
    }).then((user,err) => {
      if(err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      }else{
        res.json({
          status: '0',
          msg: '',
          result: user.cartList.reverse()
        })
      }
    })
  } else {
    res.json({
      status: '1',
      msg: '用户未登录，无法获取购物车商品',
      result: []
    })
  }

});

//购物车删除
router.post('/cartDel', (req, res, next) => {
  let userName = req.cookies.userName;
  let productId = req.body.productId;
  User.update({
    userName: userName
  }, {
    $pull: {
      'cartList': {
        'productId': productId
      }
    }
  }).then((user, err) => {
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  });
});

//商品数量增减
router.post('/cartEdit', (req, res, next) => {
  let userName = req.cookies.userName;
  let productId = req.body.productId;
  let productNum = req.body.productNum;
  let checked = req.body.checked;

  User.update({
    userName: userName,
    "cartList.productId" : productId
  }, {
    'cartList.$.productNum': productNum, //  $是占位符
    'cartList.$.checked': checked
  }).then((user, err) => {
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  });
});

//checkAll
router.post('/editCheckAll', (req, res, next) => {
  let userName = req.cookies.userName;
  let checkAll = req.body.checkAll;

  User.findOne({
    userName: userName
  }).then((user) => {
    user.cartList.forEach((item) => {
      item.checked = checkAll;
    });
    return user.save();
  }).then((user, err) => {
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  });
});

//查询用户地址接口
router.get('/addressList', (req, res, next) => {
  let userName = req.cookies.userName;
  if(userName) {
    User.findOne({
      userName: userName
    }).then((user) => {
      res.json({
        status: '0',
        msg: '',
        result: user.addressList.reverse()
      })
    });
  } else {
    res.json({
      status: '1',
      msg: '用户未登录，无法获取地址',
      result: []
    })
  }

});

//设置默认地址接口
router.post('/setDefault', (req, res, next) => {
  let userName = req.cookies.userName;
  let addressId = req.body.addressId;
  User.findOne({
    userName: userName
  }).then((user,err) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      let addressList = user.addressList;
      addressList.forEach((item) => {
        if(item.addressId === addressId) {
          item.isDefault = true;
        }else {
          item.isDefault = false;
        }
      });
      return user.save();
    }
  }).then((user,err) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '设置默认地址成功',
        result: ''
      })
    }
  })
});

//删除地址接口
router.post('/delAddress', (req, res, next) => {
  let userName = req.cookies.userName;
  let addressId = req.body.addressId;
  User.update({
    userName: userName,
    "addressList.addressId": addressId
  }, {
    $pull: {
      "addressList": {
        "addressId": addressId
      }
    }
  }).then((user, err) => {
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else{
      res.json({
        status: '0',
        msg: '地址删除成功',
        result: ''
      })
    }
  })
});

//添加地址接口
router.post('/addNewAddress', (req, res, next) => {
  let userName = req.cookies.userName;
  let newAddress = req.body.newAddress;
  let isOldAddress = false;
  User.findOne({
    userName: userName
  }).then((user, err) => {
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else {
      user.addressList.forEach((item) => {
        if (item.addressId === newAddress.addressId) {
          isOldAddress = true;
          res.json({
            status: '1',
            msg: '该地址Id已经存在',
            result: ''
          });
        }
      });
      if (!isOldAddress) {
        if(user.addressList.length === 0){
          newAddress.isDefault = true;
        }else{
          newAddress.isDefault = false;
        }
        user.addressList.push(newAddress);
        return user.save();
      }
    }
  }).then((user, err) => {
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else {
      res.json({
        status: '0',
        msg: '添加地址成功',
        result: ''
      })
    }
  })
});

//生成订单接口
router.post('/payment', (req, res, next) => {
  let userName = req.cookies.userName;
  let orderTotal = req.body.orderTotal;
  let addressId = req.body.addressId;
  let order = {};

  console.log('asd');

  User.findOne({
    userName: userName
  }).then((user, err) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      let address = '';
      let goodsList = [];
      let newCartList = [];
      //获取当前用户选择的地址的信息
      user.addressList.forEach((item) => {
        if(item.addressId === addressId) {
          address = item;
        }
      });
      //获取用户购物车的购买商品
      user.cartList.forEach((item) => {
        if(item.checked) {
          goodsList.push(item);
        }else{
          //订单确认后删除该购物车里的购买的商品
          newCartList.push(item);
        }
      });
      user.cartList = newCartList;


      let platform = '666';
      let r1 = Math.floor(Math.random() * 10);
      let r2 = Math.floor(Math.random() * 10);

      let sysDate = new Date().Format('yyyyMMddhhmmss');
      let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      let orderId = platform + r1 + sysDate + r2;

      order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodsList: goodsList,
        orderStatus: true,
        createDate: createDate
      };

      user.orderList.push(order);
      return user.save();
    }
  }).then((user, err) => {
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    }else{
      res.json({
        status: '0',
        msg: '',
        result: order
      })
    }
  })
});

//根据订单ID查询订单信息
router.post('/orderDetail', (req, res, next) => {
  let userName = req.cookies.userName;
  let orderId = req.body.orderId;

  User.findOne({
    userName: userName
  }).then((user, err) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      let orderList = user.orderList;
      if(orderList.length > 0) {
        console.log(orderList);
        let orderTotal = 0;
        orderList.forEach((item) => {
          if(item.orderId === orderId) {
            orderTotal = item.orderTotal;
          }
        });

        res.json({
          status: '0',
          msg: '',
          result: {
            orderId: orderId,
            orderTotal: orderTotal
          }
        });
      }else {
        res.json({
          status: '10002',
          msg: '当前用户未创建订单',
          result: ''
        });
      }
    }
  })
});


module.exports = router;
