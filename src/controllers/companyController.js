'use strict'

var Company= require('../models/company');

function createCompany(req,res) {
    if (req.user.rol=='admin') {
        var company= new Company();
        var params= req.body;
    if (params.nombre && params.email && params.telefono) {
        company.nombre = params.nombre;
        company.nit=params.nit;
        company.direccion= params.direccion;
        company.email=params.email;
        company.telefono=params.telefono;

        Company.find({
            $or:[
                {email:company.email.toLowerCase()},
                {email: company.email.toLowerCase()}
            ]
        }).exec((err,companys)=>{
            if(err) return res.status(500).send({message: 'Error en peticion del usuario'});

            if (companys && companys.length >=1) {
                return res.status(500).send({message:'La empresa ya existe en el sistema'})
            } else {
                    company.save((err,companySaved)=>{
                        if(err) return res.status(500).send({message: 'Error al guardar la empresa'});
    
                        if (companySaved) {
                            res.status(200).send({company: companySaved});
                        } else {
                            res.status(404).send({message: 'No se ha podido ingresar la empresa'});
                        }
                    })
            }
        })
    } else {
        res.status(202).send({
            message:'Rellene todos los campos necesarios'
        });
    }
    } else {
        res.status(202).send({
            message:'No tiene permisos para crear una empresa'
        })
    }
    
}

function updateCompany(req,res) {
    var companyId= req.params.id;
    var params= req.body;
    if(companyId != req.company.sub){
        if (req.user.rol=='admin') {
            Company.findByIdAndUpdate(companyId,params,{new:true}, (err,companyUpdated)=>{
                if(err) return res.status(500).send({message:'error en la peticon'});

                if(!companyUpdated) return res.status(404).send({message: 'No se ha podido actualizar esta compañia'});

                return res.status(200).send({company: companyUpdated});
            });
        } else {
            return res.status(500).send({message: 'No tiene permisos para editar esta empresa'});
        }
    }else{
        Company.findByIdAndUpdate(companyId,params,{new:true}, (err,companyUpdated)=>{
            if(err) return res.status(500).send({message:'error en la peticon'});

            if(!companyUpdated) return res.status(404).send({message: 'No se ha podido actualizar esta compañia'});

            return res.status(200).send({company: companyUpdated});
            });
    }
}

function deleteCompany(req,res) {
    var companyId= req.params.id;
    if (companyId != req.company.sub) {
        if (req.user.rol=='admin') {
            Company.findByIdAndRemove(companyId,(err,companyDeleted)=>{
                if(err) return res.status(500).send({message: 'Error en la peticion del usuario'});
                if(!companyDeleted) return res.status(404).send({message: 'No se ha podido eliminar la empresa'});
                var mensaje="Empresa eliminada :  " + companyDeleted.nombre
                return res.status(202).send(mensaje)
            })
        } else {
            res.status(202).send({
                message:'No tiene permisos para eliminar empresas'
            })
        }
    } else {
        Company.findByIdAndRemove(companyId,(err,companyDeleted)=>{
            if(err) return res.status(500).send({message: 'Error en la peticion del usuario'});
            if(!companyDeleted) return res.status(404).send({message: 'No se ha podido eliminar la empresa'});
            var mensaje="Eliminado"
            return res.status(202).send(mensaje)
        });
    }
}

function readCompanies(req,res) {
    Company.find(req.params.id,function name(err,company) {
        if(err) return next(err);
        res.send(company);
    })
}



function searchCompany(req,res,next) {
    var nombre=req.body.nombre
            Company.find({nombre:{$regex:"^"+nombre, $options:"i"}},(err,company)=>{
                    if (!company) return res.status(404).send({message:'No se ha encontrado ningun estudiante'})
                    if(err){
                        return res.status(500).send({message: 'Error con el metodo de busqueda'})
                     }else{
                         return res.status(200).send({Empresas:company});
                     }
                
            })      
}

module.exports={
    createCompany,
    updateCompany,
    deleteCompany,
    readCompanies,
    searchCompany
}