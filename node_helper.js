/* Magic Mirror
 * Module: MMM-StateOfCorona
 *
 * By Mykle1
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');
var unirest = require("unirest");

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },


    getStates: function(url) {
     var self = this;
      var req = unirest("GET", "https://coronavirus-monitor.p.rapidapi.com/coronavirus/johns_hopkins_latest_usa_statistic_by_state.php");

      req.query({
      	"state": this.config.state
      });
      req.headers({
      	"x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
      	"x-rapidapi-key": this.config.apiKey
      });
      req.end(function (res) {
      	if (res.error) throw new Error(res.error);
         var result = JSON.parse(res.body);
        self.sendSocketNotification("STATES_RESULT", result);
      	//console.log(res.body);
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
