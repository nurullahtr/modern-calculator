# Modern Calculator

A modern calculator application built with Vue.js and Electron.js, featuring both basic mathematical operations and currency conversion capabilities.

## Features

- Basic mathematical operations
- Currency conversion
- Modern Material UI design
- Keyboard shortcut (Ctrl/Cmd + Shift + C) to show/hide
- Calculation history
- Dark mode interface

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run in development mode:
```bash
npm run electron:serve
```

3. Build for production:
```bash
npm run electron:build
```

## Usage

- Press `Ctrl/Cmd + Shift + C` to show/hide the calculator
- Switch between Basic and Currency modes using the toggle buttons
- Use the numpad or click buttons for calculations
- View calculation history in the expandable panel below
- For currency conversion:
  1. Switch to Currency mode
  2. Select source and target currencies
  3. Enter amount and perform calculation

## Technologies Used

- Vue.js 3
- Electron.js
- Vuetify 3
- Tailwind CSS
- Exchange Rate API 