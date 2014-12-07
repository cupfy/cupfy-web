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
	}
}

var ui = new UI();

$(document).ready(function()
{
	ui.init();
});
