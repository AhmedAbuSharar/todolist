import {} from 'sequelize';
import {
  AutoIncrement,
  DataType,
  Column,
  Model,
  PrimaryKey,
  Table,
  DefaultScope,
  Scopes,
  Unique,
} from 'sequelize-typescript';

@DefaultScope(() => ({
  attributes: { exclude: ['password'] },
}))
@Scopes(() => ({
  withPassword: {
    attributes: { include: ['password'] },
  },
}))
@Table
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.STRING)
  name: string;

  @Unique
  @Column({
    type: DataType.STRING,
  })
  email: string;

  @Column(DataType.STRING)
  password: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt: Date;
}
