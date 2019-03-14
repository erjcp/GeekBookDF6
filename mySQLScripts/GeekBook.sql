DROP TABLE IF EXISTS Author;
DROP TABLE IF EXISTS Review;
DROP TABLE IF EXISTS Book;
DROP TABLE IF EXISTS Publisher;
DROP TABLE IF EXISTS Wrote;
DROP TABLE IF EXISTS CartItem;


CREATE TABLE Author 
(authorNum DECIMAL(2,0) PRIMARY KEY,
authorLast CHAR(12),
authorFirst CHAR(10) 
);

CREATE TABLE Book 
(bookCode CHAR(4) PRIMARY KEY,
title CHAR(40),
publisherCode CHAR(3),
genre CHAR(3),
paperback CHAR(1), 
numCopies DECIMAL(2,0),
price DECIMAL(8,2),
/*cover BLOB,*/
summary CHAR(100)
);


CREATE TABLE Publisher 
(publisherCode CHAR(3) PRIMARY KEY,
publisherName CHAR(25),
city CHAR(20) )
;

CREATE TABLE Wrote 
(bookCode CHAR(4),
authorNum DECIMAL(2,0),
sequence DECIMAL(2,0),
PRIMARY KEY (bookCode, authorNum) )
;


INSERT INTO Author
VALUES
(14,'Ambrose','Stephen E.');
INSERT INTO Author
VALUES
(15,'Rowling','J.K.');
INSERT INTO Book
VALUES
('2226','Harry Potter and the Prisoner of Azkaban','ST','SFI','N', 10, 4.00, 'A classic like no other...');
INSERT INTO Book
VALUES
('6328','Band of Brothers','TO','HIS','Y', 10, 4.00, 'A classic like no other...');
INSERT INTO Book
VALUES
('7443','Harry Potter and the Goblet of Fire','ST','SFI','N', 10, 4.00, 'A classic like no other...');
INSERT INTO Publisher
VALUES
('ST','Scholastic Trade','New York');
INSERT INTO Publisher
VALUES
('TO','Touchstone Books','Westport CT');
INSERT INTO Wrote
VALUES
('2226',15,1);
INSERT INTO Wrote
VALUES
('6328',14,1);
INSERT INTO Wrote
VALUES
('7443',15,1);
