import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';

@Injectable()
export class TransactionsService {
  constructor(@InjectModel(Transaction.name) private txModel: Model<TransactionDocument>) {}

  async create(tx: Partial<Transaction>) {
    const created = new this.txModel(tx);
    return created.save();
  }

  async findByUser(userId: string, query: any = {}) {
    const q: any = { userId };
    if (query.type) q.type = query.type;
    if (query.category) q.category = query.category;
    if (query.from || query.to) q.date = {};
    if (query.from) q.date.$gte = new Date(query.from);
    if (query.to) q.date.$lte = new Date(query.to);
    return this.txModel.find(q).sort({ date: -1 }).lean();
  }

  async update(id: string, userId: string, body: Partial<Transaction>) {
    const res = await this.txModel.findOneAndUpdate({ _id: id, userId }, { $set: body }, { new: true }).lean();
    if (!res) throw new NotFoundException('Transaction not found');
    return res;
  }

  async delete(id: string, userId: string) {
    return this.txModel.deleteOne({ _id: id, userId });
  }

  // Aggregations
  async sumByUserAndMonth(userId: string, year: number, month: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);
    return this.txModel.aggregate([
      { $match: { userId: this.toObjectId(userId), date: { $gte: start, $lte: end } } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]);
  }

  async sumByCategory(userId: string, year: number, month: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);
    return this.txModel.aggregate([
      { $match: { userId: this.toObjectId(userId), date: { $gte: start, $lte: end } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]);
  }

  private toObjectId(id: string) {
    const { Types } = require('mongoose');
    return Types.ObjectId(id);
  }
}
