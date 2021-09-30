import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from './User';
import { ListingRevision } from './ListingRevision';

@Entity()
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  @Index()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  @Index()
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', precision: 3 })
  deletedAt: Date | null;

  @VersionColumn()
  revision: number;

  @OneToMany(() => ListingRevision, (listingRevision) => listingRevision.listingId)
  revisions: ListingRevision[];

  @Column()
  createdById: string;

  @ManyToOne(() => User, (user) => user.listingsCreated, { onDelete: 'RESTRICT' })
  createdBy: User;

  @Column()
  updatedById: string;

  @ManyToOne(() => User, (user) => user.listingsUpdated, { onDelete: 'RESTRICT' })
  updatedBy: User;

  @Column('jsonb')
  item: Record<string, unknown>;
}
