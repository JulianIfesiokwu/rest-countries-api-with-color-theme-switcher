const searchField = document.querySelector('.search__field');
const resultsDiv = document.querySelector('.results');
const selectedRegion = document.querySelector('#continents');

// Seperate population value by thousands
function thousands_separators(num) {
    let num_parts = num.toString();
    num_parts = num_parts.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts;
}

// Display all countries on document load
function showCountries(data) {
    data.forEach((country) => {
        displayCountry(country)
    })    
}

const showSearchResults = async () => {
    try {
        const url = `https://restcountries.eu/rest/v2/all`
        const result = await fetch(url)
        const allCountries = await result.json()
        //search data based on client input
        refineResults(allCountries)
    }
    catch(err) {
        console.log(err)
    }
}

// Refine results based on countries
function refineResults(allCountries) {
    let searchTerm = searchField.value;
    // Clear results container of previous searches
    resultsDiv.innerHTML = '';
    // Reset region field
    selectedRegion.value = 'none'
    // Loop through country list and display only countries that meet the search term
    allCountries.forEach((country) => {
        const countryName = (country.name).toLowerCase();
        // console.log('no problem')
        if(countryName.indexOf(searchTerm) !=-1) {
            displayCountry(country)
        } 
    })
}

// Show countries in region selected
const showRegionCountries = async () => {
    let regionValue = selectedRegion.value
    if(regionValue === 'none') return
    if(regionValue.length != 'none') {
        // Reset search field value
        searchField.value = ''
        try {
            const url = `https://restcountries.eu/rest/v2/region/${regionValue}`
            const result = await fetch(url)
            const regionData = await result.json()
            // Clear previous results
            resultsDiv.innerHTML = '';
            // display results based on region

            regionData.forEach((country) => {
                displayCountry(country)
            })
            // showCountries(data)        
        }
        catch(err) {
            console.log(err)
        }
    }
}

// Display a country
function displayCountry(country) {        
    let countryCard = document.createElement('div');
    countryCard.classList.add('country__card');
    //create div for flag
    let countryFlag = document.createElement('div');
    countryFlag.classList.add('country__flag');
    //create img element for flag
    let flagContainer = document.createElement('span');
    flagContainer.classList.add('country__img');
    // Create img element and add flag
    let imgContainer = document.createElement('img');
    imgContainer.setAttribute('src', `${country.flag}`);
    imgContainer.setAttribute('alt', `${country.name}`);       
    //Create div for country information
    let countryInformation = document.createElement('div');
    countryInformation.classList.add('country__information');
    // Create h2 for title information
    let h2 = document.createElement('h2');
    h2.classList.add('country__name');
    h2.textContent = `${country.name}`;
    // Create p element for population
    let countryPopulation = document.createElement('p');
    countryPopulation.classList.add('country__population');
    countryPopulation.textContent = `Population: ${thousands_separators(country.population)}`;
    // Create p element for continent
    let countryContinent = document.createElement('p');
    countryContinent.classList.add('country__continent');
    countryContinent.textContent = `Region: ${country.region}`;
    // Create p element for capital
    let countryCapital = document.createElement('p');
    countryCapital.classList.add('country__continent');
    countryCapital.textContent = `Capital: ${country.capital}`;
    // Append all information to card
    flagContainer.appendChild(imgContainer)
    countryFlag.appendChild(flagContainer)
    countryCard.appendChild(countryFlag)

    countryInformation.append(h2, countryPopulation, countryContinent, countryCapital)
    countryCard.appendChild(countryInformation)

    // Add to DOM
    resultsDiv.appendChild(countryCard)
}

// Make API request to get all countries on document load
const getCountries = async () => {
    try {
        const url = `https://restcountries.eu/rest/v2/all`
        const result = await fetch(url)
        const data = await result.json()
        // display results
        showCountries(data)        
    }
    catch(err) {
        console.log(err)
    }
}

// displays all countries on load
getCountries();

searchField.addEventListener('input', showSearchResults)
selectedRegion.addEventListener('input', showRegionCountries)