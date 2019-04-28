<?php
	include_once 'header.php';
?>


<section class="main-container">
	<div class="main-wrapper">
		<h2>Check Account</h2>


				<div id="stream" class="col-md-4" style="height: 350px;margin: auto;border: 1px solid #444;padding: 20px;overflow: auto;">
    </div>


		<div class="col-md-10">
			<label>Your Address: </label>
        <input type="text" class="form-control" id="address" value="<?php echo $_SESSION['u_address']; ?>" readonly/>
      </div>
		<div class="col-md-12">
			<div class="form-group">
				<fieldset>
					<button class="btn btn-success" style="width:20%;" id="start">Check Account</button>
				</fieldset>
			</div>
		</div>
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
  