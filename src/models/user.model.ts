import mongoose,{Schema,model,models} from "mongoose";

interface IUser{
    email:string;
    password:string;
    
}

let userSchema;