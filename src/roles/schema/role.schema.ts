import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Role {
  @Prop({ required: true, unique: true })
  _id: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  permissions: string[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.index({ name: 1 });
