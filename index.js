const card = document.querySelector('.display-info-container')
const weatherForm = document.querySelector('.weather-form')
const cityInput = document.querySelector('.input')
const searchButton = document.querySelector('.search')
const apiKey = 'b13f0dd6cd5dd04f119e483bbeda1f3e'

weatherForm.addEventListener('submit', async event => {
  event.preventDefault()

  const city = cityInput.value
  cityInput.value = ''

  if(city){
    try {
      const weatherData = await getWeatherData(city)
      displayWeatherInfo(weatherData)
      console.log(weatherData)
    } catch (error) {
      displayError('City is not found!')  
    }
  } 
  else {  
    displayError('Please Enter a city')
  }
})

async function getWeatherData(city){
  try{
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    const response = await fetch(apiUrl)

    if(!response.ok){
      throw new Error('Error: Could not fetch data')
    }

    return await response.json();
  }
  catch(error){
    console.error('Fetching data failed: ', error.message)
  }
}

function displayWeatherInfo(data){
  const { name: city,
          main: {temp, humidity},
          weather: [{description, id}],
          wind: {speed}
        } = data;
  
  card.textContent = ''
  card.style.display = 'flex'
    
  card.innerHTML = `
  <div class="display-emoji"></div>
    <p class="city">${city}</p>
      <p class="degree">${((temp - 273.15) * (9/5) + 32).toFixed(1)}
        <span>&#176;C</span></p>
      <p>${description}</p>

      <div class="weather-stats">
        <div class="humidity-info">
          <img src="../img/humidity.png" alt="">
          <div>
            <p>${humidity}%</p>
            <p>Humidity</p>
          </div>
        </div>

        <div class="wind-info">
          <img src="../img/wind.png" alt="">
          <div>
            <p>${speed}Km/h</p>
            <p>Wind Speed</p>
          </div>  
        </div>  
      </div>
    </div>
  `

  card.querySelector('.display-emoji').appendChild(displayEmoji(id));
}

function displayEmoji(weatherId){
    const img = document.createElement('img')

    switch (true) {
      case (weatherId >= 200 && weatherId < 300):
        img.src = '../img/thunderstorm.png'
        img.alt = 'Thunderstorm'
        break
      case (weatherId >= 300 && weatherId < 400):
        img.src = '../img/shower_rain.png'
        img.alt = 'Shower rain'
        break
      case (weatherId >= 500 && weatherId < 600):
        img.src = '../img/rain.png'
        img.alt = 'Rain'
        break
      case (weatherId >= 600 && weatherId < 700):
        img.src = '../img/snow.png'
        img.alt = 'Snow'
        break
      case (weatherId >= 600 && weatherId < 700):
        img.src = '../img/mist.png'
        img.alt = 'Snow'
        break
      case (weatherId === 800):
        img.src = '../img/clear.png'
        img.alt = 'Clear Sky'
        break
      case (weatherId >= 801 && weatherId < 810):
        img.src = '../img/scattered_clouds.png'
        img.alt = 'Clouds'
        break
      default:
        return '❓';
    }

    return img;
}

function displayError(message){
  const displayError = document.createElement('p')
  displayError.textContent = message

  card.textContent = ''
  card.style.display = 'flex'
  card.appendChild(displayError)
}
