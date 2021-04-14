"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class Server {
    constructor() {
        this.port = 3000;
        this.app = express_1.default();
    }
    start(callback) {
        const PORT = process.env.PORT || 3000;
        this.app.listen(PORT, callback);
    }
}
exports.default = Server;
