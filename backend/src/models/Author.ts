import { Model, Column, Table, DataType, HasMany } from 'sequelize-typescript';
import { Book } from './Book';

@Table({
  timestamps: false,
  modelName: 'Author'
})
export class Author extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  })
  author_id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name!: string;

  @HasMany(() => Book)
  books!: Book[];
}
