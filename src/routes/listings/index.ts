import { FastifyPluginAsync } from 'fastify';
import { ListingDtoType, ListingEntityInstance } from './listings.types';
import { createListing } from './createListing';
import { getListings } from './getListings';
import { updateListing } from './updateListing';
import { deleteListing } from './deleteListing';
import { getListingById } from './getListingById';

const listings: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.decorate('toListingDto', (listing: ListingEntityInstance): ListingDtoType => {
    return {
      id: listing.id,
      revision: listing.revision,
      item: {
        foo: listing.item.foo as string,
      },
      createdAt: listing.createdAt.toISOString(),
      updatedAt: listing.updatedAt.toISOString(),
      deletedAt: listing.deletedAt?.toISOString(),
      createdById: listing.createdById,
      updatedById: listing.updatedById,
    };
  });

  fastify.register(createListing);
  fastify.register(getListings);
  fastify.register(updateListing);
  fastify.register(deleteListing);
  fastify.register(getListingById);
};

export default listings;

declare module 'fastify' {
  export interface FastifyInstance {
    toListingDto: (listing: ListingEntityInstance) => ListingDtoType;
  }
}
