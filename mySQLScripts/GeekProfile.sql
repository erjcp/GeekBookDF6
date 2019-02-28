DROP TABLE IF EXISTS CartItem;
DROP TABLE IF EXISTS Cart;
/* drops cart tables because of constraints */
DROP TABLE IF EXISTS LogIn;
DROP TABLE IF EXISTS Billing;
DROP TABLE IF EXISTS Shipping;
DROP TABLE IF EXISTS Card;
DROP TABLE IF EXISTS Customer;

CREATE TABLE Customer
(id CHAR(12) PRIMARY KEY,
firstName CHAR(12),
middleName CHAR(12),
lastName CHAR(12),
nickName CHAR(12),
phone CHAR(12),
email CHAR(24)

);

CREATE TABLE LogIn
(loginId CHAR(12) PRIMARY KEY,
pass CHAR(12),
constraint customlog
    foreign key (loginId) references Customer(id)
);

CREATE TABLE Billing
(billingId CHAR(12) PRIMARY KEY,
address CHAR(24),
city CHAR(24),
zip CHAR(8),
state CHAR(24),
/* constraints */
constraint custombill
    foreign key (billingId) references Customer(id)
);

CREATE TABLE Shipping
(shippingId CHAR(12),
address CHAR(24),
city CHAR(24),
zip CHAR(8),
state CHAR(24),
/*constraints*/
constraint customship
    foreign key (shippingId) references Customer(id)
);

CREATE TABLE Card
(cardId CHAR(12),
cardNum CHAR(19),
securityNum CHAR(5),
expMonth DECIMAL (2,0),
expDay DECIMAL (2,0),
expYear DECIMAL (4,0),
/* constraints */
constraint customcard
    foreign key (cardId) references Customer(id)
);

INSERT INTO Customer
VALUES
('0000' ,'Morrison','J', 'Toni', 'Tony', '305-XXX-XXXX', 'morritoni@fiu.edu');

INSERT INTO Customer
VALUES
('0001' ,'Testy','T','Testerson', 'Test', '305-YYY-YYYY', 'testytest@fiu.edu');

INSERT INTO LogIn
VALUES
('0000' ,'pass1');

INSERT INTO LogIn
VALUES
('0001' ,'pass2');

INSERT INTO Billing
VALUES
('0000' ,'1111 sw wow st','Miami', '33333', 'FL');

INSERT INTO Billing
VALUES
('0001' ,'1112 sw test st','Miami', '33333', 'FL');

INSERT INTO Shipping
VALUES
('0000' ,'1111 sw wow st','Miami', '33333', 'FL');

INSERT INTO Shipping
VALUES
('0000' ,'1112 sw test st','Miami', '33333', 'FL');

INSERT INTO Shipping
VALUES
('0001' ,'1111 sw wow st','Miami', '33333', 'FL');

INSERT INTO Shipping
VALUES
('0001' ,'1112 sw test st','Miami', '33333', 'FL');

INSERT INTO Card
VALUES
('0000' ,'XXXXXXXXXXXXXXXX','XXX', '01', '01', '2020');

INSERT INTO Card
VALUES
('0000' ,'YYYYYYYYYYYYYYYY','YYY', '02', '02', '2020');

INSERT INTO Card
VALUES
('0001' ,'ZZZZZZZZZZZZZZZZ','ZZZ', '03', '03', '2020');

