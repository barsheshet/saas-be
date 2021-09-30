import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { Listing } from './Listing';

@Entity()
export class ListingRevision {
  @PrimaryColumn('uuid')
  listingId: string;

  @ManyToOne(() => Listing, (listing) => listing.revisions, { onDelete: 'RESTRICT' })
  listing: Listing;

  @PrimaryColumn()
  revision: number;

  @Column({ type: 'timestamptz', precision: 3 })
  createdAt: Date;

  @Column({ type: 'timestamptz', precision: 3 })
  updatedAt: Date;

  @Column()
  createdById: string;

  @Column()
  updatedById: string;

  @Column('jsonb')
  item: Record<string, unknown>;
}
