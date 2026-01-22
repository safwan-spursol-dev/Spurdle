-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 22, 2026 at 02:40 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `spursol_game`
--

-- --------------------------------------------------------

--
-- Table structure for table `game_sessions`
--

CREATE TABLE `game_sessions` (
  `id` int(11) NOT NULL,
  `score` int(11) DEFAULT 0,
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `game_sessions`
--

INSERT INTO `game_sessions` (`id`, `score`, `full_name`, `email`, `created_at`) VALUES
(1, 60, 'Zohaib Hassan', 'zohaib@gmail.com', '2026-01-12 11:35:37'),
(2, 30, 'kazim', 'kazim@gmail.com', '2026-01-12 11:39:27'),
(4, 10, 'asad', 'asad@gmail.com', '2026-01-12 17:16:53'),
(7, 60, 'Zohaib', 'zohaib1@gmail.com', '2026-01-12 22:07:01'),
(11, 50, 'Ahmed', 'ahmed@gmail.com', '2026-01-12 22:58:51'),
(13, 20, 'hasaan', 'hassan@gmail.com', '2026-01-13 10:58:15'),
(14, 12, 'Saad', 'saad@gmail.com', '2026-01-13 11:54:44'),
(15, 14, 'Asim', 'asim@gmail.com', '2026-01-13 11:56:22'),
(16, 6, 'Yousha', 'yousha@gmail.com', '2026-01-13 12:04:14'),
(17, 12, 'Junaid', 'junaid@gmail.com', '2026-01-13 12:05:54'),
(18, 70, 'Sami', 'sami@gmail.com', '2026-01-13 12:18:14'),
(19, 0, 'Safwan', 'Safwan@gmail.com', '2026-01-14 15:02:57'),
(20, 0, NULL, NULL, '2026-01-14 15:09:16'),
(21, 20, 'Anas', 'anas@gmail.com', '2026-01-19 19:01:40'),
(22, 0, NULL, NULL, '2026-01-20 10:19:34'),
(23, 0, NULL, NULL, '2026-01-20 13:28:24'),
(24, 0, NULL, NULL, '2026-01-20 15:00:56'),
(25, 6, NULL, NULL, '2026-01-20 15:34:37'),
(26, 0, NULL, NULL, '2026-01-20 15:36:57'),
(27, 4, NULL, NULL, '2026-01-20 15:39:04'),
(28, 0, NULL, NULL, '2026-01-20 15:42:23'),
(29, 4, NULL, NULL, '2026-01-20 15:43:30'),
(30, 4, NULL, NULL, '2026-01-20 15:44:13'),
(31, 4, NULL, NULL, '2026-01-20 15:45:50'),
(32, 10, NULL, NULL, '2026-01-20 15:46:40'),
(33, 0, NULL, NULL, '2026-01-20 15:49:07'),
(34, 2, NULL, NULL, '2026-01-20 15:50:36'),
(35, 0, NULL, NULL, '2026-01-20 15:54:29'),
(36, 12, 'Hussain', 'hussain@gmail.com', '2026-01-20 16:22:23'),
(37, 2, 'Hamid', 'hamid@gmail.com', '2026-01-20 16:27:04'),
(38, 0, 'Naveed', 'naveed@gmail.com', '2026-01-20 16:33:08'),
(39, 4, 'Jawid', 'Jawid@gmail.com', '2026-01-20 16:35:56'),
(40, 2, 'Yasir', 'yasir@gmail.com', '2026-01-20 16:38:37'),
(41, 0, 'Samad', 'samad@gmail.com', '2026-01-20 16:44:36'),
(42, 0, 'Usama', 'usama@gmail.com', '2026-01-20 16:47:08'),
(43, 2, 'Aman', 'aman@gmail.com', '2026-01-20 16:50:04'),
(44, 0, 'Waseh', 'waseh@gmail.com', '2026-01-20 16:52:35'),
(45, 2, 'taha', 'taha@gmail.com', '2026-01-20 16:55:37'),
(46, 4, 'Hashim', 'hashim@gmail.com', '2026-01-20 16:57:44'),
(47, 0, 'Jasim', 'jasim@gmail.com', '2026-01-20 17:00:23'),
(48, 0, 'Kamran', 'kamran@gmail.com', '2026-01-20 17:04:31'),
(49, 16, 'basit', 'basit@gmail.com', '2026-01-20 17:09:56'),
(50, 2, 'Wasi', 'wasi@gmail.com', '2026-01-20 17:15:23'),
(51, 0, 'talha', 'talha@gmail.com', '2026-01-20 17:18:19'),
(52, 0, 'hamad', 'hamad@gmail.com', '2026-01-20 17:20:21'),
(53, 12, 'Wajahat', 'wajahat@gmail.com', '2026-01-20 17:24:35'),
(54, 2, 'gazi', 'gazi@gmail.com', '2026-01-20 17:26:52'),
(55, 12, 'ibrahim', 'ibrahim@gmail.com', '2026-01-20 17:32:46'),
(56, 0, NULL, NULL, '2026-01-20 17:37:57'),
(57, 4, NULL, NULL, '2026-01-20 17:41:49'),
(58, 4, NULL, NULL, '2026-01-20 17:42:52'),
(59, 4, 'saad', 'saad@gmail.com', '2026-01-20 18:32:38'),
(60, 10, 'hadi', 'hadi@gmail.com', '2026-01-21 13:35:15'),
(61, 2, 'ghayas', 'ghayas@gmail.com', '2026-01-22 09:44:45'),
(62, 6, 'sameer', 'sameer@gmail.com', '2026-01-22 10:29:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `game_sessions`
--
ALTER TABLE `game_sessions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `game_sessions`
--
ALTER TABLE `game_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
