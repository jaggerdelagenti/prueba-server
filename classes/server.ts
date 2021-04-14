import express from 'express';

export default class Server{
    public app: express.Application;
    public port: number=3000;

    constructor(){
        this.app=express();
    }

    start(callback:any){
        const PORT = process.env.PORT || 3000;
        this.app.listen(PORT, callback);
    }
}