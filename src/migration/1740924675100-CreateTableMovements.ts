import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTableMovements1740924675100 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "movements",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid"
                    },
                    {
                        name: "quantity",
                        type: "int",
                        isNullable: false
                    },
                    {
                        name: "destination_branch_id",
                        type: "uuid",
                        isNullable: false
                    },
                    {
                        name: "product_id",
                        type: "uuid",
                        isNullable: false
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["PENDING", "IN_PROGRESS", "FINISHED"],
                        isNullable: false,
                        default: "PENDING"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    }
                ]
            })
        )

        await queryRunner.createForeignKey(
            "movements",
            new TableForeignKey({
                columnNames: ["destination_branch_id"],
                referencedTableName: "branch",
                referencedColumnNames: ["id"],
                onDelete: "Cascade",
            })
        )

        await queryRunner.createForeignKey(
            "movements",
            new TableForeignKey({
                columnNames: ["product_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "products",
                onDelete: "CASCADE"
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("movements")
    }

}
