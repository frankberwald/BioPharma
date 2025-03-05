import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateMovements1740868364932 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "movements",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isGenerated: true,
                        isPrimary: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "destination_branch_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "product_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "driver_id",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "quantity",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["PENDING", "IN_PROGRESS", "FINISHED"],
                        default: "'PENDING'",
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

        await queryRunner.createForeignKey("movements", new TableForeignKey({
            columnNames: ["destination_branch_id"],
            referencedTableName: "branches",
            referencedColumnNames: ["id"],
        }))

        await queryRunner.createForeignKey("movements", new TableForeignKey({
            columnNames: ["product_id"],
            referencedTableName: "products",
            referencedColumnNames: ["id"],
        }))

        await queryRunner.createForeignKey("movements", new TableForeignKey({
            columnNames: ["driver_id"],
            referencedTableName: "drivers",
            referencedColumnNames: ["id"],
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("movements");
    }

}