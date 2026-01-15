CREATE DATABASE  IF NOT EXISTS `heals_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `heals_db`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: heals_db
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

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
-- Table structure for table `bmi_records`
--

DROP TABLE IF EXISTS `bmi_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bmi_records` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `studentID` varchar(50) NOT NULL,
  `value` float DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `weight` decimal(5,2) NOT NULL,
  `height` decimal(5,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bmi_records`
--

LOCK TABLES `bmi_records` WRITE;
/*!40000 ALTER TABLE `bmi_records` DISABLE KEYS */;
INSERT INTO `bmi_records` VALUES (1,'2025100179',22.49,'Normal','2025-12-30 05:47:54',0.00,0.00),(2,'5678',22.03,'Normal','2025-12-31 07:33:50',0.00,0.00),(3,'S123',20.81,'Normal','2025-12-31 08:04:13',0.00,0.00),(4,'S123',22.22,'Normal','2025-12-31 10:53:16',0.00,0.00),(5,'S123',20.81,'Normal','2025-12-31 10:56:42',0.00,0.00),(6,'S123',22.5,'Normal','2025-12-31 11:08:14',60.00,165.00),(7,'S123',20.2,'Normal','2025-12-31 11:09:18',55.00,165.00);
/*!40000 ALTER TABLE `bmi_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `studentID` varchar(50) DEFAULT NULL,
  `counselorID` varchar(50) DEFAULT NULL,
  `moodID` int(11) DEFAULT NULL,
  `text` text DEFAULT NULL,
  `date` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `studentID` (`studentID`),
  KEY `counselorID` (`counselorID`),
  KEY `moodID` (`moodID`),
  CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `users` (`userID`),
  CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`counselorID`) REFERENCES `users` (`userID`),
  CONSTRAINT `feedback_ibfk_3` FOREIGN KEY (`moodID`) REFERENCES `moods` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,'S123','S345',NULL,'itsokay, you can slow talk with your dad right? and make sure take a deep breath','2025-12-31 17:24:21'),(2,'S123','S345',NULL,'good you are doing great now','2025-12-31 19:11:23');
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `moods`
--

DROP TABLE IF EXISTS `moods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `moods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `studentID` varchar(50) NOT NULL,
  `mood` varchar(50) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `moods`
--

LOCK TABLES `moods` WRITE;
/*!40000 ALTER TABLE `moods` DISABLE KEYS */;
INSERT INTO `moods` VALUES (1,'2025100179','Happy','i have new car','2025-12-30 05:47:34'),(2,'2025100179','Happy','i have new car','2025-12-30 05:47:37'),(3,'2025100179','Happy','i have new car','2025-12-30 05:47:37'),(4,'5678','Stressed ?','i have too many work to be done','2025-12-31 07:12:18'),(5,'5678','Happy ?','i\'m hang out with my friends today','2025-12-31 07:15:22'),(6,'5678','Relaxed ?','im going hiking with my mom','2025-12-31 07:24:16'),(7,'5678','Happy ?','i film new song','2025-12-31 07:26:40'),(8,'S123','Angry ?','my dad scolded me','2025-12-31 08:03:49'),(9,'S123','Happy ?','i got new shirt','2025-12-31 11:09:39');
/*!40000 ALTER TABLE `moods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timetable`
--

DROP TABLE IF EXISTS `timetable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timetable` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `studentID` varchar(50) DEFAULT NULL,
  `day` varchar(20) DEFAULT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `time` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `studentID` (`studentID`),
  CONSTRAINT `timetable_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timetable`
--

LOCK TABLES `timetable` WRITE;
/*!40000 ALTER TABLE `timetable` DISABLE KEYS */;
INSERT INTO `timetable` VALUES (1,'2025100179','Monday','FRANCE','8:00 - 10:00'),(3,'5678','Tuesday','CSC541','8:00 A.M - 10:00 A.M'),(4,'S123','Monday','English','10 - 12'),(5,'S123','Monday','Math','8 - 10');
/*!40000 ALTER TABLE `timetable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userID` varchar(50) NOT NULL,
  `fullName` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','counselor','admin') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userID` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2025123321','shariffudin','shariff@gmail.com','shariff','student'),(2,'2025100179','Imannur Umairah','imannurumairah@gmail.com','umai1408','student'),(4,'5678','Nurul Tasnim','tasnim@gmail.com','tasnim','student'),(5,'S123','Aldina Balqis','aldina@gmail.com','aldina','student'),(6,'S345','Danial','danial@gmail.com','danial','counselor'),(7,'admin01','Super Admin','admin@example.com','adminpass','admin'),(10,'S111','Amira Aimie','amira@gmail.com','amira','student');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-31 20:12:55
