const express = require('express')
const router = express.Router()

const { userRouter } = require('./controllers/index')

router.post('/', userRouter.user_create_post)

module.exports = router
