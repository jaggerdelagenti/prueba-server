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
        /* this.app.listen(process.env.PORT , callback); */
        const port = process.env.PORT || 8080;
        app.listen(port, () => {
            console.log('Express server listening on port', port)
        });
    }
}
exports.default = Server;
