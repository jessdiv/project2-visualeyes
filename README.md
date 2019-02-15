# Project 2 Visualeyes

To get a closer look of the project visit: https://declanboller.github.io/Visualeyes-client-no-react/

The Visualeyes site was produced by 4 students (Bridget McMahon, Declan Boller,
Jessica Diver, and Sean McCusker) that are part of WDI-30 in Sydney, Australia.
It is a group project that is helping us prepare for our future web-development
rolls. We came together in our shared interest of producing a site that helps us
visualise data in different ways. We chose to focus on illustrating 15 countries
around the world in terms of, population, GDP/per capita, and life-expectancy.
All of the data used in the site was retrieved from: https://data.worldbank.org/indicator?tab=featured between the dates of 8 February and 12 February 2019.

Below is a screen shot of the landing page that the user sees upon visiting our site:

![Landing Page](/images/2019/02/LandingPage.png)

## Objectives of Project 2
- Have a backend for the project which is in Ruby on Rails
- Have a front end that can be in React, although does not have to be.
- This app has two models in Rails: Countries and Statistics
- We used the following Gems: 'rack-cors', and 'pry-rails'. Also, 'require-csv'
(while not a gem) needed the csv library to communicate with the front-end for GET requests
- Heroku: This app has been uploaded to Heroku on the backend and that is where we pull our statistics from the loaded CSV file.

## Built With
- Ruby on Rails
- D3.js library
- jQuery
- JavaScript
- HTML
- CSS

Below are screen shots of the different graphs that can be viewed on the site:

### Life Expectancy vs. GDP
This is an animation that shows how life expectancy and GDP are correlated and
change over time. This is a time-lapse series that runs from 1960-2017.

![Life Expectancy vs. GDP](/images/2019/02/LifeExpectancyGDP.png)


### GDP/Capita per Country
The below graph is a demonstration of GDP/per capita has changed over by country
from 1960-2017.

![GDP/Capita per Country](/images/2019/02/GDP_Capita_PerCountry.png)


### Population Bubbles
The population bubbles are scaled to represent the population size of a given
country. So the largest two bubbles represent China and India. The bubbles are
interactive and the larger the bubble the more force they have to move their
neighbouring bubbles around the site.

![Population Bubbles](/images/2019/02/PopulationBubbles.png)


### Population by Country
The below line graph shows how a given country's population has changed over time
from 1960-2017. Like the other visualisations, a given country can be shown alone
or by toggling off or on which countries you want to investigate further.

![Population Line Graph](/images/2019/02/PopulationLineGraph.png)


### Population Bubbles by Area
The below bubbles are drawn to scale to visualise how large a country is by area
compared to another country.

![Population Area Bubbles](/images/2019/02/PopulationAreaBubbles.png)


## Scope of Project as of 14-2-2019
- Can view data in different visualisations on the site
- Can see all countries at once in each visualisation or toggle on or off which countries you want to see at any given time

## Pain Points
- We only had a week and this was the first time we were introduced to, let alone had a chance to play with D3
- Trying to configure the backend properly so that we could pull the data to use on the frontend
- Finding the correct data to use
- Configuring tooltips, especially for the line graphs

## TODO
- Would like to possibly add more countries and further explore what the D3 library has to offer
- Optimisation of the site could be improved
- More time to solve scaleLog vs. scaleLinear presentation of data for population line graph
- Would like to have more animations, i.e. show the SVGs animate the drawing
- Make the site mobile friendly
- Make the line graphs scale better when toggling on or off a country
- A lot of DRY code that could be fixed, this was the sacrifice for trying to wrap our heads around 'learning' D3 in one week

## Big Thanks
A big thank you to our instructor, Joel Turnbull for his help and assistance in the project. As well as, to Linna Liu and Yianni Moustakas for your help and trouble shooting skills to guide us with some of our pain points. This project was completed in February of 2019.
