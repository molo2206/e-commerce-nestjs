import { MigrationInterface, QueryRunner } from "typeorm";

export class ChgUserOrder1742984078047 implements MigrationInterface {
    name = 'ChgUserOrder1742984078047'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_1102b5a0c580f845993e2f766f6\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_cc4e4adab232e8c05026b2f345d\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_151b79a83ba240b0cb31b2302d1\``);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`deliveredAt\` \`deliveredAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`updatedById\` \`updatedById\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`shippingAddressId\` \`shippingAddressId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`orders_products\` DROP FOREIGN KEY \`FK_823bad3524a5d095453c43286bb\``);
        await queryRunner.query(`ALTER TABLE \`orders_products\` DROP FOREIGN KEY \`FK_4eff63e89274f79195e25c5c115\``);
        await queryRunner.query(`ALTER TABLE \`orders_products\` CHANGE \`orderId\` \`orderId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`orders_products\` CHANGE \`productId\` \`productId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_7ed5659e7139fc8bc039198cc1f\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_a6b3c434392f5d10ec171043666\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`productId\` \`productId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_d7e7f53b786522ae18147bb853c\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_33b88e166df04f2d9291628bebb\``);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`addedById\` \`addedById\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`categoryIdId\` \`categoryIdId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_1102b5a0c580f845993e2f766f6\` FOREIGN KEY (\`updatedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_cc4e4adab232e8c05026b2f345d\` FOREIGN KEY (\`shippingAddressId\`) REFERENCES \`shippings\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_151b79a83ba240b0cb31b2302d1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders_products\` ADD CONSTRAINT \`FK_823bad3524a5d095453c43286bb\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders_products\` ADD CONSTRAINT \`FK_4eff63e89274f79195e25c5c115\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_7ed5659e7139fc8bc039198cc1f\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_a6b3c434392f5d10ec171043666\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_d7e7f53b786522ae18147bb853c\` FOREIGN KEY (\`addedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_33b88e166df04f2d9291628bebb\` FOREIGN KEY (\`categoryIdId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_33b88e166df04f2d9291628bebb\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_d7e7f53b786522ae18147bb853c\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_a6b3c434392f5d10ec171043666\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_7ed5659e7139fc8bc039198cc1f\``);
        await queryRunner.query(`ALTER TABLE \`orders_products\` DROP FOREIGN KEY \`FK_4eff63e89274f79195e25c5c115\``);
        await queryRunner.query(`ALTER TABLE \`orders_products\` DROP FOREIGN KEY \`FK_823bad3524a5d095453c43286bb\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_151b79a83ba240b0cb31b2302d1\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_cc4e4adab232e8c05026b2f345d\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_1102b5a0c580f845993e2f766f6\``);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`categoryIdId\` \`categoryIdId\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`addedById\` \`addedById\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_33b88e166df04f2d9291628bebb\` FOREIGN KEY (\`categoryIdId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_d7e7f53b786522ae18147bb853c\` FOREIGN KEY (\`addedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`productId\` \`productId\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_a6b3c434392f5d10ec171043666\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_7ed5659e7139fc8bc039198cc1f\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders_products\` CHANGE \`productId\` \`productId\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`orders_products\` CHANGE \`orderId\` \`orderId\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`orders_products\` ADD CONSTRAINT \`FK_4eff63e89274f79195e25c5c115\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders_products\` ADD CONSTRAINT \`FK_823bad3524a5d095453c43286bb\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`shippingAddressId\` \`shippingAddressId\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`updatedById\` \`updatedById\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`deliveredAt\` \`deliveredAt\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_151b79a83ba240b0cb31b2302d1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_cc4e4adab232e8c05026b2f345d\` FOREIGN KEY (\`shippingAddressId\`) REFERENCES \`shippings\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_1102b5a0c580f845993e2f766f6\` FOREIGN KEY (\`updatedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
