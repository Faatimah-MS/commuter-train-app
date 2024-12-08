//defining constants from html document
const searchBttn = document.getElementById("searchBttn");
const stationInfo = document.getElementById("stationInfo");
const lvInfo = document.getElementById("lvInfo");
const stationValues = document.getElementById("station");
const dataList = document.getElementById("stations");

// adding event listener when an input is given in the search box.
stationValues.addEventListener("input", function (event) {
    const searchStation= stationValues.value;
    //fetching data with AJAX API.
    fetch("https://rata.digitraffic.fi/api/v1/metadata/stations")
        .then(response => {
            return response.json();
        })
        .then(stations => {

          //
            dataList.innerHTML = "";
            stations.forEach(function (station) {

                //console.log(station.stationName);
                // Comparing case insensitive stringsÖ https://stackoverflow.com/questions/2140627/how-to-do-case-insensitive-string-comparison
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
                if (station.stationName.toUpperCase().startsWith(String(searchStation.toUpperCase())) === true) {
                    console.log(station.stationName);


                   // adding the list of options for search term to a list
                    const option = document.createElement("option");
                    option.innerHTML = `
                        <option value="${station.stationName}"></option>
                `;
                    dataList.append(option);
                }
            });
        });
})


// adding an event click to the search button
searchBttn.addEventListener("click", function(event) {
    event.preventDefault();
    const searchStation = stationValues.value;
    let shortCode = "";

    console.log(searchStation);

    // data is fetched with Ajax api.
    fetch("https://rata.digitraffic.fi/api/v1/metadata/stations")
        .then(response => {
            return response.json();
        })
        .then(stations => {
            //console.log(stations);
            let stationFound = false; // To track if a matching station is found
            // Clear previous HTML details on new request
            stationInfo.innerHTML = ""
            // going through the whole array of data and finding out the searched term/station name from the array.
            stations.forEach(function (station) {
                //console.log(station.stationName);
                // Comparing case insensitive strings https://stackoverflow.com/questions/2140627/how-to-do-case-insensitive-string-comparison
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
                if (station.stationName.localeCompare(searchStation, undefined, { sensitivity: 'accent' }) === 0) {
                    shortCode = station.stationShortCode;
                    stationFound = true;
                    console.log(station.stationName);
                    //searched staion's stails are found and put into a list, and displaying the station details in the list form.
                    const li = document.createElement("li");
                    li.innerHTML = `
                        <li><strong>Name:</strong> ${station.stationName}</li>
                        <li><strong>Latitude:</strong>${station.latitude}</li>
                        <li><strong>Longitude:</strong>${station.longitude}</li>
                        <li><strong>Station Short Code:</strong>${station.stationShortCode}</li>
                        <li><strong>Station UIC Code:</strong>${station.stationUICCode}</li>
                       `;
                    stationInfo.append(li);
                }

            });
            if (!stationFound) {
                console.log("No matching station found.");
                // Clear previous HTML when no stations are matched
                stationInfo.innerHTML = "<li>No matching station found.</li>";
                // Also clear the old train values if any on the screen
                lvInfo.innerHTML = "";
            } else {
                // Call trainDetails only after the shortcode is assigned
                trainDetails(shortCode);
            }

        });


});
// a funtion created to fetch data about the live trains in searched station and collecting data of the trains arriving and departing from the station.

function trainDetails(shortCode) {
    console.log(shortCode);
    //console.log(`https://rata.digitraffic.fi/api/v1/live-trains/station/${shortCode}?version=0&arrived_trains=0&arriving_trains=2&departed_trains=0&departing_trains=2&minutes_before_departure=30&minutes_before_arrival=30&include_nonstopping=false`);
    fetch(`https://rata.digitraffic.fi/api/v1/live-trains/station/${shortCode}?version=0&arrived_trains=0&arriving_trains=3&departed_trains=0&departing_trains=3&minutes_before_departure=60&minutes_before_arrival=60&include_nonstopping=false`)
        .then(response => {
            return response.json();
        })
        .then(liveInfo => {
            // Clear previous HTML details on new request
            lvInfo.innerHTML = ""
            liveInfo.forEach(function (train) {
                console.log(liveInfo);
                // a list showing the details of trains in the searched station.
                const li = document.createElement("li");
                li.innerHTML = `
                            <li class="train-info"> 
                            <p><strong>Commuter Line:</strong> ${train.commuterLineID}</p>
                            <p><strong>Train Number:</strong> ${train.trainNumber}</p>
                            <p><strong>Departure Date:</strong>${train.departureDate}</p>
                            <p><strong>Operator:</strong> ${train.operatorShortCode}</p>
                            <p><strong>Operator UIC Code:</strong> ${train.operatorUICCode}</p>  
                          </li>
                           
                           `;
                lvInfo.append(li);
            });

            toggleHeading()
        });
}

// toggleHeading toggles the visibility of the heading based on the size of the lists of stations and trains
function toggleHeading() {
    const trainList = document.getElementById("lvInfo");
    const stationList = document.getElementById("stationInfo");
    const trainHeading = document.getElementById("trHeading");
    const stationHeading = document.getElementById("stHeading");

    // Check the length of the train list and show the header of the sub-section when the there are values in the list
    if (trainList.children.length === 0) {
        trainHeading.style.display = "none";
    } else {
        console.log("switch to block")
        trainHeading.style.display = "block";
    }

    // Check the length of the station list and show the header of the sub-section when the there are values in the list
    if (stationList.children.length === 0) {
        stationHeading.style.display = "none";
    } else{
        console.log("switch to block")
        stationHeading.style.display = "block";
    }
}


