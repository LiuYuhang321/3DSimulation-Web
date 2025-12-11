import {getModulesConfig} from "@/config/module";
import store from "@/store";
import {flyToViewpoint, switchMode} from "@/utils/CesiumUtil";

const modulesConfig = getModulesConfig();

export const initModule = (routePath) => {
    store.dispatch('basemap/changeMaptools', routePath);
    store.dispatch('basemap/changeLegend', routePath);

    let moduleConfig = {};
    Object.assign(moduleConfig, modulesConfig['default']);
    if (modulesConfig.hasOwnProperty(routePath)) {
        Object.assign(moduleConfig, modulesConfig[routePath]);
    }
    if (moduleConfig.baseLayerType) {
        store.dispatch('basemap/changeBaseMapType', moduleConfig.baseLayerType)
    }

    store.dispatch('basemap/changeLayerTree', moduleConfig.layerTree)

    if (moduleConfig.viewpoint) {
        flyToViewpoint(moduleConfig.viewpoint);
    }
}

export const flyToByModule = (routePath: any) => {
    if (modulesConfig.hasOwnProperty(routePath)) {
        if (modulesConfig[routePath].viewpoint) {
            flyToViewpoint(modulesConfig[routePath].viewpoint);
        } else if (modulesConfig['default'].viewpoint) {
            flyToViewpoint(modulesConfig['default'].viewpoint);
        }
    }
}


