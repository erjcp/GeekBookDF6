


CREATE TABLE Cart
(customerId CHAR(12) PRIMARY KEY,
/*registered*/
paymentType CHAR(6),
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
('0000' ,'DEBIT');

INSERT INTO Cart
VALUES
('0001' ,'CREDIT');

INSERT INTO CartItem
VALUES
('0000' ,'2226', 0, 1);

INSERT INTO CartItem
VALUES
('0000' ,'6328', 1, 1);

INSERT INTO CartItem
VALUES
('0001' ,'7443', 0, 1);

INSERT INTO CartItem
VALUES
('0001' ,'2226', 1, 1);




