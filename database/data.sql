-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

--  insert into "todos"
--    ("task", "isCompleted")
--    values
--      ('Learn to code', false),
--      ('Build projects', false),
--      ('Get a job', false);

insert into "users"
  ("username", "hashedPassword", "admin")
  VALUES
    ('admin','$argon2id$v=19$m=4096,t=3,p=1$micmMoz/wknJ0Epl/BXvwQ$6C8JUC18zXaLGo5Sx8962ybgE8Ci1n5ig8496xrvTcc', true),
    ('houston1', '$argon2id$v=19$m=4096,t=3,p=1$64iwkBjBGoXRCr+M0ZUl7A$DE2dDOCsabQQSHIwPTgklRQSgwt+2+zRHAhpJd3wrj4', null),
    ('houston2', '$argon2id$v=19$m=4096,t=3,p=1$2aTHTg9Ao8dG6HwzgSp5cA$HJDUj6rg09fyZ0FgaVhM1eP7odsnNlvjhJTjRQoGdbE', null);

insert into "category"
  ("userId", "categoryName")
  VALUES
  (2, 'dairy'),
  (2, 'dry goods'),
  (2, 'proteins'),
  (2, 'FOH supplies'),
  (2, 'frozen'),
  (3, 'milks'),
  (3, 'dry'),
  (3, 'meats'),
  (3, 'FOH'),
  (3, 'icy');

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
  (5, 'tater tots', 5),
  (5, 'milk', 6),
  (5, 'swiss cheese', 6),
  (5, 'cheddar cheese', 6),
  (5, 'buns', 7),
  (5, 'ketchup', 7),
  (5, 'mayo', 7),
  (5, 'ground beef lean', 8),
  (5, 'ground beef fatty', 8),
  (5, 'napkins', 9),
  (5, '16 oz cups', 9),
  (5, '16 oz lids', 9),
  (5, 'shoestring fries', 10),
  (5, 'battered fries', 10),
  (5, 'tater tots', 10);

insert into "orders"
  ("orderId", "userId", "orderedAt")
  VALUES
  ('64f39caa-1fad-48ea-aab2-b1b663118256', '2', 'Wed Jul 26 2023 04:16:55'),
  ('1ff4efcc-8ed7-4916-a9ce-9fa405fa07c0', '2', 'Thur Jul 27 2023 04:16:55'),
  ('addc6034-6ae3-40de-b95c-fa8327eea590', '3', 'Fri Jul 28 2023 04:16:55'),
  ('3844a9c6-1058-47e5-e452-2fd6a54df40b', '3', 'Sat Jul 29 2023 04:16:55');

insert into "orderItem"
  ("orderId", "item", "quantity")
  VALUES
  ('64f39caa-1fad-48ea-aab2-b1b663118256', 'milk', '2'),
  ('1ff4efcc-8ed7-4916-a9ce-9fa405fa07c0', 'milk', '2'),
  ('addc6034-6ae3-40de-b95c-fa8327eea590', 'milk', '2'),
  ('3844a9c6-1058-47e5-e452-2fd6a54df40b', 'milk', '2'),
  ('64f39caa-1fad-48ea-aab2-b1b663118256', 'beef', '4'),
  ('64f39caa-1fad-48ea-aab2-b1b663118256', 'towels', '1'),
  ('64f39caa-1fad-48ea-aab2-b1b663118256', 'oranges', '3'),
  ('64f39caa-1fad-48ea-aab2-b1b663118256', 'Lemon Pledge', '1'),
  ('64f39caa-1fad-48ea-aab2-b1b663118256', 'Spices', '7'),
  ('1ff4efcc-8ed7-4916-a9ce-9fa405fa07c0', 'beef', '4'),
  ('1ff4efcc-8ed7-4916-a9ce-9fa405fa07c0', 'towels', '1'),
  ('1ff4efcc-8ed7-4916-a9ce-9fa405fa07c0', 'oranges', '3'),
  ('1ff4efcc-8ed7-4916-a9ce-9fa405fa07c0', 'Lemon Pledge', '1'),
  ('1ff4efcc-8ed7-4916-a9ce-9fa405fa07c0', 'Spices', '7'),
  ('addc6034-6ae3-40de-b95c-fa8327eea590', 'beef', '4'),
  ('addc6034-6ae3-40de-b95c-fa8327eea590', 'towels', '1'),
  ('addc6034-6ae3-40de-b95c-fa8327eea590', 'oranges', '3'),
  ('addc6034-6ae3-40de-b95c-fa8327eea590', 'Lemon Pledge', '1'),
  ('addc6034-6ae3-40de-b95c-fa8327eea590', 'Spices', '7'),
  ('3844a9c6-1058-47e5-e452-2fd6a54df40b', 'beef', '4'),
  ('3844a9c6-1058-47e5-e452-2fd6a54df40b', 'towels', '1'),
  ('3844a9c6-1058-47e5-e452-2fd6a54df40b', 'oranges', '3'),
  ('3844a9c6-1058-47e5-e452-2fd6a54df40b', 'Lemon Pledge', '1'),
  ('3844a9c6-1058-47e5-e452-2fd6a54df40b', 'Spices', '7');
