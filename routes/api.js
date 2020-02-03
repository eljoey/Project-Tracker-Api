const express = require('express')
const router = express.Router()

const { userRouter } = require('./controllers/index')

router.get('/user/:id', userRouter.user_id_get)

router.post('/user/create', userRouter.user_create_post)

module.exports = router
