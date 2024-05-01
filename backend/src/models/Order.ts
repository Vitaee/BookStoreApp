import { Model, Column, Table, DataType, ForeignKey, PrimaryKey, AutoIncrement, BelongsTo, HasMany } from 'sequelize-typescript';
import { Customer } from './Customer';
import { OrderDetails } from './OrderDetails';

@Table({
  timestamps: true,
  modelName: 'Order'
})
export class Order extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  order_id!: number;

  @ForeignKey(() => Customer)
  @Column
  customer_id!: number;

  @Column
  order_date!: Date;

  @BelongsTo(() => Customer)
  customer!: Customer;

  @HasMany(() => OrderDetails)
  orderDetails!: OrderDetails[];
}
