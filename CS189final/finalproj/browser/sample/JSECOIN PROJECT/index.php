<?php
	include_once 'header.php';
?>


<section class="main-container">
		<center><h4 style="text-align:center;">JSEC Coin System</h4></center>
<center><img src = "seal.png" width="100" height="100" /></center>
		<?php
			if(isset($_SESSION['u_id'])) {
				echo "Welcome, ";

				echo $_SESSION['u_first'];
				echo " ";
				echo $_SESSION['u_last'];

				echo
				'<div>
				<form action="account.php" method="POST">
				<button type="submit" name="submit">Check Balance</button>
				</form>


				<div><h3> Send Jcoin</h3>
				<form action="includes/transaction.inc.php" method="POST">
				<div><input class="form-control" type="text" id="recipient" placeholder="Enter Recepient Address"/></div>
				<div><input type="text" name="amount" value="1" readonly>
				<div><input type="text" name="namespaceId" value="jseccoinsystem" readonly></div>
				<div><input type="text" name="mosaicName" value="jseccoin" readonly></div>
				<div><textarea  class="form-control" rows="5" cols="25" name="invoice" id="message" placeholder ="Enter Invoice Here"></textarea></div>
				<div><input type="text" name="uid" placeholder="Enter Your Username"></div>
				<div><input type="text" name="privatekey" placeholder="Enter Your Private Key"></div>
				<div><input  class="form-control" type="text" id="mosaicAmount" placeholder="Enter jseccoins amount"/></div>
				<div><button class="btn btn-success" style="width:5%;" name="send" id="send">Send</button></div>
				</form>
				<input type="hidden" class="form-control" id="fee" readonly/>
				</div>

				<div>
				<form action="transaction.php" method="POST">
				<button type="submit" name="submit">Check Transactions</button>
				</form>

				';
			}
		?>

		<!-- <form action="includes/transaction.inc.php" method="POST">
			<div><input type="text" name="uid" placeholder="Enter Username"></div>
			<div><input type="text" name="invoice" placeholder="Enter Invoice"></div>
			<button type="submit" name="send">Send</button>
		</form> -->
</section>

<center><h1><div>
<?php
	if(isset($_SESSION['u_id'])) {

		echo "USERNAME: ";
		echo $_SESSION['u_uid'];
	}


?>

</div></h1></center>

<br>
<br>

<center><h1><div>

<?php
			if(isset($_SESSION['u_id'])) {
				
				echo "ID NUMBER: ";
				echo $_SESSION['u_idnum'];
			}

		?>
</div></h1></center>

<br>
<br>


<center><h1><div>
<?php
			if(isset($_SESSION['u_id'])) {
				
				echo " NEM ADDRESS: ";
				echo $_SESSION['u_address'];
				
			}

		?>
</div></h1></center>

<br>
<br>


<center><h1><div>

<?php
			if(isset($_SESSION['u_id'])) {
				
				echo " NEM PRIVATE KEY: ";
				echo $_SESSION['u_privatekey'];
			}

		?>
</div></h1></center>

<br>
<br>


<center><h1><div>

<?php
			if(isset($_SESSION['u_id'])) {
				
				echo "NEM PUBLICKEY: ";
				echo $_SESSION['u_publickey'];
			}

		?>
</div></h1></center>

<br>
<br>


<br>
<br>




<?php
	include_once 'footer.php';
?>
  