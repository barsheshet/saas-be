import { FastifyPluginAsync } from 'fastify';
import { getRepository } from 'typeorm';
import { ICreateListing, ListingInputDto, ListingDto } from './listings.types';

export const createListing: FastifyPluginAsync = async (fastify): Promise<void> => {
  const Listing = fastify.entities.Listing;
  const listingRepository = getRepository(Listing);

  fastify.post<ICreateListing>(
    '',
    {
      schema: {
        tags: ['Listings'],
        body: ListingInputDto,
        response: {
          201: ListingDto,
        },
      },
    },
    async function (request, reply) {
      const listing = new Listing();
      listing.createdById = '3adf77c8-51b6-459a-ac12-130c9b14ca60';
      listing.updatedById = '3adf77c8-51b6-459a-ac12-130c9b14ca60';
      listing.item = request.body.item;

      await listingRepository.save(listing);

      reply.status(201);

      return fastify.toListingDto(listing);
    },
  );
};
