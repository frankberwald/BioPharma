import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableUser1740312716978 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                        isNullable: false
                    },
                    {
                        name: "profile",
                        type: "enum",
                        enum: ["DRIVER", "BRANCH", "ADMIN"],
                        isNullable: false
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "150",
                        isNullable: false,
                        isUnique: true
                    },
                    {
                        name: "password_hash",
                        type: "varchar",
                        length: "150",
                        isNullable: false
                    },
                    {
                        name: "status",
                        type: "boolean",
                        default: true
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users")
    }

}
