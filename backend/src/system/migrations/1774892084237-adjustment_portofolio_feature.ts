import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdjustmentPortofolioFeature1774892084237 implements MigrationInterface {
  name = 'AdjustmentPortofolioFeature1774892084237';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`portofolio_apps_sources\` (
        \`id\` varchar(36) NOT NULL,
        \`portofolio_id\` varchar(255) NOT NULL,
        \`url\` text NOT NULL,
        \`type\` enum ('web', 'android', 'ios', 'windows', 'mac', 'linux', 'github', 'other') NOT NULL DEFAULT 'web', 
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` timestamp(6) NULL,
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`portofolio_images\` (
        \`id\` varchar(36) NOT NULL,
        \`portofolio_id\` varchar(255) NOT NULL,
        \`image_path\` text NULL, 
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` timestamp(6) NULL,
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`portofolios\` ADD \`thumbnail_path\` text NULL after \`description\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`achievements\` CHANGE \`image_path\` \`image_path\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`code_languages\` CHANGE \`image_path\` \`image_path\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`frameworks\` CHANGE \`image_path\` \`image_path\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`portofolio_category_mapping\` ADD CONSTRAINT \`FK_portofolio_category_mapping_category_id\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`portofolio_framework_mapping\` ADD CONSTRAINT \`FK_portofolio_framework_mapping_framework_id\` FOREIGN KEY (\`framework_id\`) REFERENCES \`frameworks\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`portofolio_framework_mapping\` DROP FOREIGN KEY \`FK_portofolio_framework_mapping_framework_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`portofolio_category_mapping\` DROP FOREIGN KEY \`FK_portofolio_category_mapping_category_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`frameworks\` CHANGE \`image_path\` \`image_path\` text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`code_languages\` CHANGE \`image_path\` \`image_path\` text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`achievements\` CHANGE \`image_path\` \`image_path\` text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`portofolios\` DROP COLUMN \`thumbnail_path\``,
    );
    await queryRunner.query(`DROP TABLE \`portofolio_images\``);
    await queryRunner.query(`DROP TABLE \`portofolio_apps_sources\``);
  }
}
