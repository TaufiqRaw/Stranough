import { Migration } from '@mikro-orm/migrations';

export class Migration20240515130745 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "media" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "filename" varchar(255) not null, "mime_type" varchar(255) not null);');
    this.addSql('alter table "media" add constraint "media_name_unique" unique ("name");');

    this.addSql('create table "knob" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) not null, "thumbnail_id" int null, "price" int not null, "texture" int not null, "scale" real not null, "pivot_position" jsonb not null);');
    this.addSql('alter table "knob" add constraint "knob_name_unique" unique ("name");');

    this.addSql('create table "jack" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) not null, "thumbnail_id" int null, "price" int not null, "texture" int not null, "scale" real not null, "pivot_position" jsonb not null, "is_side" boolean not null);');
    this.addSql('alter table "jack" add constraint "jack_name_unique" unique ("name");');

    this.addSql('create table "guitar_body_texture" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "scale" real not null default 1, "front_hole_mask_id" int null, "mask_id" int null, "back_mask_id" int null, "front_shadow_texture_id" int null, "back_shadow_texture_id" int null, "front_specular_texture_id" int null, "back_specular_texture_id" int null);');

    this.addSql('create table "guitar_body" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "fingerboard_spawn_point" jsonb null, "bridge_spawn_point" jsonb null, "pickup_spawn_point" jsonb null, "knob_spawn_point" jsonb null, "switch_spawn_point" jsonb null, "top_jack_spawn_point" jsonb null, "side_jack_spawn_point" jsonb null, "flat_top_back_texture_id" int null, "forearm_cut_texture_id" int null, "tummy_cut_texture_id" int null, "forearm_tummy_cut_texture_id" int null, "carved_top_texture_id" int null, "carved_top_back_texture_id" int null, "carved_top_tummy_cut_texture_id" int null);');
    this.addSql('alter table "guitar_body" add constraint "guitar_body_flat_top_back_texture_id_unique" unique ("flat_top_back_texture_id");');
    this.addSql('alter table "guitar_body" add constraint "guitar_body_forearm_cut_texture_id_unique" unique ("forearm_cut_texture_id");');
    this.addSql('alter table "guitar_body" add constraint "guitar_body_tummy_cut_texture_id_unique" unique ("tummy_cut_texture_id");');
    this.addSql('alter table "guitar_body" add constraint "guitar_body_forearm_tummy_cut_texture_id_unique" unique ("forearm_tummy_cut_texture_id");');
    this.addSql('alter table "guitar_body" add constraint "guitar_body_carved_top_texture_id_unique" unique ("carved_top_texture_id");');
    this.addSql('alter table "guitar_body" add constraint "guitar_body_carved_top_back_texture_id_unique" unique ("carved_top_back_texture_id");');
    this.addSql('alter table "guitar_body" add constraint "guitar_body_carved_top_tummy_cut_texture_id_unique" unique ("carved_top_tummy_cut_texture_id");');

    this.addSql('create table "guitar_model" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) not null, "thumbnail_id" int null, "bolt_on_body_id" int null, "neck_through_body_id" int null, "set_in_body_id" int null);');
    this.addSql('alter table "guitar_model" add constraint "guitar_model_name_unique" unique ("name");');
    this.addSql('alter table "guitar_model" add constraint "guitar_model_bolt_on_body_id_unique" unique ("bolt_on_body_id");');
    this.addSql('alter table "guitar_model" add constraint "guitar_model_neck_through_body_id_unique" unique ("neck_through_body_id");');
    this.addSql('alter table "guitar_model" add constraint "guitar_model_set_in_body_id_unique" unique ("set_in_body_id");');

    this.addSql('create table "headstock" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(500) not null, "model_id" int null, "price" int not null, "texture_id" int null, "scale" real not null, "pivot_position" jsonb not null, "string_count" smallint not null, "pegs_spawn_point" jsonb not null);');

    this.addSql('create table "bridge" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) not null, "thumbnail_id" int null, "price" int not null, "texture" int not null, "scale" real not null, "pivot_position" jsonb not null, "string_count" smallint not null, "string_spawn_point" jsonb not null);');
    this.addSql('alter table "bridge" add constraint "bridge_name_unique" unique ("name");');

    this.addSql('create table "nut" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) not null, "thumbnail_id" int null, "price" int not null, "texture" int not null, "scale" real not null, "pivot_position" jsonb not null, "string_count" smallint not null, "string_spawn_point" jsonb not null);');
    this.addSql('alter table "nut" add constraint "nut_name_unique" unique ("name");');

    this.addSql('create table "peg" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) not null, "thumbnail_id" int null, "price" int not null, "peg_cap_texture_id" int null, "peg_back_texture_id" int null, "peg_back_pivot_position" jsonb null, "scale" real not null, "pivot_position" jsonb not null);');
    this.addSql('alter table "peg" add constraint "peg_name_unique" unique ("name");');

    this.addSql('create table "pickguard" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(500) not null, "price" int not null, "texture_id" int null, "scale" real not null, "pivot_position" jsonb not null, "model_id" int not null);');

    this.addSql('create table "pickup" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) not null, "thumbnail_id" int null, "price" int not null, "texture" int not null, "scale" real not null, "pivot_position" jsonb not null, "type" text check ("type" in (\'single\', \'humbucker\', \'p90\')) not null);');
    this.addSql('alter table "pickup" add constraint "pickup_name_unique" unique ("name");');

    this.addSql('create table "switch" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(1000) not null, "thumbnail_id" int null, "price" int not null, "texture" int not null, "scale" real not null, "pivot_position" jsonb not null);');
    this.addSql('alter table "switch" add constraint "switch_name_unique" unique ("name");');

    this.addSql('alter table "knob" add constraint "knob_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "jack" add constraint "jack_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "guitar_body_texture" add constraint "guitar_body_texture_front_hole_mask_id_foreign" foreign key ("front_hole_mask_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "guitar_body_texture" add constraint "guitar_body_texture_mask_id_foreign" foreign key ("mask_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "guitar_body_texture" add constraint "guitar_body_texture_back_mask_id_foreign" foreign key ("back_mask_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "guitar_body_texture" add constraint "guitar_body_texture_front_shadow_texture_id_foreign" foreign key ("front_shadow_texture_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "guitar_body_texture" add constraint "guitar_body_texture_back_shadow_texture_id_foreign" foreign key ("back_shadow_texture_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "guitar_body_texture" add constraint "guitar_body_texture_front_specular_texture_id_foreign" foreign key ("front_specular_texture_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "guitar_body_texture" add constraint "guitar_body_texture_back_specular_texture_id_foreign" foreign key ("back_specular_texture_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "guitar_body" add constraint "guitar_body_flat_top_back_texture_id_foreign" foreign key ("flat_top_back_texture_id") references "guitar_body_texture" ("id") on update cascade on delete set null;');
    this.addSql('alter table "guitar_body" add constraint "guitar_body_forearm_cut_texture_id_foreign" foreign key ("forearm_cut_texture_id") references "guitar_body_texture" ("id") on update cascade on delete set null;');
    this.addSql('alter table "guitar_body" add constraint "guitar_body_tummy_cut_texture_id_foreign" foreign key ("tummy_cut_texture_id") references "guitar_body_texture" ("id") on update cascade on delete set null;');
    this.addSql('alter table "guitar_body" add constraint "guitar_body_forearm_tummy_cut_texture_id_foreign" foreign key ("forearm_tummy_cut_texture_id") references "guitar_body_texture" ("id") on update cascade on delete set null;');
    this.addSql('alter table "guitar_body" add constraint "guitar_body_carved_top_texture_id_foreign" foreign key ("carved_top_texture_id") references "guitar_body_texture" ("id") on update cascade on delete set null;');
    this.addSql('alter table "guitar_body" add constraint "guitar_body_carved_top_back_texture_id_foreign" foreign key ("carved_top_back_texture_id") references "guitar_body_texture" ("id") on update cascade on delete set null;');
    this.addSql('alter table "guitar_body" add constraint "guitar_body_carved_top_tummy_cut_texture_id_foreign" foreign key ("carved_top_tummy_cut_texture_id") references "guitar_body_texture" ("id") on update cascade on delete set null;');

    this.addSql('alter table "guitar_model" add constraint "guitar_model_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "guitar_model" add constraint "guitar_model_bolt_on_body_id_foreign" foreign key ("bolt_on_body_id") references "guitar_body" ("id") on update cascade on delete set null;');
    this.addSql('alter table "guitar_model" add constraint "guitar_model_neck_through_body_id_foreign" foreign key ("neck_through_body_id") references "guitar_body" ("id") on update cascade on delete set null;');
    this.addSql('alter table "guitar_model" add constraint "guitar_model_set_in_body_id_foreign" foreign key ("set_in_body_id") references "guitar_body" ("id") on update cascade on delete set null;');

    this.addSql('alter table "headstock" add constraint "headstock_model_id_foreign" foreign key ("model_id") references "guitar_model" ("id") on update cascade on delete set null;');
    this.addSql('alter table "headstock" add constraint "headstock_texture_id_foreign" foreign key ("texture_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "bridge" add constraint "bridge_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "nut" add constraint "nut_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "peg" add constraint "peg_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "peg" add constraint "peg_peg_cap_texture_id_foreign" foreign key ("peg_cap_texture_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "peg" add constraint "peg_peg_back_texture_id_foreign" foreign key ("peg_back_texture_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "pickguard" add constraint "pickguard_texture_id_foreign" foreign key ("texture_id") references "media" ("id") on update cascade on delete set null;');
    this.addSql('alter table "pickguard" add constraint "pickguard_model_id_foreign" foreign key ("model_id") references "guitar_model" ("id") on update cascade;');

    this.addSql('alter table "pickup" add constraint "pickup_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');

    this.addSql('alter table "switch" add constraint "switch_thumbnail_id_foreign" foreign key ("thumbnail_id") references "media" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "knob" drop constraint "knob_thumbnail_id_foreign";');

    this.addSql('alter table "jack" drop constraint "jack_thumbnail_id_foreign";');

    this.addSql('alter table "guitar_body_texture" drop constraint "guitar_body_texture_front_hole_mask_id_foreign";');

    this.addSql('alter table "guitar_body_texture" drop constraint "guitar_body_texture_mask_id_foreign";');

    this.addSql('alter table "guitar_body_texture" drop constraint "guitar_body_texture_back_mask_id_foreign";');

    this.addSql('alter table "guitar_body_texture" drop constraint "guitar_body_texture_front_shadow_texture_id_foreign";');

    this.addSql('alter table "guitar_body_texture" drop constraint "guitar_body_texture_back_shadow_texture_id_foreign";');

    this.addSql('alter table "guitar_body_texture" drop constraint "guitar_body_texture_front_specular_texture_id_foreign";');

    this.addSql('alter table "guitar_body_texture" drop constraint "guitar_body_texture_back_specular_texture_id_foreign";');

    this.addSql('alter table "guitar_model" drop constraint "guitar_model_thumbnail_id_foreign";');

    this.addSql('alter table "headstock" drop constraint "headstock_texture_id_foreign";');

    this.addSql('alter table "bridge" drop constraint "bridge_thumbnail_id_foreign";');

    this.addSql('alter table "nut" drop constraint "nut_thumbnail_id_foreign";');

    this.addSql('alter table "peg" drop constraint "peg_thumbnail_id_foreign";');

    this.addSql('alter table "peg" drop constraint "peg_peg_cap_texture_id_foreign";');

    this.addSql('alter table "peg" drop constraint "peg_peg_back_texture_id_foreign";');

    this.addSql('alter table "pickguard" drop constraint "pickguard_texture_id_foreign";');

    this.addSql('alter table "pickup" drop constraint "pickup_thumbnail_id_foreign";');

    this.addSql('alter table "switch" drop constraint "switch_thumbnail_id_foreign";');

    this.addSql('alter table "guitar_body" drop constraint "guitar_body_flat_top_back_texture_id_foreign";');

    this.addSql('alter table "guitar_body" drop constraint "guitar_body_forearm_cut_texture_id_foreign";');

    this.addSql('alter table "guitar_body" drop constraint "guitar_body_tummy_cut_texture_id_foreign";');

    this.addSql('alter table "guitar_body" drop constraint "guitar_body_forearm_tummy_cut_texture_id_foreign";');

    this.addSql('alter table "guitar_body" drop constraint "guitar_body_carved_top_texture_id_foreign";');

    this.addSql('alter table "guitar_body" drop constraint "guitar_body_carved_top_back_texture_id_foreign";');

    this.addSql('alter table "guitar_body" drop constraint "guitar_body_carved_top_tummy_cut_texture_id_foreign";');

    this.addSql('alter table "guitar_model" drop constraint "guitar_model_bolt_on_body_id_foreign";');

    this.addSql('alter table "guitar_model" drop constraint "guitar_model_neck_through_body_id_foreign";');

    this.addSql('alter table "guitar_model" drop constraint "guitar_model_set_in_body_id_foreign";');

    this.addSql('alter table "headstock" drop constraint "headstock_model_id_foreign";');

    this.addSql('alter table "pickguard" drop constraint "pickguard_model_id_foreign";');

    this.addSql('drop table if exists "media" cascade;');

    this.addSql('drop table if exists "knob" cascade;');

    this.addSql('drop table if exists "jack" cascade;');

    this.addSql('drop table if exists "guitar_body_texture" cascade;');

    this.addSql('drop table if exists "guitar_body" cascade;');

    this.addSql('drop table if exists "guitar_model" cascade;');

    this.addSql('drop table if exists "headstock" cascade;');

    this.addSql('drop table if exists "bridge" cascade;');

    this.addSql('drop table if exists "nut" cascade;');

    this.addSql('drop table if exists "peg" cascade;');

    this.addSql('drop table if exists "pickguard" cascade;');

    this.addSql('drop table if exists "pickup" cascade;');

    this.addSql('drop table if exists "switch" cascade;');
  }

}
