import { Model, Column, Table, DataType, ForeignKey, BelongsTo, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { Order } from './Order';
import { Book } from './Book';

@Table({
  timestamps: false,
  modelName: 'OrderDetails'
})
export class OrderDetails extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => Order)
  @Column
  order_id!: number;

  @ForeignKey(() => Book)
  @Column
  book_id!: number;

  @Column
  quantity!: number;

  @BelongsTo(() => Order)
  order!: Order;

  @BelongsTo(() => Book)
  book!: Book;
}
