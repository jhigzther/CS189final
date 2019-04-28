<?php

session_start();

if(isset($_POST['submit'])) {

	include 'dbh.inc.php';

	$uid = mysqli_real_escape_string($conn, $_POST['uid']);
	$pwd = mysqli_real_escape_string($conn, $_POST['pwd']);

	//Error handlers
	//Check if inputs are empty

	if(empty($uid) || empty($pwd)){
		header("Location: ../index.php?login=empty");
		exit();
	} else {
		$sql = "SELECT * FROM users WHERE user_uid='$uid' OR user_email='$uid'";
		$result = mysqli_query($conn, $sql);
		$resultCheck = mysqli_num_rows($result);
		if($resultCheck < 1){
			header("Location: ../index.php?login=failed");
			exit();
		} else {
			if ($row = mysqli_fetch_assoc($result)) {
				//Dehash func
				$hashedPwdCheck = password_verify($pwd, $row['user_pwd']);
				if ($hashedPwdCheck ==false) {
					header("Location: ../index.php?login=failed");
					exit();
				} elseif ($hashedPwdCheck == true) {
					//login for user
					$_SESSION['u_id'] = $row['user_id'];
					$_SESSION['u_first'] = $row['user_first'];
					$_SESSION['u_last'] = $row['user_last'];
					$_SESSION['u_email'] = $row['user_email'];
					$_SESSION['u_idnum'] = $row['user_idnum'];
					$_SESSION['u_address'] = $row['user_address'];
					$_SESSION['u_privatekey'] = $row['user_privatekey'];
					$_SESSION['u_publickey'] = $row['user_publickey'];
					$_SESSION['u_uid'] = $row['user_uid'];
					header("Location: ../index.php?login=loginsuccess");
					exit();
				}
			}
		}
	}
} else {
	header("Location: ../index.php?login=failed");
	exit();	

}
