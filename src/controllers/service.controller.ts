import {Request,Response} from "express"; import {Service} from "../models/Service";
export async function listServices(_req:Request,res:Response){res.json({services:await Service.find({active:true}).sort({featured:-1,name:1}).lean()});}
export async function getService(req:Request,res:Response){const s=await Service.findOne({slug:req.params.slug,active:true}).lean();if(!s)return res.status(404).json({message:"Service not found."});res.json({service:s});}
