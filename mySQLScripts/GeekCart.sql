


CREATE TABLE Cart
(customerId CHAR(12) PRIMARY KEY,
/*registered*/
paymentType CHAR(6),
total DECIMAL (8,2),
constraint custom
    foreign key (customerId) references Customer(id)
);

CREATE TABLE CartItem
(orderId CHAR(12),
bookId CHAR(12),
cartType DECIMAL(1,0),
quantity DECIMAL (3,0),
PRIMARY KEY(orderId, bookId),
constraint customorder
    foreign key (orderId) references Cart(customerId)
);



INSERT INTO Cart
VALUES
('0000' ,'DEBIT', 0.00);

INSERT INTO Cart
VALUES
('0001' ,'CREDIT', 0.00);

INSERT INTO CartItem
VALUES
('0000' ,'2281', 0, 1);

INSERT INTO CartItem
VALUES
('0000' ,'9627', 1, 1);

INSERT INTO CartItem
VALUES
('0001' ,'9882', 0, 1);

INSERT INTO CartItem
VALUES
('0001' ,'9883', 1, 1);




