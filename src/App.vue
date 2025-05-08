<template>
  <v-app class="bg-gray-900" @keydown="handleKeyPress">
    <TitleBar />
    <v-main class="main-content">
      <div class="max-w-md mx-auto p-4">
        <v-card class="calculator-container">
          <v-card-text>
            <!-- Top Actions Bar -->
            <div class="d-flex justify-end mb-2">
              <v-btn
                class="feedback-btn"
                color="info"
                variant="outlined"
                size="small"
                @click="showFeedback = true"
                prepend-icon="mdi-chat-outline"
              >
                Feedback
              </v-btn>
            </div>
            
            <!-- Expression Display -->
            <div class="mb-2">
              <div class="text-right text-h6 text-grey-lighten-1">{{ expression }}</div>
            </div>

            <!-- Main Display -->
            <div class="mb-4">
              <div class="text-right">
                <span class="text-h3 font-weight-bold">{{ display }}</span>
                <span v-if="mode === 'currency'" class="text-h5 ml-2">{{ fromCurrency }}</span>
              </div>
              <div v-if="mode === 'currency' && convertedAmount" class="text-right text-h5 text-primary mt-2">
                {{ convertedAmount }} {{ toCurrency }}
              </div>
            </div>

            <!-- Calculator Modes -->
            <v-btn-toggle v-model="mode" mandatory class="mb-4 w-100">
              <v-btn value="basic" class="flex-grow-1">Basic</v-btn>
              <v-btn value="currency" class="flex-grow-1">Currency</v-btn>
            </v-btn-toggle>

            <!-- Currency Mode Controls -->
            <div v-if="mode === 'currency'" class="mb-4">
              <v-select
                v-model="fromCurrency"
                :items="currencies"
                density="compact"
                hide-details
                class="currency-select mb-2"
                variant="outlined"
                label="Source Currency"
                @update:model-value="handleCurrencyChange"
              ></v-select>
              <div class="text-center text-caption mt-2" v-if="display !== '0'">
                Enter amount in {{ fromCurrency }}
              </div>
            </div>

            <!-- Calculator Buttons -->
            <v-row dense>
              <template v-if="mode === 'basic'">
                <v-col v-for="btn in buttons" :key="btn" cols="3">
                  <v-btn
                    block
                    :color="getButtonColor(btn)"
                    @click="handleButton(btn)"
                    class="calculator-button text-h5"
                    :class="{ 'text-weight-bold': isOperator(btn) }"
                    :data-key="getKeyboardShortcut(btn)"
                  >
                    {{ btn }}
                  </v-btn>
                </v-col>
              </template>
              <template v-else>
                <v-col v-for="btn in currencyButtons" :key="btn" cols="3">
                  <v-btn
                    block
                    :color="btn === '⌫' ? 'warning' : 'secondary'"
                    @click="handleButton(btn)"
                    class="calculator-button currency-button text-h6"
                    :data-key="getKeyboardShortcut(btn)"
                  >
                    {{ btn }}
                  </v-btn>
                </v-col>
              </template>
            </v-row>

            <!-- Bottom Hint -->
            <div class="text-center text-caption mt-4 text-grey">
              Press 'H' to show/hide keyboard shortcuts
            </div>
          </v-card-text>
        </v-card>

        <!-- Feedback Dialog -->
        <FeedbackDialog v-model="showFeedback" />

        <!-- Multi-Currency Panel -->
        <MultiCurrencyPanel
          v-if="mode === 'currency'"
          :amount="Number(display)"
          :sourceCurrency="fromCurrency"
        />

        <!-- History Panel -->
        <v-expansion-panels v-if="mode === 'basic'" class="mt-4">
          <v-expansion-panel>
            <v-expansion-panel-title>History</v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list class="history-list" :class="{ 'scrollable': calculationHistory.length > 2 }">
                <v-list-item v-for="(item, index) in calculationHistory" :key="index" class="history-item">
                  <v-list-item-title class="text-right">{{ item }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- Keyboard Shortcuts Help Overlay -->
        <v-dialog v-model="showHelp" max-width="450">
          <v-card class="help-overlay">
            <v-card-title class="d-flex align-center pa-4 border-bottom">
              <span class="text-h5">⌨️ Keyboard Shortcuts</span>
              <v-spacer></v-spacer>
              <v-btn
                icon="mdi-close"
                variant="text"
                size="small"
                @click="showHelp = false"
                class="close-btn"
              ></v-btn>
            </v-card-title>
            <v-card-text class="pa-4">
              <div class="shortcuts-container">
                <!-- Numbers and Basic Operations -->
                <div class="shortcut-section">
                  <div class="section-title">
                    <v-icon icon="mdi-numeric" class="mr-2"></v-icon>
                    Numbers & Basic Operations
                  </div>
                  <div class="shortcut-grid">
                    <div class="shortcut-item">
                      <kbd>0</kbd> - <kbd>9</kbd>
                      <span class="shortcut-desc">Number input</span>
                    </div>
                    <div class="shortcut-item">
                      <kbd>.</kbd>
                      <span class="shortcut-desc">Decimal point</span>
                    </div>
                    <div class="shortcut-item">
                      <kbd>+</kbd> <kbd>-</kbd> <kbd>*</kbd> <kbd>/</kbd>
                      <span class="shortcut-desc">Basic operations</span>
                    </div>
                  </div>
                </div>

                <!-- Special Functions -->
                <div class="shortcut-section">
                  <div class="section-title">
                    <v-icon icon="mdi-function-variant" class="mr-2"></v-icon>
                    Special Functions
                  </div>
                  <div class="shortcut-grid">
                    <div class="shortcut-item">
                      <kbd>Enter</kbd> or <kbd>=</kbd>
                      <span class="shortcut-desc">Calculate result</span>
                    </div>
                    <div class="shortcut-item">
                      <kbd>Backspace</kbd>
                      <span class="shortcut-desc">Delete last character</span>
                    </div>
                    <div class="shortcut-item">
                      <kbd>Esc</kbd>
                      <span class="shortcut-desc">Clear all (C)</span>
                    </div>
                    <div class="shortcut-item">
                      <kbd>%</kbd>
                      <span class="shortcut-desc">Calculate percentage</span>
                    </div>
                  </div>
                </div>

                <!-- Interface Controls -->
                <div class="shortcut-section">
                  <div class="section-title">
                    <v-icon icon="mdi-gesture-tap-button" class="mr-2"></v-icon>
                    Interface
                  </div>
                  <div class="shortcut-grid">
                    <div class="shortcut-item">
                      <kbd>H</kbd>
                      <span class="shortcut-desc">Toggle help screen</span>
                    </div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import TitleBar from './components/TitleBar.vue'
import MultiCurrencyPanel from './components/MultiCurrencyPanel.vue'
import FeedbackDialog from './components/FeedbackDialog.vue'

export default {
  name: 'App',
  components: {
    TitleBar,
    MultiCurrencyPanel,
    FeedbackDialog
  },
  setup() {
    const display = ref('0')
    const expression = ref('')
    const mode = ref('basic')
    const fromCurrency = ref('TRY')
    const toCurrency = ref('EUR')
    const calculationHistory = ref([])
    const currentOperation = ref(null)
    const previousValue = ref(null)
    const newNumber = ref(true)
    const exchangeRate = ref(null)
    const convertedAmount = ref(null)
    const showHelp = ref(false)
    const showFeedback = ref(false)

    const currencies = [
      'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'TRY',
      'KRW', 'SGD', 'HKD', 'MXN', 'BRL'
    ]

    const buttons = [
      'C', '±', '%', '÷',
      '7', '8', '9', '×',
      '4', '5', '6', '-',
      '1', '2', '3', '+',
      '0', '.', '⌫', '='
    ]

    const currencyButtons = [
      '7', '8', '9',
      '4', '5', '6',
      '1', '2', '3',
      '0', '.', 'C',
      '⌫'
    ]

    const updateExchangeRate = async () => {
      try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency.value}`)
        exchangeRate.value = response.data.rates[toCurrency.value].toFixed(4)
        if (display.value !== '0') {
          convertCurrency()
        }
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error)
      }
    }

    const convertCurrency = () => {
      if (mode.value === 'currency' && display.value !== '0' && exchangeRate.value) {
        const amount = parseFloat(display.value)
        convertedAmount.value = (amount * parseFloat(exchangeRate.value)).toFixed(2)
      }
    }

    const handleCurrencyChange = async () => {
      await updateExchangeRate()
    }

    const handleButton = async (btn) => {
      if (mode.value === 'currency' && !['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'C', '⌫'].includes(btn)) {
        return; // Ignore non-numeric buttons in currency mode
      }

      if (btn === 'C') {
        display.value = '0'
        expression.value = ''
        currentOperation.value = null
        previousValue.value = null
        newNumber.value = true
        convertedAmount.value = null
      } else if (mode.value === 'currency') {
        if (btn === '.') {
          if (!display.value.includes('.')) {
            display.value += '.'
            convertCurrency()
          }
        } else if (btn === '⌫') {
          if (display.value.length > 1) {
            display.value = display.value.slice(0, -1);
          } else {
            display.value = '0';
          }
          convertCurrency();
        } else {
          if (display.value === '0') {
            display.value = btn
          } else {
            display.value += btn
          }
          convertCurrency()
        }
      } else {
        // Original basic calculator logic
        if (btn === '±') {
          display.value = (parseFloat(display.value) * -1).toString()
        } else if (btn === '%') {
          display.value = (parseFloat(display.value) / 100).toString()
        } else if (btn === '⌫') {
          if (newNumber.value) {
            if (expression.value.endsWith(' + ') || 
                expression.value.endsWith(' - ') || 
                expression.value.endsWith(' × ') || 
                expression.value.endsWith(' ÷ ')) {
              expression.value = expression.value.slice(0, -3)
              display.value = previousValue.value.toString()
              currentOperation.value = null
              newNumber.value = false
            }
          } else {
            display.value = display.value.slice(0, -1) || '0'
          }
        } else if (['+', '-', '×', '÷'].includes(btn)) {
          handleOperator(btn)
        } else if (btn === '=') {
          await calculate()
        } else if (btn === '.') {
          if (!display.value.includes('.')) {
            display.value += '.'
          }
        } else {
          if (newNumber.value) {
            display.value = btn
            newNumber.value = false
          } else {
            display.value += btn
          }
        }
      }
    }

    const handleOperator = (operator) => {
      if (currentOperation.value && previousValue.value !== null && !newNumber.value) {
        const current = parseFloat(display.value)
        let result = 0

        switch (currentOperation.value) {
          case '+':
            result = previousValue.value + current
            break
          case '-':
            result = previousValue.value - current
            break
          case '×':
            result = previousValue.value * current
            break
          case '÷':
            result = current !== 0 ? previousValue.value / current : 'Error'
            break
        }

        display.value = result.toString()
        expression.value = expression.value + ' ' + current.toString()
      } else {
        expression.value = expression.value || display.value
      }

      previousValue.value = parseFloat(display.value)
      currentOperation.value = operator
      expression.value += ' ' + operator
      newNumber.value = true
    }

    const calculate = async () => {
      if (currentOperation.value && previousValue.value !== null && !newNumber.value) {
        const current = parseFloat(display.value)
        let result = 0

        switch (currentOperation.value) {
          case '+':
            result = previousValue.value + current
            break
          case '-':
            result = previousValue.value - current
            break
          case '×':
            result = previousValue.value * current
            break
          case '÷':
            result = current !== 0 ? previousValue.value / current : 'Error'
            break
        }

        const fullExpression = expression.value + ' ' + current.toString()
        calculationHistory.value.unshift(`${fullExpression} = ${result}`)
        display.value = result.toString()
        expression.value = ''
        currentOperation.value = null
        previousValue.value = null
        newNumber.value = true

        if (mode.value === 'currency') {
          convertCurrency()
        }
      }
    }

    const isOperator = (btn) => {
      return ['+', '-', '×', '÷', '='].includes(btn)
    }

    const getButtonColor = (btn) => {
      if (['C', '±', '%'].includes(btn)) return 'error'
      if (isOperator(btn)) return 'primary'
      if (btn === '⌫') return 'warning'
      return 'secondary'
    }

    const swapCurrencies = () => {
      const temp = fromCurrency.value
      fromCurrency.value = toCurrency.value
      toCurrency.value = temp
      updateExchangeRate()
    }

    // Watch for mode changes
    watch(mode, (newMode) => {
      if (newMode === 'currency') {
        updateExchangeRate()
      } else {
        exchangeRate.value = null
        convertedAmount.value = null
      }
    })

    const handleKeyPress = (event) => {
      // Toggle help overlay with 'H' key
      if (event.key.toLowerCase() === 'h') {
        showHelp.value = !showHelp.value
        return
      }

      // Prevent default behavior for certain keys
      if (['+', '-', '*', '/', '=', 'Enter', 'Backspace', 'Delete', 'Escape'].includes(event.key)) {
        event.preventDefault()
      }

      // Numbers (0-9) and decimal point
      if (/^[0-9.]$/.test(event.key)) {
        handleButton(event.key)
      }
      // Operators
      else if (event.key === '+') handleButton('+')
      else if (event.key === '-') handleButton('-')
      else if (event.key === '*') handleButton('×')
      else if (event.key === '/') handleButton('÷')
      // Equal sign or Enter
      else if (event.key === '=' || event.key === 'Enter') handleButton('=')
      // Backspace or Delete
      else if (event.key === 'Backspace' || event.key === 'Delete') handleButton('⌫')
      // Escape key for clear
      else if (event.key === 'Escape') handleButton('C')
      // Percentage
      else if (event.key === '%') handleButton('%')
    }

    // Add keyboard focus when component mounts
    onMounted(() => {
      if (mode.value === 'currency') {
        updateExchangeRate()
      }
      // Add tabindex to make the app focusable
      document.querySelector('.v-application').setAttribute('tabindex', '0')
      // Focus the app
      document.querySelector('.v-application').focus()
    })

    const getKeyboardShortcut = (btn) => {
      switch (btn) {
        case '÷': return '/'
        case '×': return '*'
        case '⌫': return 'Backspace'
        case 'C': return 'Esc'
        case '=': return 'Enter'
        default: return btn
      }
    }

    return {
      display,
      expression,
      mode,
      fromCurrency,
      toCurrency,
      currencies,
      calculationHistory,
      buttons,
      currencyButtons,
      exchangeRate,
      convertedAmount,
      handleButton,
      handleCurrencyChange,
      getButtonColor,
      isOperator,
      swapCurrencies,
      handleKeyPress,
      getKeyboardShortcut,
      showHelp,
      showFeedback
    }
  }
}
</script>

<style>
/* Add these at the top of the style section */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

html, body, .v-application {
  height: 100%;
}

.v-main {
  height: 100%;
  overflow-y: auto !important;
}

.main-content {
  padding-top: 32px !important;
}

.calculator-container {
  backdrop-filter: blur(16px);
  background-color: rgba(30, 30, 30, 0.8) !important;
  border-radius: 12px;
  overflow: hidden;
}

.calculator-button {
  min-height: 54px !important;
  font-size: 1.25rem !important;
  height: 48px !important;
}

.v-btn--size-default {
  text-transform: none !important;
}

/* Add outline for keyboard focus */
.v-application:focus {
  outline: none;
}

/* Add key mapping help */
.calculator-button {
  position: relative;
}

.calculator-button::after {
  content: attr(data-key);
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 0.6rem;
  opacity: 0.7;
}

.help-overlay {
  background-color: rgba(35, 35, 35, 0.98) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.border-bottom {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.shortcuts-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.shortcut-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--v-primary-base);
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.shortcut-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 32px;
}

.shortcut-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.shortcut-desc {
  color: rgba(255, 255, 255, 0.7);
  margin-left: 4px;
}

kbd {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 2px 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  display: inline-block;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
}

.close-btn {
  opacity: 0.7;
  transition: opacity 0.2s;
}

.close-btn:hover {
  opacity: 1;
}

/* Add these new styles */
.currency-controls {
  padding: 0 8px;
}

.currency-select {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  width: 100%;
}

.currency-select :deep(.v-field) {
  border-radius: 8px !important;
}

.swap-btn {
  margin: 0 4px;
}

.history-list {
  max-height: 200px;
  overflow-y: auto;
}

.history-list.scrollable {
  overflow-y: scroll;
}

.history-item {
  padding: 8px 16px;
}

.history-item:last-child {
  border-bottom: none;
}

.history-list.scrollable::-webkit-scrollbar {
  width: 6px;
  display: block;
}

.history-list.scrollable::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.history-list.scrollable::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.history-list.scrollable::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Add new style for currency buttons */
.calculator-button.currency-button {
  min-height: 32px !important;
  height: 32px !important;
  font-size: 1rem !important;
  margin: 2px 0;
}

.feedback-btn {
  margin: 0;
  font-size: 12px;
  text-transform: none;
}
</style> 