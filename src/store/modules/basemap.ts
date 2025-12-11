import {getMapTools} from "@/config/cesium";
import {getModulesConfig} from "@/config/module";
import {changeThreeDTileAlpha, switchBaseLayer} from "@/utils/CesiumUtil";
import {removeAllLayerFromTree} from "@/utils/LayerTreeUtil";


const modulesConfig = getModulesConfig();

const state = () => ({
    baseMapType: null,
    maptools: [],
    legend: null,
    threeDTilesAlpha: 1,
    drawObject: null,
    layerTree: null,
    showPanorama: null,
    practicePointData: null
})

const getters = {
    getMaptools(state){
        return state.maptools;

    },
    getLegend(state){
        return state.legend;
    },
    getBaseMapType(state){
        return state.baseMapType;
    },
    getShowAlphaController(state){
        return state.showAlphaController;
    },
    getDrawObject(state){
        return state.drawObject;
    },
    getLayerTree(state){
        return state.layerTree;
    },
    getPanorama(state){
        return state.showPanorama;
    },
    getPracticePointData(state){
        return state.practicePointData;
    }
}

const actions = {
    changeMaptools({ commit }, routePath){
        if(!modulesConfig.hasOwnProperty(routePath)) {
            commit('updateMaptools',[])
            return;
        }
        const maptools = getMapTools();
        let tools = modulesConfig[routePath]['maptools']
        if(tools && tools.length > 0){
            const _tools = []
            tools.forEach(id=>{
                maptools.forEach(item=>{
                    if(id === item.id){
                        _tools.push(item)
                    }
                })
            })
            commit('updateMaptools',_tools)
        }else{
            commit('updateMaptools',[])
        }

    },
    changeLegend({ commit }, routePath){
        if(!modulesConfig.hasOwnProperty(routePath)) {
            commit('updateLegend',null)
            return;
        }
        let legend = modulesConfig[routePath]['legend']
        if(legend){
            commit('updateLegend',legend)
        }else{
            commit('updateLegend',null)
        }
    },
    changeBaseMapType({commit }, type){
        switchBaseLayer(type);
        commit('updateBaseMapType',type)
    },
    changeThreeDTilesAlpha({commit }, {type,alpha}){
        changeThreeDTileAlpha(type,alpha)
        commit('updateThreeDTilesAlpha',alpha)
    },
    changeLayerTree({commit }, layerTree){
        removeAllLayerFromTree();
        commit('updateLayerTree', layerTree)
    }
}

const mutations = {
    updateMaptools(state, maptools){
        if(maptools){
            state.maptools = maptools;
        }else{
            state.maptools = [];
        }
    },
    updateLegend(state, legend){
        if(legend){
            state.legend = legend;
        }else{
            state.legend = null;
        }
    },
    updateBaseMapType(state, type){
        state.baseMapType = type;
    },
    updateThreeDTilesAlpha(state, alpha){
        state.threeDTilesAlpha = alpha;
    },
    updateDrawObject(state, obj){
        state.drawObject = obj;
    },
    updateLayerTree(state, layerTree){
        state.layerTree = layerTree;
    },
    updatePanorama(state, data){
        state.showPanorama = data;
    },
    updatePracticePointData(state, data){
        state.practicePointData = data;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
