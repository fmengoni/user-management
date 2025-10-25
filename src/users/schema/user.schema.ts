import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ salt: true })
  salt: string;

  @Prop({ required: true })
  roles: ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ username: 1 });
