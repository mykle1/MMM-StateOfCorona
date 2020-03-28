/* Magic Mirror
 * Module: MMM-StateOfCorona
 *
 * By Mykle1
 *
 */
Module.register("MMM-StateOfCorona", {

    // Module config defaults.
    defaults: {
        state: "New York",
        apiKey: "", // Get yours from https://rapidapi.com/
        useHeader: false, // False if you don't want a header
        header: "", // Any text you want. useHeader must be true
        maxWidth: "100%",
        animationSpeed: 0, // fade speed
        initialLoadDelay: 1250,
        retryDelay: 2500,
        rotateInterval: 30 * 1000,
        updateInterval: 15 * 60 * 1000,
    },

    getStyles: function() {
        return ["MMM-StateOfCorona.css"];
    },

    getScripts: function() {
        return ["moment.js"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification('CONFIG', this.config);

        //  Set locale.
        this.states = {};
        this.activeItem = 1;
        this.rotateInterval = null;
        this.scheduleUpdate();
    },

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "Maintain Social Distance . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("small", "bright", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }

        // date and time
        var date = document.createElement("div");
        date.classList.add("xsmall", "bright", "date");
        date.innerHTML = moment().local().format('MMMM DD, YYYY ~ h:mm a');
        //  moment.utc(this.World.updated).local().format('MMMM DD, YYYY ~ h:mm a')
        wrapper.appendChild(date);

        // state
        var location = document.createElement("div");
        location.classList.add("medium", "bright", "state");
        location.innerHTML = this.states.state;
        wrapper.appendChild(location);

        //totalCases
        var totalCases = document.createElement("div");
        totalCases.classList.add("medium", "bright", "totalCases");
        totalCases.innerHTML = this.states.usa_cases_by_state["0"].cases_number + " total cases";
        wrapper.appendChild(totalCases);

        //spacer
        var spacer = document.createElement("div");
        spacer.classList.add("medium", "bright", "spacers");
        spacer.innerHTML = "~ ~ ~";
        wrapper.appendChild(spacer);



        // loop through the obects
        var info = this.states.usa_cases_by_state;
        var keys = Object.keys(info);
        if (keys.length > 0) {
            if (this.activeItem >= keys.length) {
                this.activeItem = 1;
            }
            var area = info[keys[this.activeItem]];

            // States counties
            var counties = document.createElement("div");
            counties.classList.add("small", "bright", "counties");
            counties.innerHTML = area.state_name;
            wrapper.appendChild(counties);

            // blah.innerHTML = whatever;  -- 1st or the last one..that's it.
            // blah.innerHTML += whatever;  --  means "append to" give me all 1 at a time...rotating.

            // cases
            var cases = document.createElement("div");
            cases.classList.add("small", "bright", "cases");
            cases.innerHTML = area.cases_number + " cases";
            wrapper.appendChild(cases);
        }

        //spacer
        var spacer = document.createElement("div");
        spacer.classList.add("medium", "bright", "spacers");
        spacer.innerHTML = "~ ~ ~";
        wrapper.appendChild(spacer);

        var dead = this.states.usa_deaths;
        var keys = Object.keys(dead);
        if (keys.length > 0) {
            if (this.activeItem >= keys.length) {
                this.activeItem = 0;
            }
            var doa = dead[keys[this.activeItem]];

            // county
            var county = document.createElement("div");
            county.classList.add("small", "bright", "county");
            county.innerHTML = doa.state_name; // county
            wrapper.appendChild(county);


            // deaths by county
            var deaths = document.createElement("div");
            deaths.classList.add("small", "bright", "deaths");
            deaths.innerHTML = doa.death_cases + " deaths";
            wrapper.appendChild(deaths);

        }
        return wrapper;
    },

    processStates: function(data) {
        this.states = data;
        this.loaded = true;
        console.log(this.states);
    },

    scheduleCarousel: function() {
        console.log("Carousel of StateOfCorona fucktion!");
        this.rotateInterval = setInterval(() => {
            this.activeItem++; //this.activeItem +1
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getStates();
        }, this.config.updateInterval);
        this.getStates(this.config.initialLoadDelay);
    },

    getStates: function() {
        this.sendSocketNotification('GET_STATES');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "STATES_RESULT") {
            this.processStates(payload);
        }

        if (this.rotateInterval == null) {
            this.scheduleCarousel();
        }
        this.updateDom(this.config.animationSpeed);
        this.updateDom(this.config.initialLoadDelay);
    },
});
