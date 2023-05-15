import mongoose from "mongoose";

export interface Session {
  userId: mongoose.Types.ObjectId;
}

export interface GraphQlContext{
    session: Session;
}

export interface Recipe{
    
}