import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { ValidationError } from "class-validator";
import { Response } from "express";

@Catch(ValidationError)
export class validationExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = 400;
        response.status(status).json({
            statusCode: status,
            message: "Invalid request data",
            error: exception.toString()
        });
    }
}