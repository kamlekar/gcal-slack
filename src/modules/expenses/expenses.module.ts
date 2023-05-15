import { Module } from '@nestjs/common';
import { ExpensesController } from './controllers/expenses.controller';
import { AuthModule } from '../authentication/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ExpensesController],
})
export class ExpensesModule {}
