CREATE DATABASE project;
use project;
CREATE table users(email varchar(30) PRIMARY key, pwd varchar(30), type varchar(20),dos date,status int);
select * from users;

create table donors(email VARCHAR(40) primary key, name varchar(30), mobile int, address varchar(50), city varchar(20), proof varchar(20), pic varchar(200));
select * from donors;

create table needy(email VARCHAR(40) primary key, name varchar(30), mobile int,gender varchar(10),dob date, address varchar(150), city varchar(20), proof varchar(20), pic varchar(200));
select * from needy;

CREATE TABLE medsavailable (
    srno INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(40),
    med VARCHAR(30),
    expdate DATE,
    packing VARCHAR(25),
    qty INT
);
select * from medsavailable;
CREATE TABLE availmed (
    srno INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(40),
    medName varchar(50),
    exp DATE,
    qty INT
);
select * from availmed;
select donors.name,donors.address,donors.city,donors.email from donors inner join medsavailable on donors.email= medsavailable.email where medsavailable.med='hajmola' and donors.city='2'