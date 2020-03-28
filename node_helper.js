/* Magic Mirror
 * Module: MMM-StateOfCorona
 *
 * By Mykle1
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },


    getStates: function(url) {
        request({
            url: "https://coronavirus-monitor.p.rapidapi.com/coronavirus/johns_hopkins_united_states_latest.php",
            qs: {
                state: this.config.state
            },
            method: 'GET',
            headers: {
                'x-rapidapi-key': this.config.apiKey,
                'x-rapidapi-host': 'coronavirus-monitor.p.rapidapi.com',
            },
        }, (error, response, body) => {
            var result = JSON.parse(body);
            // console.log(result);
            this.sendSocketNotification("STATES_RESULT", result);
        });
    },


    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_STATES') {
            this.getStates(payload);
        }
        if (notification === 'CONFIG') {
            this.config = payload;
        }
    }
});
