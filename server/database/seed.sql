-- Seed data for users table
INSERT INTO users (firstName, lastName, email, username, password, role, hasProfilePic, is_first_login)
VALUES
  ('Alice', 'Employee', 'alice.employee@example.com', 'aliceemp', 'password123!', 'Employee', 0, 0),
  ('Bob', 'Finance', 'bob.finance@example.com', 'bobfin', 'password123!', 'Finance Staff', 0, 0),
  ('Carol', 'Admin', 'carol.admin@example.com', 'caroladmin', 'password123!', 'Admin', 0, 0),
  ('Dave', 'Manager', 'dave.manager@example.com', 'davemgr', 'password123!', 'Project Manager', 0, 0); 