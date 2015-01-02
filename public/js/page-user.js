var UI = function() {
}

UI.prototype = {

	registerNamespace : function() {
		var namespace = $("section.namespace");

		namespace.css({display : "block"});
	},

	init : function() {
		var namespaceField = $("input[name=namespace]");

		namespaceField.on("blur", this.verifyNamespace);

		this.testDrive();
	},

	testDrive : function() {
		var namespace = $('#test-drive [name="namespace"]');
		var apiSecret = $('#test-drive [name="apiSecret"]');
		var title = $('#test-drive [name="title"]');
		var message = $('#test-drive [name="message"]');

		title.on("blur", this.requiredField);
		message.on("blur", this.requiredField);

		var action = $('#test-drive button');

		action.on('click', function()
		{
			if(!$(this).hasClass('success'))
			{
				var err = false;

				if(title.val() == '')
				{
					title.addClass('invalid');
					err = true;
				}

				if(message.val() == '')
				{
					message.addClass('invalid');
					err = true;
				}

				if(!err)
				{
					$.ajax({
						type: 'POST',
						url: '/device/push',
						data: {
							namespace : namespace.val(),
							apiSecret : apiSecret.val(),
							title : title.val(),
							message : message.val()
						},
						success: function(data) {
							action.addClass('success');
							action.html('Success!');
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							console.log('some error');
						}
					});
				}
			}
		});
	},

	verifyNamespace : function() {
		var invalid = /[^a-zA-Z0-9.]/g;
		
		if($(this).val().length > 9
		&& !invalid.test($(this).val())) {
			$(this).addClass('valid');
			$(this).removeClass('invalid');
		} else {
			$(this).addClass('invalid');
			$(this).removeClass('valid');
		}
	},

	requiredField : function() {
		if($(this).val().length > 0) {
			$(this).addClass('valid');
			$(this).removeClass('invalid');
		} else {
			$(this).addClass('invalid');
			$(this).removeClass('valid');
		}
	}
}

var ui = new UI();

$(document).ready(function()
{
	ui.init();
});
