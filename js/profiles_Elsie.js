const plants = document.getElementById('plants');
const familyFilter = document.getElementById('family-filter');
const genusFilter = document.getElementById('genus-filter');
const speciesFilter = document.getElementById('species-filter');

let allPlantData = []; // To store all plant data

async function getData() {
  const url = "https://biocache-ws.ala.org.au/ws/occurrences/search?q=data_resource_uid%3Adr2287&qualityProfile=AVH&fq=state%3A%22Queensland%22&fq=data_resource_uid%3A%22dr2287%22&fq=occurrence_status%3A%22PRESENT%22&fq=multimedia%3A%22Image%22&fq=(family%3A%22Acanthaceae%22%20OR%20family%3A%22Bataceae%22%20OR%20family%3A%22Clusiaceae%22%20OR%20family%3A%22Dichapetalaceae%22%20OR%20family%3A%22Elatinaceae%22)&qc=-_nest_parent_%3A*&pageSize=200";
  try {
    const fet = fetch(url); 
    plants.innerText = "Requesting"; 
    const response = await fet; 

    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    const json = await response.json();
    plants.innerText = "";
    allPlantData = json.occurrences;

    populateFilters(allPlantData);
    displayPlants(allPlantData);
  } catch (error) {
    plants.innerText = error.message;
  }
}

// Populate Family, Genus, and Species dropdowns
function populateFilters(data) {
  const families = new Set();
  const genera = new Set();
  const species = new Set();

  data.forEach(occurrence => {
    families.add(occurrence.family);
    genera.add(occurrence.genus);
    species.add(occurrence.species);
  });

  updateDropdown(familyFilter, families);
  updateDropdown(genusFilter, genera);
  updateDropdown(speciesFilter, species);
}

// Update dropdown options
function updateDropdown(dropdown, items) {
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item;
    option.textContent = item;
    dropdown.appendChild(option);
  });
}

// Display filtered plant profiles
function displayPlants(filteredData) {
  plants.innerHTML = ''; // Clear existing content

  filteredData.forEach(occurence => {
    const recordName1 = occurence.vernacularName;
    const recordName2 = occurence.scientificName;
    const recordFamily = occurence.family;
    const recordGenus = occurence.genus;
    const recordSpecies = occurence.species;
    const recordLocation = occurence.point1;
    const recordImage = occurence.smallImageUrl;
    const recordDescription = occurence.raw_occurrenceRemarks;

    if (recordName1 && recordName2 && recordFamily && recordGenus && recordSpecies && recordLocation && recordDescription) {
      $(plants).append(
        $('<div class="plantProfile">').append(
          $('<div class="CardInner">').append(
            $('<div class="CardFront">').append(
              $('<img>').attr("src", recordImage)
            ),
            $('<div class="CardBack">').append(
                $('<h3>').html('<strong>Common Name:</strong><br>' + recordName1),
                $('<h3>').html('<strong>Scientific Name:</strong><br>' + recordName2),
                $('<h4>').html('<strong>Family:</strong>' + recordFamily),
                $('<h4>').html('<strong>Genus:</strong>' + recordGenus),
                $('<h4>').html('<strong>Species:</strong>' + recordSpecies),
                $('<p>').html('<strong>Description:</strong><br>' + recordDescription),
                // $('<p>').html('<strong>Location:</strong><br>' + recordLocation)
            )
          )
        )
      );
    }
  });
}

// Filter plants based on selected Family, Genus, and Species
function filterPlants() {
  const selectedFamily = familyFilter.value;
  const selectedGenus = genusFilter.value;
  const selectedSpecies = speciesFilter.value;

  const filtered = allPlantData.filter(occurence => {
    const familyMatch = selectedFamily === 'all' || occurence.family === selectedFamily;
    const genusMatch = selectedGenus === 'all' || occurence.genus === selectedGenus;
    const speciesMatch = selectedSpecies === 'all' || occurence.species === selectedSpecies;
    return familyMatch && genusMatch && speciesMatch;
  });

  displayPlants(filtered);
}

// Event listeners for filters
familyFilter.addEventListener('change', filterPlants);
genusFilter.addEventListener('change', filterPlants);
speciesFilter.addEventListener('change', filterPlants);

document.addEventListener('DOMContentLoaded', () => {
  getData();
});