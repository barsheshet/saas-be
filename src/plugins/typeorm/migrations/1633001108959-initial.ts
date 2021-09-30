import { MigrationInterface, QueryRunner } from 'typeorm';

export class initial1633001108959 implements MigrationInterface {
  name = 'initial1633001108959';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email")
        `);
    await queryRunner.query(`
            CREATE TABLE "listing_revision" (
                "listingId" uuid NOT NULL,
                "revision" integer NOT NULL,
                "createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL,
                "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL,
                "createdById" character varying NOT NULL,
                "updatedById" character varying NOT NULL,
                "item" jsonb NOT NULL,
                CONSTRAINT "PK_2c7ade3e6b8495c59d951823e7e" PRIMARY KEY ("listingId", "revision")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "listing" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP(3) WITH TIME ZONE,
                "revision" integer NOT NULL,
                "createdById" uuid NOT NULL,
                "updatedById" uuid NOT NULL,
                "item" jsonb NOT NULL,
                CONSTRAINT "PK_381d45ebb8692362c156d6b87d7" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "listing_revision"
            ADD CONSTRAINT "FK_600598ea1dd6e2775835db625e5" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "listing"
            ADD CONSTRAINT "FK_3f2e2d4b4191c9ae18fd23d3c75" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "listing"
            ADD CONSTRAINT "FK_661bb570e340824851f8f03b62a" FOREIGN KEY ("updatedById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "listing" DROP CONSTRAINT "FK_661bb570e340824851f8f03b62a"
        `);
    await queryRunner.query(`
            ALTER TABLE "listing" DROP CONSTRAINT "FK_3f2e2d4b4191c9ae18fd23d3c75"
        `);
    await queryRunner.query(`
            ALTER TABLE "listing_revision" DROP CONSTRAINT "FK_600598ea1dd6e2775835db625e5"
        `);
    await queryRunner.query(`
            DROP TABLE "listing"
        `);
    await queryRunner.query(`
            DROP TABLE "listing_revision"
        `);
    await queryRunner.query(`
            DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
  }
}
