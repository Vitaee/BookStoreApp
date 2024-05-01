import { Model, Column, Table, DataType, ForeignKey, PrimaryKey, AutoIncrement, BelongsTo, HasMany } from 'sequelize-typescript';
import { Author } from './Author';
import { OrderDetails } from './OrderDetails';

@Table({
  timestamps: false,
  modelName: 'Book'
})
export class Book extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  book_id!: number;

  @Column
  title!: string;

  @ForeignKey(() => Author)
  @Column
  author_id!: number;

  @Column
  price!: number;

  @Column
  quantity!: number;

  @BelongsTo(() => Author)
  author!: Author;

  @HasMany(() => OrderDetails)
  orderDetails!: OrderDetails[];
}
