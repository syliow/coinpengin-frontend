# Welcome to Coinpengin-Frontend 👋
![Version](https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000)
![Coin Pengin Preview](https://i.imgur.com/KF0mvRr.png)


Coinpengin is a crypto price tracking website that allows users to view the latest cryptocurrency prices for the top 100 coins. It fetches the latest price and data from Coingecko API, users are able to view the chart for a specific cryptocurrency too.

### ✨ [View Live Website here](https://coin-pengin.netlify.app/)

## Features
- Track cryptocurrency prices in real-time
- View cryptocurrency price chart 
- Switch between different currency (USD/ MYR)
- Dark mode toggle
- Display toast message based on user actions
- Account Registration
- User Login
- Add a coin to wishlist / Remove a coin from wishlist

## Installation

1. Clone this repo with `git clone https://github.com/syliow/coinpengin-frontend.git` command.
2. Run `npm install` to install all the dependencies.
3. Run `npm run start` to start the project.
4. Great! You will now have access to Coinpengin on your localhost at `localhost:3000`. 
5. Note: You will need to install Coinpengin's backend to have access for the user account feature. You can find Coinpengin's backend repo at [here](https://github.com/syliow/coinpengin-backend).

## Deployment

- Website deployed on [Netlify](https://www.netlify.com/)

## Technologies Used

* [Axios](https://axios-http.com/) - Used to communicate with backend and make requests to Coingecko API
* [Chart.js](https://www.chartjs.org/)- Used to generate cryptocurrency price chart
* [Formik / Yup](https://formik.org/) - Used for form validation
* [JSON Web Tokens](https://jwt.io/) - Used to verify user accounts
* [Material-UI](https://mui.com/) - React component library used for design.
* [Material Table](https://material-table.com/) - Generate a data table component based on Material-UI
* [React Toastify](https://fkhadra.github.io/react-toastify/introduction) - Display notification fetched from backend based on user actions

## Room for improvement:
- Improve Frontend design.
- Improve Code quality.

To do:
- Add a user profile page to display wishlist cryptocurrencies.
- Add Exchanges page to display the Top Cryptocurrency Exchanges.

## Acknowledgements
- This project was inspired by Coingecko.
- This project was based on Coingecko's frontend design and their [API](https://www.coingecko.com/en/api)

## Contact
Created by [@Shanyi Liow](http://liowshanyi.website/) - feel free to contact me!


