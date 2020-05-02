require('./db');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const mongoose = require('mongoose');
const Task = mongoose.model('Task');
const taskList = mongoose.model('taskList');
const User = mongoose.model('User');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: 'sjdoiqdjJDJDWJoidwvnnvnvnvnnvnvnvn88****2999393JDW(@(!1123123wdowdiowfej',
    resave: true,
    saveUninitialized: true
};
app.use(session(sessionOptions));

//passport config
require('./config/passport')(passport);
const {allow} = require('./config/auth');
app.use(passport.initialize());
app.use(passport.session());

//express flash setup
app.use(flash());

app.use((req,res,next)=>{
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// body parser setup
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res)=>{
  res.render('login');
});

app.post('/login', (req, res, next)=>{
  passport.authenticate('local', { 
    successRedirect: '/homepage',
    failureRedirect: '/login',
    failureFlash: true
  })(req,res,next);
});

app.get('/homepage',allow, (req,res)=>{
    console.log('welcome',req.user)
    res.render('homepage', {user:req.user.userName});
});

app.get('/logout',(req,res)=>{
  req.logout();
  req.flash('success','You have logged out')
  res.redirect('/login');
});

app.get('/register', (req, res)=>{
  res.render('register');
});
app.post('/register',  (req, res)=>{
    User.findOne({userName: req.body.userName}).then(async (user)=>{
      if(user){
        req.flash('error', 'Username taken, please use something else.' )
        res.redirect('/register');
      }
      else{
        if(req.body.password != req.body.password2){
          req.flash('error','Passwords do not match, try again.');
          res.redirect('/register');
        }
        else{
          try{
            const hashPW = await bcrypt.hash(req.body.password, 10);
            const u = new User({
              userName: req.body.userName,
              email: req.body.email,
              password: hashPW
            });
            u.save(function(err){
              if(err){
                console.log(err);
              }else{
                req.flash('success', 'Successfully registered, please login.' )
                res.redirect('/login');
              }
            });
          }
          catch{
            console.log('something went wrong');
            res.redirect('/register');
          }
        }
      }
      
    });
  
});
app.get('/task-lists',allow, (req, res)=>{
  res.render('task-lists', {taskList:req.user.taskList});
});

app.get('/task-lists/new',allow, (req, res) => {
  res.render('new-list', {});
});

app.post('/task-lists/new', (req, res) => {
  const newTL = new taskList({
    name:req.body.taskList, 
    user:req.user.id
  });
  newTL.save(function(err){
    if(err){
      console.log(err);}
  });
User.findOneAndUpdate(
    {_id:req.user.id},
    {$push: {taskList: newTL}
      },function(err){
        if(err){
          console.log(err);
        }else{
          res.redirect('/task-lists');
        }
      }
  )
});

app.get('/all-tasks',allow, (req, res) => {
let filter = {'user':req.user.id};

if (req.query.taskName !== ''){
    filter['name'] = req.query.taskName;
}

if (req.query.completion !== 'All'){
  if(req.query.completion === 'Complete'){
    filter["completed"] = true;
  }
  else {
    filter["completed"] = false;
  }
}
if (req.query.tlist !== 'All'){
    filter['list'] = req.query.tlist;
}
if ((req.query.taskName === '' || filter['name']=== undefined) && (req.query.completion === 'All' || filter['completed'] === undefined)&& (req.query.tlist === 'All' || filter['list']=== undefined)){
  filter = {'user':req.user.id};
}
if(req.query.tlist ===undefined||req.query.taskName===undefined||req.query.completion===undefined){
  filter = {'user':req.user.id};
}

Task.find(filter, function(err, task) {
  res.render('all-tasks', {allTasks: task, taskList: req.user.taskList});
});
});

app.post('/all-tasks',allow, (req, res) => { 
  if(Array.isArray(req.body.completion)){
    req.body.completion.forEach(taskID=>{
      Task.findOne({user:req.user.id,_id:taskID}).then((e)=>{
        if(e.completed){
          Task.findOneAndUpdate(
            {user:req.user.id,_id :taskID},
            {$set: {completed: false}
          },function(err){
            if(err){
              console.log(err);
            }
        })
        }else{
          Task.findOneAndUpdate(
            {user:req.user.id,_id :taskID},
            {$set: {completed: true}
          },function(err){
            if(err){
              console.log(err);
            }
        })
        }
      })
    })
  } 
  else{
    Task.findOne({user:req.user.id,_id:req.body.completion}).then((e)=>{
      if(e.completed){
        Task.findOneAndUpdate(
          {user:req.user.id,_id :req.body.completion},
          {$set: {completed: false}
        },function(err){
          if(err){
            console.log(err);
          }
      })
      }else{
        Task.findOneAndUpdate(
          {user:req.user.id,_id :req.body.completion},
          {$set: {completed: true}
        },function(err){
          if(err){
            console.log(err);
          }
      })
      }
    });
  }
  res.redirect('/all-tasks');
});

app.get('/all-tasks/new',allow, (req, res) => {
  res.render('new-task',{taskList:req.user.taskList});
  
});

app.post('/all-tasks/new',allow, (req, res) => {
  if(req.user.taskList.length ===0){
    req.flash('error',"Please Create a List Before Creating a Task");
    res.redirect('/task-lists/new')
  }
  else{
    const t1 = new Task({
      user:req.user.id,
      name: req.body.taskName,
      createdAt: Date.now(),
      list: req.body.list
    });
    t1.save(function(err){
      if(err){
        console.log(err);}
    });
    taskList.findOneAndUpdate(
      {name:req.body.list},
      {$push: {Task: t1}
        },function(err){
          if(err){
            console.log(err);
          }else{
            res.redirect('/all-tasks');
          }
        }
    )
  }
});

app.listen(process.env.PORT || 3000);