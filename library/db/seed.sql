insert into authors (name) values
  ('Chinua Achebe'),
  ('Chimamanda Ngozi Adichie'),
  ('Wole Soyinka'),
  ('Ngũgĩ wa Thiong''o'),
  ('Buchi Emecheta');

insert into books (title, year, author_id) values
  ('Things Fall Apart', 1958, (select id from authors where name = 'Chinua Achebe')),
  ('No Longer at Ease', 1960, (select id from authors where name = 'Chinua Achebe')),
  ('Arrow of God', 1964, (select id from authors where name = 'Chinua Achebe')),
  ('Half of a Yellow Sun', 2006, (select id from authors where name = 'Chimamanda Ngozi Adichie')),
  ('Purple Hibiscus', 2003, (select id from authors where name = 'Chimamanda Ngozi Adichie')),
  ('Death and the King''s Horseman', 1975, (select id from authors where name = 'Wole Soyinka')),
  ('The Lion and the Jewel', 1963, (select id from authors where name = 'Wole Soyinka')),
  ('Petals of Blood', 1977, (select id from authors where name = 'Ngũgĩ wa Thiong''o')),
  ('The Joys of Motherhood', 1979, (select id from authors where name = 'Buchi Emecheta')),
  ('Second-Class Citizen', 1974, (select id from authors where name = 'Buchi Emecheta'));

insert into members (name, phone) values
  ('Grace Okafor', '0801 234 5678'),
  ('Samuel Adeyemi', '0802 345 6789'),
  ('Ruth Bello', '0803 456 7890'),
  ('Daniel Eze', null),
  ('Esther Musa', '0805 678 9012');

insert into loans (book_id, member_id, borrowed_on, due_on) values
  ((select id from books where title = 'Things Fall Apart'),
   (select id from members where name = 'Grace Okafor'),
   current_date - 3, current_date + 11),
  ((select id from books where title = 'Half of a Yellow Sun'),
   (select id from members where name = 'Samuel Adeyemi'),
   current_date - 10, current_date + 4);