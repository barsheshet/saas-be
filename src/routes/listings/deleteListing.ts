import { FastifyPluginAsync } from 'fastify';
import { IDeleteListing, ListingParams, ListingDto } from './listings.types';
import { getConnection } from 'typeorm';

export const deleteListing: FastifyPluginAsync = async (fastify): Promise<void> => {
  const { Listing, ListingRevision } = fastify.entities;
  const connection = getConnection();

  fastify.delete<IDeleteListing>(
    '/:listingId',
    {
      schema: {
        tags: ['Listings'],
        params: ListingParams,
        response: {
          200: ListingDto,
        },
      },
    },
    async function (request) {
      const { listingId } = request.params;
      const deletedListing = await connection.transaction(async (manager) => {
        const listing = await manager.findOne(Listing, listingId);

        if (!listing) {
          throw fastify.httpErrors.notFound(`Listing with id "${listingId}" not found.`);
        }

        await manager.create(ListingRevision, {
          listingId,
          revision: listing.revision,
          createdAt: listing.createdAt,
          updatedAt: listing.updatedAt,
          createdById: listing.createdById,
          updatedById: listing.updatedById,
          item: listing.item,
        });

        listing.updatedById = '3adf77c8-51b6-459a-ac12-130c9b14ca60';
        return await manager.softRemove(listing);
      });

      return fastify.toListingDto(deletedListing);
    },
  );
};
