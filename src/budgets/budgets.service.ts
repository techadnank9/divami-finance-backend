import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Budget, BudgetDocument } from './schemas/budget.schema';

@Injectable()
export class BudgetsService {
  constructor(@InjectModel(Budget.name) private budgetModel: Model<BudgetDocument>) {}

  async create(payload: Partial<Budget>) {
    const created = new this.budgetModel(payload);
    return created.save();
  }

  async listForUser(userId: string, year?: number, month?: number) {
    const q: any = { userId };
    if (year) q.year = year;
    if (month) q.month = month;
    return this.budgetModel.find(q).lean();
  }

  async update(id: string, userId: string, body: Partial<Budget>) {
    return this.budgetModel.findOneAndUpdate({ _id: id, userId }, { $set: body }, { new: true }).lean();
  }

  async delete(id: string, userId: string) {
    return this.budgetModel.deleteOne({ _id: id, userId });
  }
}
