$(document).ready(function() {

	var CANNED_SELLER_EMAIL = "ptshih@mail.ru";
	var CANNED_PRODUCT_SLUG = "rhinoshield";
	var POST_URL = "https://api-sandbox.trycelery.com/v1/orders";
	var CONTENT_TYPE_STRING = "application/json; charset=utf-8";
	var JSON = "json";
	var SUCCESS_REDIRECT_BASE_URL = "success.html";

	getBuyer = function() {
		var buyer = new Object();
		buyer['email'] = $('#buyer-email').val();
		buyer['name'] = $('#buyer-name').val();
		var address = new Object();
		address['street'] = $('#buyer-street').val();
		address['city'] = $('#buyer-city').val();
		address['state'] = $('#buyer-state').val();
		address['zip'] = $('#buyer-zip').val();
		address['country'] = $('#buyer-country').val();
		buyer['address'] = address;
		return buyer;
	};

	getPaymentDetails = function() {
		var payment = new Object();
		payment['card_number'] = $('#payment-card-number').val();
		payment['card_exp_month'] = $('#payment-card-exp-month').val();
		payment['card_exp_year'] = $('#payment-card-exp-year').val();
		payment['card_cvc'] = $('#payment-card-exp-year').val();
		return payment;
	};

	getProducts = function() {
		var products = new Array();
		$('.line-item-row').each(function() {
			if (getQuantity($(this)) > 0) {
				products.push(getProduct($(this)));
			}
		})
		return products;
	}

	getProduct = function(productObject) {
		var product = new Object();
		product['slug'] = CANNED_PRODUCT_SLUG;
		product['options'] = getOptions(productObject);
		product['extras'] = getExtras(productObject);
		product['quantity'] = getQuantity(productObject);
		return product;
	}

	getOptions = function(productObject) {
		var options = new Array();
		(productObject).find('.option-row').each(function() {
			options.push(getOption($(this)));
		})
		return options;
	}

	getOption = function(optionObject) {
		var option = new Object();
		option['name'] = (optionObject).find('#option-name').val();
		option['value'] = (optionObject).find('#option-value').val();
		return option;
	}

	getExtras = function(productObject) {
		var extras = new Array();
		return extras;
	}

	getQuantity = function(productObject) {
		return (productObject).find('#select-quantity').val();
	}

	getOrder = function() {
		var order = new Object();
		order['payment'] = getPaymentDetails();
		order['buyer'] = getBuyer();
		order['seller_email'] = CANNED_SELLER_EMAIL;
		order['products'] = getProducts();
		order['taxes'] = 0;
		order['shipping'] = 0;
		order['notes'] = "";
		order['coupon'] = "";
		return order;
	}

	getRequestBody = function() {
		var request = new Object();
		request['order'] = getOrder();
		return request;
	}

	makeRequest = function() {
		var requestBody = getRequestBody();
		console.log(requestBody);
		var requestBodyString = window.JSON.stringify(requestBody);
		console.log(requestBodyString);
		$.ajax({
			type: "POST",
			url: POST_URL,
			data: requestBodyString,
			contentType: CONTENT_TYPE_STRING,
			dataType: JSON,
			success: requestSuccess,
			failure: requestFailure
		});
	}

	requestSuccess = function(data) {
		console.log("Success");
		console.log(window.JSON.stringify(data));
		var order = data['order'];
		var orderId = order['id'];
		window.open(SUCCESS_REDIRECT_BASE_URL + "?orderId=" + orderId);
	}

	requestFailure = function(error) {
		console.log("Failure: " + error);
	}

	$('#btn-checkout').click(function() {
		makeRequest();
	});
});