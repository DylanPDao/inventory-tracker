set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public.items" (
	"itemId" serial NOT NULL UNIQUE,
	"inventoryId" integer NOT NULL,
	"par" integer NOT NULL,
	"item" VARCHAR(255) NOT NULL,
	CONSTRAINT "items_pk" PRIMARY KEY ("itemId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.inventorys" (
	"inventoryId" serial NOT NULL UNIQUE,
	"storeId" integer NOT NULL,
	CONSTRAINT "inventorys_pk" PRIMARY KEY ("inventoryId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.stores" (
	"storeId" serial NOT NULL,
	"store" VARCHAR(255) NOT NULL UNIQUE,
	"hashedPassword" VARCHAR(255) NOT NULL,
	"admin" BOOLEAN NOT NULL,
	CONSTRAINT "stores_pk" PRIMARY KEY ("storeId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.orders" (
	"orderId" serial NOT NULL UNIQUE,
	"storeId" integer NOT NULL,
	"orderedAt" TIMESTAMP NOT NULL,
	CONSTRAINT "orders_pk" PRIMARY KEY ("orderId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.orderItem" (
	"orderItemId" serial NOT NULL UNIQUE,
	"orderId" integer NOT NULL,
	"item" VARCHAR(255) NOT NULL,
	"quantity" integer NOT NULL,
	CONSTRAINT "orderItem_pk" PRIMARY KEY ("orderItemId")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "items" ADD CONSTRAINT "items_fk0" FOREIGN KEY ("inventoryId") REFERENCES "inventorys"("inventoryId");

ALTER TABLE "inventorys" ADD CONSTRAINT "inventorys_fk0" FOREIGN KEY ("storeId") REFERENCES "stores"("storeId");


ALTER TABLE "orders" ADD CONSTRAINT "orders_fk0" FOREIGN KEY ("storeId") REFERENCES "stores"("storeId");

ALTER TABLE "orderItem" ADD CONSTRAINT "orderItem_fk0" FOREIGN KEY ("orderId") REFERENCES "orders"("orderId");
