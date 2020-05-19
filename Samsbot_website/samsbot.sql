CREATE DATABASE  IF NOT EXISTS `samsbot` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `samsbot`;
-- MySQL dump 10.13  Distrib 8.0.17, for macos10.14 (x86_64)
--
-- Host: samsbot1.cvrunnkd3clm.us-east-1.rds.amazonaws.com    Database: grubhub
-- ------------------------------------------------------
-- Server version	8.0.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `client_signup`
--

DROP TABLE IF EXISTS `client_signup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_signup` (
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `client_email` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  PRIMARY KEY (`client_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_signup`
--

LOCK TABLES `client_signup` WRITE;
/*!40000 ALTER TABLE `client_signup` DISABLE KEYS */;
INSERT INTO `client_signup` VALUES ('Ankit','Joshi','ankit@joshi.com','ankit');
/*!40000 ALTER TABLE `client_signup` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=CURRENT_USER*/ /*!50003 TRIGGER `client_signup_AFTER_INSERT` AFTER INSERT ON `client_signup` FOR EACH ROW BEGIN
INSERT INTO client_update (client_email) VALUES (new.client_email);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `client_update`
--

DROP TABLE IF EXISTS `client_update`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_update` (
  `client_email` varchar(45) NOT NULL,
  `street_address` varchar(45) DEFAULT NULL,
  `apt` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  `zip_code` varchar(45) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `cross_street` varchar(100) DEFAULT NULL,
  `delivery_instructions` varchar(100) DEFAULT NULL,
  `address_name` varchar(45) DEFAULT NULL,
  `profile_image` varchar(200) DEFAULT NULL,
  KEY `client_email_idx` (`client_email`),
  CONSTRAINT `client_email` FOREIGN KEY (`client_email`) REFERENCES `client_signup` (`client_email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_update`
--

LOCK TABLES `client_update` WRITE;
/*!40000 ALTER TABLE `client_update` DISABLE KEYS */;
INSERT INTO `client_update` VALUES ('ankit@joshi.com','1330 The Alameda','374','San Jose','California','95126','123-456-7890','null','null','Home','/images/ankit@joshi.com/Ankit.jpg');
/*!40000 ALTER TABLE `client_update` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_table`
--

DROP TABLE IF EXISTS `item_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_table` (
  `section_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  `item_name` varchar(45) NOT NULL,
  `item_image` varchar(45) DEFAULT NULL,
  `item_description` varchar(300) DEFAULT NULL,
  `item_price` varchar(45) NOT NULL,
  PRIMARY KEY (`item_id`),
  UNIQUE KEY `item_id_UNIQUE` (`item_id`),
  KEY `section_id_idx` (`section_id`),
  CONSTRAINT `section_id` FOREIGN KEY (`section_id`) REFERENCES `menu_table` (`section_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_table`
--

LOCK TABLES `item_table` WRITE;
/*!40000 ALTER TABLE `item_table` DISABLE KEYS */;
INSERT INTO `item_table` VALUES (14,25,'Veggie pizza','/images/14/pizza.jpg','This pizza is loaded with veggies','8.99'),(15,27,'Veggie Burrito','/images/15/burrito.jpg','Flour Tortilla with rice, beans, fajita veggies, queso, salsa, guacamole, and sour cream, or cheese.','7.85'),(16,28,'Veggie Burrito Bowl','/images/15/burrito-bowl.jpg','Served in a bowl with your choice of rice, beans or fajita veggies, queso, salsa, guacamole, and sour cream or cheese.','7.85'),(16,29,'Salad Bowl','/images/15/salad-bowl.jpg','Chopped Romaine lettuce with your choice of beans, queso, salsa, guacamole, sour cream or cheese with freshly made chipotle-honey vinaigrette','7.85'),(17,30,'Veggie Taco','/images/15/tacos.jpg','Your choice of tortilla filled with queso, salsa, guacamole, sour cream or cheese, and romaine lettuce','2.75'),(21,31,'Chili Garlic Noodles','/images/14/chili garlic noodles.jpg','Chilli Garlic Noodles are one of the most popular dishes of Indo-Chinese cuisine and can be easily prepared at home.','14'),(20,32,'Chinese Bhel','/images/14/chinese bhel.jpg','Chinese version of classic Indian street food Bhel','8.5'),(21,33,'Hakka Noodles','/images/14/hakka noodles.jpg','Hakka noodles is a Chinese preparation where boiled noodles are stir fried with sauces and vegetables.','10.99'),(22,34,'Fried ice cream','/images/14/fried ice cream.jpg','Fried ice cream is a dessert made from a breaded scoop of ice cream that is quickly deep-fried, creating a warm, crispy shell around the still-cold ice cream.','8'),(20,35,'Momos','/images/14/momos.jpg','Momo is a type of steamed dumpling with some form of filling.','6'),(23,36,'Burger','/images/13/burger.jpg','Veggie pattie with lettuce, red onions and a slice of tomatoes served with a side of fries.','6.99'),(23,37,'Pizza','/images/13/pizza.jpg','Veggie pizza with cherry tomatoes, mozzarella and herbs','11.99');
/*!40000 ALTER TABLE `item_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_table`
--

DROP TABLE IF EXISTS `menu_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_table` (
  `r_id` int(11) NOT NULL,
  `section_name` varchar(45) DEFAULT NULL,
  `section_description` varchar(200) DEFAULT NULL,
  `section_id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`section_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_table`
--

LOCK TABLES `menu_table` WRITE;
/*!40000 ALTER TABLE `menu_table` DISABLE KEYS */;
INSERT INTO `menu_table` VALUES (14,'Dinner','Fine wine and dine!',14),(15,'Burritos','740-1210 cal',15),(15,'Bowls','420-910 cal',16),(15,'Tacos','390-1140 cal',17),(14,'Starters','Let\'s get you started',20),(14,'Noodles','Slurpy goodness',21),(14,'Endings','Desserts!!!!!!',22),(13,'Snack','Munching stuff',23);
/*!40000 ALTER TABLE `menu_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details_table`
--

DROP TABLE IF EXISTS `order_details_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details_table` (
  `order_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `item_name` varchar(45) NOT NULL,
  `item_quantity` int(11) NOT NULL,
  `item_total_price` float NOT NULL,
  KEY `order_id_idx` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details_table`
--

LOCK TABLES `order_details_table` WRITE;
/*!40000 ALTER TABLE `order_details_table` DISABLE KEYS */;
INSERT INTO `order_details_table` VALUES (51,32,'Chinese Bhel',1,8.5),(51,33,'Hakka Noodles',1,10.99),(51,34,'Fried ice cream',1,8),(52,27,'Veggie Burrito',2,15.7),(53,36,'Burger',1,6.99),(54,27,'Veggie Burrito',2,15.7),(55,37,'Pizza',3,35.97),(56,27,'Veggie Burrito',3,23.55),(57,33,'Hakka Noodles',1,10.99),(57,35,'Momos',1,6);
/*!40000 ALTER TABLE `order_details_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_table`
--

DROP TABLE IF EXISTS `order_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_table` (
  `order_id` int(11) NOT NULL,
  `client_email` varchar(45) NOT NULL,
  `client_first_name` varchar(45) NOT NULL,
  `client_last_name` varchar(45) NOT NULL,
  `client_address` varchar(100) NOT NULL,
  `r_id` int(11) NOT NULL,
  `status` varchar(45) NOT NULL,
  `order_bill` decimal(10,2) NOT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_table`
--

LOCK TABLES `order_table` WRITE;
/*!40000 ALTER TABLE `order_table` DISABLE KEYS */;
INSERT INTO `order_table` VALUES (51,'tina@aggarwal.com','Tina','Aggarwal','1326 The Alameda 266 San Jose California 95126',14,'Delivered',27.49),(52,'tina@aggarwal.com','Tina','Aggarwal','1326 The Alameda 266 San Jose California 95126',15,'Cancelled',15.70),(53,'tina@aggarwal.com','Tina','Aggarwal','1326 The Alameda 266 San Jose California 95126',13,'Cancelled',6.99),(55,'tina@aggarwal.com','Tina','Aggarwal','1326 The Alameda 266 San Jose California 95126',13,'New',35.97),(56,'tina@aggarwal.com','Tina','Aggarwal','1326 The Alameda 266 San Jose California 95126',15,'Cancelled',23.55),(57,'tina@aggarwal.com','Tina','Aggarwal','1326 The Alameda 266 San Jose California 95126',14,'Delivered',16.99);
/*!40000 ALTER TABLE `order_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `owner_profile`
--

DROP TABLE IF EXISTS `owner_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `owner_profile` (
  `profile_image` varchar(200) DEFAULT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `owner_email` varchar(45) NOT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `rest_name` varchar(45) DEFAULT NULL,
  `rest_image` varchar(45) DEFAULT NULL,
  `cuisine` varchar(45) DEFAULT NULL,
  `rest_zip_code` varchar(45) DEFAULT NULL,
  `r_id` int(11) NOT NULL,
  PRIMARY KEY (`owner_email`),
  UNIQUE KEY `owner_email_UNIQUE` (`owner_email`),
  KEY `r_id_idx` (`r_id`),
  CONSTRAINT `r_id` FOREIGN KEY (`r_id`) REFERENCES `owner_signup` (`r_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `owner_profile`
--

LOCK TABLES `owner_profile` WRITE;
/*!40000 ALTER TABLE `owner_profile` DISABLE KEYS */;
INSERT INTO `owner_profile` VALUES ('/images/13/amber-profile.png','Aryan','Gupta','amberIndia@amberIndia.com','123-456-7890','Amber India','/images/13/amber-india.jpeg','Indian','95128',13),('/images/15/chipotle-profile.png','Karteek','Agarwal','chipotle@chipotle.com','null','Chipotle','/images/15/chipotle.svg','Mexican','55422',15),('/images/14/mickey.png','Tina','Aggarwal','inchins@inchins.com','123-456-7890','Inchins','/images/14/inchins.jpg','Indo Chinese','95126',14);
/*!40000 ALTER TABLE `owner_profile` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=CURRENT_USER*/ /*!50003 TRIGGER `owner_profile_AFTER_UPDATE` AFTER UPDATE ON `owner_profile` FOR EACH ROW BEGIN
	UPDATE `owner_signup` 
    SET first_name = new.first_name,
    last_name = new.last_name,
    owner_email = new.owner_email,
    restaurant_name = new.rest_name,
    restaurant_zip_code = new.rest_zip_code
    WHERE r_id = new.r_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `owner_signup`
--

DROP TABLE IF EXISTS `owner_signup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `owner_signup` (
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `owner_email` varchar(45) NOT NULL,
  `restaurant_name` varchar(45) NOT NULL,
  `restaurant_zip_code` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `r_id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`r_id`),
  UNIQUE KEY `owner_email_UNIQUE` (`owner_email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `owner_signup`
--

LOCK TABLES `owner_signup` WRITE;
/*!40000 ALTER TABLE `owner_signup` DISABLE KEYS */;
INSERT INTO `owner_signup` VALUES ('Shashwat','Jain','amberindia@amberindia.com','Amber India','95128','amberIndia',13),('Shubham','Patil','inchins@inchins.com','Inchins','95126','inchins',14),('Mayank','Dhingra','chipotle@chipotle.com','Chipotle','55422','chipotle',15);
/*!40000 ALTER TABLE `owner_signup` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=CURRENT_USER*/ /*!50003 TRIGGER `owner_signup_AFTER_INSERT` AFTER INSERT ON `owner_signup` FOR EACH ROW BEGIN
INSERT into `owner_profile` (first_name, last_name, owner_email, rest_name, rest_zip_code, r_id) VALUES (new.first_name, new.last_name, new.owner_email, new.restaurant_name, new.restaurant_zip_code, new.r_id);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Dumping events for database 'grubhub'
--

--
-- Dumping routines for database 'grubhub'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-10-05 22:59:13
