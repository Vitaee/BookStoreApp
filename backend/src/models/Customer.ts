import { Model, Column, Table, DataType, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import { Order } from './Order';

@Table({
  timestamps: false,
  modelName: 'Customer'
})
export class Customer extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  customer_id!: number;

  @Column
  name!: string;

  @Column
  email!: string;

  @Column
  address!: string;

  @HasMany(() => Order)
  orders!: Order[];
}
