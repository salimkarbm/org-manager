import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('organisations')
export class Organisation {
  @PrimaryGeneratedColumn('uuid')
  orgId: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true, default: null })
  description: string;

  @ManyToMany(() => User, (user) => user.organisations)
  users: User[];
}
