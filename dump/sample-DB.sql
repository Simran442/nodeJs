-- phpMyAdmin SQL Dump
-- version 4.4.15.7
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Aug 30, 2019 at 07:56 AM
-- Server version: 5.6.37
-- PHP Version: 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ip_snapshot`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE IF NOT EXISTS `bookings` (
  `id` int(11) NOT NULL,
  `locationId` int(11) NOT NULL,
  `noOfItems` int(11) NOT NULL,
  `checkInDate` text NOT NULL,
  `checkOutDate` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE IF NOT EXISTS `cities` (
  `id` int(11) NOT NULL,
  `cityName` text NOT NULL,
  `latitude` text NOT NULL,
  `longitude` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `cities`
--

INSERT INTO `cities` (`id`, `cityName`, `latitude`, `longitude`, `createdAt`) VALUES
(1, 'Delhi', '28.6466758', '76.8123801', '2019-08-29 11:10:21'),
(2, 'Chandigarh', '30.7350626', '76.6933167', '2019-08-29 11:11:01');

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE IF NOT EXISTS `locations` (
  `id` int(11) NOT NULL,
  `locationName` text NOT NULL,
  `latitude` text NOT NULL,
  `longitude` text NOT NULL,
  `cityId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `locationName`, `latitude`, `longitude`, `cityId`, `createdAt`) VALUES
(1, 'Rock Garden, Chandigarh', '30.7528556', '76.8028662', 2, '2019-08-29 08:02:36'),
(2, 'Sector 17', '30.7402543', '76.7738713', 2, '2019-08-29 08:07:57'),
(3, 'Sector 17, Chandigarh', '30.7402543', '76.7738713', 2, '2019-08-29 08:09:27'),
(4, 'Sukhna lake, Chandigarh', '30.7420749', '76.8126812', 2, '2019-08-29 08:13:49'),
(5, 'Rose Garden, Chandigarh', '30.7475026', '76.7820469', 2, '2019-08-29 08:15:33'),
(6, 'pinjore garden chandigarh', '30.7940877', '76.9125169', 2, '2019-08-29 08:18:15'),
(7, 'Elante Mall, Chandigarh', '30.705493', '76.7990621', 2, '2019-08-29 08:22:10'),
(8, 'Japanese Garden, Chandigarh', '30.7057464', '76.7799243', 2, '2019-08-29 08:25:53'),
(9, 'International Dolls Museum, Chandigarh', '30.7411787', '76.7687874', 2, '2019-08-29 08:27:10'),
(10, 'Open Hand Monument, Chandigarh', '30.7590983', '76.8053112', 2, '2019-08-29 08:28:23'),
(11, 'Garden Of Springs, Chandigarh', '30.7235959', '76.7339555', 2, '2019-08-29 08:30:42'),
(12, 'India Gate, Delhi', '28.6090482', '77.2241287', 1, '2019-08-29 09:20:07'),
(13, 'Lal Qila, Delhi', '28.6558068', '77.2319367', 1, '2019-08-29 09:21:05'),
(14, 'Qutub Minar, Delhi', '28.5244754', '77.1833266', 1, '2019-08-29 09:30:48'),
(15, 'Lotus Temple, Delhi', '28.553492', '77.2566324', 1, '2019-08-29 09:31:56'),
(16, 'Chandni Chowk, Delhi', '28.6513808', '77.2228918', 1, '2019-08-29 09:32:37'),
(17, 'Akshardham, Delhi', '28.6126735', '77.2750679', 1, '2019-08-29 09:33:35'),
(18, 'Jantar Mantar, Delhi', '28.6270547', '77.2144327', 1, '2019-08-29 09:34:21'),
(19, 'Rashtrapati Bhavan, Delhi', '28.6143478', '77.197236', 1, '2019-08-29 09:34:59'),
(20, 'Connaught Place, Delhi', '28.6289143', '77.2065107', 1, '2019-08-29 09:36:07'),
(21, 'Feroz Shah Kotla Cricket Ground, Delhi', '28.6378632', '77.24094', 1, '2019-08-29 09:37:54'),
(22, 'Feroz Shah Kotla Cricket Ground, Delhi', '28.6289143', '77.2065107', 1, '2019-08-29 11:30:10'),
(23, 'Hotel Oyster', '30.7475023', '76.7754539', 2, '2019-08-29 13:01:50'),
(24, 'James Hotel Chandigarh', '30.7475023', '76.7754539', 2, '2019-08-29 13:03:59'),
(25, 'OYO 7219 Corporate Inn', '30.7475023', '76.7754539', 2, '2019-08-29 13:03:59'),
(26, 'Hotel City Heart Premium', '30.7402537', '76.7738284', 2, '2019-08-29 13:06:17'),
(27, 'Hotel The Komfort Inn', '30.7402537', '76.7738284', 2, '2019-08-29 13:07:54'),
(28, 'Hotel Central Park, Chandigarh', '30.7383455', '76.7819842', 2, '2019-08-29 13:07:54'),
(29, 'OYO 1255 Hotel City Plaza 17', '30.7383455', '76.7819842', 2, '2019-08-29 13:09:54'),
(30, 'Ghazal Restaurant', '30.7390375', '76.7838299', 2, '2019-08-29 13:11:05'),
(31, 'Udyog Bhawan', '30.7390375', '76.7838299', 2, '2019-08-29 13:11:52');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=35;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
