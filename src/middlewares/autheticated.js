'use strict'

var jwt=require('jwt-simple');
var moment= require('moment');
var secret='secret_pass_sells';

exports.ensureAuth=function (req,res,next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'La peticion no tiene la cabecera de autentificacion'})
    }

    var token= req.headers.authorization.replace(/['"]+/g, '');
    var payload=null;
    try {
        payload= jwt.decode(token,secret);

        if (payload.exp <= moment().unix()) { // token expirara segun el tiempo 
            return res.status(401).send({
                message: 'El token ha expirado'
            })
        }
    } catch (ex) {
        return res.status(404).send({
            message:'El token no es valido'
        })        
    }

    req.user=payload;
    req.company=payload;
    next();
}