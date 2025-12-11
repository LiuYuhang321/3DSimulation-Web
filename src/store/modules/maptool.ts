const state =()=>({
    toolItem: null,
    azimuth:null,
})

const getters = {
   gettoolItem(state){
    return state.toolItem;
   },
   getazimuth(state){
    return state.azimuth
   }
}

const actions = {
    changeToolitem({commit},toolItem){
        commit('updatedToolitem',toolItem)
    },
    changeazimuth({commit},toolItem){
        let FWJ = (360-(toolItem-45)+90)
        if(FWJ>360){
            FWJ = FWJ-360
        }
        commit('updatedazimuth',FWJ)
    }
}

const mutations = {
    updatedToolitem(state,toolItem) {
        state.toolItem = toolItem
    },
    updatedazimuth(state,azimuth) {
        state.azimuth = azimuth
    },
}

export default{
    namespace:true,
    state,
    getters,
    actions,
    mutations
}