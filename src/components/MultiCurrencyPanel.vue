<template>
  <v-card class="mt-4 currency-panel">
    <v-card-title class="d-flex align-center sticky-header">
      <span>Multi-Currency View</span>
      <v-spacer></v-spacer>
      <v-btn
        size="small"
        icon="mdi-cog"
        @click="showSettings = true"
      ></v-btn>
    </v-card-title>
    <v-card-text class="currency-panel-content">
      <div v-if="amount > 0" class="currency-grid">
        <v-card
          v-for="currency in selectedCurrencies"
          :key="currency"
          variant="outlined"
          class="currency-card ma-1"
          @click="swapWithSource(currency)"
          :class="{'clickable': true}"
        >
          <v-card-text class="pa-2">
            <div class="text-caption">{{ sourceCurrency }} to {{ currency }}</div>
            <div class="text-h6">{{ formatAmount(convertedAmounts[currency]) }}</div>
            <div class="text-caption">1 {{ sourceCurrency }} = {{ formatRate(exchangeRates[currency]) }} {{ currency }}</div>
            <div class="swap-hint">
              <v-icon size="12" class="mr-1">mdi-swap-horizontal</v-icon>
              <span class="text-caption">Click to swap</span>
            </div>
          </v-card-text>
        </v-card>
      </div>
      <div v-else class="text-center text-body-2 pa-4">
        Enter an amount to see conversions
      </div>
    </v-card-text>

    <!-- Settings Dialog -->
    <v-dialog v-model="showSettings" max-width="400">
      <v-card>
        <v-card-title>Currency Settings</v-card-title>
        <v-card-text>
          <v-select
            v-model="selectedCurrencies"
            :items="availableCurrencies"
            label="Select Currencies to Display"
            multiple
            chips
            closable-chips
            :rules="[v => v.length <= 6 || 'Maximum 6 currencies']"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="showSettings = false"
          >Done</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { ref, watch } from 'vue'
import axios from 'axios'

export default {
  name: 'MultiCurrencyPanel',
  props: {
    amount: {
      type: Number,
      required: true
    },
    sourceCurrency: {
      type: String,
      required: true
    }
  },
  emits: ['update:sourceCurrency'],
  setup(props, { emit }) {
    const showSettings = ref(false)
    const selectedCurrencies = ref(['EUR', 'TRY', 'USD', 'CAD'])
    const exchangeRates = ref({})
    const convertedAmounts = ref({})

    // Ensure TRY and other currencies are available
    const getAvailableCurrencies = () => {
      return [
        'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'TRY',
        'KRW', 'SGD', 'HKD', 'MXN', 'BRL'
      ].filter(currency => {
        return currency === 'TRY' || currency !== props.sourceCurrency;
      });
    }

    // Recalculate available currencies when source changes
    const availableCurrencies = ref(getAvailableCurrencies());

    const updateRates = async () => {
      try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${props.sourceCurrency}`)
        exchangeRates.value = response.data.rates
        calculateConversions()
      } catch (error) {
        console.error('Error fetching exchange rates:', error)
      }
    }

    const calculateConversions = () => {
      selectedCurrencies.value.forEach(currency => {
        if (exchangeRates.value[currency]) {
          convertedAmounts.value[currency] = props.amount * exchangeRates.value[currency]
        }
      })
    }

    const formatAmount = (amount) => {
      return amount ? amount.toFixed(2) : '0.00'
    }

    const formatRate = (rate) => {
      return rate ? rate.toFixed(4) : '0.0000'
    }
    
    // Function to swap a destination currency with source currency
    const swapWithSource = (currency) => {
      // Add current source to selected currencies if it's not already there
      if (!selectedCurrencies.value.includes(props.sourceCurrency)) {
        selectedCurrencies.value.push(props.sourceCurrency);
      }
      
      // Remove the new source from selected currencies
      selectedCurrencies.value = selectedCurrencies.value.filter(c => c !== currency);
      
      // Emit event to update source currency in parent component
      emit('update:sourceCurrency', currency);
    }

    watch(() => props.amount, calculateConversions)
    
    watch(() => props.sourceCurrency, () => {
      // Update available currencies when source changes
      availableCurrencies.value = getAvailableCurrencies();
      updateRates();
    })
    
    watch(selectedCurrencies, calculateConversions)

    // Initial rates fetch
    updateRates()

    return {
      showSettings,
      selectedCurrencies,
      availableCurrencies,
      exchangeRates,
      convertedAmounts,
      formatAmount,
      formatRate,
      swapWithSource
    }
  }
}
</script>

<style scoped>
.currency-panel {
  max-height: 400px;
  display: flex;
  flex-direction: column;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1;
  background: inherit;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.currency-panel-content {
  overflow-y: auto;
  flex-grow: 1;
  padding: 8px;
}

.currency-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
}

.currency-card {
  transition: all 0.3s ease;
}

.currency-card.clickable {
  cursor: pointer;
}

.currency-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.swap-hint {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 4px;
  opacity: 0.6;
}

/* Custom scrollbar styles */
.currency-panel-content::-webkit-scrollbar {
  width: 6px;
}

.currency-panel-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.currency-panel-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.currency-panel-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style> 