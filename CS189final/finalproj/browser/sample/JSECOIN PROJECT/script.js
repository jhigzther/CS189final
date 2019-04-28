$(document).ready(function () {

    //import the nem-sdk
    // This is not needed if you use the repl.js script available in the container
    var nem = require("nem-sdk").default;

    function generate() {

        // generate 32 random bytes. 
        // You could write the 32 bytes of your choice if you prefer, but that might be dangerous as
        // it would be less random.
        // 
        var rBytes = nem.crypto.nacl.randomBytes(32);
        // convert the random bytes to an hex string
        // the result, rHex, can be printed out to the console for taking a backup with console.log(rBytes).
        // Take a backup copy of that value as it lets you recreate the keypair to give
        // you access to your account.
        // This value is also usable with the NEM NanoWallet.
        var rHex = nem.utils.convert.ua2hex(rBytes);

        var dest = "poop";
        // generate the keypair
        var keyPair = nem.crypto.keyPair.create(rHex);

        var address = nem.model.address.toAddress(keyPair.publicKey.toString(),  nem.model.network.data.testnet.id)

        var account = {ADDRESS: address, PUBLIC_KEY: keyPair.publicKey.toString(), PRIVATE_KEY: rHex};


        return account;
    }

    $("#generate").click(function() {
        account = generate();
        $('#privatekey').val(account.PRIVATE_KEY);
        $('#publickey').val(account.PUBLIC_KEY);
        $('#address').val(account.ADDRESS);
        $('#destruction').val(dest);
    });

    /////////////////////////////////
    /////////////////////////////////
    //start of mosaic transfer script
    /////////////////////////////////
    /////////////////////////////////

    var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

    // Create an empty un-prepared transfer transaction object
    var transferTransaction = nem.model.objects.get("transferTransaction");

    // Create an empty common object to hold pass and key
    var common = nem.model.objects.get("common");

    // Get a mosaicDefinitionMetaDataPair object with preloaded xem definition
    var mosaicDefinitionMetaDataPair = nem.model.objects.get("mosaicDefinitionMetaDataPair");

    // Set default amount. In case of mosaic transfer the XEM amount works as a multiplier. (2 XEM will multiply by 2 the quantity of the mosaics you send)
    $("#amount").val("1");

    /**
     * Function to update our fee in the view
     */
    function updateFee() {
        // Check for amount errors
        if(undefined === $("#amount").val() || !nem.utils.helpers.isTextAmountValid($("#amount").val())) return alert('Invalid amount !');

        // Set the cleaned amount into transfer transaction object
        transferTransaction.amount = nem.utils.helpers.cleanTextAmount($("#amount").val());

        // Set the message into transfer transaction object
        transferTransaction.message = $("#message").val();

        // Prepare the updated transfer transaction object
        var transactionEntity = nem.model.transactions.prepare("mosaicTransferTransaction")(common, transferTransaction, mosaicDefinitionMetaDataPair, nem.model.network.data.testnet.id);

        // Format fee returned in prepared object
        var feeString = nem.utils.format.nemValue(transactionEntity.fee)[0] + "." + nem.utils.format.nemValue(transactionEntity.fee)[1];

        //Set fee in view
        $("#fee").val(feeString.toString());
    }

    /**
     * Build transaction from form data and send
     */
    function send() {
        // Check form for errors
        if(!transferTransaction.mosaics.length) return alert('You must attach at least one mosaic !');
        if(!$("#privateKey").val() || !$("#recipient").val()) return alert('Missing parameter !');
        if(undefined === $("#amount").val() || !nem.utils.helpers.isTextAmountValid($("#amount").val())) return alert('Invalid amount !');
        if (!nem.model.address.isValid(nem.model.address.clean($("#recipient").val()))) return alert('Invalid recipent address !');

        // Set the private key in common object
        common.privateKey = $("#privateKey").val();

        // Check private key for errors
        if (common.privateKey.length !== 64 && common.privateKey.length !== 66) return alert('Invalid private key, length must be 64 or 66 characters !');
        if (!nem.utils.helpers.isHexadecimal(common.privateKey)) return alert('Private key must be hexadecimal only !');

        // Set the cleaned amount into transfer transaction object
        transferTransaction.amount = nem.utils.helpers.cleanTextAmount($("#amount").val());

        // Recipient address must be clean (no hypens: "-")
        transferTransaction.recipient = nem.model.address.clean($("#recipient").val());

        // Set message
        transferTransaction.message = $("#message").val();

        // Prepare the updated transfer transaction object
        var transactionEntity = nem.model.transactions.prepare("mosaicTransferTransaction")(common, transferTransaction, mosaicDefinitionMetaDataPair, nem.model.network.data.testnet.id);

        nem.com.requests.chain.time(endpoint).then(function (timeStamp) {
            const ts = Math.floor(timeStamp.receiveTimeStamp / 1000);
            transactionEntity.timeStamp = ts;
            const due = 60;
            transactionEntity.deadline = ts + due * 60;
            nem.model.transactions.send(common, transactionEntity, endpoint).then(function(res){
                if (res.code >= 2) { alert(res.message); } 
                else { alert(res.message); }
            }, function(err) { alert(err); });
        }, function (err) { console.error(err); });
    }

    /**
     * Function to attach a mosaic to the transferTransaction object
     */
    function attachMosaic() {
        // Check for form errors
        if(undefined === $("#mosaicAmount").val() || !nem.utils.helpers.isTextAmountValid($("#mosaicAmount").val())) return alert('Invalid amount !');
        if(!$("#namespaceId").val() || !$("#mosaicName").val()) return alert('Missing parameter !');

        // If not XEM, fetch the mosaic definition from network
        if($("#mosaicName").val() !== 'xem') {
            nem.com.requests.namespace.mosaicDefinitions(endpoint, $("#namespaceId").val()).then(function(res) {

                // Look for the mosaic definition(s) we want in the request response (Could use ["eur", "usd"] to return eur and usd mosaicDefinitionMetaDataPairs)
                var neededDefinition = nem.utils.helpers.searchMosaicDefinitionArray(res.data, [$("#mosaicName").val()]);

                // Get full name of mosaic to use as object key
                var fullMosaicName  = $("#namespaceId").val() + ':' + $("#mosaicName").val();

                // Check if the mosaic was found
                if(undefined === neededDefinition[fullMosaicName]) return alert("Mosaic not found !");
                
                // Set mosaic definition into mosaicDefinitionMetaDataPair
                mosaicDefinitionMetaDataPair[fullMosaicName] = {};
                mosaicDefinitionMetaDataPair[fullMosaicName].mosaicDefinition = neededDefinition[fullMosaicName];

                nem.com.requests.mosaic.supply(endpoint, fullMosaicName).then(function(supplyRes) {

                    // Set supply amount to mosaicDefinitionMetaDataPair.
                    mosaicDefinitionMetaDataPair[fullMosaicName].supply = supplyRes.supply;

                    // Now we have the definition we can calculate quantity out of user input
                    var quantity = nem.utils.helpers.cleanTextAmount($("#mosaicAmount").val()) * Math.pow(10, neededDefinition[fullMosaicName].properties[0].value);

                    // Create a mosaic attachment
                    var mosaicAttachment = nem.model.objects.create("mosaicAttachment")($("#namespaceId").val(), $("#mosaicName").val(), quantity);

                    // Push attachment into transaction mosaics
                    transferTransaction.mosaics.push(mosaicAttachment);


                    // Calculate back the quantity to an amount to show in the view. It should be the same as user input but we double check to see if quantity is correct.
                    var totalToShow = nem.utils.format.supply(quantity, {"namespaceId": $("#namespaceId").val(), "name": $("#mosaicName").val()}, mosaicDefinitionMetaDataPair)[0] + '.' + nem.utils.format.supply(quantity, {"namespaceId": $("#namespaceId").val(), "name": $("#mosaicName").val()}, mosaicDefinitionMetaDataPair)[1];

                    // Push mosaic to the list in view
                    $("#mosaicList").prepend('<li>'+ totalToShow +' <small><b>'+  $("#namespaceId").val() + ':' + $("#mosaicName").val() +'</b></small> </li>');

                    // Update the transaction fees in view
                    updateFee();

                }, function (err) {
                    console.error(err);
                });
            }, 
            function(err) {
                alert(err);
            });
        } else {
            // Calculate quantity from user input, XEM divisibility is 6
            var quantity = nem.utils.helpers.cleanTextAmount($("#mosaicAmount").val()) * Math.pow(10, 6);

            // Create a mosaic attachment
            var mosaicAttachment = nem.model.objects.create("mosaicAttachment")($("#namespaceId").val(), $("#mosaicName").val(), quantity);

            // Push attachment into transaction mosaics
            transferTransaction.mosaics.push(mosaicAttachment);

            // Calculate back the quantity to an amount to show in the view. It should be the same as user input but we double check to see if quantity is correct.
            var totalToShow = nem.utils.format.supply(quantity, {"namespaceId": $("#namespaceId").val(), "name": $("#mosaicName").val()}, mosaicDefinitionMetaDataPair)[0] + '.' + nem.utils.format.supply(quantity, {"namespaceId": $("#namespaceId").val(), "name": $("#mosaicName").val()}, mosaicDefinitionMetaDataPair)[1];

            // Push mosaic to the list in view
            $("#mosaicList").prepend('<li>'+ totalToShow +' <small><b>'+  $("#namespaceId").val() + ':' + $("#mosaicName").val() +'</b></small> </li>');

            // Update the transaction fees in view
            updateFee();
        }
    }

    // On amount change we update fee in view
    $("#amount").on('change keyup paste', function() {
        updateFee();
    });

    // On message change we update fee in view
    $("#message").on('change keyup paste', function() {
        updateFee();
    });

    // Call send function when click on send button
    $("#send").click(function() {
      send();
    });

    // Call attachMosaic function when click on attachMosaic button
    $("#attachMosaic").click(function() {
      attachMosaic();
    });

    // Initialization of fees in view
    updateFee();

}); //<-- document ready



//acc checker
// Load nem-browser library
var nem = require("nem-sdk").default;

// Connect using connector
function connect(connector){
    return connector.connect().then(function() {
        // Set time
        date = new Date();

        // If we are here, we are connected
        $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Connected to: '+ connector.endpoint.host +'</p>');
        
        // Show event
        $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Subscribing to errors</p>');

        // Subscribe to errors channel
        nem.com.websockets.subscribe.errors(connector, function(res){
            // Set time
            date = new Date();
            // Show event
            $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Received error</p>');
            // Show data
            $('#stream').append('<p><b>'+ date.toLocaleString()+': <pre>' + JSON.stringify(res) +'</pre>');
        });

        // Show event
        $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Subscribing to new blocks</p>');

        // Subscribe to new blocks channel
        nem.com.websockets.subscribe.chain.blocks(connector, function(res){
            // Set time
            date = new Date();
            // Show event
            $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Received a new block</p>');
            // Show data
            $('#stream').append('<p><b>'+ date.toLocaleString()+': <pre>' + JSON.stringify(res) +'</pre>');
        });

        // Show event
        $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Subscribing to recent transactions</p>');

        // Subscribe to recent transactions channel
        nem.com.websockets.subscribe.account.transactions.recent(connector, function(res){
            // Set time
            date = new Date();
            // Show event
            $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Received recent transactions</p>');
            // Show data
            $('#stream').append('<p><b>'+ date.toLocaleString()+': <pre>' + JSON.stringify(res) +'</pre>');
        });

        // Show event
        $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Subscribing to account data of '+ connector.address +'</p>');

        // Subscribe to account data channel
        nem.com.websockets.subscribe.account.data(connector, function(res) {
            // Set time
            date = new Date();
            // Show event
            $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Received account data</p>');
            // Show data
            $('#stream').append('<p><b>'+ date.toLocaleString()+': <pre>' + JSON.stringify(res) +'</pre>');

            $('#account-prev').html('<pre>' + JSON.stringify(res,undefined,2) +'</pre>');
        });

        // Show event
        $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Subscribing to unconfirmed transactions of '+ connector.address +'</p>');

        // Subscribe to unconfirmed transactions channel
        nem.com.websockets.subscribe.account.transactions.unconfirmed(connector, function(res) {
            // Set time
            date = new Date();
            // Show event
            $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Received unconfirmed transaction</p>');
            // Show data
            $('#stream').append('<p><b>'+ date.toLocaleString()+': <pre>' + JSON.stringify(res) +'</pre>');
        });

        // Show event
        $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Subscribing to confirmed transactions of '+ connector.address +'</p>');

        // Subscribe to confirmed transactions channel
        nem.com.websockets.subscribe.account.transactions.confirmed(connector, function(res) {
            // Set time
            date = new Date();
            // Show event
            $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Received confirmed transaction</p>');
            // Show data
            $('#stream').append('<p><b>'+ date.toLocaleString()+': <pre>' + JSON.stringify(res) +'</pre>');
        });
        
        // Show event
        $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Requesting account data of '+ connector.address +'</p>');

        // Request account data
        nem.com.websockets.requests.account.data(connector);

        // Show event
        $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Requesting recent transactions of '+ connector.address +'</p>');
        
        // Request recent transactions
        nem.com.websockets.requests.account.transactions.recent(connector);

    }, function(err) {
        // Set time
        date = new Date();
        // Show event
        $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> An error occured</p>');
        // Show data
        $('#stream').append('<p><b>'+ date.toLocaleString()+': <pre>' + JSON.stringify(err) +'</pre>');
        // Try to reconnect
        reconnect();
    });
}

function reconnect() {
    // Replace endpoint object
    endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.testnet[1].uri, nem.model.nodes.websocketPort);
    // Replace connector
    connector = nem.com.websockets.connector.create(endpoint, address);
    // Set time
    date = new Date();
    // Show event
    $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Trying to connect to: '+ endpoint.host +'</p>');
    // Try to establish a connection
    connect(connector);
}

function start(address) {

    var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.websocketPort);

    // Address to subscribe
    var account_address = nem.model.address.clean(address);

    // Create a connector object
    var connector = nem.com.websockets.connector.create(endpoint, account_address);

    // Set start date of the monitor
    var date = new Date();

    // Add event to the stream div
    $('#stream').append('<p><b>'+ date.toLocaleString()+':</b> Starting monitor...</p>');

    // Try to establish a connection
    connect(connector);
}


$(document).ready(function () {
    // Call connect function when click on start button
    $("#start").click(function() {
      start($("#address").val());
      $('#stream').append('<p>help</p>');
    });
});


