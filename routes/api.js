const express = require('express')
const router = express.Router()

const { userRouter, projectRouter } = require('./controllers/index')

router.post('/user/create', userRouter.user_create_post)

router.get('/user/:id', userRouter.user_id_get)

router.get('/user/:username/projects', userRouter.projects_get)

module.exports = router
