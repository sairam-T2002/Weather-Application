'use strict';
const btn = document.querySelector('.btn');
const stats = document.querySelectorAll('.value');
const img = document.querySelector('.img');
const icons = document.querySelectorAll('.icon');
const ul = document.querySelector('.list');
const tempBox = document.querySelectorAll('.temp-box');
const humidBox = document.querySelectorAll('.humidity-box');
const dntBox = document.querySelectorAll('.dnt');
const allWeatherList = [];

function grouping(nodeList, n) {
  const grouped = [];
  for (let i = 0; i < nodeList.length; i += n) {
    grouped.push(Array.from(nodeList).slice(i, i + n));
  }
  return grouped;
}

function addToRecents(location) {
  const recent = document.querySelectorAll('.recent');
  for (const el of recent) {
    if (el.textContent === location) return;
  }
  const html = `<li class="location--1"><button class="recent">${location}</button></li>`;
  ul.insertAdjacentHTML('afterbegin', html);
}

function imageUpdate(condition) {
  switch (condition.text) {
    case 'Sunny':
      img.src = 'sunny_tp.png';
      break;
    case 'Partly cloudy':
      img.src = 'partial-clouds_tp.png';
      break;
    case 'Cloudy':
    case 'Overcast':
    case 'Mist':
    case 'Fog':
    case 'Freezing fog':
      img.src = 'cloudy_tp.png';
      break;
    case 'Patchy rain possible':
    case 'Light rain':
    case 'Moderate rain at times':
    case 'Moderate rain':
    case 'Heavy rain at times':
    case 'Heavy rain':
    case 'Light freezing rain':
    case 'Moderate or heavy freezing rain':
    case 'Light rain shower':
    case 'Moderate or heavy rain shower':
    case 'Torrential rain shower':
    case 'Patchy light rain with thunder':
    case 'Moderate or heavy rain with thunder':
      img.src = 'drizzles_tp.png';
      break;
    case 'Patchy snow possible':
    case 'Patchy sleet possible':
    case 'Blowing snow':
    case 'Blizzard':
    case 'Patchy light snow':
    case 'Light snow':
    case 'Patchy moderate snow':
    case 'Moderate snow':
    case 'Patchy heavy snow':
    case 'Heavy snow':
    case 'Light sleet':
    case 'Moderate or heavy sleet':
    case 'Light snow showers':
    case 'Moderate or heavy snow showers':
      img.src = 'snowy_t.png';
      break;
    case 'Thundery outbreaks possible':
    case 'Patchy light drizzle':
    case 'Light drizzle':
    case 'Light sleet showers':
    case 'Moderate or heavy sleet showers':
    case 'Light snow showers':
    case 'Moderate or heavy snow showers':
    case 'Light showers of ice pellets':
    case 'Moderate or heavy showers of ice pellets':
    case 'Patchy light snow with thunder':
    case 'Moderate or heavy snow with thunder':
      img.src = 'thunder-strom_tp.png';
      break;
  }
}
function updateWeatherCard({ location, current }, { forecast }) {
  const { forecastday } = forecast;
  const { condition } = current;
  imageUpdate(condition);
  icons.forEach((el, i) => {
    el.src = forecastday[i].day.condition.icon;
  });

  stats.forEach((el, i) => {
    switch (i) {
      case 0:
        el.textContent = condition.text;
        break;
      case 1:
        el.textContent = `${current.temp_c}° C`;
        break;
      case 2:
        el.textContent = current.humidity;
        break;
      case 3:
        el.textContent = location.name;
        break;
      case 4:
        el.textContent = current.last_updated;
        break;
      case 5:
        el.textContent = `${current.wind_kph} Kmph`;
        break;
      case 6:
        el.textContent = current.wind_dir;
        break;
    }
  });
  grouping(tempBox, 3)
    .reverse()
    .forEach((el, i) => {
      el.forEach((el, j) => {
        switch (j) {
          case 0:
            el.textContent = `${forecastday[i].day.maxtemp_c}° C`;
            break;
          case 1:
            el.textContent = `${forecastday[i].day.mintemp_c}° C`;
            break;
          case 2:
            el.textContent = `${forecastday[i].day.avgtemp_c}° C`;
            break;
        }
      });
    });
  grouping(humidBox, 3)
    .reverse()
    .forEach((el, i) => {
      el.forEach((el, j) => {
        switch (j) {
          case 0:
            el.textContent = `${forecastday[i].day.maxwind_kph} Kmph`;
            break;
          case 1:
            el.textContent = `${forecastday[i].day.totalprecip_mm} mm`;
            break;
          case 2:
            el.textContent = forecastday[i].day.avghumidity;
            break;
        }
      });
    });
  grouping(dntBox, 2)
    .reverse()
    .forEach((el, i) => {
      el.forEach((el, j) => {
        switch (j) {
          case 0:
            el.textContent = forecastday[i].date;
            break;
          case 1:
            el.textContent = '23:00';
            break;
        }
      });
    });
  // console.log(location.name);
  addToRecents(location.name);
}

async function getWeather(location, date, lastDate) {
  const weather = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=5ae149e9ab80468392944421233008&q=${location}&aqi=no`
  );
  const weatherHistory = await fetch(
    `http://api.weatherapi.com/v1/history.json?key=5ae149e9ab80468392944421233008&q=${location}&dt=${lastDate}&end_dt=${date}`
  );
  const weatherlist = await fetch(
    'https://www.weatherapi.com/docs/weather_conditions.json'
  );
  const weatherObj = await weather.json();
  const weatherHistoryObj = await weatherHistory.json();
  const weatherList = await weatherlist.json();
  weatherList.forEach(el => {
    allWeatherList.push(el.day);
  });
  updateWeatherCard(weatherObj, weatherHistoryObj);
}
function updateDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate() - 1).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  const lastWeekDate = new Date(currentDate);
  lastWeekDate.setDate(currentDate.getDate() - 7);
  const formattedLastWeekDate = `${lastWeekDate.getFullYear()}-${String(
    lastWeekDate.getMonth() + 1
  ).padStart(2, '0')}-${String(lastWeekDate.getDate()).padStart(2, '0')}`;
  return [formattedDate, formattedLastWeekDate];
}
btn.addEventListener('click', function (e) {
  e.preventDefault();
  const input = document.querySelector('.input').value;

  getWeather(input, ...updateDate());
});

ul.addEventListener('click', function (e) {
  console.log(e.target.textContent);
  getWeather(e.target.textContent, ...updateDate());
});
