import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  confirm_password: string;

  @Prop({ required: true })
  no_phone: string;

  @Prop({ required: true })
  date_of_birth: string;
  
  @Prop({ required: true })
  address: string;
}

export const UserSchema = SchemaFactory.createForClass(User);