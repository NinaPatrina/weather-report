'use strict';
import 'regenerator-runtime/runtime';
import axios from 'axios';

// 2. Change temperature by clicking on an arrow

const state = {
  temp: 55,
};
let flagFahrenheit = true;

const increaseTemp = () => {
  state.temp += 1;
  const tempContainer = document.getElementById('current_temp');
  tempContainer.textContent = flagFahrenheit
    ? `${Math.trunc(state.temp)}°F`
    : `${Math.trunc(state.temp)}°C`;
  changeColorTemp(state.temp);
  changeBackground(state.temp);
};

const registerEventHandlers = () => {
  const increaseTempButton = document.getElementById('increaseTempButton');
  increaseTempButton.addEventListener('click', increaseTemp);
  const decreaseTempButton = document.getElementById('decreaseTempButton');
  decreaseTempButton.addEventListener('click', decreaseTemp);
};
document.addEventListener('DOMContentLoaded', registerEventHandlers);

const decreaseTemp = () => {
  state.temp -= 1;
  const tempContainer = document.getElementById('current_temp');
  tempContainer.textContent = `Current temp: ${state.temp}`;
  tempContainer.textContent = flagFahrenheit
    ? `${Math.trunc(state.temp)}°F`
    : `${Math.trunc(state.temp)}°C`;
  changeColorTemp(state.temp);
  changeBackground(state.temp);
};

const registerEventHandlersDecrease = () => {
  const increaseTempButton = document.getElementById('decreaseTempButton');
  increaseTempButton.addEventListener('click', decreaseTemp);
};
document.addEventListener('DOMContentLoaded', registerEventHandlersDecrease);

// Temperature Ranges Change Landscape

const changeBackground = (temp) => {
  const element = document.getElementById('main__intro__right');
  if (!flagFahrenheit) {
    temp = (9 / 5) * temp + 32;
  }
  if (temp >= 80) {
    element.className = 'summer';
  } else if (temp < 80 && temp >= 54) {
    element.className = 'spring';
  } else if (temp < 54 && temp >= 34) {
    element.className = 'autumn';
  } else {
    element.className = 'winter';
  }
};
// Temperature Ranges Change Temperature

const changeColorTemp = (temp) => {
  const tempContainer = document.getElementById('current_temp');
  if (!flagFahrenheit) {
    temp = (9 / 5) * temp + 32;
  }
  if (temp < 50) {
    tempContainer.className = 'teal';
  } else if (temp >= 50 && temp < 60) {
    tempContainer.className = 'green';
  } else if (temp >= 60 && temp < 70) {
    tempContainer.className = 'yellow';
  } else if (temp >= 70 && temp < 80) {
    tempContainer.className = 'orange';
  } else {
    tempContainer.className = 'red';
  }
};

// 3. Naming the City

const result = document.getElementById('city_name');
const RenameCity = (e) => {
  result.textContent =
    e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
};

const registerEventHandlersRename = () => {
  const message = document.getElementById('enter_city');
  message.addEventListener('input', RenameCity);
};
document.addEventListener('DOMContentLoaded', registerEventHandlersRename);

// 4. calling APIs LocationIQ and OpenWeather
const getRealTemp = () => {
  axios
    .get('https://weather-report-proxyserver.herokuapp.com/location', {
      params: {
        q: document.getElementById('enter_city').value,
      },
    })
    .then((response) => {
      const forecastFor = document.getElementById('forecast');
      const city_full_name = response.data[0].display_name;
      forecastFor.textContent = `Forecast for: ${response.data[0].display_name}`;
      axios
        .get('https://weather-report-proxyserver.herokuapp.com/weather', {
          params: {
            lat: response.data[0].lat,
            lon: response.data[0].lon,
          },
        })
        .then((response) => {
          Forecast(response.data);
        })
        .catch((error) => {
          console.log('error!', error.response);
        });
      axios
        .get(`https://www.googleapis.com/customsearch/v1`, {
          params: {
            key: process.env.GOOGLE_API,
            cx: `74444ea6766c34614`,
            searchType: `image`,
            q: city_full_name,
          },
        })
        .then((response) => {
          document.getElementById('imgid').src = response.data.items[0].link;
        })
        .catch((error) => {
          console.log('error2!', error.response);
        });
    });
};
const registerEventHandlersReal = () => {
  const getRealTempBtn = document.getElementById('get__real__temp');
  getRealTempBtn.addEventListener('click', getRealTemp);
};
document.addEventListener('DOMContentLoaded', registerEventHandlersReal);

const Forecast = (data) => {
  const today = new Date();
  if (!flagFahrenheit) {
    state.temp = (5 / 9) * (data.current.temp - 32);
  } else {
    state.temp = data.current.temp;
  }
  const tempContainer = document.getElementById('current_temp');
  tempContainer.textContent = flagFahrenheit
    ? `${Math.trunc(state.temp)}°F`
    : `${Math.trunc(state.temp)}°C`;
  changeColorTemp(state.temp);
  changeBackground(state.temp);
  const taskList = document.getElementById('day__forecast');
  taskList.innerHTML = '';

  // forecast for a week
  for (let i = 0; i <= 7; i++) {
    const listItem = document.createElement('li');

    listItem.textContent = today.toDateString();
    listItem.className = 'date';
    taskList.appendChild(listItem);
    today.setDate(today.getDate() + 1);

    const list = document.createElement('ol');
    listItem.appendChild(list);

    const dayTemp = document.createElement('li');
    dayTemp.textContent = flagFahrenheit
      ? `day temp: ${Math.trunc(data.daily[i].temp.day)}°F`
      : `day temp: ${Math.trunc((5 / 9) * (data.daily[i].temp.day - 32))}°C`;
    dayTemp.className = 'data';
    list.appendChild(dayTemp);

    const nightTemp = document.createElement('li');
    nightTemp.textContent = flagFahrenheit
      ? `night temp: ${Math.trunc(data.daily[i].temp.night)}°F`
      : `night temp: ${Math.trunc(
          (5 / 9) * (data.daily[i].temp.night - 32)
        )}°C`;
    nightTemp.className = 'data';
    list.appendChild(nightTemp);

    const description = document.createElement('li');
    description.textContent = `${data.daily[i]['weather'][0].description}`;
    description.className = 'data';
    list.appendChild(description);
  }
  if (data.daily[0]['weather'][0].description.includes('snow')) {
    document.body.className = 'snow-bg';
  } else if (data.daily[0]['weather'][0].description.includes('rain')) {
    document.body.className = 'rain';
  } else if (data.daily[0]['weather'][0].description.includes('cloud')) {
    document.body.className = 'cloud';
  } else if (data.daily[0]['weather'][0].description.includes('clear')) {
    document.body.className = 'sun';
  }
};

// 5. Selection Changes Sky Background

const changeModeSkyBackground = (event) => {
  const element = document.body;
  element.className = event.target.value;
};

const registerEventHandlersSkybackground = () => {
  const skyMode = document.getElementById('back-select');
  skyMode.addEventListener('change', changeModeSkyBackground);
};
document.addEventListener(
  'DOMContentLoaded',
  registerEventHandlersSkybackground
);

// 6.Resetting the City Name

const ResetCity = () => {
  const nameContainer = document.getElementById('city_name');
  nameContainer.textContent = 'Far Far Away';
};

const registerEventHandlersReset = () => {
  const form = document.querySelector('#form');
  form.addEventListener('reset', ResetCity);
};
document.addEventListener('DOMContentLoaded', registerEventHandlersReset);

// 7. convert the temperature between Celsius and Fahrenheit

const changeMetricForTemp = () => {
  flagFahrenheit = !flagFahrenheit;
  if (!flagFahrenheit) {
    state.temp = (5 / 9) * (state.temp - 32);
  } else {
    state.temp = (9 / 5) * state.temp + 32;
  }
  const tempContainer = document.getElementById('current_temp');
  tempContainer.textContent = flagFahrenheit
    ? `${Math.trunc(state.temp)}°F`
    : `${Math.trunc(state.temp)}°C`;
  changeColorTemp(state.temp);
  changeBackground(state.temp);
};

const registerEventHandlersFarenheit = () => {
  const switchFC = document.getElementById('switchBtnFC');
  switchFC.addEventListener('click', changeMetricForTemp);
};
document.addEventListener('DOMContentLoaded', registerEventHandlersFarenheit);
