const express = require('express')
const router = express.Router()

const {
  userRouter,
  projectRouter,
  featureRouter
} = require('./controllers/index')

// Create user: POST
router.post('/user/create', userRouter.user_create_post)

// Find user: GET
router.get('/:userId', userRouter.user_id_get)

// Find project: GET
router.get('/:userId/project/:projId', projectRouter.project_id_get)

// Create project: POST
router.post('/:userId/project/create', projectRouter.project_create_post)

// Delete project: POST
router.post(
  '/:userId/project/delete/:projId',
  projectRouter.project_delete_post
)

module.exports = router
