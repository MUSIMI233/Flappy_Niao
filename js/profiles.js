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
  const genera = new Map();  // Using a map to relate family with genus
  const species = new Map(); // Using a map to relate genus with species

  data.forEach(occurrence => {
    families.add(occurrence.family);
    
    if (!genera.has(occurrence.family)) {
      genera.set(occurrence.family, new Set());
    }
    genera.get(occurrence.family).add(occurrence.genus);

    if (!species.has(occurrence.genus)) {
      species.set(occurrence.genus, new Set());
    }
    species.get(occurrence.genus).add(occurrence.species);
  });

  updateDropdown(familyFilter, families);
  
  familyFilter.addEventListener('change', () => {
    updateGenusOptions(genera);
    updateSpeciesOptions(species);
    filterPlants();
  });

  genusFilter.addEventListener('change', () => {
    updateSpeciesOptions(species);
    filterPlants();
  });

  speciesFilter.addEventListener('change', filterPlants);
}

// Update Family dropdown options
function updateDropdown(dropdown, items) {
  dropdown.innerHTML = '<option value="all">All</option>';
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item;
    option.textContent = item;
    dropdown.appendChild(option);
  });
}

// Update Genus dropdown options based on the selected family
function updateGenusOptions(genera) {
  const selectedFamily = familyFilter.value;
  genusFilter.innerHTML = '<option value="all">All</option>';

  if (selectedFamily === 'all') {
    genera.forEach((genusSet) => {
      genusSet.forEach(genus => {
        const option = document.createElement('option');
        option.value = genus;
        option.textContent = genus;
        genusFilter.appendChild(option);
      });
    });
  } else {
    genera.get(selectedFamily)?.forEach(genus => {
      const option = document.createElement('option');
      option.value = genus;
      option.textContent = genus;
      genusFilter.appendChild(option);
    });
  }
}

// Update Species dropdown options based on the selected genus
function updateSpeciesOptions(species) {
  const selectedGenus = genusFilter.value;
  speciesFilter.innerHTML = '<option value="all">All</option>';

  if (selectedGenus === 'all') {
    species.forEach((speciesSet) => {
      speciesSet.forEach(speciesItem => {
        const option = document.createElement('option');
        option.value = speciesItem;
        option.textContent = speciesItem;
        speciesFilter.appendChild(option);
      });
    });
  } else {
    species.get(selectedGenus)?.forEach(speciesItem => {
      const option = document.createElement('option');
      option.value = speciesItem;
      option.textContent = speciesItem;
      speciesFilter.appendChild(option);
    });
  }
}

// Display filtered plant profiles
function displayPlants(filteredData) {
  // plants.innerHTML = ''; // Clear existing content
  const fragment = document.createDocumentFragment();

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
      const plantCard = document.createElement('div');
      plantCard.classList.add('plantProfile');
      plantCard.innerHTML = `
        <div class="CardInner">
          <div class="CardFront">
            <img src="${recordImage}" alt="${recordName1}">
          </div>
          <div class="CardBack">
            <h3><strong>Common Name:</strong><br>${recordName1}</h3>
            <h3><strong>Scientific Name:</strong><br>${recordName2}</h3>
            <h4><strong>Family:</strong>${recordFamily}</h4>
            <h4><strong>Genus:</strong>${recordGenus}</h4>
            <h4><strong>Species:</strong>${recordSpecies}</h4>
            <p><strong>Description:</strong><br>${recordDescription}</p>
          </div>
        </div>
      `;
      fragment.appendChild(plantCard);
    }
  });
  plants.appendChild(fragment);
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

document.addEventListener('DOMContentLoaded', getData);