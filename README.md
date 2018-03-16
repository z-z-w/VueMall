# Vue.js + Node.js + MongoDB实现的商城

简介:
---------------
本项目前端使用了Vue.js框架，后端方面使用了Node.js（express） + MongoDB(mongoose)

**1. 项目后端:**
  * 使用`NodeJs的express`框架完成商城网站后端搭建;
  * 使用`mongodb`完成数据存储,通过`mongoose`模块完成对`mongodb`数据的构建;
  * 使用`goods.js`实现分页获取数据库中的商品；
  * 使用`users.js`实现用户的注册登录检测登录状态，购物车的商品增删改查，地址的添加删除和设置默认地址；
  * 使用`util/util.js`对时间做格式化；
  * 为了更方便的维护前后端代码，把后端的依赖包直接写入到前端的依赖中；
  
  
**2. 项目前端:**
  * 为了更好学习Vue+node, 本项目的html和css代码纯属复制；
  * 使用vue-router对路由配置;
  * 使用axios发送接口;
  * 使用vuex对用户名和购物车数量的状态进行管理
  * 使用vue-lazyload实现对图片的懒加载;
  
**3. 网站整体功能:**
  * 商品首页的展示页面， 具有金钱范围和升降功能；
  * 具有用户注册登录，在没登录的情况下无法将商品加入购物车；
  * 购物车页面，可对购物车中的商品进行选择，修改数量，删除等功能；
  * 地址页面， 添加地址和删除地址，地址数量过多可隐藏显示。添加的第一个地址默认为默认地址，但可设置其它地址为默认地址；
  * 订单确认页面，对选择购买的商品的数量、价格的浏览；
  * 订单消息页面；

**运行与使用:**
  ----
  1. 启动数据库`mongod`；
  2. npm install;
  3. node bin/www; 
  4. npm run dev;


项目整体效果
-------

![页面加载失败](https://github.com/z-z-w/VueMall/blob/master/resource/1.png)
![页面加载失败](https://github.com/z-z-w/VueMall/blob/master/resource/2.png)
![页面加载失败](https://github.com/z-z-w/VueMall/blob/master/resource/3.png)
![页面加载失败](https://github.com/z-z-w/VueMall/blob/master/resource/4.png)
![页面加载失败](https://github.com/z-z-w/VueMall/blob/master/resource/5.png)
![页面加载失败](https://github.com/z-z-w/VueMall/blob/master/resource/6.png)


    
