import { FastifyPluginAsync } from 'fastify';
import { getRepository, FindConditions, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { IGetListings, GetListingsQuery, ListingsDto, SortDirections, ListingEntityInstance } from './listings.types';

export const getListings: FastifyPluginAsync = async (fastify): Promise<void> => {
  const Listing = fastify.entities.Listing;
  const listingRepository = getRepository(Listing);

  fastify.get<IGetListings>(
    '',
    {
      schema: {
        tags: ['Listings'],
        querystring: GetListingsQuery,
        response: {
          200: ListingsDto,
        },
      },
    },
    async function (request) {
      const { query } = request;
      const sortDirection = query.sortDirection || SortDirections.ASC;
      const sortBy = query.sortBy || 'createdAt';
      const take = query.take || 10;
      const operator = sortDirection === SortDirections.ASC ? MoreThanOrEqual : LessThanOrEqual;
      const where: FindConditions<ListingEntityInstance> = {};

      if (query.cursor) {
        where[sortBy] = operator(Buffer.from(query.cursor, 'base64').toString());
      }

      const listings = await listingRepository.find({
        take: take + 1,
        order: {
          [sortBy]: sortDirection,
        },
        where,
      });

      let cursor = null;

      if (listings.length > take) {
        const last = listings.pop();
        cursor = Buffer.from(last?.createdAt.toISOString() || '').toString('base64');
      }

      return { listings: listings.map(fastify.toListingDto), cursor };
    },
  );
};
