# Human Task Manager

## Overview


My website will be a To-Do List, with multiple pages separating work tasks, personal tasks, and basic errands. It will have the option to set a time to remind you to do it, a complete box, and a do later option. The list will allow you to filter all tasks, completed tasks, and incomplete tasks.


## Data Model


The application will store Users, Lists of tasks and Tasks

* users can have multiple lists of tasks (by reference)
* these tasks will have header links for quick access on layout.hbs
* each list can have multiple tasks (stored in list)
* each task will have 2 timestamps, the created timestamp, and the reminder timestamp


An Example User:

```javascript
{
  username: "shannonshopper",
  hash: // a password hash,
  task_lists: // an array of references to List documents
}
```

An Example List with Embedded Items:

```javascript
{
  user: // a reference to a User object
  name: "Errands",
  tasks: [
    { name: "Buy milk",createdAt: "10:00AM", completed: false},
    { name: "Workout",createdAt: "10:00AM", completed: true},
  ]
}
```


## [Link to Commented First Draft Schema](https://github.com/nyu-csci-ua-0480-008-spring-2020/al5361-final-project/blob/34465794ba6eb5f601cddf98febad00448c04bee/db.js)

## Wireframes


/task/new - page for creating a new task list

![add task](documentation/addtask.xd)

/task - page for showing all tasks list

![all tasks list w/ links](documentation/tasks.xd)

/task/{{task name}} - page for showing specific shopping list

![specific task list](documentation/taskslug.xd)

task/{{task name}}/complete - page for showing specific shopping list

![completed task for slug](documentation/completedTasks.xd)

task/{{task name}}/incomplete - page for showing specific shopping list

![incomplete task for slug](documentation/incompletetasks.xd/)



## Site map


[simple drawing of site map](documentation/siteMap.jpeg)

## User Stories or Use Cases


1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can create a new task list
4. as a user, I can add tasks to an existing tasks list
5. as a user, I can cross off items in an existing tasks list

## Research Topics


* (5 points) Integrate user authentication
    * I'm going to be using passport for user authentication
* (3 points) Perform client side form validation using express-flash and passport
    * Will use express-flash to validate registration, login, logout, and pages that require users to be logged in
* (2 points) Bootstrap Css
    * Will use premade css template to make the website professional
10 points total out of 8 required points (x addtional points will not count for extra credit_)


## [Link to Initial Main Project File](https://github.com/nyu-csci-ua-0480-008-spring-2020/al5361-final-project/blob/9cd282ddeeb746d4433dbf4c3d61dc189c3e8841/app.js)

## Annotations / References Used
1. [passport.js authentication docs](http://passportjs.org/docs) (https://www.youtube.com/watch?v=-RCnNyD0L-s&t=1684s) (https://www.youtube.com/watch?v=6FOq4cUdH8k&t=3902s)
2. [tutorial on bcrypt](https://www.npmjs.com/package/bcrypt) 
3. [express-flash](https://www.npmjs.com/package/express-flash) 
4. [bootstrap](https://getbootstrap.com/) (https://bootswatch.com/simplex)
