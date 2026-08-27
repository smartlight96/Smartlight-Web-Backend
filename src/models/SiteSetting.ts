import {Schema,model,models,Document} from "mongoose";
export interface ISiteSetting extends Document{key:string;value:unknown;updatedBy?:Schema.Types.ObjectId;updatedAt:Date}
const s=new Schema<ISiteSetting>({key:{type:String,unique:true,required:true},value:{type:Schema.Types.Mixed},updatedBy:{type:Schema.Types.ObjectId,ref:"User"}},{timestamps:true}); export const SiteSetting=models.SiteSetting||model<ISiteSetting>("SiteSetting",s);
