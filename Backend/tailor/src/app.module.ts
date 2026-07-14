import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { AdminModule } from './admin/admin.module';

import { ReviewModule } from './review/review.module';
import { AdminOrderModule } from './admin-order/admin-order.module';


import { AdminCustomersModule } from './admin-customers/admin-customers.module';
import { DoorstepModule } from './doorstep/doorstep.module';
import { MeasurementModule } from './measurement/measurement.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.MONGO_URI!),

    AuthModule,
    UserModule,
    OrderModule,
    AdminModule,
    ReviewModule,
    AdminOrderModule,
    AdminCustomersModule,
    DoorstepModule,
    MeasurementModule,
  ],
  providers: [],
})
export class AppModule {}