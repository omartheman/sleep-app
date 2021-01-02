
UPDATE sleep_data
SET napEndTime = '15:00'
WHERE id = 2;

UPDATE sleep_data
SET napEndTime = '16:00'
WHERE id = 3;

UPDATE sleep_data
SET napEndTime = '17:00'
WHERE id = 4;

UPDATE sleep_data
SET napEndTime = '15:00'
WHERE id = 5;

UPDATE sleep_data
SET napEndTime = '15:30'
WHERE id = 6;

UPDATE sleep_data
SET napEndTime = '15:10'
WHERE id = 7;

SELECT * FROM sleep_data ORDER BY date;

ALTER TABLE sleep_data RENAME COLUMN napEnd TO napEndTime;
ALTER TABLE sleep_data RENAME COLUMN napStart TO napStartTime;

INSERT INTO sleep_data 
(user, date, napStartTime, napEndTime, sleepAidMg, sleepAidItem, enterBedTime, lightsOffTime, numberTimesArousal, arousalDuration, morningWakeTime, exitBedTime, minutesEarlyWoke, qualityRating)
VALUES 
('omar', '2020-12-30', '12:30:00');

INSERT INTO sleep_data 
(user, date, napStartTime, napEndTime)
VALUES 
('omar', '2021-01-15T08:00:00.000Z', '11:08:00', '12:15');

INSERT INTO sleep_data 
(user, date, napStartTime)
VALUES 
('omar', '2020-12-29', '12:00:00');

INSERT INTO sleep_data 
(user, date)
VALUES 
('omar', '2020-12-30');

--Initial creation of sleep_data table 

CREATE TABLE sleep_data (
  id INT(50) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user VARCHAR(500),
  date DATE,
  napStartTime TIME,
  napEndTime TIME,
  sleepAidMg INT(50),
  sleepAidItem VARCHAR(255),
  enterBedTime TIME,
  lightsOffTime TIME,
  numberTimesArousal INT(50),
  arousalDuration TIME,
  morningWakeTime TIME,
  exitBedTime TIME,
  minutesEarlyWoke TIME, 
  qualityRating INT(50)
);