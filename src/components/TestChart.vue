data() {
    return {
      selectedMinIndex: 0,
      selectedMaxIndex: 0
    }

/* Zeit-Range Slider Styles */
.time-range-slider {
  margin: 20px 0 30px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.85em;
  color: #6c757d;
}

.range-slider-container {
  position: relative;
  height: 40px;
  margin-bottom: 15px;
}

.range-slider {
  position: absolute;
  width: 100%;
  height: 6px;
  background: transparent;
  -webkit-appearance: none;
  appearance: none;
  pointer-events: none;
  border-radius: 3px;
}

.range-slider::-webkit-slider-track {
  width: 100%;
  height: 6px;
  background: #ddd;
  border-radius: 3px;
}

.range-slider::-moz-range-track {
  width: 100%;
  height: 6px;
  background: #ddd;
  border-radius: 3px;
  border: none;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #007bff;
  cursor: pointer;
  pointer-events: all;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.range-slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #007bff;
  cursor: pointer;
  pointer-events: all;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.range-slider:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

.range-slider:focus::-moz-range-thumb {
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

.range-min::-webkit-slider-thumb {
  background: #28a745;
}

.range-min::-moz-range-thumb {
  background: #28a745;
}

.range-max::-webkit-slider-thumb {
  background: #dc3545;
}

.range-max::-moz-range-thumb {
  background: #dc3545;
}

.selected-range {
  text-align: center;
  font-size: 0.9em;
  color: #495057;
  background: white;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}
  },
  mounted() {
    this.initializeSlider()
  },
  watch: {
    data: {
      handler() {
        this.initializeSlider()
      },
      immediate: true
    }
  },<template>
  <div class="timeline-chart">
    <h2>{{ title }}</h2>
    
    <!-- Zeit-Range Slider -->
    <div class="time-range-slider">
      <div class="slider-labels">
        <span class="slider-label">{{ formatDate(minDate) }}</span>
        <span class="slider-label">{{ formatDate(maxDate) }}</span>
      </div>
      <div class="range-slider-container">
        <input
          type="range"
          class="range-slider range-min"
          :min="0"
          :max="dateRange.length - 1"
          v-model="selectedMinIndex"
          @input="updateTimeRange"
        />
        <input
          type="range"
          class="range-slider range-max"
          :min="0"
          :max="dateRange.length - 1"
          v-model="selectedMaxIndex"
          @input="updateTimeRange"
        />
      </div>
      <div class="selected-range">
        <strong>Ausgewählter Zeitraum:</strong> 
        {{ formatDate(selectedMinDate) }} - {{ formatDate(selectedMaxDate) }}
      </div>
    </div>

    <Bar
      :data="filteredChartData"
      :options="chartOptions"
      :height="350"
    />
  </div>
</template>

<script>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import 'chartjs-adapter-date-fns'
import { de } from 'date-fns/locale'

// Chart.js Komponenten registrieren
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default {
  name: 'TimelineChart',
  components: {
    Bar
  },
  props: {
    title: {
      type: String,
      default: 'Zeitleiste'
    },
    data: {
      type: Array,
      default: () => [
        { x: '2024-01-01', y: 10 },
        { x: '2024-02-15', y: 25 },
        { x: '2024-04-10', y: 15 },
        { x: '2024-06-20', y: 35 },
        { x: '2024-08-05', y: 28 },
        { x: '2024-10-12', y: 42 },
        { x: '2024-12-25', y: 38 }
      ]
    },
    backgroundColor: {
      type: String,
      default: 'rgba(54, 162, 235, 0.6)'
    },
    borderColor: {
      type: String,
      default: 'rgba(54, 162, 235, 1)'
    },
    timeUnit: {
      type: String,
      default: 'month'
    },
    label: {
      type: String,
      default: 'Zeitverlauf'
    }
  },
  computed: {
    // Sortierte und eindeutige Daten für den Slider
    dateRange() {
      return [...this.data]
        .sort((a, b) => new Date(a.x) - new Date(b.x))
        .map(item => item.x)
    },
    
    minDate() {
      return this.dateRange[0] || new Date().toISOString().split('T')[0]
    },
    
    maxDate() {
      return this.dateRange[this.dateRange.length - 1] || new Date().toISOString().split('T')[0]
    },
    
    selectedMinDate() {
      return this.dateRange[this.selectedMinIndex] || this.minDate
    },
    
    selectedMaxDate() {
      return this.dateRange[this.selectedMaxIndex] || this.maxDate
    },
    
    // Gefilterte Daten basierend auf Slider-Auswahl
    filteredData() {
      const minDate = new Date(this.selectedMinDate)
      const maxDate = new Date(this.selectedMaxDate)
      
      return this.data.filter(item => {
        const itemDate = new Date(item.x)
        return itemDate >= minDate && itemDate <= maxDate
      })
    },
    
    filteredChartData() {
      return {
        datasets: [{
          label: this.label,
          data: this.filteredData,
          backgroundColor: this.backgroundColor,
          borderColor: this.borderColor,
          borderWidth: 1,
          barThickness: 'flex',
          maxBarThickness: 40,
          categoryPercentage: 0.8,
          barPercentage: 0.9,
          borderRadius: 4
        }]
      }
    },
    chartData() {
      return this.filteredChartData
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false
          },
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: ${context.parsed.y}`
              },
              title: (tooltipItems) => {
                const date = new Date(tooltipItems[0].parsed.x)
                return date.toLocaleDateString('de-DE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              }
            }
          }
        },
        interaction: {
          mode: 'index',
          intersect: false
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: this.timeUnit,
              minUnit: 'day',
              displayFormats: {
                day: 'dd.MM',
                month: 'MMM yyyy',
                year: 'yyyy'
              }
            },
            adapters: {
              date: {
                locale: de
              }
            },
            title: {
              display: true,
              text: 'Zeit'
            },
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Werte'
            },
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        }
      }
    }
  },
  methods: {
    initializeSlider() {
      if (this.dateRange.length > 0) {
        this.selectedMinIndex = 0
        this.selectedMaxIndex = this.dateRange.length - 1
      }
    },
    
    updateTimeRange() {
      // Stelle sicher, dass Min nicht größer als Max ist
      if (this.selectedMinIndex > this.selectedMaxIndex) {
        if (this.selectedMinIndex !== this.selectedMaxIndex) {
          // Tausche die Werte
          const temp = this.selectedMinIndex
          this.selectedMinIndex = this.selectedMaxIndex
          this.selectedMaxIndex = temp
        }
      }
      
      // Emit das gefilterte Ergebnis
      this.$emit('range-changed', {
        minDate: this.selectedMinDate,
        maxDate: this.selectedMaxDate,
        filteredData: this.filteredData
      })
    },
    
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      })
    },
    addDataPoint(date, value) {
      const newData = [...this.data, { x: date, y: value }]
      // Sortiere nach Datum
      newData.sort((a, b) => new Date(a.x) - new Date(b.x))
      this.$emit('update:data', newData)
    },
    clearData() {
      this.$emit('update:data', [])
    }
  }
}
</script>

<style scoped>
.timeline-chart {
  width: 100%;
  height: 500px;
  padding: 20px;
  box-sizing: border-box;
}

.timeline-chart h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 1.5em;
  text-align: center;
}
</style>