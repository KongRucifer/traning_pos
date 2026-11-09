import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/categories.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { ProductsModule } from './products/products.module.js';

@Module({
  imports: [
    // Reads back_end/.env into process.env
    ConfigModule.forRoot({ isGlobal: true }),

    // Database connection (settings come from .env)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get('DB_PORT', 5432)),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME', 'pos_training'),
        autoLoadEntities: true,
        // Tables are created by database/schema.sql — never let the ORM change them
        synchronize: false,
        logging: ['error'],
      }),
    }),

    CategoriesModule,
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {}
