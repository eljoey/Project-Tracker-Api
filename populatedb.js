console.log('This script populates the db')

const userArgs = process.argv.slice(2)

const async = require('async')
const User = require('./models/user')
const Project = require('./models/project')
const Feature = require('./models/feature')
const Bug = require('./models/bug')
const Comment = require('./models/comment')

const bcrypt = require('bcrypt')

const mongoose = require('mongoose')
const mongoDB = userArgs[0]
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error'))

let users = []
let projects = []
let features = []
let bugs = []
let comments = []

const userCreate = async (
  username,
  firstName,
  lastName,
  password,
  projectsArr,
  cb
) => {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  let userDetail = {
    username: username,
    passwordHash,
    firstName: firstName,
    lastName: lastName,
    created: Date.now(),
    projects: projectsArr
  }

  let user = new User(userDetail)

  user.save(function(err) {
    if (err) {
      cb(err, null)
      return
    }

    console.log('New User: added')
    users.push(user)
    cb(null, user)
  })
}

const projectCreate = (
  name,
  description,
  admin,
  membersArr,
  bugsArr,
  featuresArr,
  cb
) => {
  let projectDetail = {
    name: name,
    description: description,
    admin: admin,
    members: membersArr,
    created: Date.now(),
    bugs: bugsArr,
    features: featuresArr
  }

  let project = new Project(projectDetail)

  project.save(function(err) {
    if (err) {
      cb(err, null)
      return
    }

    console.log('New Project: added')
    projects.push(project)
    cb(null, project)
  })
}

const featureCreate = (name, description, proj, createdBy, commentsArr, cb) => {
  let featureDetail = {
    name: name,
    description: description,
    project: proj,
    createdBy: createdBy,
    created: Date.now(),
    comments: commentsArr
  }

  let feature = new Feature(featureDetail)

  feature.save(function(err) {
    if (err) {
      cb(err, null)
      return
    }

    console.log('New Feature: added')
    features.push(feature)
    cb(null, feature)
  })
}

const bugCreate = (name, description, proj, createdBy, commentsArr, cb) => {
  let bugDetail = {
    name: name,
    description: description,
    project: proj,
    createdBy: createdBy,
    created: Date.now(),
    comments: commentsArr
  }

  let bug = new Bug(bugDetail)

  bug.save(function(err) {
    if (err) {
      cb(err, null)
      return
    }

    console.log('New Bug: feature')
    bugs.push(bug)
    cb(null, bug)
  })
}

const commentCreate = (user, content, cb) => {
  let commentDetail = {
    user: user,
    content: content,
    created: Date.now()
  }

  let comment = new Comment(commentDetail)

  comment.save(function(err) {
    if (err) {
      cb(err, null)
      return
    }

    console.log('New Comment: added')
    comments.push(comment)
    cb(null, comment)
  })
}

const updateUser = async (userId, projIndex) => {
  let user = await User.findById(userId)

  const updatedUser = new User({
    ...user.toObject(),
    projects: projects[projIndex]
  })

  await User.findByIdAndUpdate(userId, updatedUser, { new: true })
}

const updateProject = async (projId, featureIndex, bugIndex) => {
  let project = await Project.findById(projId)

  const updatedProject = new Project({
    ...project.toObject(),
    features: features[featureIndex],
    bugs: bugs[bugIndex]
  })

  await Project.findByIdAndUpdate(projId, updatedProject, { new: true })
}

const createUsers = cb => {
  async.series(
    [
      function(callback) {
        userCreate('TestUser0', 'Test', 'User', 'testpassword0', [], callback)
      },
      function(callback) {
        userCreate('TestUser1', 'Test', 'User', 'testpassword1', [], callback)
      },
      function(callback) {
        userCreate('TestUser2', 'Test', 'User', 'testpassword2', [], callback)
      },
      function(callback) {
        userCreate('TestUser3', 'Test', 'User', 'testpassword3', [], callback)
      }
    ],
    cb
  )
}

const createComments = cb => {
  async.series(
    [
      function(callback) {
        commentCreate(users[0], 'This is a comment 0', callback)
      },
      function(callback) {
        commentCreate(users[1], 'This is a comment 1', callback)
      },
      function(callback) {
        commentCreate(users[1], 'This is a comment 2', callback)
      },
      function(callback) {
        commentCreate(users[2], 'This is a comment 3', callback)
      },
      function(callback) {
        commentCreate(users[2], 'This is a comment 4', callback)
      },
      function(callback) {
        commentCreate(users[3], 'This is a comment 5', callback)
      },
      function(callback) {
        commentCreate(users[3], 'This is a comment 6', callback)
      },
      function(callback) {
        commentCreate(users[0], 'This is a comment 7', callback)
      },
      function(callback) {
        commentCreate(users[0], 'This is a comment 8', callback)
      },
      function(callback) {
        commentCreate(users[1], 'This is a comment 9', callback)
      },
      function(callback) {
        commentCreate(users[1], 'This is a comment 10', callback)
      },
      function(callback) {
        commentCreate(users[2], 'This is a comment 11', callback)
      },
      function(callback) {
        commentCreate(users[2], 'This is a comment 12', callback)
      },
      function(callback) {
        commentCreate(users[3], 'This is a comment 13', callback)
      },
      function(callback) {
        commentCreate(users[3], 'This is a comment 14', callback)
      },
      function(callback) {
        commentCreate(users[0], 'This is a comment 15', callback)
      }
    ],
    cb
  )
}

const createProjects = cb => {
  async.series(
    [
      function(callback) {
        projectCreate(
          'Test Project 0',
          'This is a project 0',
          users[0],
          [users[0], users[1]],
          [],
          [],
          callback
        )
      },
      function(callback) {
        projectCreate(
          'Test Project 0',
          'This is a project 1',
          users[1],
          [users[1], users[2]],
          [],
          [],
          callback
        )
      },
      function(callback) {
        projectCreate(
          'Test Project 0',
          'This is a project 2',
          users[2],
          [users[2], users[3]],
          [],
          [],
          callback
        )
      },
      function(callback) {
        projectCreate(
          'Test Project 0',
          'This is a project 3',
          users[3],
          [users[3], users[0]],
          [],
          [],
          callback
        )
      }
    ],
    cb
  )
}

//name, description, proj, createdBy, commentsArr, cb
const createFeatures = cb => {
  async.series(
    [
      function(callback) {
        featureCreate(
          'Test Feature 0',
          'This is a feature 0',
          projects[0],
          users[0],
          [comments[0], comments[1]],
          callback
        )
      },
      function(callback) {
        featureCreate(
          'Test Feature 0',
          'This is a feature 1',
          projects[1],
          users[1],
          [comments[2], comments[3]],
          callback
        )
      },
      function(callback) {
        featureCreate(
          'Test Feature 0',
          'This is a feature 2',
          projects[2],
          users[2],
          [comments[4], comments[5]],
          callback
        )
      },
      function(callback) {
        featureCreate(
          'Test Feature 0',
          'This is a feature 3',
          projects[3],
          users[3],
          [comments[6], comments[7]],
          callback
        )
      }
    ],
    cb
  )
}

//name, description, proj, createdBy, commentsArr, cb
const createBugs = cb => {
  async.series(
    [
      function(callback) {
        bugCreate(
          'Test Bug 0',
          'This is a bug 0',
          projects[0],
          users[0],
          [comments[8], comments[9]],
          callback
        )
      },
      function(callback) {
        bugCreate(
          'Test Bug 0',
          'This is a bug 1',
          projects[1],
          users[1],
          [comments[10], comments[11]],
          callback
        )
      },
      function(callback) {
        bugCreate(
          'Test Bug 0',
          'This is a bug 2',
          projects[2],
          users[2],
          [comments[12], comments[13]],
          callback
        )
      },
      function(callback) {
        bugCreate(
          'Test Bug 0',
          'This is a bug 3',
          projects[3],
          users[3],
          [comments[14], comments[15]],
          callback
        )
      }
    ],
    cb
  )
}

const updateUsersDB = cb => {
  async.parallel(
    [
      async function(callback) {
        await updateUser(users[0]._id, 0, callback)
      },
      async function(callback) {
        await updateUser(users[1]._id, 1, callback)
      },
      async function(callback) {
        await updateUser(users[2]._id, 2, callback)
      },
      async function(callback) {
        await updateUser(users[3]._id, 3, callback)
      }
    ],
    cb
  )
}

const updateProjectDB = cb => {
  async.parallel(
    [
      async function(callback) {
        await updateProject(projects[0]._id, 0, 0)
      },
      async function(callback) {
        await updateProject(projects[1]._id, 1, 1)
      },
      async function(callback) {
        await updateProject(projects[2]._id, 2, 2)
      },
      async function(callback) {
        await updateProject(projects[3]._id, 3, 3)
      }
    ],
    cb
  )
}

async.series(
  [
    createUsers,
    createComments,
    createProjects,
    createFeatures,
    createBugs,
    updateUsersDB,
    updateProjectDB
  ],
  function(err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err)
    } else {
      console.log('FINISHED')
    }

    mongoose.connection.close()
  }
)
