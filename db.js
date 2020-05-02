// 1ST DRAFT DATA MODEL
const mongoose = require('mongoose');

/*
dummy entry in mongo shell
db.user.insert({
  userName: 'allen',
  email: 'allen',
  password: 'allen',
  taskList:  []
});
*/

// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more lists
const Task = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  name: {type: String, required: true},
  createdAt: {type: Date, required: true},
  completed: {type: Boolean, default: false, required: true},
  list: {type: String, required: true}
}, {
    collection: 'Task',
    //_id: true
});
mongoose.model('Task', Task);

const taskList = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  name: {type: String, required: true},
  Task: [Task]
},{ collection: 'taskList' });
mongoose.model('taskList', taskList);

const User = new mongoose.Schema({
  userName: {type: String, required: true},
  password: {type: String, required: true},
  taskList:  [taskList]
},{ collection: 'User' });

mongoose.model('User', User);


// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, './config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/finalproject';
}
//followed console deprecation error instructions
mongoose.connect(dbconf,{ useNewUrlParser: true, useUnifiedTopology: true});






// a task
// * includes an optional finish by time of this task 
// * tasks in a list can be checked off


// a grocery list
// * each list must have a related user
// * a list can have 0 or more items

/*
const allTasks = new mongoose.Schema({
  //user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  allTasks: [taskList]
},{ collection: 'allTasks' });

mongoose.model('allTasks', allTasks);
*/
// TODO: add remainder of setup for slugs, connection, registering models, etc. below

