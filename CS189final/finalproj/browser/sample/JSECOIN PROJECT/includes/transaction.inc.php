<?php 

if (isset($_POST['send'])) {
	include_once 'dbh.inc.php';

	
	$uid =  mysqli_real_escape_string($conn, $_POST['uid']);
	$transaction = mysqli_real_escape_string($conn, $_POST['invoice']);

	if (empty($uid) || empty($transaction)) {

		header("Location: ../index.php?transaction=empty");
		exit();
	} else{

	$sql = "INSERT INTO transaction (user_uid, user_invoice) VALUES ('$uid', '$transaction');";
	$result = mysqli_query($conn, $sql);
	header("Location: ../index.php?sent=success");
	exit();
}
}