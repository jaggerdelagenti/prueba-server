import{Response,Request,NextFunction} from 'express';
import Token from '../classes/token';
import { IUser } from '../models/user.model';

export const checkingToken = (req:any,res:Response,next:NextFunction)=>{
    const userToken = req.get('x-token')||'';

    Token.checkToken(userToken)
    .then((decoded:any)=>{
        console.log('Decoded', decoded);
        req.user=decoded.user;
        //console.log(req.user)
        next();
    })
    .catch(err=>{
        res.json({
            ok:false,
            mensaje:'Token is wrong'
        })  
    })
}