import { Schema, model, models, Document } from "mongoose";
export interface INewsletterSubscriber extends Document { email:string; active:boolean; createdAt:Date; updatedAt:Date }
const schema=new Schema<INewsletterSubscriber>({email:{type:String,unique:true,required:true,lowercase:true,trim:true,index:true},active:{type:Boolean,default:true}},{timestamps:true});
export const NewsletterSubscriber=models.NewsletterSubscriber||model<INewsletterSubscriber>("NewsletterSubscriber",schema);
