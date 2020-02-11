const userRouter = require('./user/userController')
const projectRouter = require('./project/projectController')
const featureRouter = require('./feature/featureController')
const bugRouter = require('./bug/bugController')
const commentRouter = require('./comment/commentController')

module.exports = {
  userRouter,
  projectRouter,
  featureRouter,
  bugRouter,
  commentRouter
}
