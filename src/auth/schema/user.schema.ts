import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from "bcrypt";

export type UserDocument = HydratedDocument<User>;

@Schema({ strict : true })
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

UserSchema.pre('save', async function (next) {
  /**
   * Here it first checks whether the document is new by using mongoose .isNew helper, 
   * therefore, this.isNew is true if the document is new or has changes, 
   * otherwise false, and we only want to hash the password if the document is new, 
   * otherwise it will hash the password again if you save the document again by making some changes in other columns if your document contains other columns.
   */
  try {

    // Check if the password has been modified or is new
    if(!this.isModified('password')){
      return next();
    }
    
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword

    next()
  } catch (error) {
    next(error)
  }
})

UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    throw error
  }
}