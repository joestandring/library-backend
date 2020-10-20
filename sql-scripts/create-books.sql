CREATE TABLE books (
  ID INT NOT NULL AUTO_INCREMENT,
  ownerID INT NOT NULL,
  available TINYINT(1) NOT NULL DEFAULT 1,
  isbn VARCHAR(10) NOT NULL,
  title VARCHAR(32) NOT NULL,
  imgLink VARCHAR(2048),
  authorFirst VARCHAR(16),
  authorLast VARCHAR(16) NOT NULL,
  genre VARCHAR(16),
  publisher VARCHAR(32),
  publishYear INT(4),
  dateAdded DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (ID),
  FOREIGN KEY (ownerID) REFERENCES users (ID)
);