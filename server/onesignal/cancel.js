var request = require('request');

var headers = {
    'Authorization': `Basic ${process.env.RESTAPI}`
};

var options = {
    url: 'https://onesignal.com/api/v1/notification/YOUR_NOTIFICATION_ID?app_id=YOUR_APP_ID',
    headers: headers
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
}

request(options, callback);
