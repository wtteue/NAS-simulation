cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "runs": true
    },
    {
        "file": "plugins/phonegap-nfc/www/phonegap-nfc.js",
        "id": "phonegap-nfc.NFC",
        "runs": true
    },
    {
        "file": "plugins/com-intel-security/www/appSecurityApi.js",
        "id": "com-intel-security.Services",
        "clobbers": [
            "intel.security"
        ]
    },
    {
        "file": "plugins/com-intel-security/www/q-1/q.js",
        "id": "com-intel-security.Q",
        "clobbers": [
            "Q"
        ]
    },
    {
        "file": "plugins/cordova-plugin-secure-storage/www/securestorage.js",
        "id": "cordova-plugin-secure-storage.SecureStorage",
        "clobbers": [
            "SecureStorage"
        ]
    },
    {
        "file": "plugins/cordova-plugin-secure-storage/www/sjcl_ss.js",
        "id": "cordova-plugin-secure-storage.sjcl_ss",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.1",
    "phonegap-nfc": "0.6.6",
    "com-intel-security": "2.0.0",
    "cordova-plugin-secure-storage": "2.2.1"
};
// BOTTOM OF METADATA
});