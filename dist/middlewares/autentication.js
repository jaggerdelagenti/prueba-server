"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkingToken = void 0;
const token_1 = __importDefault(require("../classes/token"));
const checkingToken = (req, res, next) => {
    const userToken = req.get('x-token') || '';
    token_1.default.checkToken(userToken)
        .then((decoded) => {
        console.log('Decoded', decoded);
        req.user = decoded.user;
        //console.log(req.user)
        next();
    })
        .catch(err => {
        res.json({
            ok: false,
            mensaje: 'Token is wrong'
        });
    });
};
exports.checkingToken = checkingToken;
