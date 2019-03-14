

CREATE TABLE Review
(bookId CHAR(12),
customerId CHAR(12),
score DECIMAL(2,1),
heading CHAR (50),
review CHAR (100),
reviewDate DATE,
PRIMARY KEY(bookId, customerId),
constraint customreview
    foreign key (bookId) references Book(bookCode)
);

INSERT INTO Review
VALUES
('7443' ,'0000', 4.5, 'Like no other', 'A great book with a great story.', '2019-04-23');

INSERT INTO Review
VALUES
('7443' ,'0001', 4.5,  'Like no other', 'Incredible author.', '2019-04-23');

INSERT INTO Review
VALUES
('2226' ,'0000', 3.0,  'Like no other', 'I like the later books better.', '2019-04-23');

INSERT INTO Review
VALUES
('2226' ,'0001', 4.2,  'Like no other', 'J.K. is the greatest!', '2019-04-23');