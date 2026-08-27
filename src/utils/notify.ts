import Notification from "../models/Notification";
export async function notify(title:string,message:string,type:"MESSAGE"|"REQUEST"|"USER"|"REVIEW"|"SYSTEM",link?:string){try{await Notification.create({title,message,type,link});}catch(error){console.error("NOTIFICATION CREATE ERROR",error);}}
