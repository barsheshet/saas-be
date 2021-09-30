import fp from 'fastify-plugin';
import { createConnection } from 'typeorm';
import 'reflect-metadata';
import { Listing } from './entities/Listing';
import { ListingRevision } from './entities/ListingRevision';
import { User } from './entities/User';

export default fp(async (fastify) => {
  const connection = await createConnection();

  fastify.decorate('entities', {
    Listing,
    ListingRevision,
    User,
  });

  fastify.addHook('onReady', async () => {
    console.log('seeding...');
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        id: '3adf77c8-51b6-459a-ac12-130c9b14ca60',
        email: 'foo@bar.io',
      })
      .orIgnore()
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        id: '3adf77c8-51b6-459a-ac12-130c9b14ca61',
        email: 'bar@foo.io',
      })
      .orIgnore()
      .execute();
  });
});

declare module 'fastify' {
  export interface FastifyInstance {
    entities: {
      Listing: typeof Listing;
      ListingRevision: typeof ListingRevision;
      User: typeof User;
    };
  }
}
