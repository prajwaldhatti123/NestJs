
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class User extends Document {
    @Prop({required: true , unique: true})
    email: string;

    @Prop({required: true})
    password : string;

    @Prop({required: true , minlength: 3 , maxlength: 20})
    firstName: string;

    @Prop({required: true , minlength: 3 , maxlength: 20})
    lastName: string;

    @Prop({required: true , default: Date.now})
    created: Date;

    @Prop({required: true , default: Date.now})
    updated: Date;

}

export const UserSchema = SchemaFactory.createForClass(User);