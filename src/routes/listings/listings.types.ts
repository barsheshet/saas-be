import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';

export enum SortDirections {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum SortBy {
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

export const ItemDto = Type.Object(
  {
    foo: Type.String(),
  },
  { additionalProperties: false },
);

export const ListingInputDto = Type.Object(
  {
    item: ItemDto,
  },
  { additionalProperties: false },
);

export const ListingDto = Type.Object({
  id: Type.String({ format: 'uuid' }),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  deletedAt: Type.Optional(Type.String({ format: 'date-time' })),
  createdById: Type.String({ format: 'uuid' }),
  updatedById: Type.String({ format: 'uuid' }),
  revision: Type.Integer(),
  item: ItemDto,
});

export const GetListingsQuery = Type.Object(
  {
    sortBy: Type.Optional(
      Type.KeyOf(
        Type.Object({
          [SortBy.createdAt]: Type.Number(),
          [SortBy.updatedAt]: Type.Number(),
        }),
      ),
    ),
    sortDirection: Type.Optional(
      Type.KeyOf(
        Type.Object({
          [SortDirections.ASC]: Type.Number(),
          [SortDirections.DESC]: Type.Number(),
        }),
      ),
    ),
    take: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
    cursor: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

export const ListingsDto = Type.Object({
  listings: Type.Array(ListingDto),
  cursor: Type.Union([Type.String(),Type.Null()])
});

export const ListingParams = Type.Object({
  listingId: Type.String({ format: 'uuid' }),
});

export type ListingDtoType = Static<typeof ListingDto>;

export type ListingInputDtoType = Static<typeof ListingInputDto>;

export type ListingParamsType = Static<typeof ListingParams>;

export type ListingsDtoType = Static<typeof ListingsDto>;

export type GetListingsQueryType = Static<typeof GetListingsQuery>;

export type ListingEntityInstance = InstanceType<FastifyInstance['entities']['Listing']>;

export interface IGetListings {
  Querystring: GetListingsQueryType;
  Reply: ListingsDtoType;
}

export interface ICreateListing {
  Body: ListingInputDtoType;
  Reply: ListingDtoType;
}

export interface IUpdateListing {
  Body: ListingInputDtoType;
  Params: ListingParamsType;
  Reply: ListingDtoType;
}

export interface IDeleteListing {
  Params: ListingParamsType;
  Reply: ListingDtoType;
}

export interface IGetListingById {
  Params: ListingParamsType;
  Reply: ListingDtoType;
}
