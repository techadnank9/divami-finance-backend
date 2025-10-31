import { Controller, Post, Body, UseGuards, Req, Get, Query, Delete, Param, Put } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private tx: TransactionsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: any, @Body() body: any) {
    const userId = req.user.userId;
    return this.tx.create({ ...body, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Req() req: any, @Query() query: any) {
    return this.tx.findByUser(req.user.userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.tx.update(id, req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async del(@Req() req: any, @Param('id') id: string) {
    return this.tx.delete(id, req.user.userId);
  }
}
