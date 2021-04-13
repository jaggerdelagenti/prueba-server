"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = require("bcrypt");
const token_1 = __importDefault(require("../classes/token"));
const autentication_1 = require("../middlewares/autentication");
const userRoutes = express_1.Router();
//login
userRoutes.post('/login', (req, res) => {
    const body = req.body;
    user_model_1.User.findOne({ username: body.username }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            res.json({
                ok: false,
                message: 'User/Pass no son correctos'
            });
        }
        if (userDB.comparePass(body.password)) {
            const tokenUser = token_1.default.getJwtToken({
                _id: userDB.id,
                name: userDB.name,
                username: userDB.username,
                email: userDB.email
            });
            res.json({
                ok: true,
                token: tokenUser
            });
        }
        else {
            res.json({
                ok: false,
                token: 'User o pass no son correctos'
            });
        }
    });
});
//crear user
userRoutes.post('/create', (req, res) => {
    const user = {
        firstname: req.body.first_name,
        lastname: req.body.last_name,
        email: req.body.email,
        username: req.body.username,
        password: bcrypt_1.hashSync(req.body.password, 10),
    };
    user_model_1.User.create(user).then(userDB => {
        //rol profesional
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB.id,
            firstname: userDB.first_name,
            lastname: userDB.last_name,
            username: userDB.username,
            email: userDB.email,
        });
        let filter = {};
        user_model_1.User.find(filter, (err, usersDB) => {
            if (err)
                throw err;
            if (!usersDB) {
                return res.json({
                    ok: false,
                    message: 'users not founded'
                });
            }
            res.json({
                ok: true,
                token: tokenUser
            });
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
//actualizar user
userRoutes.put('/update', autentication_1.checkingToken, (req, res) => {
    const user = {
        first_name: req.body.firstname || req.user.first_name,
        last_name: req.body.lastname || req.user.last_name,
        username: req.body.username || req.user.username,
        email: req.body.email || req.user.email,
        password: req.body.password || req.user.password,
    };
    user_model_1.User.findByIdAndUpdate(req.user._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                message: 'No existe un user con ese ID'
            });
        }
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            firstname: userDB.first_name,
            lastname: userDB.last_name,
            email: userDB.email,
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    });
});
//get user
userRoutes.get('/user', autentication_1.checkingToken, (req, res) => {
    const user = {
        username: req.body.username || req.user.username,
        email: req.body.email || req.user.email
    };
    user_model_1.User.findById(req.user._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                message: 'No existe un user con ese ID'
            });
        }
        const User = {
            _id: userDB._id,
            username: userDB.username,
            email: userDB.email,
        };
        res.json({
            ok: true,
            token: User
        });
    });
});
exports.default = userRoutes;
