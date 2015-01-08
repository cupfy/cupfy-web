var models = [];

models.push({
	name: "device",
	show: "Device",
	content: [
		["name", "String", "Device name given by the user"],
		["model", "String", "Device model (eg Galaxy S5)"],
		["type", "Number", "Device type (0: Android, 1:iOS, 2:WP)"],
		["deviceId", "String", "Device unique id"],
		["pushId", "String", "Device unique push identification"]
	],
	example: [
		{
	        "_id": "54aed3f442497d7788917e56",
	        "name": "Mauricio's Phone",
	        "model": "OnePlus One",
	        "type": 0,
	        "deviceId": "1JSANf1849",
	        "pushId": "nijfasgIY*#YR!(@$201rkaSFASNFAG()U!$rq=q-=",
	        "__v": 0
		}
	]
});

models.push({
	name: "hook",
	show: "Hook",
	content: [
	    ["device", "Device", ""],
		["namespace", "String", ""],
	    ["approved", "Boolean", ""],
	    ["removed", "Boolean", ""]
	],
	example: [
		{
            "_id": "54aed67b7f03a8388915c6c7",
            "device": "54aed3f442497d7788917e56",
            "namespace": "com.mauriciogiordano.hookme",
            "approved": false,
            "removed": false,
            "__v": 0
		}
	]
});

exports.getModels = function()
{
	return models;
}
