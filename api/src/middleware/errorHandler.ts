import { StatusCodes } from'http-status-codes';
import { Request, Response, NextFunction } from 'express';
const errorHandler = (err :Error, req :Request, res :Response, next :NextFunction ) => {
    res.status(StatusCodes.BAD_REQUEST).json({message: err.message})
}

export default errorHandler;