-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

--  insert into "todos"
--    ("task", "isCompleted")
--    values
--      ('Learn to code', false),
--      ('Build projects', false),
--      ('Get a job', false);

insert into "stores"
  ("store", "hashedPassword", "admin")
  VALUES
    ('admin','$argon2id$v=19$m=4096,t=3,p=1$micmMoz/wknJ0Epl/BXvwQ$6C8JUC18zXaLGo5Sx8962ybgE8Ci1n5ig8496xrvTcc', true),
    ('htown1', '$argon2id$v=19$m=4096,t=3,p=1$7h1MBcpDDg+OqJVRhZEjqg$lsnIyc/SYcvqbc7KlDWYCKv5ZlXgjsoQTmb5PcLD2G0', null);

insert into "category"
  ("storeId", "categoryName")
  VALUES
  (2, 'dairy'),
  (2, 'dry goods'),
  (2, 'proteins'),
  (2, 'FOH supplies'),
  (2, 'frozen');

insert into "items"
  ("par", "item", "categoryId")
  VALUES
  (5, 'milk', 1),
  (5, 'swiss cheese', 1),
  (5, 'cheddar cheese', 1),
  (5, 'buns', 2),
  (5, 'ketchup', 2),
  (5, 'mayo', 2),
  (5, 'ground beef lean', 3),
  (5, 'ground beef fatty', 3),
  (5, 'napkins', 4),
  (5, '16 oz cups', 4),
  (5, '16 oz lids', 4),
  (5, 'shoestring fries', 5),
  (5, 'battered fries', 5),
  (5, 'tater tots', 5);
