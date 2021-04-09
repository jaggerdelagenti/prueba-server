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
    user_model_1.User.findOne({ email: body.email }, (err, userDB) => {
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
                email: userDB.email,
                avatar: userDB.avatar
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
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.username,
        password: bcrypt_1.hashSync(req.body.password, 10),
    };
    user_model_1.User.create(user).then(userDB => {
        //rol profesional
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB.id,
            firstname: userDB.firstname,
            lastname: userDB.lastname,
            username: userDB.username,
            email: userDB.email,
        });
        res.json({
            ok: true,
            token: tokenUser
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
        firstname: req.body.firstname || req.user.firstname,
        lastname: req.body.lastname || req.user.lastname,
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
            firstname: userDB.firstname,
            lastname: userDB.lastname,
            email: userDB.email,
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    });
});
exports.default = userRoutes;
