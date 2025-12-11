<template>
    <sub-panel :title="'剖面线绘制'" @close="clearAll">
        <div class="elev-content">
            <n-button @click="measureSection">绘制</n-button>
            <br>
            <n-button @click="clear">清除</n-button>
        </div>
    </sub-panel>
    <div class="echatsView" v-show="EisShow">
        <main-panel :title="'剖面线分析'">
            <div id="echartsView1"></div>
        </main-panel>
    </div>
</template>

<script setup lang="ts">
import {measureSection, measureClear} from "../business/practice/components/maptools.ts";
import {NButton, NIcon} from "naive-ui"
import SubPanel from '@/components/panel/SubPanel.vue'
import MainPanel from '@/components/panel/MainPanel.vue'

import {h, nextTick, onMounted, ref, watch} from "vue"
import * as echarts from "echarts"

import {eventTarget} from "@/libs/cf3d/src";
import EditableInput from "@/components/form/EditableInput.vue";
import {TrashBinOutline} from "@vicons/ionicons5";

const emit = defineEmits(['close'])

let myChart1: echarts.ECharts
// 图表自适应
window.onresize = function () {
    myChart1.resize()
}
const graphicList = ref([{
    name: "test"
}]);

const columns = [
    {
        title: '名称',
        key: 'name',
        width: 200,
        render(row, index) {
            return h(EditableInput, {
                value: row.name,
                onUpdateValue(v) {
                    graphicList.value[index].name = v
                }
            })
        }
    },
    {
        title: '操作',
        key: 'actions',
        width: 100,
        render(row, index) {
            return h(
                NIcon,
                {
                    size: 'small',
                    title: '删除',
                    component: TrashBinOutline,
                    onClick: () => {
                    }
                },
                {default: () => 'Send Email'}
            )
        }
    }
];
const EisShow = ref(false)
const clearAll = () => {
    emit('close', '')
    measureClear();
    EisShow.value = false
    myChart1.clear()
}
const clear = () => {
    measureClear();
    EisShow.value = false
    myChart1.clear()

}
watch(EisShow, () => {
    if (EisShow.value == false) {
        measureClear();
        myChart1.clear()
    }
})
onMounted(() => {
    cf3d.addMeasure({
        label: {
            color: "#ffffff",
            font_family: "楷体",
            font_size: 20
        }
    });
    myChart1 = echarts.init(document.getElementById("echartsView1")!)

})
eventTarget.on("measureEnd", function (event: any) {
    EisShow.value = true
    nextTick(() => {
        setEchartsData(event)
    })
})
eventTarget.on("measureClick", function (event: any) {
    if (event.value) {
        nextTick(() => {
            setEchartsData(event.value)
        })
    }
})

function setEchartsData(data: any) {
    if (data == null || data.arrPoint == null) {
        return
    }
    const arrPoint = data.arrPoint
    let inhtml = ""

    const option = {
        grid: {
            left: 10,
            right: 40,
            bottom: 10,
            top: 40,
            containLabel: true
        },
        dataZoom: [
            {
                type: "inside",
                throttle: 50
            }
        ],
        tooltip: {
            trigger: "axis",
            formatter: (params: any) => {
                if (params.length === 0) {
                    cf3d.hideTipMarker()
                    return inhtml
                }

                const hbgd = params[0].value // 海拔高度
                const point = arrPoint[params[0].dataIndex] // 所在经纬度
                const result = cf3d.calculation(params[0])

                inhtml = `当前位置<br />
                      距起点：${result.len}<br />
                      海拔：<span style='color:${params[0].color};'>${result.hbgdStr}</span><br />
                      经度：${point.lng}<br />
                      纬度：${point.lat}`

                cf3d.showTipMarker(point, hbgd, inhtml)
                return inhtml
            }
        },
        xAxis: [
            {
                name: "行程",
                type: "category",
                nameTextStyle: {color: "rgb(255, 70, 131)"},
                boundaryGap: false,
                axisLine: {
                    show: true
                },
                axisLabel: {
                    show: true,
                    formatter: "{value} 米",
                    color: "#fff"
                },
                data: data.arrLen
            }
        ],
        yAxis: [
            {
                name: "高程",
                nameTextStyle: {color: "rgb(255, 70, 131)"},
                type: "value",
                min: getMinZ(arrPoint),
                axisLabel: {
                    formatter: "{value} 米",
                    color: "#fff"
                }
            }
        ],
        series: [
            {
                name: "高程值",
                type: "line",
                smooth: true,
                symbol: "none",
                sampling: "average",
                itemStyle: {
                    normal: {
                        color: "rgb(255, 70, 131)"
                    }
                },
                data: data.arrHB
            }
        ]
    }

    myChart1.setOption(option)
    myChart1.resize()
}

function getMinZ(arr: any) {
    let minz = "dataMin"
    if (arr == null || arr.length === 0) {
        return minz
    }

    minz = arr[0].alt
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].alt < minz) {
            minz = arr[i].alt
        }
    }
    return minz
}

</script>

<style scoped lang="scss">
* {
    margin: 0;
    padding: 0;
}

.elev-content {
    padding: 20px;
    display: flex;
    flex-direction: column;

}

.echatsView {
    position: fixed;
    z-index: 1;
    width: calc(100vw - 500px);
    bottom: 60px;
    right: 100px;
    left: 50%;
    transform: translateX(-50%);
}

#echartsView1 {
    height: 200px;
}


</style>
