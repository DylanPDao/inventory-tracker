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
