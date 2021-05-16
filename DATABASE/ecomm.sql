-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 16, 2021 at 07:09 PM
-- Server version: 10.4.18-MariaDB
-- PHP Version: 7.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecomm`
--

-- --------------------------------------------------------

--
-- Table structure for table `color`
--

CREATE TABLE `color` (
  `id` int(11) NOT NULL,
  `color` varchar(100) NOT NULL,
  `color_code` text NOT NULL,
  `description` text NOT NULL,
  `created` date DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `color`
--

INSERT INTO `color` (`id`, `color`, `color_code`, `description`, `created`, `status`) VALUES
(1, 'red', '#eb2744', 'red color', '2021-05-04', 1),
(4, 'blue', '#271ebe', 'blue', '2021-05-07', 1),
(5, 'green', '#207c21', 'green', '2021-05-07', 1),
(6, 'yellow', '#dde730', 'yellow', '2021-05-07', 1);

-- --------------------------------------------------------

--
-- Table structure for table `main_catagary`
--

CREATE TABLE `main_catagary` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `main_catagary`
--

INSERT INTO `main_catagary` (`id`, `name`, `status`) VALUES
(1, 'Men', 1),
(2, 'Women', 1),
(3, 'Children', 1);

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `id` int(11) NOT NULL,
  `role_id` tinyint(4) NOT NULL DEFAULT 2 COMMENT '1-admin 2-user',
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email_id` text NOT NULL,
  `phone_no` varchar(50) DEFAULT NULL,
  `profile_pic` text DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` text DEFAULT NULL,
  `state` text DEFAULT NULL,
  `country` int(11) DEFAULT NULL,
  `zipcode` varchar(50) DEFAULT NULL,
  `password` text NOT NULL,
  `forgot_code` text DEFAULT NULL,
  `added_date` varchar(100) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`id`, `role_id`, `first_name`, `last_name`, `email_id`, `phone_no`, `profile_pic`, `address`, `city`, `state`, `country`, `zipcode`, `password`, `forgot_code`, `added_date`, `status`) VALUES
(0, 2, 'ayush', 'sss', 'sss@hotmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '81dc9bdb52d04dc20036dbd8313ed055', NULL, '1621184776135', 1),
(1, 2, 'info', 'patel', 'info@gmail.com', '9874562358', 'Desert.jpg', 'Test data', '17180', '869', 39, '65655', '81dc9bdb52d04dc20036dbd8313ed055', 'IOM71F9G', '1615873615', 1),
(2, 1, 'admin', 'admin', 'admin@gmail.com', '9658745685', '', 'test', '16225', '867', 39, '789456', '81dc9bdb52d04dc20036dbd8313ed055', NULL, '1615873727', 1),
(8, 2, 'test', 'patel', 'abc@gmail.com', '+919106867460', 'Koala.jpg', 'test', '17204', '869', 39, '394130', '202cb962ac59075b964b07152d234b70', NULL, '1620061166559', 1),
(9, 2, 'gurmit', 'sing', 'gurmit@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '202cb962ac59075b964b07152d234b70', NULL, '1620506118206', 1);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `main_id` int(11) NOT NULL,
  `sub_id` int(11) NOT NULL,
  `p_name` varchar(255) NOT NULL,
  `p_image` text NOT NULL,
  `p_price` decimal(10,2) NOT NULL,
  `p_quntity` decimal(10,2) NOT NULL,
  `description` text NOT NULL,
  `created` date DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `main_id`, `sub_id`, `p_name`, `p_image`, `p_price`, `p_quntity`, `description`, `created`, `status`) VALUES
(1, 1, 1, 'Slim casual shirt', 'c2.webp', '100.00', '100.00', 'test', '2021-05-06', 1),
(3, 1, 1, 'Real casual shirt', 'c3.webp', '100.00', '100.00', 'casual products', '2021-05-07', 1),
(4, 1, 1, 'Dan casual shirt', 'c4.webp', '100.00', '100.00', 'casual shirts', '2021-05-07', 1),
(5, 1, 1, 'casual trangle shirt', 'c5.webp', '100.00', '100.00', 'casual trangle shirt', '2021-05-07', 1),
(6, 2, 10, 'Slim woman cotton saree', 'sar4.webp', '100.00', '100.00', 'saree', '2021-05-07', 1),
(7, 2, 10, 'Saree silk', 'sar3.webp', '100.00', '100.00', 'silk sarees', '2021-05-07', 1),
(8, 3, 11, 'kids t-shirt ware', 'kts2.webp', '100.00', '100.00', 't-shirst', '2021-05-07', 1),
(9, 3, 11, 't-shirt children', 'kts3.webp', '50.00', '50.00', 't-shirt kids', '2021-05-07', 1);

-- --------------------------------------------------------

--
-- Table structure for table `product_color`
--

CREATE TABLE `product_color` (
  `id` int(11) NOT NULL,
  `p_id` int(11) NOT NULL,
  `color_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_color`
--

INSERT INTO `product_color` (`id`, `p_id`, `color_id`, `status`) VALUES
(2, 1, 4, 1),
(3, 1, 1, 1),
(6, 1, 5, 1),
(7, 3, 1, 1),
(8, 3, 4, 1),
(9, 3, 5, 1),
(10, 3, 6, 1),
(11, 4, 1, 1),
(12, 4, 4, 1),
(13, 4, 5, 1),
(14, 5, 1, 1),
(15, 5, 4, 1),
(16, 5, 5, 1),
(17, 5, 6, 1),
(18, 6, 1, 1),
(19, 6, 4, 1),
(20, 6, 5, 1),
(21, 7, 1, 1),
(22, 7, 4, 1),
(23, 7, 5, 1),
(24, 7, 6, 1),
(25, 8, 1, 1),
(26, 8, 4, 1),
(27, 8, 5, 1),
(28, 8, 6, 1),
(29, 9, 1, 1),
(30, 9, 5, 1),
(31, 9, 6, 1);

-- --------------------------------------------------------

--
-- Table structure for table `product_size`
--

CREATE TABLE `product_size` (
  `id` int(11) NOT NULL,
  `p_id` int(11) NOT NULL,
  `s_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_size`
--

INSERT INTO `product_size` (`id`, `p_id`, `s_id`, `status`) VALUES
(1, 1, 1, 1),
(2, 1, 3, 1),
(7, 1, 4, 1),
(8, 1, 5, 1),
(13, 3, 1, 1),
(14, 3, 3, 1),
(15, 3, 4, 1),
(16, 3, 5, 1),
(17, 3, 6, 1),
(18, 4, 1, 1),
(19, 4, 3, 1),
(20, 4, 4, 1),
(21, 4, 5, 1),
(22, 5, 1, 1),
(23, 5, 3, 1),
(24, 5, 4, 1),
(25, 6, 1, 1),
(26, 6, 3, 1),
(27, 6, 4, 1),
(28, 7, 1, 1),
(29, 7, 3, 1),
(30, 7, 4, 1),
(31, 8, 1, 1),
(32, 8, 3, 1),
(33, 8, 4, 1),
(34, 9, 1, 1),
(35, 9, 3, 1),
(36, 9, 4, 1),
(37, 9, 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`, `description`, `status`) VALUES
(1, 'admin', 'admin', 1),
(2, 'user', 'user', 1);

-- --------------------------------------------------------

--
-- Table structure for table `size`
--

CREATE TABLE `size` (
  `id` int(11) NOT NULL,
  `size` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `created` date DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `size`
--

INSERT INTO `size` (`id`, `size`, `description`, `created`, `status`) VALUES
(1, 'S', 'small', '2021-05-04', 1),
(3, 'm', 'medium', '2021-05-04', 1),
(4, 'l', 'large', '2021-05-04', 1),
(5, 'xl', 'extra large', '2021-05-04', 1),
(6, '2xl', '2 extra large', '2021-05-04', 1),
(7, '3xl', '3 extra large', '2021-05-04', 1);

-- --------------------------------------------------------

--
-- Table structure for table `sub_catagary`
--

CREATE TABLE `sub_catagary` (
  `id` int(11) NOT NULL,
  `main_id` int(11) NOT NULL,
  `c_name` varchar(255) NOT NULL,
  `c_image` text NOT NULL,
  `c_description` text NOT NULL,
  `created` date DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sub_catagary`
--

INSERT INTO `sub_catagary` (`id`, `main_id`, `c_name`, `c_image`, `c_description`, `created`, `status`) VALUES
(1, 1, 'shirt', 'c1.webp', 'shirts', '2021-05-04', 1),
(3, 1, 'T-shirt', 't1.webp', 'tshirt', '2021-05-07', 1),
(4, 1, 'Fromal shirt', 's1.webp', 'formal shirt', '2021-05-07', 1),
(5, 1, 'Casual trousers', 'ct1.webp', 'casual trousers', '2021-05-07', 1),
(6, 1, 'Formal trousers', 'ft1.webp', 'formal trousers', '2021-05-07', 1),
(7, 1, 'Jeans', 'j1.webp', 'jeans', '2021-05-07', 1),
(8, 1, 'Track pants', 'tp1.webp', 'track pants', '2021-05-07', 1),
(9, 1, 'Shorts', 'sho1.webp', 'shorts', '2021-05-07', 1),
(10, 2, 'Sarees', 'sar1.webp', 'sarees', '2021-05-07', 1),
(11, 3, 'Kids t-shirts', 'kts1.webp', 'kids t-shirts', '2021-05-07', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `color`
--
ALTER TABLE `color`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `main_catagary`
--
ALTER TABLE `main_catagary`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_color`
--
ALTER TABLE `product_color`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_size`
--
ALTER TABLE `product_size`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `size`
--
ALTER TABLE `size`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
