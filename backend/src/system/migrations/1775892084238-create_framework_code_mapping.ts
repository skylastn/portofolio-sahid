import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFrameworkCodeMapping1775892084238 implements MigrationInterface {
  name = 'CreateFrameworkCodeMapping1775892084238';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`framework_code_mapping\` (
        \`id\` varchar(36) NOT NULL,
        \`framework_id\` varchar(36) NOT NULL,
        \`code_language_id\` varchar(36) NOT NULL,
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` timestamp(6) NULL,
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`framework_code_mapping\` ADD CONSTRAINT \`FK_framework_code_mapping_code_language_id\` FOREIGN KEY (\`code_language_id\`) REFERENCES \`code_languages\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`framework_code_mapping\` ADD CONSTRAINT \`FK_framework_code_mapping_framework_id\` FOREIGN KEY (\`framework_id\`) REFERENCES \`frameworks\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`framework_code_mapping\` DROP FOREIGN KEY \`FK_framework_code_mapping_framework_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`framework_code_mapping\` DROP FOREIGN KEY \`FK_framework_code_mapping_code_language_id\``,
    );
    await queryRunner.query(`DROP TABLE \`framework_code_mapping\``);
  }
}
