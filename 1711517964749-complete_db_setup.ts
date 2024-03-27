import { MigrationInterface, QueryRunner } from "typeorm";

export class CompleteDbSetup1711517964749 implements MigrationInterface {
    name = 'CompleteDbSetup1711517964749'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`event_media\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT Wed Mar 27 2024 11:09:27 GMT+0530 (India Standard Time), \`updated_at\` datetime(6) NOT NULL DEFAULT Wed Mar 27 2024 11:09:27 GMT+0530 (India Standard Time) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`images\` json NULL, \`videos\` json NULL, \`documents\` json NULL, \`event_id\` int NOT NULL, UNIQUE INDEX \`REL_16a84aef47c794ac3d01f39830\` (\`event_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`invitations\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT Wed Mar 27 2024 11:09:27 GMT+0530 (India Standard Time), \`updated_at\` datetime(6) NOT NULL DEFAULT Wed Mar 27 2024 11:09:27 GMT+0530 (India Standard Time) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`status\` enum ('PENDING', 'ACCEPTED', 'REJECTED', 'TENTATIVE') NOT NULL DEFAULT 'PENDING', \`user_id\` int NOT NULL, \`event_id\` int NOT NULL, \`rsvp\` json NULL, \`rsvp_response\` json NULL, \`checkin\` tinyint NOT NULL DEFAULT '0', \`checkin_time\` datetime NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`feedbacks\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT Wed Mar 27 2024 11:09:27 GMT+0530 (India Standard Time), \`updated_at\` datetime(6) NOT NULL DEFAULT Wed Mar 27 2024 11:09:27 GMT+0530 (India Standard Time) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`comment\` varchar(255) NOT NULL, \`user_id\` int NOT NULL, \`event_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`events\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT Wed Mar 27 2024 11:09:27 GMT+0530 (India Standard Time), \`updated_at\` datetime(6) NOT NULL DEFAULT Wed Mar 27 2024 11:09:27 GMT+0530 (India Standard Time) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`location\` varchar(255) NOT NULL, \`start_date\` datetime NULL, \`end_date\` datetime NULL, \`user_id\` int NOT NULL, \`calendar_id\` varchar(255) NULL, \`status\` enum ('CONFIRMED', 'CANCELLED', 'TENTATIVE') NOT NULL DEFAULT 'CONFIRMED', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT Wed Mar 27 2024 11:09:27 GMT+0530 (India Standard Time), \`updated_at\` datetime(6) NOT NULL DEFAULT Wed Mar 27 2024 11:09:27 GMT+0530 (India Standard Time) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`mobile_no\` varchar(25) NULL, \`image_url\` varchar(255) NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tokens\` (\`id\` int NOT NULL AUTO_INCREMENT, \`access_token\` text NOT NULL, \`refresh_token\` text NOT NULL, \`user_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notifications\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT Wed Mar 27 2024 11:09:27 GMT+0530 (India Standard Time), \`updated_at\` datetime(6) NOT NULL DEFAULT Wed Mar 27 2024 11:09:27 GMT+0530 (India Standard Time) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`message\` varchar(255) NOT NULL, \`user_id\` int NOT NULL, \`read\` tinyint NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`event_media\` ADD CONSTRAINT \`FK_16a84aef47c794ac3d01f39830c\` FOREIGN KEY (\`event_id\`) REFERENCES \`events\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`invitations\` ADD CONSTRAINT \`FK_fecdffec754fa4d5cea98709776\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`invitations\` ADD CONSTRAINT \`FK_d4dcb14581e4fafa601e15e3533\` FOREIGN KEY (\`event_id\`) REFERENCES \`events\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`feedbacks\` ADD CONSTRAINT \`FK_4334f6be2d7d841a9d5205a100e\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`feedbacks\` ADD CONSTRAINT \`FK_f4f2807aad50f5bcee7baf26623\` FOREIGN KEY (\`event_id\`) REFERENCES \`events\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD CONSTRAINT \`FK_09f256fb7f9a05f0ed9927f406b\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tokens\` ADD CONSTRAINT \`FK_8769073e38c365f315426554ca5\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_9a8a82462cab47c73d25f49261f\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_9a8a82462cab47c73d25f49261f\``);
        await queryRunner.query(`ALTER TABLE \`tokens\` DROP FOREIGN KEY \`FK_8769073e38c365f315426554ca5\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_09f256fb7f9a05f0ed9927f406b\``);
        await queryRunner.query(`ALTER TABLE \`feedbacks\` DROP FOREIGN KEY \`FK_f4f2807aad50f5bcee7baf26623\``);
        await queryRunner.query(`ALTER TABLE \`feedbacks\` DROP FOREIGN KEY \`FK_4334f6be2d7d841a9d5205a100e\``);
        await queryRunner.query(`ALTER TABLE \`invitations\` DROP FOREIGN KEY \`FK_d4dcb14581e4fafa601e15e3533\``);
        await queryRunner.query(`ALTER TABLE \`invitations\` DROP FOREIGN KEY \`FK_fecdffec754fa4d5cea98709776\``);
        await queryRunner.query(`ALTER TABLE \`event_media\` DROP FOREIGN KEY \`FK_16a84aef47c794ac3d01f39830c\``);
        await queryRunner.query(`DROP TABLE \`notifications\``);
        await queryRunner.query(`DROP TABLE \`tokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`events\``);
        await queryRunner.query(`DROP TABLE \`feedbacks\``);
        await queryRunner.query(`DROP TABLE \`invitations\``);
        await queryRunner.query(`DROP INDEX \`REL_16a84aef47c794ac3d01f39830\` ON \`event_media\``);
        await queryRunner.query(`DROP TABLE \`event_media\``);
    }

}
