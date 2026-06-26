-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 26, 2026 at 01:17 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12
SET SQL_MODE ="NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vibeCred`
--

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `user_id` varchar(36) NOT NULL,
  `post_id` varchar(36) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`user_id`, `post_id`, `created_at`) VALUES
('215546c3-bef1-4bf9-8cd5-2b9afb669430', '169919dc-ee96-49c1-88d9-0680da954002', '2026-06-25 15:17:54'),
('215546c3-bef1-4bf9-8cd5-2b9afb669430', '8da8cf7c-ad5f-4cec-8858-e2f9ae5f76da', '2026-06-26 09:21:32');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` varchar(36) NOT NULL,
  `authorId` varchar(36) NOT NULL,
  `author` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  `parent_id` varchar(36) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `authorId`, `author`, `title`, `content`, `parent_id`, `created_at`) VALUES
('169919dc-ee96-49c1-88d9-0680da954002', '215546c3-bef1-4bf9-8cd5-2b9afb669430', 'Godswill Eguavoen', 'Why Changing Your Database Strategy Feels Like Open-Heart Surgery', 'There comes a time in every full-stack engineer\'s life where they look at an auto-incrementing integer ID and think, \"We are going to outgrow this.\" You decide to switch the entire application over to universally unique string identifiers (UUIDs). It sounds simple on paper. Just a quick alteration in phpMyAdmin, right?\r\n\r\nWrong. It is the architectural equivalent of changing the tires on a car while driving 120 miles per hour down the expressway. You run the migration, clear out the junk records, and suddenly your environment is perfectly aligned.\r\n\r\nWhen you finally hit that publish button, watch the logs print out a perfectly synced string across both SQL and NoSQL pipelines, and watch the active interaction state stick perfectly green... that is pure developer euphoria. The matrix is finally whole.\r\n\r\nKey Lessons:\r\n\r\nDon\'t be afraid to wipe the slate clean if the foundational architecture is holding you back.\r\n\r\nTrue full-stack engineering is about making separate worlds (like SQL and Firebase) talk to each other like old friends.\r\n\r\nWhen your pipeline finally syncs seamlessly, take a break and celebrate. You earned it.', NULL, '2026-06-25 12:42:07'),
('1da75abc-3a3b-447a-bf51-cb643f90a5e9', '215546c3-bef1-4bf9-8cd5-2b9afb669430', 'Godswill Eguavoen', NULL, 'thank you', '8dcf5ece-56cf-4532-aa8f-35c626ac5695', '2026-06-26 10:14:32'),
('44e941b6-0de5-4bd9-9af7-33a5d07e9522', '215546c3-bef1-4bf9-8cd5-2b9afb669430', 'Godswill Eguavoen', NULL, 'thank you', 'daa47c52-69fa-4528-b82d-de1b77c8605b', '2026-06-26 10:14:25'),
('71798569-b0c2-4a25-8492-584ca3836605', '215546c3-bef1-4bf9-8cd5-2b9afb669430', 'Godswill Eguavoen', NULL, 'hello ma', '169919dc-ee96-49c1-88d9-0680da954002', '2026-06-25 16:18:48'),
('7f9d5b2d-25ee-41ca-a071-d715df99c220', '215546c3-bef1-4bf9-8cd5-2b9afb669430', 'Godswill Eguavoen', 'The Day Our Smart-Toaster App Almost Destroyed the Kitchen', 'Last year, three of us sat in a room and thought, \"What the world truly lacks is an AI-powered, blockchain-backed smart toaster that tweets your breakfast metrics to the cloud.\" We spent four months building the frontend with the slickest animations you\'ve ever seen. The button glowed emerald green when your toast was crisp. It was beautiful.\r\n\r\nThen came launch day. Our first beta tester plugged it in. The NextJS app loaded flawlessly, the database synced in milliseconds, but our IoT micro-controller got caught in an infinite loop. Instead of popping up, the toaster kept heating up, attempting to reach a \"higher state of decentralized crispiness.\" It nearly set the kitchen counters on fire.\r\n\r\nTurns out, we spent so much time worrying about the tech stack, the tracking matrix, and the landing page metrics that we forgot to check if the basic physical relay switch worked.\r\n\r\nKey Lessons:\r\n\r\nBuild things people actually need—or at least things that won\'t set their house on fire.\r\n\r\nValidate your core hardware before designing a flashy dashboard for it.\r\n\r\nClean architecture won\'t save you if your actual product is burning to a crisp.', NULL, '2026-06-25 12:40:37'),
('8da8cf7c-ad5f-4cec-8858-e2f9ae5f76da', '215546c3-bef1-4bf9-8cd5-2b9afb669430', 'Godswill Eguavoen', 'From \"Bug\" to \"Feature\" in 400 Milligrams of Caffeine', 'It is 2:00 AM. The terminal window is staring back at me, glowing with an aggressive red error message that defies all known laws of physics and computer science. The code works perfectly on my machine, but the staging server has decided to transform my beautiful API responses into an abstract art installation of [object Object] and undefined.\r\n\r\nI had two choices: admit defeat and close the laptop, or brew a cup of coffee strong enough to restart a stalled car engine. Naturally, I chose the caffeine.\r\n\r\nThree sips in, I realized the issue wasn\'t my logic—it was the database connection pool timing out because it couldn\'t handle my sheer enthusiasm. I didn\'t fix the bug; I just optimized the timeout query until the error disappeared. If anyone asks, it\'s not a memory leak; it\'s a \"progressive data-retention strategy.\"\r\n\r\nKey Lessons:\r\n\r\nNever underestimate the power of a developer fueled by spite and espresso.\r\n\r\nIf the code works but you don\'t know why, don\'t touch it. It\'s structural integrity now.\r\n\r\nDocumentation is just a love letter to your future self who will inevitably forget everything anyway.', NULL, '2026-06-25 12:39:51'),
('8e64ced6-000d-4213-995a-8ba0bc03cde2', '215546c3-bef1-4bf9-8cd5-2b9afb669430', 'Godswill Eguavoen', NULL, 'hello how far', '169919dc-ee96-49c1-88d9-0680da954002', '2026-06-25 15:17:30'),
('d1204d6c-d7bb-4b79-8ce1-05a0114aa4ec', '215546c3-bef1-4bf9-8cd5-2b9afb669430', 'Godswill Eguavoen', '[SYSTEM DATA]: Architecting Multi-Engine Data Redirection Layers', 'Building an application that dynamically orchestrates state synchronization across a relational primary database (MySQL) and a real-time NoSQL document stream engine (Firebase Firestore) presents unique challenges. \r\n\r\nBy handling identity matrix mapping directly at the application gate using standardized string-based UUID tokens, we bypass primary key collision traps. Relational engines map parent-child nodes via indexed columns while NoSQL environments structure nested collections instantly under unified identifiers.\r\n\r\nWhen an unauthenticated entity tries to alter a post state or drop a response pulse, the identity layer intercepts the execution loop, preserving data state integrity.\r\n\r\nWhere do you land on infrastructure decoupling? Do you lean toward a single hybrid primary layer, or do you prefer routing separate workflows into optimized data engines? \r\n\r\nLeave your analytical response array below. 👇', NULL, '2026-06-25 16:12:22'),
('daa47c52-69fa-4528-b82d-de1b77c8605b', '215546c3-bef1-4bf9-8cd5-2b9afb669430', 'Godswill Eguavoen', NULL, 'yes that is true', 'd1204d6c-d7bb-4b79-8ce1-05a0114aa4ec', '2026-06-25 16:23:03'),
('f2bd1dd1-8fe1-41db-9ea7-89500f5bee84', '215546c3-bef1-4bf9-8cd5-2b9afb669430', 'Godswill Eguavoen', NULL, 'thank you', 'daa47c52-69fa-4528-b82d-de1b77c8605b', '2026-06-26 10:13:56');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`) VALUES
('215546c3-bef1-4bf9-8cd5-2b9afb669430', 'Godswill Eguavoen', 'godswilleguavoen@gmail.com', '$2b$10$2TVESsxNxHe/VsbSLiFLoe4/VhSFIxeouhALYRw4SRu3.RSC3ZvRe', '2026-06-25 12:24:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`user_id`,`post_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
