import { Controller, Post, Body, UseGuards, Req, Get, Query, Put, Param, Delete } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('budgets')
export class BudgetsController {
  constructor(private budgets: BudgetsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: any, @Body() body: any) {
    return this.budgets.create({ ...body, userId: req.user.userId });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Req() req: any, @Query() q: any) {
    const year = q.year ? parseInt(q.year) : undefined;
    const month = q.month ? parseInt(q.month) : undefined;
    return this.budgets.listForUser(req.user.userId, year, month);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.budgets.update(id, req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Req() req: any, @Param('id') id: string) {
    return this.budgets.delete(id, req.user.userId);
  }
}
