const express = require('express')
const router = express.Router()

const { userRouter, projectRouter } = require('./controllers/index')

router.post('/user/create', userRouter.user_create_post)

router.get('/:id', userRouter.user_id_get)

router.post('/:id/project/create', projectRouter.project_create_post)

module.exports = router
