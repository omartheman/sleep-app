DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(500) DEFAULT NULL,
  `password` varchar(500) DEFAULT NULL,
  `email` varchar(500) DEFAULT NULL,
  `firstName` varchar(500) DEFAULT NULL,
  `lastName` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `accounts` VALUES (1,'omar','omar','info@omarshishani.com',NULL,NULL),(2,'test','test','oma','omar','shish');

DROP TABLE IF EXISTS `sleep_data`;
CREATE TABLE `sleep_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` varchar(500) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `napStartTime` time DEFAULT NULL,
  `napEndTime` time DEFAULT NULL,
  `sleepAidItem` varchar(255) DEFAULT NULL,
  `sleepAidMg` int DEFAULT NULL,
  `enterBedTime` time DEFAULT NULL,
  `lightsOffTime` time DEFAULT NULL,
  `timeToFallAsleep` int DEFAULT NULL,
  `numberTimesArousal` int DEFAULT NULL,
  `arousalDuration` varchar(500) DEFAULT NULL,
  `morningWakeTime` time DEFAULT NULL,
  `exitBedTime` time DEFAULT NULL,
  `minutesEarlyWoke` int DEFAULT NULL,
  `qualityRating` int DEFAULT NULL,
  PRIMARY KEY (`id`)
);


INSERT INTO `sleep_data` VALUES (2,'omar','2020-12-30','12:30:00','15:00:00',NULL,NULL,'21:20:00','21:49:00',NULL,NULL,NULL,'07:45:00','08:00:00',NULL,NULL),(3,'omar','2020-12-31','11:30:00','16:00:00',NULL,NULL,'21:30:00','23:40:00',30,NULL,NULL,'09:30:00','09:35:00',NULL,NULL),(4,'omar','2020-12-29','12:00:00','17:00:00',NULL,NULL,'22:10:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,'omar','2020-12-28','11:15:00','15:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,'omar','2021-01-01','11:20:00','19:30:00',NULL,NULL,'22:00:00','22:30:00',23,NULL,NULL,'07:30:00','07:40:00',23,NULL),(8,'omar','2021-01-02','11:08:00','12:15:00',NULL,NULL,'23:00:00','23:10:00',15,NULL,NULL,'08:30:00','08:30:00',NULL,NULL),(27,'omar','2021-01-05',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'06:45:00',NULL,NULL),(28,'omar','2021-01-09',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'20, 19, 4',NULL,NULL,NULL,NULL),(29,'omar','2021-01-28','10:10:00','23:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(31,'omar','2021-01-15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(32,'omar','2021-01-07',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'8, 20min 12 5 minuy',NULL,NULL,NULL,NULL),(33,'omar','2021-01-08',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'25, 23, 4minutes',NULL,NULL,10,NULL),(34,'omar','2021-01-14',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,30,NULL);
