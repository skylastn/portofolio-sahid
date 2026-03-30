import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdjustWorkFeature1774900450406 implements MigrationInterface {
  name = 'AdjustWorkFeature1774900450406';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`works\` DROP COLUMN \`appstoreUrl\``,
    );
    await queryRunner.query(`ALTER TABLE \`works\` DROP COLUMN \`githubUrl\``);
    await queryRunner.query(`ALTER TABLE \`works\` DROP COLUMN \`imagePath\``);
    await queryRunner.query(
      `ALTER TABLE \`works\` ADD \`company_name\` text NOT NULL after \`id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`works\` ADD \`company_url\` text NULL after \`company_name\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`works\` ADD \`image_path\` text NULL after \`end_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`portofolios\` ADD \`work_id\` varchar(255) NULL after \`id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`portofolios\` ADD CONSTRAINT \`FK_portofolio_work_id\` FOREIGN KEY (\`work_id\`) REFERENCES \`works\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`portofolios\` DROP FOREIGN KEY \`FK_portofolio_work_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`portofolios\` DROP COLUMN \`work_id\``,
    );
    await queryRunner.query(`ALTER TABLE \`works\` DROP COLUMN \`image_path\``);
    await queryRunner.query(
      `ALTER TABLE \`works\` DROP COLUMN \`company_url\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`works\` DROP COLUMN \`company_name\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`works\` ADD \`imagePath\` text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`works\` ADD \`githubUrl\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`works\` ADD \`appstoreUrl\` text NOT NULL`,
    );
  }
}
