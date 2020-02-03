var express = require('express');
var router = express.Router();

var ArticleModel = require('../models/articles');
var userModel = require('../models/users');
var ordersModel = require('../models/orders')

var dateFormat = require('../fonction')

/* GET home page. */
router.get('/', async function(req, res, next) {

    //  Req number 1
    var requestTotalArticles = ArticleModel.find()
    var TotalArticles = 0;

    var totalArticlesReq = await requestTotalArticles.exec()

    for(var i = 0; i<totalArticlesReq.length; i++){
      TotalArticles = TotalArticles + totalArticlesReq[i].stock
    }


    // Req number 2
    var totalMessagesUnread = 0
    var user = await userModel.find()
    
        for( var i = 0; i<user.length; i++){
            for(var j = 0; j<user[i].messages.length; j++){
                if(!user[i].messages[j].read){
                  totalMessagesUnread++
                }
    
            }
    
        }
    

    // Req Number 3

    var TotalUnclosedTasks = 0;
    var requestTasksClosed = await userModel.find();

    for(var i = 0; i<requestTasksClosed.length; i++){
        
        
        for(var j = 0; j<requestTasksClosed[i].tasks.length; j++){
            
            if(!requestTasksClosed[i].tasks[j].dateCloture)(
              TotalUnclosedTasks++
            )

        }

    }


    var userCount = 0;
    var requestUserCount = await userModel.find();

        userCount = requestUserCount.length
       
  

  res.render('index', {TotalArticles,totalMessagesUnread,TotalUnclosedTasks,userCount});
});

/* GET tasks page. */
router.get('/tasks-page', function(req, res, next) {

  var taskList = [];

  userModel.find(function(error,users){
    
    for(var i = 0; i<users.length;i++){

      taskList.push({
        name:users[i].tasks[0].name,
        description:users[i].tasks[0].description,
        category: users[i].tasks[0].category,
        dateInsert: users[i].tasks[0].dateInsert,
        dateDue: users[i].tasks[0].dateDue,
        dateCloture:users[i].tasks[0].dateCloture,
        owner: users[i].tasks[0].owner,
      })
    }
    res.render('tasks', {taskList});
  })

});

/* GET Messages page. */
router.get('/messages-page', function(req, res, next) {

  var messageList = [];

  userModel.find(function(error,users){
    console.log(users)

    for(var i = 0; i<users.length;i++){

      messageList.push({
        title: users[i].messages[0].title, //We use message[0] because we want to take the first message
        description:users[i].messages[0].description,
        dateExp: users[i].messages[0].dateExp,
        read: users[i].messages[0].read,
        sender: users[i].messages[0].sender
      })

    }

    res.render('messages', {messageList,dateFormat});
  })
});



/* GET Messages page. */
router.get('/users-page', function(req, res, next) {

  userModel.find(function(err,users){
    console.log(users)
    res.render('users', {users,dateFormat});
  })
});




/* GET Messages page. */
router.get('/catalog-page', function(req, res, next) {

  ArticleModel.find(function(err,articles){
    console.log(articles)
    res.render('catalog', {articles,dateFormat});
  })
});

/* GET Messages page. */
router.get('/orders-list-page', function(req, res, next) {

  ordersModel.find(function(error,orders){
    // console.log('here is our ordersList -->', orders)


    res.render('orders-list', {orders,dateFormat});
  })  
});

/* GET Messages page. */
router.get('/order-page', function(req, res, next) {

  console.log(req.query)

  ordersModel.findById(req.query.id)
  .populate('articles')
  .populate('user')
  .exec(function(error,order){
    res.render('order', {order,dateFormat});
  })

});



module.exports = router;
