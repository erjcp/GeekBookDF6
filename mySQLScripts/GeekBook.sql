DROP TABLE IF EXISTS Author;
DROP TABLE IF EXISTS Book;
DROP TABLE IF EXISTS Publisher;
DROP TABLE IF EXISTS Wrote;

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
price DECIMAL(8,2)
/*cover BLOB*/
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
(1,'Morrison','Toni');
INSERT INTO Author
VALUES
(2,'Solotaroff','Paul');
INSERT INTO Author
VALUES
(3,'Vintage','Vernor');
INSERT INTO Author
VALUES
(4,'Francis','Dick');
INSERT INTO Author
VALUES
(5,'Straub','Peter');
INSERT INTO Author
VALUES
(6,'King','Stephen');
INSERT INTO Author
VALUES
(7,'Pratt','Philip');
INSERT INTO Author
VALUES
(8,'Chase','Truddi');
INSERT INTO Author
VALUES
(9,'Collins','Bradley');
INSERT INTO Author
VALUES
(10,'Heller','Joseph');
INSERT INTO Author
VALUES
(11,'Wills','Gary');
INSERT INTO Author
VALUES
(12,'Hofstadter','Douglas R.');
INSERT INTO Author
VALUES
(13,'Lee','Harper');
INSERT INTO Author
VALUES
(14,'Ambrose','Stephen E.');
INSERT INTO Author
VALUES
(15,'Rowling','J.K.');
INSERT INTO Author
VALUES
(16,'Salinger','J.D.');
INSERT INTO Author
VALUES
(17,'Heaney','Seamus');
INSERT INTO Author
VALUES
(18,'Camus','Albert');
INSERT INTO Author
VALUES
(19,'Collins, Jr.','Bradley');
INSERT INTO Author
VALUES
(20,'Steinbeck','John');
INSERT INTO Author
VALUES
(21,'Castelman','Riva');
INSERT INTO Author
VALUES
(22,'Owen','Barbara');
INSERT INTO Author
VALUES
(23,'O''Rourke','Randy');
INSERT INTO Author
VALUES
(24,'Kidder','Tracy');
INSERT INTO Author
VALUES
(25,'Schleining','Lon');
INSERT INTO Book
VALUES
('0180','A Deepness in the Sky','TB','SFI','Y', 10, 4.00);
INSERT INTO Book
VALUES
('0189','Magic Terror','FA','HOR','Y', 10, 4.00);
INSERT INTO Book
VALUES
('0200','The Stranger','VB','FIC','Y', 10, 4.00);
INSERT INTO Book
VALUES
('0378','Venice','SS','ART','N', 10, 4.00);
INSERT INTO Book
VALUES
('079X','Second Wind','PU','MYS','N', 10, 4.00);
INSERT INTO Book
VALUES
('0808','The Edge','JP','MYS','Y', 10, 4.00);
INSERT INTO Book
VALUES
('1351','Dreamcatcher: A Novel','SC','HOR','N', 10, 4.00);
INSERT INTO Book
VALUES
('1382','Treasure Chests','TA','ART','N', 10, 4.00);
INSERT INTO Book
VALUES
('138X','Beloved','PL','FIC','Y', 10, 4.00);
INSERT INTO Book
VALUES
('2226','Harry Potter and the Prisoner of Azkaban','ST','SFI','N', 10, 4.00);
INSERT INTO Book
VALUES
('2281','Van Gogh and Gauguin','WP','ART','N', 10, 4.00);
INSERT INTO Book
VALUES
('2766','Of Mice and Men','PE','FIC','Y', 10, 4.00);
INSERT INTO Book
VALUES
('2908','Electric Light','FS','POE','N', 10, 4.00);
INSERT INTO Book
VALUES
('3350','Group: Six People in Search of a Life','BP','PSY','Y', 10, 4.00);
INSERT INTO Book
VALUES
('3743','Nine Stories','LB','FIC','Y', 10, 4.00);
INSERT INTO Book
VALUES
('3906','The Soul of a New Machine','BY','SCI','Y', 10, 4.00);
INSERT INTO Book
VALUES
('5163','Travels with Charley','PE','TRA','Y', 10, 4.00);
INSERT INTO Book
VALUES
('5790','Catch-22','SC','FIC','Y', 10, 4.00);
INSERT INTO Book
VALUES
('6128','Jazz','PL','FIC','Y', 10, 4.00);
INSERT INTO Book
VALUES
('6328','Band of Brothers','TO','HIS','Y', 10, 4.00);
INSERT INTO Book
VALUES
('669X','A Guide to SQL','CT','CMP','Y', 10, 4.00);
INSERT INTO Book
VALUES
('6908','Franny and Zooey','LB','FIC','Y', 10, 4.00);
INSERT INTO Book
VALUES
('7405','East of Eden','PE','FIC','Y', 10, 4.00);
INSERT INTO Book
VALUES
('7443','Harry Potter and the Goblet of Fire','ST','SFI','N', 10, 4.00);
INSERT INTO Book
VALUES
('7559','The Fall','VB','FIC','Y', 10, 4.00);
INSERT INTO Book
VALUES
('8092','Godel, Escher, Bach','BA','PHI','Y', 10, 4.00);
INSERT INTO Book
VALUES
('8720','When Rabbit Howls','JP','PSY','Y', 10, 4.00);
INSERT INTO Book
VALUES
('9611','Black House','RH','HOR','N', 10, 4.00);
INSERT INTO Book
VALUES
('9627','Song of Solomon','PL','FIC','Y', 10, 4.00);
INSERT INTO Book
VALUES
('9701','The Grapes of Wrath','PE','FIC','Y', 10, 4.00);
INSERT INTO Book
VALUES
('9882','Slay Ride','JP','MYS','Y', 10, 4.00);
INSERT INTO Book
VALUES
('9883','The Catcher in the Rye','LB','FIC','Y', 10, 4.00);
INSERT INTO Book
VALUES
('9931','To Kill a Mockingbird','HC','FIC','N', 10, 4.00);
INSERT INTO Publisher
VALUES
('AH','Arkham House','Sauk City WI');
INSERT INTO Publisher
VALUES
('AP','Arcade Publishing','New York');
INSERT INTO Publisher
VALUES
('BA','Basic Books','Boulder CO');
INSERT INTO Publisher
VALUES
('BP','Berkley Publishing','Boston');
INSERT INTO Publisher
VALUES
('BY','Back Bay Books','New York');
INSERT INTO Publisher
VALUES
('CT','Course Technology','Boston');
INSERT INTO Publisher
VALUES
('FA','Fawcett Books','New York');
INSERT INTO Publisher
VALUES
('FS','Farrar Straus and Giroux','New York');
INSERT INTO Publisher
VALUES
('HC','HarperCollins Publishers','New York');
INSERT INTO Publisher
VALUES
('JP','Jove Publications','New York');
INSERT INTO Publisher
VALUES
('JT','Jeremy P. Tarcher','Los Angeles');
INSERT INTO Publisher
VALUES
('LB','Lb Books','New York');
INSERT INTO Publisher
VALUES
('MP','McPherson and Co.','Kingston');
INSERT INTO Publisher
VALUES
('PE','Penguin USA','New York');
INSERT INTO Publisher
VALUES
('PL','Plume','New York');
INSERT INTO Publisher
VALUES
('PU','Putnam Publishing Group','New York');
INSERT INTO Publisher
VALUES
('RH','Random House','New York');
INSERT INTO Publisher
VALUES
('SB','Schoken Books','New York');
INSERT INTO Publisher
VALUES
('SC','Scribner','New York');
INSERT INTO Publisher
VALUES
('SS','Simon and Schuster','New York');
INSERT INTO Publisher
VALUES
('ST','Scholastic Trade','New York');
INSERT INTO Publisher
VALUES
('TA','Taunton Press','Newtown CT');
INSERT INTO Publisher
VALUES
('TB','Tor Books','New York');
INSERT INTO Publisher
VALUES
('TH','Thames and Hudson','New York');
INSERT INTO Publisher
VALUES
('TO','Touchstone Books','Westport CT');
INSERT INTO Publisher
VALUES
('VB','Vintage Books','New York');
INSERT INTO Publisher
VALUES
('WN','W.W. Norton','New York');
INSERT INTO Publisher
VALUES
('WP','Westview Press','Boulder CO');
INSERT INTO Wrote
VALUES
('0180',3,1);
INSERT INTO Wrote
VALUES
('0189',5,1);
INSERT INTO Wrote
VALUES
('0200',18,1);
INSERT INTO Wrote
VALUES
('0378',11,1);
INSERT INTO Wrote
VALUES
('079X',4,1);
INSERT INTO Wrote
VALUES
('0808',4,1);
INSERT INTO Wrote
VALUES
('1351',6,1);
INSERT INTO Wrote
VALUES
('1382',23,2);
INSERT INTO Wrote
VALUES
('1382',25,1);
INSERT INTO Wrote
VALUES
('138X',1,1);
INSERT INTO Wrote
VALUES
('2226',15,1);
INSERT INTO Wrote
VALUES
('2281',9,2);
INSERT INTO Wrote
VALUES
('2281',19,1);
INSERT INTO Wrote
VALUES
('2766',20,1);
INSERT INTO Wrote
VALUES
('2908',17,1);
INSERT INTO Wrote
VALUES
('3350',2,1);
INSERT INTO Wrote
VALUES
('3743',16,1);
INSERT INTO Wrote
VALUES
('3906',24,1);
INSERT INTO Wrote
VALUES
('5163',20,1);
INSERT INTO Wrote
VALUES
('5790',10,1);
INSERT INTO Wrote
VALUES
('6128',1,1);
INSERT INTO Wrote
VALUES
('6328',14,1);
INSERT INTO Wrote
VALUES
('669X',7,1);
INSERT INTO Wrote
VALUES
('6908',16,1);
INSERT INTO Wrote
VALUES
('7405',20,1);
INSERT INTO Wrote
VALUES
('7443',15,1);
INSERT INTO Wrote
VALUES
('7559',18,1);
INSERT INTO Wrote
VALUES
('8092',12,1);
INSERT INTO Wrote
VALUES
('8720',8,1);
INSERT INTO Wrote
VALUES
('9611',5,2);
INSERT INTO Wrote
VALUES
('9611',6,1);
INSERT INTO Wrote
VALUES
('9627',1,1);
INSERT INTO Wrote
VALUES
('9701',20,1);
INSERT INTO Wrote
VALUES
('9882',4,1);
INSERT INTO Wrote
VALUES
('9883',16,1);
INSERT INTO Wrote
VALUES
('9931',13,1);
