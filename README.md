# Modern Calculator

A powerful, elegant calculator application built with Vue.js and Electron, featuring both basic calculations and multi-currency conversion capabilities with a modern UI.

![Modern Calculator](build/screenshot.png)

## Features

### Core Functionality
- **Basic Calculator**: Standard arithmetic operations with a clean interface
- **Multi-Currency Conversion**: Convert between multiple currencies simultaneously
- **Real-time Exchange Rates**: Up-to-date currency conversion via Exchange Rate API

### User Interface
- **Modern Design**: Sleek dark-themed interface with glassmorphism effects
- **Responsive Layout**: Adapts to different screen sizes
- **Custom Title Bar**: Integrated window controls (minimize, close)
- **Two Operation Modes**: Switch easily between basic and currency calculations

### Enhanced User Experience
- **Keyboard Shortcuts**: Full keyboard support for all operations
  - Numbers, operators, and special functions
  - Press 'H' key to view all available shortcuts
- **Calculation History**: Track and review your calculations
- **User Feedback**: Submit feedback directly from the app
- **Multiple Currency View**: See conversions to EUR, TRY, USD, CAD at once
- **Custom Currency Selection**: Choose which currencies to display

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Development Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/modern-calculator.git
   cd modern-calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run in development mode:
   ```bash
   npm run electron:dev
   ```

### Building for Production
Build a portable Windows executable:
```bash
npm run electron:build
```

Build a macOS application (requires macOS):
```bash
npm run electron:build:mac
```

The built application will be available in the `dist_electron` folder.

## Usage Guide

### Basic Calculator Mode
- Use the number pad to input values
- Perform addition, subtraction, multiplication, and division
- Use backspace (⌫) to delete the last digit
- Press 'C' to clear all
- Press '=' to calculate the result

### Currency Conversion Mode
1. Switch to "Currency" mode using the toggle
2. Select your source currency
3. Enter the amount
4. View real-time conversions to multiple currencies below
5. Click the settings icon on the Multi-Currency panel to customize displayed currencies

### Keyboard Shortcuts
- Press 'H' to view all keyboard shortcuts
- Use numeric keys for numbers
- Use operators (+, -, *, /) for calculations
- Backspace to delete, Escape to clear, Enter to calculate

## Technology Stack

- **Frontend**: Vue.js 3 with Composition API
- **Desktop Integration**: Electron.js
- **UI Framework**: Vuetify 3
- **Styling**: Tailwind CSS
- **API Integration**: Exchange Rate API for currency data
- **Build System**: Vite
- **Packaging**: Electron Builder

## Feedback

Use the feedback button in the application to submit your comments or suggestions directly to the development team.

## License

MIT 