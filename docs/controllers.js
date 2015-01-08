var controllers = [];

controllers.push({
    name: "device",
    show: "Device",
    routes: [
        {
            routeName: "/:deviceId",
            method: "GET",
            requiresAuth: true,
            params: [
                [],
                [],
            ],
            headers: [
                [],
                [],
            ],
            returns: [
                [404, "error", "{ \"code\" : 10 }"],
                [200, "success", "Mixed"]
            ],
            description: "Will try to recover the <a href=\"#\" data-trigger=\"device-model\">Device</a> and its <a href=\"#\" data-trigger=\"hook-model\">Hooks</a>.</p>",
            example: [
                '[GET] URL /device/1JSANf1849',
                'HEADERS',
                'STATUS 200 OK',
                {
                    "device": {
                        "_id": "54aed3f442497d7788917e56",
                        "name": "Mauricio's Phone",
                        "model": "OnePlus One",
                        "type": 0,
                        "deviceId": "1JSANf1849",
                        "pushId": "nijfasgIY*#YR!(@$201rkaSFASNFAG()U!$rq=q-=",
                        "__v": 0
                    },
                    "hooks": []
                }
            ]
        },
        {
            routeName: "/",
            method: "POST",
            requiresAuth: false,
            params: [
                [],
                ["name"],
                ["name", "model"],
                ["name", "model", "type"],
                ["name", "model", "type"],
                ["name", "model", "type", "deviceId"],
                ["name", "model", "type", "deviceId", "pushId"],
            ],
            headers: [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
            ],
            returns: [
                [400, "error", "{ \"code\" : 2 }"],
                [400, "error", "{ \"code\" : 2 }"],
                [400, "error", "{ \"code\" : 2 }"],
                [400, "error", "{ \"code\" : 2 }"],
                [400, "error", "{ \"code\" : 2 }"],
                [400, "error", "{ \"code\" : 2 }"],
                [200, "success", "<a href=\"#\" data-trigger=\"device-model\">Device</a>"]
            ],
            description: "Will try to create a new <a href=\"#\" data-trigger=\"device-model\">Device</a>.</p>",
            example: [
                '[POST] URL /device',
                'PARAMETERS { "name" : "Mauricio\'s Phone", "model" : "OnePlus One", "type" : "0", "deviceId" : "1JSANf1849", "pushId" : "nijfasgIY*#YR!(@$201rkaSFASNFAG()U!$rq=q-=" }',
                'HEADERS',
                'STATUS 200 OK',
                {
                    "__v": 0,
                    "name": "Mauricio's Phone",
                    "model": "OnePlus One",
                    "type": 0,
                    "deviceId": "1JSANf1849",
                    "pushId": "nijfasgIY*#YR!(@$201rkaSFASNFAG()U!$rq=q-=",
                    "_id": "54aed3f442497d7788917e56"
                }
            ]
        },
        {
            routeName: "/:deviceId",
            method: "PUT",
            requiresAuth: false,
            params: [
                [],
                ["name"],
                ["name", "pushId"],
            ],
            headers: [
                [],
                [],
                [],
            ],
            returns: [
                [401, "error", "{ \"code\" : 100 }"],
                [201, "success", "<a href=\"#\" data-trigger=\"device-model\">Device</a>"],
                [201, "success", "<a href=\"#\" data-trigger=\"device-model\">Device</a>"]
            ],
            description: "Will try to edit a <a href=\"#\" data-trigger=\"device-model\">Device</a>.</p>",
            example: [
                '[PUT] URL /device/1JSANf1849',
                'PARAMETERS { "name" : "Mauricio\'s old phone" }',
                'HEADERS',
                'STATUS 200 OK',
                {
                    "__v": 0,
                    "name": "Mauricio's old phone",
                    "model": "OnePlus One",
                    "type": 0,
                    "deviceId": "1JSANf1849",
                    "pushId": "nijfasgIY*#YR!(@$201rkaSFASNFAG()U!$rq=q-=",
                    "_id": "54aed3f442497d7788917e56"
                }
            ]
        },
        {
            routeName: "/:deviceId/hook",
            method: "POST",
            requiresAuth: false,
            params: [
                [],
                ["namespace"],
                ["namespace"],
            ],
            headers: [
                [],
                ["namespace"],
                ["namespace"],
            ],
            returns: [
                [400, "error", "{ \"code\" : 2 }"],
                [401, "error", "{ \"code\" : 1 }"],
                [200, "success", "<a href=\"#\" data-trigger=\"hook-model\">Hook</a>"]
            ],
            description: "Will try to hook a <a href=\"#\" data-trigger=\"device-model\">Device</a> to a namespace.</p>",
            example: [
                '[POST] URL /device/1JSANf1849/hook',
                'PARAMETERS { "namespace" : "com.mauriciogiordano.hookme" }',
                'HEADERS',
                'STATUS 200 OK',
                {
                    "device": {
                        "_id": "54aed3f442497d7788917e56",
                        "name": "Mauricio's Phone",
                        "model": "OnePlus One",
                        "type": 0,
                        "deviceId": "1JSANf1849",
                        "pushId": "nijfasgIY*#YR!(@$201rkaSFASNFAG()U!$rq=q-=",
                        "__v": 0
                    },
                    "hooks": [
                        {
                            "_id": "54aed67b7f03a8388915c6c7",
                            "device": "54aed3f442497d7788917e56",
                            "namespace": "com.mauriciogiordano.hookme",
                            "approved": false,
                            "removed": false,
                            "__v": 0
                        }
                    ]
                }
            ]
        }
    ]
});

exports.getControllers = function()
{
    return controllers;
}
