import { AnySchema } from "yup";
import { Request, Response, NextFunction } from "express";

const validateRequest = (schema :AnySchema) =>{
    return async(req :Request, res :Response, next :NextFunction)=>{
        await schema.validate(
            {
                body: req.body,
                query: req.query,
                params: req.params,
        });
        next();
    }
};
export default validateRequest;