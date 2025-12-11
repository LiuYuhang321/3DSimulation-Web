<template>
   <charts :options="options" ref="chart" />
</template>

<script setup>
import { ref, watch,onMounted} from "vue";
import Charts from "@/components/Charts/Chart.vue";
import * as echarts from "echarts";

const props = defineProps({
  data: {
    type: Number,
  },
});

const chart = ref("chart");

const innerCircle_outLineColor = new echarts.graphic.RadialGradient(
    0,
    0.5,
    0.8,
    [
        {
            offset: 0.5,
            color: '#00FFFF',
        },
        {
            offset: 1,
            color: '#1597F7',
        },
    ],
    false
);
const innerCircler_PaddingColor = new echarts.graphic.RadialGradient(
    0.5,
    0.5,
    0.8,
    [
        {
            offset: 0,
            color: '#4978EC',
        },
        {
            offset: 0.5,
            color: '#1E2B57',
        },
        {
            offset: 1,
            color: '#141F3D',
        },
    ],
    false
);
const poniterColor = new echarts.graphic.RadialGradient(
    0,
    0.5,
    0.8,
    [
        {
            offset: 0,
            color: '#43EA80',
        },
        {
            offset: 0.5,
            color: '#38F8D4',
        },
        {
            offset: 1,
            color: '#38F8D4',
        },
    ],
    false
);

var rich = {
    bule: {
        fontSize: 10,
        fontFamily: 'DINBold',
        color: '#fff',
        fontWeight: '700',
    },
    radius: {
        width: 40,
        height: 20,
        lineHieght: 80,
        borderWidth: 2,
        borderColor: '#0092F2',
        fontSize: 15,
        color: '#fff',
        backgroundColor: '#1B215B',
        borderRadius: 30,
        textAlign: 'center',
    },
    size: {
        height: 400,
    },
};


const options = ref(
 {
    tooltip: {
        formatter: '{a} <br/>{b} : {c}%',
    },
    series: [
        {
            name: '最外部进度条',
            z: 100,
            type: 'gauge',
            radius: '100%',
            startAngle: 90,
            // [100 25 50 75] 上右下左
            endAngle: -269.9999,
            splitNumber: 8,
            axisLine: {
                lineStyle: {
                    color: [
                        [
                            1,
                            new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                {
                                    offset: 0,
                                    color: '#00D7E2',
                                },
                                {
                                    offset: 0.8,
                                    color: '#1597F7',
                                },
                                {
                                    offset: 1,
                                    color: '#00D7E2',
                                },
                            ]),
                        ],
                        [1, 'rgba(28,128,245,.0)'],
                    ],
                    width: 5,
                },
            },
            axisLabel: {
                show: true,
                color: '#fff',
                fontWeight: '700',
                fontSize: '10',
                distance: 10,
                // 来向、去向
                formatter: function (value) {
                    switch (value) {
                        case 100:
                            return 'N';
                        case 25:
                            return 'E';
                        case 50:
                            return 'S';
                        case 75:
                            return 'W';
                    }
                },
            },
            axisTick: {
                show: false,
            },
            splitLine: {
                show: true,
                length: 6,
                distance: 0,
                lineStyle: {
                    color: '#086DFF',
                },
            },
            itemStyle: {
                show: false,
            },

            data: [
                {
                    name: '方位角',
                    value: props.data,
                },
            ],
            title: {
                //标题
                show: false,
            },
            rich: rich,
            detail: {
                formatter: function (value) {
                    let name = '方位角';
                    var num = `${Math.round(value)}°`;
                    return '{bule|' + name + '}' + '\n{radius|' + num + '}';
                },
                rich: rich,
                offsetCenter: ['0%', '0%'],
            },
            pointer: {
                show: false,
            },
            animationDuration: 4000,
        },
        {
            name: '内部圈',
            type: 'gauge',
            colorBy: 'series',
            z: 2,
            splitNumber: 0,
            startAngle: 90,
            endAngle: -269.9999,
            radius: '40%',
            axisLine: {
                lineStyle: {
                    color: [[1, innerCircle_outLineColor]],
                    width: 8,
                    shadowColor: '#00FFFF',
                    shadowBlur: 6,
                    shadowOffsetX: 0,
                },
            },
            tooltip: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            splitLine: {
                show: false,
            },
            itemStyle: {
                show: false,
            },
            detail: {
                show: false,
            },
            title: {
                //标题
                show: false,
            },
            min: 0,
            max: 360,
            data: [
                {
                    name: 'title',
                    value:props.data,
                },
            ],
            // 指针颜色
            itemStyle: {
                normal: {
                    color: poniterColor,
                },
            },
            // 指针
            pointer: {
                show: true,
                offsetCenter: [0, '-100%'],
                length: '100%',
                radius: '20%',
                width: 5, //指针粗细
            },
            animationDuration: 500,
        },
    
    ],
});

watch(
  () => props.data,(val)=>{
    let newval = val
    options.value.series[0].data[0].value = newval;
    options.value.series[1].data[0].value =  newval;
    chart.value.setOption();
    
  })


</script>
<style scoped lang='scss'>
</style>