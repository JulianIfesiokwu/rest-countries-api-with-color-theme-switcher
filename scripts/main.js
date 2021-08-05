const searchField = document.querySelector('.search__field');
const resultsDiv = document.querySelector('.results');
const selectedRegion = document.querySelector('#continents');
const countryCard = document.querySelector('.country__card');
const search = document.querySelector('.search');
const detailedInfo = document.querySelector('.detailed-info');
const switchTheme = document.querySelector('.switch-theme');
const countryContent = document.querySelector('.country__content');
const backBtn = document.querySelector('.back');
const borderCountryList = document.querySelector('.border__list');

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
        }
        catch(err) {
            console.log(err)
        }
    }
}

function getDetailedInformation(e) {
    let target = e.target.closest('.country__card');
    let targetCountry = target.firstElementChild.nextSibling.firstElementChild.textContent.toLowerCase();
    // Hide search results div
    resultsDiv.style.display = 'none';
    search.style.display = 'none';
    detailedInfo.style.display = 'block';
    // display detailed information about selected country
    showDetailedInfo(targetCountry);
}

const showDetailedInfo = async (targetCountry) => {
    // Clear previous results
    // countryContent.innerHTML = '';
    try {
        const url = `https://restcountries.eu/rest/v2/name/${targetCountry}`
        const result = await fetch(url)
        const countryData = await result.json()
        // display results based on targetCountry
        showDetailedCountry(countryData)   
    }
    catch(err) {
        console.log(err)
    }
}

function showDetailedCountry(countryData) {   
    const imgSpan = document.querySelector('.detailed__country__img');
    let imgContainer = document.createElement('img');
    imgContainer.setAttribute('src', `${countryData[0].flag}`);
    imgContainer.setAttribute('alt', `${countryData[0].name}`);
    imgSpan.appendChild(imgContainer)
    console.log(countryData[0])
    const countryName = document.querySelector('.country__name_2');
    countryName.textContent=`${countryData[0].name}`;
    const nativeName = document.querySelector('.native__name');
    nativeName.textContent = `${countryData[0].nativeName}`;
    const population = document.querySelector('.population');
    population.textContent = `${thousands_separators(countryData[0].population)}`;
    const continent = document.querySelector('.continent');
    continent.textContent = `${countryData[0].region}`;
    const subRegion = document.querySelector('.sub-region');
    subRegion.textContent = `${countryData[0].subregion}`;
    const capital = document.querySelector('.capital');
    capital.textContent = `${countryData[0].capital}`;
    const domain = document.querySelector('.domain');
    domain.textContent = `${countryData[0].topLevelDomain}`;
    const currencies = document.querySelector('.currencies');
    currencies.textContent = `${countryData[0].currencies[0].name}`;
    // Extract language data
    let languagesArray = [];
    countryData[0].languages.forEach((language) => {
        languagesArray.push(language.name)
        });
    // Convert to string
    let languagesString = languagesArray.toString();
    const languages = document.querySelector('.languages');
    languages.textContent = `${languagesString}`;
    // Get border countries
    let borderCountries = countryData[0].borders;
    // Loop through each border country code and find country name
    borderCountries.forEach(async (borderCountryCode) => {
        try {
            const url = `https://restcountries.eu/rest/v2/alpha/${borderCountryCode}`;
            const result = await fetch(url);
            const countryName = await result.json()
            // Create span element
            let borderCountry = document.createElement('span');
            borderCountry.textContent=`${countryName.name}`;
            borderCountry.classList.add('border--countries');
            borderCountryList.append(borderCountry)
        } catch(err) {
            console.error(err)
        }
    });
    
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

function changeTheme(e) {
    console.log(e)
}

function goBack() {
    resultsDiv.style.display='flex';
    detailedInfo.style.display='none';
    search.style.display = 'flex';
    const imgSpan = document.querySelector('.detailed__country__img');
    // remove previous flags if any
    while (imgSpan.hasChildNodes()) {  
        imgSpan.removeChild(imgSpan.firstChild);
    }
    // remove previous list
    while (borderCountryList.hasChildNodes()) {
        borderCountryList.removeChild(borderCountryList.firstChild)
    }
}

// displays all countries on load
getCountries();

searchField.addEventListener('input', showSearchResults)
selectedRegion.addEventListener('input', showRegionCountries)
resultsDiv.addEventListener('click', getDetailedInformation)
switchTheme.addEventListener('click', changeTheme);
backBtn.addEventListener('click', goBack)