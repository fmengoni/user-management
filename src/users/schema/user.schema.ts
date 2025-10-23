import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Role } from '../../roles/schema/role.schema';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  _id: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ salt: true })
  salt: string;

  @Prop({ required: true })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ username: 1 });
