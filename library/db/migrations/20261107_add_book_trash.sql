alter table books
  add column if not exists deleted_at timestamptz;

create index if not exists books_deleted_at_idx
  on books (deleted_at)
  where deleted_at is not null;
