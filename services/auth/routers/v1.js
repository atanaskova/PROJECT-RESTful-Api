const express=require('express');
const router=express.Router();
const controller=require('../../../controllers/auth');

router
    .post('/register', controller.register)
    .post('/login', controller.login)
    .get('/refreshToken', controller.refresh_token);

module.exports=router;