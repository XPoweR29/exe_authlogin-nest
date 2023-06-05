import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    length: 50,
  })
  username: string;

  @Column({
    length: 256,
  })
  pwd: string;

  @Column({
    length: 100,
  })
  email: string;

  @Column({
    length: 256,
    nullable: true,
  })
  refreshToken: string;
}