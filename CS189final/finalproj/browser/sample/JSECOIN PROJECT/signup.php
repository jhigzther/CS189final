<?php
	include_once 'header.php';
?>


<section class="main-container">
	<div class="main-wrapper">
		<h2>Signup</h2>
		<div id="generateaccount">
		<div class="col-md-12">
			<div class="form-group">
				<label class="control-label">Private Key: </label>
				<input type="text" class="form-control" id="privatekey" readonly />
				<label class="control-label">Public Key: </label>
				<input type="text" class="form-control" id="publickey" readonly />
				<label class="control-label">Address: </label>
				<input type="text" class="form-control" id="address" readonly />
			</div>
		</div>
		<div class="col-md-12">
			<div class="form-group">
				<fieldset>
					<button class="btn btn-success" style="width:20%;" id="generate">Generate Nem Account</button>
				</fieldset>
			</div>
		</div>
	</div>
		<form class="signup-form" action="includes/signup.inc.php" method="POST">
			<input type="text" name="first" placeholder="Firstname">
			<input type="text" name="last" placeholder="Lastname">
			<input type="text" name="email" placeholder="E-mail">
			<input type="text" name="idnum" placeholder="Student ID Number">
			<input type="text" name="add" placeholder="Nem Generated Address">
			<input type="text" name="privatekey" placeholder="Nem Generated Private Key">
			<input type="text" name="publickey" placeholder="Nem Generated Public Key">
			<input type="text" name="uid" placeholder="Username">
			<input type="password" name="pwd" placeholder="Password">
			<button type="submit" name="submit">Sign up</button>
		</form>
	</div>
</section>



<?php
	include_once 'footer.php';
?>
  