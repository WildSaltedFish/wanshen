<template>
  <div ref="chartRef" class="echarts-bar-container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  options: {
    type: Object,
    default: () => ({})
  },
  primary: {
    type: String,
    default: '#4566d1'
  },
  secondary: {
    type: String,
    default: 'rgb(69, 183, 209)'
  }
})

const chartRef = ref(null)
let chartInstance = null

const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

const updateChart = () => {
  const defaultOptions = {
    title: {
      text: '数据统计',
      left: 'center',
      textStyle: {
        color: props.primary
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: props.primary,
      borderWidth: 1,
      textStyle: {
        color: props.primary
      }
    },
    xAxis: {
      type: 'category',
      axisLine: {
        lineStyle: {
          color: props.primary
        }
      },
      axisLabel: {
        color: props.primary
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: props.primary
        }
      },
      axisLabel: {
        color: props.primary
      },
      splitLine: {
        lineStyle: {
          color: [props.secondary + '20']
        }
      }
    },
    series: [{
      type: 'bar',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: props.primary },
          { offset: 1, color: props.secondary }
        ]),
        borderRadius: [4, 4, 0, 0]
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: props.primary + '80'
        }
      }
    }],
    grid: {
      containLabel: true,
      left: '5%',
      right: '5%',
      bottom: '10%'
    }
  }

  const finalOptions = echarts.util.merge(
      { dataset: { source: props.data } },
      defaultOptions,
      props.options
  )

  chartInstance.setOption(finalOptions)
}

const resizeChart = () => {
  chartInstance?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  chartInstance?.dispose()
})

watch(
    () => [props.data, props.options, props.primary, props.secondary],
    () => {
      updateChart()
      resizeChart()
    },
    { deep: true }
)
</script>

<style scoped>
.echarts-bar-container {
  width: 100%;
  height: 400px;
}
</style>
