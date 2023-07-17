set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."items" (
	"itemId" serial NOT NULL UNIQUE,
	"par" integer NOT NULL,
	"item" VARCHAR(255) NOT NULL,
	"categoryId" integer NOT NULL,
	CONSTRAINT "items_pk" PRIMARY KEY ("itemId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."inventories" (
	"inventoryId" serial NOT NULL UNIQUE,
	"storeId" integer NOT NULL,
	CONSTRAINT "inventories_pk" PRIMARY KEY ("inventoryId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."stores" (
	"storeId" serial NOT NULL,
	"store" VARCHAR(255) NOT NULL UNIQUE,
	"hashedPassword" VARCHAR(255) NOT NULL,
	"admin" BOOLEAN NULL,
	CONSTRAINT "stores_pk" PRIMARY KEY ("storeId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."orders" (
	"orderId" serial NOT NULL UNIQUE,
	"storeId" integer NOT NULL,
	"orderedAt" TIMESTAMP NOT NULL,
	CONSTRAINT "orders_pk" PRIMARY KEY ("orderId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."orderItem" (
	"orderItemId" serial NOT NULL UNIQUE,
	"orderId" integer NOT NULL,
	"item" VARCHAR(255) NOT NULL,
	"quantity" integer NOT NULL,
	CONSTRAINT "orderItem_pk" PRIMARY KEY ("orderItemId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."category" (
	"inventoryId" integer NOT NULL,
	"categoryId" serial NOT NULL UNIQUE,
	"categoryName" VARCHAR(255) NOT NULL,
	CONSTRAINT "category_pk" PRIMARY KEY ("categoryId")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "items" ADD CONSTRAINT "items_fk0" FOREIGN KEY ("categoryId") REFERENCES "category"("categoryId");

ALTER TABLE "inventories" ADD CONSTRAINT "inventories_fk0" FOREIGN KEY ("storeId") REFERENCES "stores"("storeId");


ALTER TABLE "orders" ADD CONSTRAINT "orders_fk0" FOREIGN KEY ("storeId") REFERENCES "stores"("storeId");

ALTER TABLE "orderItem" ADD CONSTRAINT "orderItem_fk0" FOREIGN KEY ("orderId") REFERENCES "orders"("orderId");

ALTER TABLE "category" ADD CONSTRAINT "category_fk0" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("inventoryId");
