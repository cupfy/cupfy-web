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

	init : function() {
		var showAccessButton = document.querySelector("header button.access");
		var hideAccessButton = document.querySelector("section.access form .close");

		showAccessButton.addEventListener("click", this.toggleAccess);
		hideAccessButton.addEventListener("click", this.toggleAccess);
	}
}

var ui = new UI();

ui.init();
