import { Migration } from '@mikro-orm/migrations';

export class Migration20240821084009 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');

    this.addSql('alter table "order" add column "created_by_id" int not null;');
    this.addSql('alter table "order" add constraint "order_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "order" drop constraint "order_created_by_id_foreign";');

    this.addSql('alter table "order" drop column "created_by_id";');

    this.addSql('alter table "user" drop constraint "user_username_unique";');
  }

}
