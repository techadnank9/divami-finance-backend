import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: ['income', 'expense'] })
  type: 'income' | 'expense';

  @Prop()
  category: string;

  @Prop()
  note: string;

  @Prop({ required: true, type: Date })
  date: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
