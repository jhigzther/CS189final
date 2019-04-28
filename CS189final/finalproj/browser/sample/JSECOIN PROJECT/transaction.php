<?php
	include_once 'header.php';
?>


<section class="main-container">
	<div class="main-wrapper">
		<h2>TRANSACTION LEDGER</h2>


    		<!-- TRANSACTION LEDGER CODE START -->
<?php include_once 'includes/dbh.inc.php'; ?>

<?php 
		if(isset($_SESSION['u_id'])){

		$mysqli = new mysqli('localhost', 'root', '', 'projectfinal') or die(mysqli_error($mysqli));
		$result = $mysqli->query("SELECT * FROM transaction") or die($mysqli->error);
}
?>


<center><div class="row jusitfy-content-center">
				<table class="table">
					<br>
					<thead>
						<tr>
						<th><h2>Username</h2></th>
						<th><h2>Invoice</h2></th>
						</tr>
					</thead>

				<?php 
				while ($row = $result->fetch_assoc()): ?>
					<tr>
						<td><?php echo $row['user_uid']; ?></td>
						<td><?php echo $row['user_invoice']; ?></td>
					</tr>
				<?php endwhile; ?>
				</table>   
		</div></center>

	</div>
	</div>
</section>

<script src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="../../dist/nem-sdk.js"></script>
<script src="script.js"></script>





<?php
	include_once 'footer.php';
?>
