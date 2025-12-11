export default {
    getDikuaiDetailData(state){
        return state.showDikuaiDetailData;
    },
    getDikuaiCompareData(state){
        return state.showDikuaiCompareData;
    },
    getPeripheralStatisticsData(state){
        return state.showPeripheralStatisticsData;
    },
    getPeripheralQueryData(state) {
        return state.showPeripheralQueryData
    },
    getDikuaiPointList(state){
        return state.dikuaiPointList;
    },
    getWindowResize(state){
        return state.windowResize;
    }
}
