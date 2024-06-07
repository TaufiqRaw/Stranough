import { Migration } from '@mikro-orm/migrations';

export class Migration20240602122521 extends Migration {

  async up(): Promise<void> {
    this.addSql('create extension vector;')
  }

  async down(): Promise<void> {
    this.addSql('drop extension vector;');
  }

}
