import CesiumScenes from './cesium_scenes.json5';
import CesiumScenesPro from './cesium_scenes_pro.json5';
import MapTools from './maptool.json5';


const env = import.meta.env.VITE_APP_ENV
export const getCesiumScenes = () => {
  if(env === 'PRODUCTION'){
    return CesiumScenesPro;
  }else{
    return CesiumScenes;
  }
}
export const getMapTools = () => {
  return MapTools;
}


