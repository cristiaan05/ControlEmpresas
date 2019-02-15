'use strict'
const mongoose=require("mongoose");
const app=require("./app");
const User= require("./models/user");
var bcrypt = require('bcrypt-nodejs');

//connection to mongo
mongoose.Promise= global.Promise;
mongoose.connect('mongodb://localhost:27017/controlEmpresas', {useNewUrlParser: true}).then(()=>{
    console.log('Exito en la conexion hacia la basa de datos');

    app.set('port', process.env.PORT || 3000);
    app.listen(app.get('port'), ()=>{
        console.log(`Servidor corriendo en puerto:'${app.get('port')}'`);
    })
    
    module.exports.init=function createAdmin(req,res) {
        var user = new User();
        user.nombre = 'admin';
        user.usuario = 'admin';
        user.email = 'admin@gmail.com';
        user.password = '123';
        user.rol = 'admin';

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
                bcrypt.hash(user.password, null, null, (err, hash) => {
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
    }
}).catch(err => console.log(err));