import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddDollBuilder1761000000000 implements MigrationInterface {
    name = 'AddDollBuilder1761000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "doll_ingredient" (
                "id" character varying NOT NULL,
                "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                "category" character varying NOT NULL,
                "description" character varying,
                "metaphysicalUses" character varying,
                "notes" character varying,
                "warnings" jsonb NOT NULL DEFAULT '[]',
                "hexCode" character varying,
                "typeOfRock" jsonb NOT NULL DEFAULT '[]',
                "primaryUses" jsonb NOT NULL DEFAULT '[]',
                "extraCost" character varying,
                "availability" character varying,
                "notionId" character varying,
                "sortOrder" integer NOT NULL DEFAULT 0,
                CONSTRAINT "pk_doll_ingredient" PRIMARY KEY ("id")
            )
        `)
        await queryRunner.query(`CREATE INDEX "idx_doll_ingredient_category" ON "doll_ingredient" ("category")`)
        await queryRunner.query(`CREATE INDEX "idx_doll_ingredient_name" ON "doll_ingredient" ("name")`)

        await queryRunner.query(`
            CREATE TABLE "doll_configuration" (
                "id" character varying NOT NULL,
                "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "userId" character varying NOT NULL,
                "projectId" character varying NOT NULL,
                "name" character varying NOT NULL,
                "dollLine" character varying NOT NULL,
                "formula" character varying NOT NULL,
                "selectedRockIds" jsonb NOT NULL DEFAULT '[]',
                "selectedHerbOilIds" jsonb NOT NULL DEFAULT '[]',
                "selectedColorIds" jsonb NOT NULL DEFAULT '[]',
                "selectedArchetypeIds" jsonb NOT NULL DEFAULT '[]',
                "writtenIntention" character varying NOT NULL DEFAULT '',
                "seekerNotes" character varying,
                "status" character varying NOT NULL,
                "submittedAt" character varying,
                CONSTRAINT "pk_doll_configuration" PRIMARY KEY ("id")
            )
        `)
        await queryRunner.query(`CREATE INDEX "idx_doll_config_project_id" ON "doll_configuration" ("projectId")`)
        await queryRunner.query(`CREATE INDEX "idx_doll_config_user_id" ON "doll_configuration" ("userId")`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx_doll_config_user_id"`)
        await queryRunner.query(`DROP INDEX "idx_doll_config_project_id"`)
        await queryRunner.query(`DROP TABLE "doll_configuration"`)
        await queryRunner.query(`DROP INDEX "idx_doll_ingredient_name"`)
        await queryRunner.query(`DROP INDEX "idx_doll_ingredient_category"`)
        await queryRunner.query(`DROP TABLE "doll_ingredient"`)
    }
}
