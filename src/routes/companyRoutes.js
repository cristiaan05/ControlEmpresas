'use strict'
var express=require("express");
var CompanyController=require('../controllers/companyController');
var md_auth=require('../middlewares/autheticated');

var api=express.Router();

api.post('/createCompany',md_auth.ensureAuth,CompanyController.createCompany);
api.put('/updateCompany/:id',md_auth.ensureAuth,CompanyController.updateCompany);
api.delete('/deleteCompany/:id',md_auth.ensureAuth,CompanyController.deleteCompany);
api.post('/readCompanies',CompanyController.readCompanies);
api.get('/searchCompany',CompanyController.searchCompany);

module.exports=api;