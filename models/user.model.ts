
import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';

//User Schema
const userSchema = new Schema({
    
    firstname: {
        type: String,
        required: [ true, 'First name is required' ]
    },
    lastname: {
        type: String,
        required: [ true, 'Last name is required' ]
    },
    username: {
        type: String,
        required: [ true, 'Username is required' ]
    },
    email: {
        type: String,
        unique: true,
        required: [ true, 'Email is required' ]
    },
    password: {
        type: String,
        required: [ true, 'Password is required']
    }    
    
},{
    collection:'users', timestamps: {createdAt: 'created', updatedAt: 'updated'}
});

userSchema.method('comparePass', function<Any>( password: string = ''): boolean {
    if (  bcrypt.compareSync( password, this.password ) ) {
        return true;
    } else {
        return false;
    }
});

export interface IUser extends Document {
    first_name: string;
    last_name:string;
    email: string;
    username:string;
    password: string;   
    comparePass(password: string): boolean;
}

export const User = model<IUser>('User', userSchema);
