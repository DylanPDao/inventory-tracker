set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."users" (
	"userId" serial NOT NULL,
	"username" VARCHAR(255) NOT NULL UNIQUE,
	"hashedPassword" VARCHAR(255) NOT NULL,
	"admin" BOOLEAN NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."cards" (
	"productId" int NOT NULL,
	"language" int NOT NULL,
	"graded" BOOLEAN NOT NULL,
	"company" VARCHAR(255) NOT NULL,
	CONSTRAINT "cards_pk" PRIMARY KEY ("productId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."products" (
	"productId" serial NOT NULL,
	"name" VARCHAR(255) NOT NULL,
	"price" int NOT NULL,
	"imageUrl" VARCHAR(255) NOT NULL,
	"shortDescription" VARCHAR(255) NOT NULL,
	"longDescription" VARCHAR(255) NOT NULL,
	"stock" int NOT NULL,
	"type" VARCHAR(255) NOT NULL,
	CONSTRAINT "products_pk" PRIMARY KEY ("productId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."languages" (
	"languageId" serial NOT NULL,
	"language" VARCHAR(255) NOT NULL,
	CONSTRAINT "languages_pk" PRIMARY KEY ("languageId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."carts" (
	"userId" int NOT NULL,
	"cartId" serial NOT NULL,
	CONSTRAINT "carts_pk" PRIMARY KEY ("cartId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."cartItems" (
	"cartItemId" serial NOT NULL,
	"cartId" int NOT NULL,
	"productId" int NOT NULL,
	"quantity" int NOT NULL,
	CONSTRAINT "cartItems_pk" PRIMARY KEY ("cartItemId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."orders" (
	"orderId" serial NOT NULL,
	"userId" int NOT NULL,
	"total" DECIMAL NOT NULL,
	"paymentAmount" int NOT NULL,
	CONSTRAINT "orders_pk" PRIMARY KEY ("orderId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."sets" (
	"productId" int NOT NULL,
	"languageId" int NOT NULL,
	CONSTRAINT "sets_pk" PRIMARY KEY ("productId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."orderItems" (
	"orderId" int NOT NULL,
	"orderItemId" serial NOT NULL,
	"quantity" int NOT NULL,
	"name" VARCHAR(255) NOT NULL,
	"price" int NOT NULL,
	"imageUrl" VARCHAR(255) NOT NULL,
	"shortDescription" VARCHAR(255) NOT NULL,
	"longDescription" VARCHAR(255) NOT NULL,
	"type" VARCHAR(255) NOT NULL,
	CONSTRAINT "orderItems_pk" PRIMARY KEY ("orderItemId")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "cards" ADD CONSTRAINT "cards_fk0" FOREIGN KEY ("productId") REFERENCES "products"("productId");
ALTER TABLE "cards" ADD CONSTRAINT "cards_fk1" FOREIGN KEY ("language") REFERENCES "languages"("languageId");



ALTER TABLE "carts" ADD CONSTRAINT "carts_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_fk0" FOREIGN KEY ("cartId") REFERENCES "carts"("cartId");
ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_fk1" FOREIGN KEY ("productId") REFERENCES "products"("productId");

ALTER TABLE "orders" ADD CONSTRAINT "orders_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE "sets" ADD CONSTRAINT "sets_fk0" FOREIGN KEY ("productId") REFERENCES "products"("productId");
ALTER TABLE "sets" ADD CONSTRAINT "sets_fk1" FOREIGN KEY ("languageId") REFERENCES "languages"("languageId");

ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_fk0" FOREIGN KEY ("orderId") REFERENCES "orders"("orderId");
