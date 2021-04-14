import Server from './classes/server';
import userRoutes from './routes/user';
import mongoose, { mongo } from 'mongoose';
import bodyparser from 'body-parser';
import cors from 'cors';


const server = new Server();

//Body parser
server.app.use(bodyparser.urlencoded({extended:true}))
server.app.use(bodyparser.json())

//connection string
const MONGODB_URI='mongodb+srv://maximendez:DMwQ0PjDaAXvBj1f@cluster0.2db6g.mongodb.net/test?retryWrites=true&w=majority'

//Connect db
mongoose.connect(MONGODB_URI,
{useNewUrlParser:true,useCreateIndex:true},(err)=>{
    if(err) throw err;
    console.log('Starships users database loaded successfully')
})

server.start(()=>{
    console.log(`Server running in port ${server.port}`);
})


//CORS settings
server.app.use(cors({origin:true, credentials:true}));


//app routes
server.app.use('/user',userRoutes)


