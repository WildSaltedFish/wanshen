<template>
  <div ref="radarChart" style="width: 100%; height: 400px;"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  props: {
    primaryColor: {
      type: String,
      default: '#4566d1'
    },
    secondaryColor: {
      type: String,
      default: 'rgb(69, 183, 209)'
    },
    indicators: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    bgColors: {
      type: Array,
      default: () => [
        'rgba(69, 102, 209, 0.06)',
        'rgba(69, 183, 209, 0.08)',
        'rgba(69, 102, 209, 0.04)'
      ]
    },
    areaOpacity: {
      type: Number,
      default: 0.3,
      validator: value => value >= 0 && value <= 1
    }
  },

  mounted() {
    this.initChart();
  },

  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  },

  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.radarChart);

      const option = {
        radar: {
          shape: 'circle',
          indicator: this.indicators,
          axisLine: {
            lineStyle: {
              color: 'rgba(125, 155, 255, 0.3)',  // 降低轴线对比度
              type: 'dotted'  // 改为点状虚线
            }
          }
          },
          splitArea: {
            areaStyle: {
              color: [
                'rgba(180, 200, 255, 0.15)',  // 最外层透明度提高
                'rgba(180, 200, 255, 0.1)',   // 中间层透明度
                'rgba(180, 200, 255, 0.05)',  // 最内层接近透明
              ],
              type: 'radial',
              opacity: 0.08  // 整体降低透明度
            }
          },
        series: [{
          type: 'radar',
          data: this.data,
          areaStyle: {
            color: this.secondaryColor + '4D'
          },
          lineStyle: {
            color: this.primaryColor
          },
          itemStyle: {
            color: this.primaryColor
          }
        }]
      };

      this.chart.setOption(option);
      window.addEventListener('resize', this.handleResize);
    },

    handleResize() {
      this.chart.resize();
    }
  }
};
</script>
