import { FastifyPluginAsync } from 'fastify';
import { getConnection } from 'typeorm';
import { IUpdateListing, ListingInputDto, ListingDto, ListingParams } from './listings.types';

export const updateListing: FastifyPluginAsync = async (fastify): Promise<void> => {
  const { Listing, ListingRevision } = fastify.entities;
  const connection = getConnection();

  fastify.put<IUpdateListing>(
    '/:listingId',
    {
      schema: {
        tags: ['Listings'],
        body: ListingInputDto,
        params: ListingParams,
        response: {
          200: ListingDto,
        },
      },
    },
    async function (request) {
      const { listingId } = request.params;

      const updatedListing = await connection.transaction(async (manager) => {
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

        listing.item = request.body.item;
        listing.updatedById = '3adf77c8-51b6-459a-ac12-130c9b14ca60';
        return await manager.save(listing);
      });

      return fastify.toListingDto(updatedListing);
    },
  );
};
