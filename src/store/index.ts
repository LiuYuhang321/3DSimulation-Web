import { createStore, createLogger } from 'vuex'
import states from "@/store/states";
import actions from "@/store/actions";
import mutations from "@/store/mutations";
import getters from "@/store/getters";
import basemap from "@/store/modules/basemap";
import maptool from "@/store/modules/maptool";

const debug = import.meta.env.VITE_APP_TITLE !== 'production'

export default createStore({
    state: states,
    getters: getters,
    //根级别的 action
    actions: actions,
    //根级别的 mutation
    mutations: mutations,
    //模块
    modules: {
        basemap,
        maptool
    },
    strict: debug,
    /*plugins: debug ? [createLogger()] : []*/
})


