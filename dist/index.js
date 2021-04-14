"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const user_1 = __importDefault(require("./routes/user"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const server = new server_1.default();
//Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//connection string
const MONGODB_URI = 'mongodb+srv://maximendez:DMwQ0PjDaAXvBj1f@cluster0.2db6g.mongodb.net/test?retryWrites=true&w=majority';
//Connect db
mongoose_1.default.connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err)
        throw err;
    console.log('Starships users database loaded successfully');
});
server.start(() => {
    console.log(`Server running in port ${server.port}`);
});
//CORS settings
server.app.use(cors_1.default({ origin: true, credentials: true }));
//app routes
server.app.use('/user', user_1.default);
