$(document).ready(function()
{
	var UI = function() {
		this.accessIsShown = false;
	}

	UI.prototype = {
		hideAccess : function() {
			var access = $('section.access');

			access.css({display : 'none'});
		},

		showAccess : function() {
			var access = $('section.access');

			access.css({display : 'block'});
		},

		toggleAccess : function() {
			if(ui.accessIsShown) {
				ui.hideAccess();
			} else {
				ui.showAccess();
			}

			ui.accessIsShown = !ui.accessIsShown;
		},

		accessForm : function() {
			var accessForm = $('#access');

			accessForm.on('submit', function()
			{
				var emailField = $(this).children('input[type=email]');

				if(emailField.hasClass('invalid')) {
					return false;
				}
			});
		},

		init : function() {
			var showAccessButton = $('header button.access');
			var hideAccessButton = $('section.access form .close');

			showAccessButton.on('click', ui.toggleAccess);
			hideAccessButton.on('click', ui.toggleAccess);

			var emailField = $('#access input[type=email]');

			emailField.on('blur', ui.verifyEmail);

			ui.accessForm();
		},

		verifyEmail : function() {
			if(ui.validateEmail($(this).val())) {
				$(this).addClass('valid');
				$(this).removeClass('invalid');
			} else {
				$(this).removeClass('valid');
				$(this).addClass('invalid');
			}
		},

		validateEmail : function(email) { 
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		}
	}

	var ui = new UI();

	ui.init();
});