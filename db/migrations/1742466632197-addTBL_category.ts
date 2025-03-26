import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTBLCategory1742466632197 implements MigrationInterface {
    name = 'AddTBLCategory1742466632197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`description\` \`description\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
    }

}
