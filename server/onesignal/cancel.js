var request = require('request');

var deleteNotification = function(data) {


var headers = {
    'Authorization': `Basic ${process.env.RESTAPI}`
};

var options = {
    method: 'DELETE',
    url: `https://onesignal.com/api/v1/notifications/${data}?app_id=d3d99984-794f-4c25-bedb-5cb810d8ed86`,
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
