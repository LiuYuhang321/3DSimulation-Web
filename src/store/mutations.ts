export default {
    updateDikuaiDetailData(state, data) {
        state.showDikuaiDetailData = data
    },
    updateDikuaiCompareData(state, data) {
        if (!data) {
            state.showDikuaiCompareData = []
        } else {
            state.showDikuaiCompareData = data
        }

    },
    updatePeripheralStatisticsData(state, data) {
        state.showPeripheralStatisticsData = data
    },
    updatePeripheralQueryData(state, data) {
        state.showPeripheralQueryData = data
    },

    updateDikuaiPointList(state, data) {
        state.dikuaiPointList = data
    },

    updateWindowResize(state) {
        state.windowResize = new Date().getTime()
    },
    updateisShow(state, data) {
        state.isShow = data
    },
    updatemoduledata(state, data) {
        state.moduledata = data
    },
    // updateEcharts(state, data) {
    //     state.Eisshow = data
    // },
    updateShowellipsoid(state, data) {
        state.showellipsoid = data
    },
    updateDistance(state, data) {
        state.distance = data
    },
    updateImage(state, data) {
        state.image = data
    },
    updatepointShow(state, data) {
        state.pointShow = data
    },
    updatepolylineShow(state, data) {
        state.polylineShow = data
    },
    updatepolygonShow(state, data) {
        state.polygonShow = data
    },
    updatetextShow(state, data) {
        state.textShow = data
    },
    updateLoginStates(state, data) {
        state.loginStates = data
    },
    updateshowNode(state, data) {
        state.showNode = data
    },
    //显示图层标注信息
    updateshowLayerLabel(state, data) {
        state.showLayerLabel = data
    },
    //图层树id
    updatecatalogueId(state, data) {
        state.catalogueId = data
    },
    //弹出图层组件
    updateshowPointDialog(state, data) {
        state.showPointDialog = data
    },
    updateshowPolylineDialog(state, data) {
        state.showPolylineDialog = data
    },
    updateshowPolygonDialog(state, data) {
        state.showPolygonDialog = data
    },
    updateshowTextDialog(state, data) {
        state.showTextDialog = data
    },
    //传出optionId
    updateoptionId(state, data) {
        state.optionId = data
    },

}
