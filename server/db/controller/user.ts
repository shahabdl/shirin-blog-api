import mongoose from "mongoose";
import userModel from '../models/user'

const getUserById = async (id: mongoose.Types.ObjectId) => {
    try{
        if(mongoose.isValidObjectId(id)){
            let user = await userModel.findById(id);
            return user?.toJSON();
        }
    }catch(err){
        console.log(err);
        
    }
}

export {getUserById};