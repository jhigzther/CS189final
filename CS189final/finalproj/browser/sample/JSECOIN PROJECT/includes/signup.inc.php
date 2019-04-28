<?php 

if (isset($_POST['submit'])) {

	include_once 'dbh.inc.php';

	$first =  mysqli_real_escape_string($conn, $_POST['first']);
	$last =  mysqli_real_escape_string($conn, $_POST['last']);
	$email =  mysqli_real_escape_string($conn, $_POST['email']);
	$idnum = mysqli_real_escape_string($conn, $_POST['idnum']);
	$add = mysqli_real_escape_string($conn, $_POST['add']);
	$privatekey = mysqli_real_escape_string($conn, $_POST['privatekey']);
	$publickey = mysqli_real_escape_string($conn, $_POST['publickey']);
	$uid =  mysqli_real_escape_string($conn, $_POST['uid']);
	$pwd =  mysqli_real_escape_string($conn, $_POST['pwd']);

	//ERR handlers
	//check empty field
	if (empty($first) || empty($last) || empty($email) || empty($idnum) || empty($add) || empty($privatekey) || empty($publickey) || empty($uid) || empty($pwd)) {

		header("Location: ../signup.php?signup=empty");
		exit();

	} else {
		//check input characters
		if(!preg_match("/^[a-zA-Z]*$/", $first) || !preg_match("/^[a-zA-Z]*$/", $last)){ 
			header("Location: ../signup.php?signup=invalid");
			exit();
		} else {
			//check if email is valid
			if (!filter_var($email, FILTER_VALIDATE_EMAIL)){
				header("Location: ../signup.php?signup=email");
				exit();
			} else {
				$sql = "SELECT * FROM users WHERE user_uid='$uid'";	
				$result = mysqli_query( $conn, $sql);
				$resultCheck = mysqli_num_rows($result);

				if ($resultCheck > 0){
					header("Location: ../signup.php?signup=usertaken");
					exit();


				} else {
					//hash password
					$hashedPwd = password_hash($pwd, PASSWORD_DEFAULT);
					//Insert user into DB
					$sql = "INSERT INTO users (user_first, user_last, user_email, user_idnum, user_address, user_privatekey, user_publickey, user_uid, user_pwd) VALUES ('$first', '$last', '$email', '$idnum', '$add', '$privatekey', '$publickey', '$uid', '$hashedPwd');";

					mysqli_query($conn, $sql);
					header("Location: ../signup.php?signup=success");
					exit();
				}

			}
		}

	}

} else {
	header("Location: ../signup.php");
	exit();
}