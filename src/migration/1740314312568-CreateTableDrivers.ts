import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateDrivers1740099529062 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "drivers",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isGenerated: true,
                        isPrimary: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "full_adress",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "document",
                        type: "varchar",
                        length: "30",
                        isNullable: false,
                    },
                    {
                        name: "user_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey("drivers", new TableForeignKey({
            columnNames: ["user_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
        }))
    }


    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("drivers");
    }
}