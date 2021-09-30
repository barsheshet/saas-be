import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany } from 'typeorm';
import { Listing } from './Listing';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @OneToMany(() => Listing, (listing) => listing.createdBy)
  listingsCreated: Listing[];

  @OneToMany(() => Listing, (listing) => listing.updatedBy)
  listingsUpdated: Listing[];
}
