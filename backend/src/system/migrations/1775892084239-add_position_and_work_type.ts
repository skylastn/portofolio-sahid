import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPositionAndWorkType1775892084239 implements MigrationInterface {
  name = 'AddPositionAndWorkType1775892084239';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`code_languages\` ADD \`position\` int NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`frameworks\` ADD \`position\` int NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`portofolios\` ADD \`position\` int NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`works\` ADD \`type\` enum ('freelance', 'fulltime') NOT NULL DEFAULT 'fulltime'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`works\` ADD \`position\` int NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`achievements\` ADD \`position\` int NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`achievements\` DROP COLUMN \`position\``,
    );
    await queryRunner.query(`ALTER TABLE \`works\` DROP COLUMN \`position\``);
    await queryRunner.query(`ALTER TABLE \`works\` DROP COLUMN \`type\``);
    await queryRunner.query(
      `ALTER TABLE \`portofolios\` DROP COLUMN \`position\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`frameworks\` DROP COLUMN \`position\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`code_languages\` DROP COLUMN \`position\``,
    );
  }
}
