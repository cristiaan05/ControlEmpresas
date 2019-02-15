'use strict'
var express= require('express');
var UserController=require('../controllers/userController');
var md_auth=require('../middlewares/autheticated');

//Rutas
var api=express.Router();
api.post('/login',UserController.login);
api.post('/registerUser',md_auth.ensureAuth,UserController.registerUser);
api.put('/updateUser/:id',md_auth.ensureAuth,UserController.updateUser);
api.delete('/deleteUser/:id',md_auth.ensureAuth,UserController.deleteUser);

module.exports=api;