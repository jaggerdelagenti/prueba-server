import{Router, Request, Response} from 'express';
import { User } from '../models/user.model';
import {hashSync} from 'bcrypt';
import Token from '../classes/token';
import { checkingToken } from '../middlewares/autentication';

const userRoutes = Router();


//login
userRoutes.post('/login', (req:Request,res:Response)=>{
    const body= req.body;

    User.findOne({email:body.email},(err:any,userDB:any)=>{
        if(err)throw err;
        if(!userDB){
            res.json({
                ok:false,
                message:'User/Pass no son correctos'
            })
        }

        if(userDB.comparePass(body.password)){

            const tokenUser = Token.getJwtToken({
                _id:userDB.id,
                name:userDB.name,
                email:userDB.email,
                avatar:userDB.avatar
            })

            res.json({
                ok:true,
                token:tokenUser
            });
        }else{
            res.json({
                ok:false,
                token:'User o pass no son correctos'
            })
        }
    })
})

//crear user
userRoutes.post('/create',(req:Request,res:Response)=>{
    const user ={
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email,
        username:req.body.username,
        password:hashSync(req.body.password, 10),
    }
    User.create(user).then(userDB=>{

        //rol profesional
        const tokenUser = Token.getJwtToken({
            _id:userDB.id,
            firstname:userDB.firstname,
            lastname:userDB.lastname,
            username:userDB.username,
            email:userDB.email,            
        })

        res.json({
            ok:true,
            token:tokenUser
        });
    }).catch(err=>{
        res.json({
            ok:false,
            err
        })
    })    
})

//actualizar user
 userRoutes.put('/update', checkingToken, (req: any, res: Response ) => {

     const user = {
       firstname: req.body.firstname || req.user.firstname,
       lastname: req.body.lastname || req.user.lastname,
       username: req.body.username || req.user.username,
       email : req.body.email  || req.user.email,
       password : req.body.password  || req.user.password,
       
   }

   User.findByIdAndUpdate( req.user._id, user, { new: true }, (err, userDB) => {

       if ( err ) throw err;

       if ( !userDB ) {
           return res.json({
               ok: false,
               message: 'No existe un user con ese ID'
           });
       }

       const tokenUser = Token.getJwtToken({
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


export default userRoutes;