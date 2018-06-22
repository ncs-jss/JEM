var request = require('request');

var deleteNotification = function(data) {


var headers = {
    'Authorization': `Basic ${process.env.ONESIGNAL_REST_API}`
};

var options = {
    method: 'DELETE',
    url: `https://onesignal.com/api/v1/notifications/${data}?app_id=${process.env.ONESIGNAL_APP_ID}`,
    headers: headers
};


function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log('sucees' ,body);
    }
}

request(options, callback);

};

module.exports = {deleteNotification};
