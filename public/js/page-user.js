var UI = function() {
}

UI.prototype = {

	registerNamespace : function() {
		var namespace = document.querySelector("section.namespace");

		namespace.style.display = "inline-flex";
	},

	init : function() {
		var namespaceField = document.querySelector("input[name=namespace]");

		namespaceField.addEventListener("blur", this.verifyNamespace);
	},

	verifyNamespace : function() {
		var namespaceField = document.querySelector("input[name=namespace]");
		var invalid = /[^a-zA-Z0-9.]/g;
		
		if(namespaceField.value.length > 9
		&& !invalid.test(namespaceField.value)) {
			namespaceField.classList.add('valid');
			namespaceField.classList.remove('invalid');
		} else {
			namespaceField.classList.add('invalid');
			namespaceField.classList.remove('valid');
		}
	}
}

var ui = new UI();

ui.init();
