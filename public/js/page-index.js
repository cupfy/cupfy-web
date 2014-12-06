var UI = function() {
	this.accessIsShown = false;
}

UI.prototype = {
	hideAccess : function() {
		var access = document.querySelector("section.access");

		access.style.display = "none";
	},

	showAccess : function() {
		var access = document.querySelector("section.access");

		access.style.display = "inline-flex";
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
		var accessForm = document.getElementById('access');

		accessForm.onsubmit = function() {
			var emailField = document.querySelector("input[type=email]");

			if(emailField.classList.contains('invalid')) {
				return false;
			}
		}
	},

	init : function() {
		var showAccessButton = document.querySelector("header button.access");
		var hideAccessButton = document.querySelector("section.access form .close");

		showAccessButton.addEventListener("click", this.toggleAccess);
		hideAccessButton.addEventListener("click", this.toggleAccess);

		var emailField = document.querySelector("input[type=email]");

		emailField.addEventListener("blur", this.verifyEmail);

		this.accessForm();
	},

	verifyEmail : function() {
		var emailField = document.querySelector("input[type=email]");

		if(ui.validateEmail(emailField.value)) {
			emailField.classList.add('valid');
			emailField.classList.remove('invalid');
		} else {
			emailField.classList.add('invalid');
			emailField.classList.remove('valid');
		}
	},

	validateEmail : function(email) { 
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}
}

var ui = new UI();

ui.init();
