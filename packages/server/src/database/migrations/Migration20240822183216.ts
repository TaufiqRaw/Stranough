import { Migration } from '@mikro-orm/migrations';

export class Migration20240822183216 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');

    this.addSql('alter table "order" add column "preferences_type" varchar(255) null, add column "preferences_description" varchar(255) null, add column "preferences_image_id" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_email_unique";');

    this.addSql('alter table "order" drop column "preferences_type", drop column "preferences_description", drop column "preferences_image_id";');
  }

}
