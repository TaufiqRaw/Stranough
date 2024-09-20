import { Migration } from '@mikro-orm/migrations';

export class Migration20240829080940 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "order" drop column "preferences_type", drop column "preferences_image_id", drop column "feedback";');

    this.addSql('alter table "order" add column "preferences_img_length" int null, add column "old_id" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "order" drop column "preferences_img_length";');

    this.addSql('alter table "order" add column "preferences_image_id" varchar(255) null, add column "feedback" varchar(3000) null;');
    this.addSql('alter table "order" rename column "old_id" to "preferences_type";');
  }

}
