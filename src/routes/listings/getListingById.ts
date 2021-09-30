import { FastifyPluginAsync } from 'fastify';
import { getRepository } from 'typeorm';
import { IGetListingById, ListingDto, ListingParams } from './listings.types';

export const getListingById: FastifyPluginAsync = async (fastify): Promise<void> => {
  const Listing = fastify.entities.Listing;
  const listingRepository = getRepository(Listing);

  fastify.get<IGetListingById>(
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
      const listing = await listingRepository.findOne(listingId);

      if (!listing) {
        throw fastify.httpErrors.notFound(`Listing with id "${listingId}" not found.`);
      }

      return fastify.toListingDto(listing);
    },
  );
};
