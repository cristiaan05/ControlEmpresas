'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var CompanySchema=Schema({
    nombre:String,
    nit:String,
    direccion:String,
    email:String,
    telefono:String,
})

module.exports= mongoose.model('Company',CompanySchema);