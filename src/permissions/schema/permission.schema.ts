import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Permission {
  @Prop({ required: true, unique: true })
  _id: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  permission: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

PermissionSchema.index({ name: 1 });
PermissionSchema.index({ id: 1 });
