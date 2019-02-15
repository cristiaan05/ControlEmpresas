'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');
var path = require('path');
var fs = require('fs');

function login(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({ email: email }, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error de la petición' })
        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    if (params.gettoken) {
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        })
                    } else {
                        user.password = undefined;
                        return res.status(200).send({ user })
                    }
                } else {
                    return res.status(404).send({ message: 'El usuario no se ha podido identificar' })
                }
            })
        } else {
            return res.status(404).send({ message: 'El usuario no se ha podido loggear' })
        }
    })
}

function registerUser(req, res) {
    if (req.user.rol == 'admin') {
        var user = new User();
        var params = req.body;
        if (params.usuario && params.email && params.password) {
            user.nombre = params.nombre;
            user.usuario = params.usuario;
            user.email = params.email;
            user.password = params.password;
            user.rol = 'user';

            User.find({
                $or: [
                    { email: user.email.toLowerCase() },
                    { email: user.email.toUpperCase() },
                    { usuario: user.usuario.toLowerCase() },
                    { usuario: user.usuario.toUpperCase() }
                ]
            }).exec((err, users) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion del usuario' });

                if (users && users.length >= 1) {
                    return res.status(500).send({ message: 'El usuario ya existe en el sistema' })
                } else {
                    bcrypt.hash(params.password, null, null, (err, hash) => {
                        user.password = hash;

                        user.save((err, userSaved) => {
                            if (err) return res.status(500).send({ message: 'Error al guardar el usuario' });

                            if (userSaved) {
                                res.status(200).send({ user: userSaved });
                            } else {
                                res.status(404).send({ message: 'No se ha podido registrar al usuario' });
                            }
                        })
                    })
                }
            })
        } else {
            res.status(202).send({
                message: 'Rellene todos los campos necesarios'
            });
        }
    } else {
        res.status(202).send({
            message: 'No tiene permisos para crear un usuario'
        });
    }
}

function updateUser(req, res) {
    var userId = req.params.id;
    var params = req.body;

    delete params.password; //esto evita que cambiemos la contrasena
    if (userId != req.user.sub) {
        if (req.user.rol == 'admin') {
            if (params.rol == 'admin' || params.rol =='user') {
                User.findByIdAndUpdate(userId, params, { new: true }, (err, userUpdated) => {
                    if (err) return res.status(500).send({ message: 'error en la peticion' });
    
                    if (!userUpdated) return res.status(404).send({ message: 'No se ha podido actualizar este usuario' });
    
                    return res.status(200).send({ user: userUpdated });
                });
                
            } else {
                return res.status(404).send({
                    message:'No se puede modificar a ese tipo de usuario, colocar "admin" o "user" '
                })
            } 
        } else {
            return res.status(500).send({ message: 'No tiene permisos para editar este usuario' });
        }
    } else {
        if(req.body.rol=='admin'){
            return res.status(202).send({
                message:'No tiene permisos para modificar el rol'
            })
        }else{
                User.findByIdAndUpdate(userId, params, { new: true }, (err, userUpdated) => {
                    if (err) return res.status(500).send({ message: 'error en la peticion' });
        
                    if (!userUpdated) return res.status(404).send({ message: 'No se ha podido actualizar este usuario' });
        
                    return res.status(200).send({ user: userUpdated });
                });
        }
        
    }
}

function deleteUser(req, res) {
    var userId = req.params.id;
    if (userId != req.user.sub) {
        if (req.user.rol == 'admin') {
            User.findById(userId,(err,userFounded)=>{
                if (err) return res.status(500).send({ message: 'error en al peticion' });
                if (!userFounded) return res.status(404).send({ message: 'No se ha encontrado el Usuario' });
                if (userFounded.rol =='admin') {
                    return res.status(202).send({
                        message:'No puede eliminar a otro administrador'
                    })
                } else {
                    User.findByIdAndRemove(userId, (err, userDeleted) => {
                    if (err) return res.status(500).send({ message: 'error en al peticion' });
                    if (!userDeleted) return res.status(404).send({ message: 'No se ha podido eliminar el usuario' });
                    var mensaje = "Eliminado"
                    return res.status(202).send(mensaje)
                    })
                }
            })         
        } else {
            res.status(200).send({
                message:'No tiene permisos para eliminar este usuario'
            })
        }
    } else {
        User.findByIdAndRemove(userId, (err, userUpdated) => {
            if (err) return res.status(500).send({ message: 'error en al peticion' });
            if (!userUpdated) return res.status(404).send({ message: 'No se ha podido eliminar el usuario' });
            var mensaje = "Elimnado"
            return res.status(202).send(mensaje)
        });
    }
}

module.exports = {
    login,
    registerUser,
    updateUser,
    deleteUser
}

