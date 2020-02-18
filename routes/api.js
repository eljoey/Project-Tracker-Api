const express = require('express')
const router = express.Router()

const {
  userRouter,
  projectRouter,
  featureRouter,
  bugRouter,
  commentRouter
} = require('./controllers/index')

//////////////////////////////////////
/////////////// USER /////////////////
//////////////////////////////////////

// Create user: POST
router.post('/user/create', userRouter.user_create_post)

// Find user: GET
router.get('/user', userRouter.user_id_get)

// Update user: POST
router.post('/user/update', userRouter.user_update_post)

//////////////////////////////////////////
/////////////// PROJECTS /////////////////
//////////////////////////////////////////

// Find all of the logged in users projects: Get
router.get('/projects', projectRouter.projects_get)

// Find project by ID: GET
router.get('/project/:projId', projectRouter.project_id_get)

// Create project: POST
router.post('/project/create', projectRouter.project_create_post)

// Update project: POST
router.post('/project/:projId/update', projectRouter.project_update_post)

// Delete project: POST
router.post('/project/:projId/delete', projectRouter.project_delete_post)

//////////////////////////////////////////
/////////////// FEATURES /////////////////
//////////////////////////////////////////

// Find all features in Project: GET
router.get('/project/:projId/features', featureRouter.features_get)

// Find single feature by ID: GET
router.get('/project/:projId/feature/:featureId', featureRouter.feature_id_get)

// Create feature: POST
router.post(
  '/project/:projId/feature/create',
  featureRouter.feature_create_post
)

// Update Feature: POST
router.post(
  '/project/:projId/feature/:featureId/update',
  featureRouter.feature_update_post
)

// Delete Feature: POST
router.post(
  '/project/:projId/feature/:featureId/delete',
  featureRouter.feature_delete_post
)

//////////////////////////////////////
/////////////// BUGS /////////////////
//////////////////////////////////////

// Find all bugs in Project: GET
router.get('/project/:projId/bugs', bugRouter.bugs_get)

// find single bug by ID: GET
router.get('/project/:projId/bug/:bugId', bugRouter.bug_id_get)

// Create Bug: POST
router.post('/project/:projId/bug/create', bugRouter.bug_create_post)

// Update Bug: POST
router.post('/project/:projId/bug/:bugId/update', bugRouter.bug_update_post)

// Delete Bug: POST
router.post('/project/:projId/bug/:bugId/delete', bugRouter.bug_delete_post)

//////////////////////////////////////////
/////////////// COMMENTS /////////////////
//////////////////////////////////////////

// Create Comment: POST
router.post('/:type/:typeId/comment/create', commentRouter.comment_create_post)

// Update Comment: POST
router.post(
  '/:type/:typeId/comment/:commentId/update',
  commentRouter.comment_update_post
)

// Delete Comment: POST
router.post(
  '/:type/:typeId/comment/:commentId/delete',
  commentRouter.comment_delete_post
)

module.exports = router

// TODO: BETTER ROUTES!!!!!
