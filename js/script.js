// 获取元素
const guide = document.getElementById('guide');
const guideBtn = document.getElementById('guide-btn');
var completionTime = 0;
var currentFamilyIndex = 0;  // current displayed family index
var maxFamiliesToShow = 5;   // max family tags is 5
// store all species data
var speciesData = [];
var familyIcons = {};

function iterateRecords(results) {

	console.log(results);

	// Setup the map as per the Leaflet instructions:
	// https://leafletjs.com/examples/quick-start/

	// Iterate over each record and add a marker using the Latitude field (also containing longitude)
	$.each(results.result.records, function(recordID, recordValue) {	
	});

}

// get species data from AP
async function getSpeciesData() {
	try {
		const response = await fetch('https://biocache-ws.ala.org.au/ws/occurrences/search?q=data_resource_uid%3Adr2287&qualityProfile=AVH&fq=state%3A%22Queensland%22&fq=data_resource_uid%3A%22dr2287%22&fq=occurrence_status%3A%22PRESENT%22&fq=multimedia%3A%22Image%22&fq=(family%3A%22Acanthaceae%22%20OR%20family%3A%22Bataceae%22%20OR%20family%3A%22Clusiaceae%22%20OR%20family%3A%22Dichapetalaceae%22%20OR%20family%3A%22Elatinaceae%22)&qc=-_nest_parent_%3A*&pageSize=200');  // 替换为你的API URL
		const apiData = await response.json();
		const speciesData = apiData.occurrences;
		console.log(speciesData);
		return speciesData;
	} catch (error) {
		console.error('Error fetching API data:', error);
		return null;
	}
}

// GET request: get data from PHP API
// async function sendGetRequest() {
// 	try {
// 		const response = await fetch('/session.php?route=session_data', {
// 			method: 'GET',
// 			headers: {
// 				'Content-Type': 'application/json'
// 			}
// 		});
//
// 		if (!response.ok) {  // check response states
// 			throw new Error('Network response was not ok: ' + response.statusText);
// 		}
//
// 		const data = await response.json();  // response -> json
// 		if (data.status === 'success') {
// 			console.log('GET response data:', data.data.level);  // output data
// 			return data.data.level;
// 		} else {
// 			console.error('Error in GET request:', data.message);
// 			return null;
// 		}
// 	} catch (error) {
// 		console.error('Error in GET request:', error);
// 		return null;
// 	}
// }

// use async/await outside ,use sendGetRequest function
async function gameInit() {
	// use await to wait sendGetRequest finishing，get returned completionTime
	// completionTime = await sendGetRequest();
	completionTime = getGameProgress();
	if (completionTime !== null) {
		console.log('Completion time:', completionTime);  // get and use completionTime
	} else {
		console.error('Failed to get completion time');
	}
}

// use function when game success
function onLevelSuccess() {
	console.log("Current family index: " + currentFamilyIndex);
	if (currentFamilyIndex < maxFamiliesToShow && speciesData.length > 0) {
		var familiesDisplayed = [];
		var familyDataToShow = speciesData.filter(function (species) {
			if (!familiesDisplayed.includes(species.family)) {
				familiesDisplayed.push(species.family);  // add to displayed family
				return true;
			}
			return false;
		});

		if (currentFamilyIndex < familyDataToShow.length) {
			var familyToDisplay = familyDataToShow[currentFamilyIndex].family;
			console.log("Current family index: " + currentFamilyIndex);

			// find all family
			var speciesToDisplay = speciesData.filter(function (species) {
				return species.family === familyToDisplay;
			});

			console.log("Displaying all species of family: " + familyToDisplay, speciesToDisplay);

			displaySpeciesOnMap(speciesToDisplay);
			currentFamilyIndex++;
		}
	} else {
		console.log("All families have been shown or no more species data available.");
	}
}

//  show icon on map referring API
function displaySpeciesOnMap(speciesData) {
	speciesData.forEach(function (species) {
		var lat = species.decimalLatitude;
		var lng = species.decimalLongitude;
		var family = species.family;
		var name = species.scientificName;
		var vernacularName = species.vernacularName || "Unknown Common Name";

		// choose icon according to family
		var icon = familyIcons[family] || familyIcons["Elatinaceae"];

		if (lat && lng) {
			L.marker([lat, lng], { icon: icon })
				.addTo(map)
				.bindPopup(`<b>${name}</b><br>Family: ${family}<br>${vernacularName}`);
		} else {
			console.warn("Missing coordinates for species:", species);
		}

	});
}


function successButton(completionTime) {
	for (let i = 0; i < completionTime; i++) {
		console.log('Button clicked!');
		gameSuccessHandler();  // run when success
	}
}

function gameSuccessHandler() {
	console.log('Game success logic triggered');
	onLevelSuccess();  // show icon on map
}


function getGameProgress() {
	const level = localStorage.getItem('level');
	return level ? JSON.parse(level) : 0;
}

$(document).ready(async function() {

	guideBtn.addEventListener('click', () =>{
		window.location.href = './flappybird.html';

		// hide guide and disable button
		guide.style.display = 'none';
		guideBtn.disabled = true;

		localStorage.setItem('guideHidden', 'true');
	});

	var map = L.map('map').setView([-18.5, 145.5], 6);
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	var LeafIcon = L.Icon.extend({
		options: {
			shadowUrl: 'assets/images/leaf-shadow.png',
			iconSize:     [38, 95],
			shadowSize:   [50, 64],
			iconAnchor:   [22, 94],
			shadowAnchor: [4, 62],
			popupAnchor:  [-3, -76]
		}
	});

	var greenIcon = new LeafIcon({iconUrl: 'assets/images/leaf-green.png'}),
    	redIcon = new LeafIcon({iconUrl: 'assets/images/leaf-red.png'}),
		pinkIcon = new LeafIcon({iconUrl: 'assets/images/leaf-pink.png'}),
		purpleIcon = new LeafIcon({iconUrl: 'assets/images/leaf-purple.png'}),
    	orangeIcon = new LeafIcon({iconUrl: 'assets/images/leaf-orange.png'});

	L.icon = function (options) {
		return new L.Icon(options);
	};

	familyIcons = {
		"Elatinaceae": greenIcon,
		"Dichapetalaceae": redIcon,
		"Bataceae": orangeIcon,
		"Acanthaceae": pinkIcon,
		"Clusiaceae": purpleIcon,
	};

	
	
  







// check if  localStorage has 'guideHidden'
if (localStorage.getItem('guideHidden') === 'true') {
	// if guide is hided，no guide, no button
	guide.style.display = 'none';
	guideBtn.disabled = true;
} else {
	// if no hiding, show guide
	guide.style.display = 'flex';
}

	await gameInit();
	speciesData = await getSpeciesData();
	successButton(completionTime);

});


