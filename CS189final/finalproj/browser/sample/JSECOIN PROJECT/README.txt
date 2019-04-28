/includes folder

dbh.inc.php : handles all the database connection to mysqli

login.inc.php : handles functionality of login query

logout : handles functionality of logging out of your account

signup.inc.php : handles functionality of signing up

transaction.inc.php: handles functionality for 2nd table



TO BEGIN SETUP FIRST DOWNLOAD XAMPP

step 1: go to phpmyadmin and create a new database and name it "projectfinal" press "create"
step 2: go to "SQL" and type the following to setup the database

	CREATE TABLE users (
		user_id int(11) not null AUTO_INCREMENT PRIMARY KEY,
		user_first varchar(256) not null,
		user_last varchar(256) not null,
		user_email varchar(256) not null,
		user_idnum varchar(256) not null,
		user_address varchar(256) not null,
		user_privatekey varchar(256) not null,
		user_publickey varchar(256) not null,
		user_uid varchar(256) not null,
		user_pwd varchar(256) not null
	);
step 3: press "Go"

step 4: Now go back to "SQL" and type the following to create another table

	CREATE TABLE transaction (
		transaction_id int(11) not null AUTO_INCREMENT PRIMARY KEY,
		user_uid varchar(256) not null,
		user_invoice varchar(256) not null
	);

step 5: press "Go" again

step 6:

	Account you can use for testing with JSECOIN already:

	ADDRESS: TDZ7XT5T4SPSP72R4YXZARBUETVGMMMAZBDN5UI4
	PRIV KEY: 55b1cb32b3b82914c10e63cfbaedb7532e69ac0d3172b58c60c1a7c2fea98b87
	PUB KEY: a0106b741a031d8402c916d8c573d146ae97770a7cbf1ea6cb44699a41be6dfe

