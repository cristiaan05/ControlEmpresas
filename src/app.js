'use strict'
//variables globales
const express= require("express");
const app= express();
const bodyparser= require("body-parser")


//load routes
var user_routes = require('./routes/userRoutes');
var company_routes=require('./routes/companyRoutes');

//middlewares
app.use(bodyparser.urlencoded({ extended:false}));
app.use(bodyparser.json());

//headers
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headears','Authorization , X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Acces-Control-Allow-Request-Method');
    res.header('Access.Control-Allow-Methods', 'GET', 'POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
})

//rutas
app.use('/api', user_routes,company_routes);

//exportar
module.exports=app;