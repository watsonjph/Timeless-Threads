INSERT INTO `users` (
  `user_id`, `firstName`, `lastName`, `email`, `username`, `password`, 
  `createdAt`, `role`, `has_profile_pic`,
  `streetAddress`, `barangay`, `city`, `province`, `postalCode`, `profile_pic_url`
) VALUES
(1, 'test', 'test', 'seapool@gmail.com', 'test', '$2b$10$ieENtnnYq1i6wYF.v7yrJe9SUSO60rw2Wu6haJmBGWoZxn9fwyJE.', '2025-07-08 16:01:47', 'user', 0, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'Corporate', 'Slave', 'CorpoSlave@example.com', 'CorpoSlave', '$2b$10$ieENtnnYq1i6wYF.v7yrJe9SUSO60rw2Wu6haJmBGWoZxn9fwyJE.', '2025-07-08 16:25:00', 'user', 0, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'Mango', 'Goat', 'mango.goat@example.com', 'Mangoat', '$2b$10$ieENtnnYq1i6wYF.v7yrJe9SUSO60rw2Wu6haJmBGWoZxn9fwyJE.', '2025-07-08 16:25:00', 'user', 0, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 'Santa', 'Admin', 'santa.admin@example.com', 'santaadmin', '$2b$10$ieENtnnYq1i6wYF.v7yrJe9SUSO60rw2Wu6haJmBGWoZxn9fwyJE.', '2025-07-08 16:25:00', 'admin', 0, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 'Hori', 'Manager', 'Hori.manager@example.com', 'Horisan', '$2b$10$ieENtnnYq1i6wYF.v7yrJe9SUSO60rw2Wu6haJmBGWoZxn9fwyJE.', '2025-07-08 16:25:00', 'user', 0, NULL, NULL, NULL, NULL, NULL, NULL);
