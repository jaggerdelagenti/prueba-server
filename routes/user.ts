import{Router, Request, Response} from 'express';
import { User } from '../models/user.model';
import {hashSync} from 'bcrypt';
import Token from '../classes/token';
import { checkingToken } from '../middlewares/autentication';

const userRoutes = Router();


//login
userRoutes.post('/login', (req:Request,res:Response)=>{
    const body= req.body;

    User.findOne({username:body.username},(err:any,userDB:any)=>{
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
                username:userDB.username,
                email:userDB.email
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
        firstname:req.body.first_name,
        lastname:req.body.last_name,
        email:req.body.email,
        username:req.body.username,
        password:hashSync(req.body.password, 10),
    }
    User.create(user).then(userDB=>{

        //rol profesional
        const tokenUser = Token.getJwtToken({
            _id:userDB.id,
            firstname:userDB.first_name,
            lastname:userDB.last_name,
            username:userDB.username,
            email:userDB.email,            
        })
        let filter={};
    
        User.find( filter, (err:any, usersDB:any) => {

            if ( err ) throw err;

            if ( !usersDB ) {
                return res.json({
                    ok: false,
                    message: 'users not founded'
                });
            } 

            res.json({
                ok:true,
                token:tokenUser
            });

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
       first_name: req.body.firstname || req.user.first_name,
       last_name: req.body.lastname || req.user.last_name,
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
 userRoutes.get('/user', checkingToken, (req: any, res: Response ) => {

    const user = {
      username: req.body.username || req.user.username,
      email : req.body.email  || req.user.email
  }
  User.findById( req.user._id, user, { new: true }, (err, userDB) => {

      if ( err ) throw err;

      if ( !userDB ) {
          return res.json({
              ok: false,
              message: 'No existe un user con ese ID'
          });
      }

      const User = {
          _id: userDB._id,
          username:userDB.username,
          email: userDB.email,
      };

      res.json({
          ok: true,
          token: User
      });


  });

});





export default userRoutes;