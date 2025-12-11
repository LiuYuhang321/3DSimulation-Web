import { httpGetJSON } from "@/api";
const layerTree = new Map();

export const changeLayerTree = (item, checked) => {
    if(!item.mapInfo) return;
    if(checked){
        if(!layerTree.has(item.id)){
            if(typeof item.mapInfo === 'string'){
                httpGetJSON(item.mapInfo).then(res=>{
                    addLayerFromLayerTree(item,res)
                })
            }else if(typeof item.mapInfo === 'object'){
                addLayerFromLayerTree(item,item.mapInfo)
            }
        }
    }else{
        if(layerTree.has(item.id)){
            removeLayerFromLayerTree(item);
            layerTree.delete(item.id);
        }
    }
}

export const addLayerFromLayerTree = (item, layerData) => {
    switch (layerData.type){
        case 'geojson':{
            let layer = cf3d.addGeoJsonLayer(layerData.data);
            layerTree.set(item.id, {
                layerConfig: layerData,
                layer: layer
            })
            break;
        }
        case '3dtiles':{
            let layer = cf3d.add3Dtiles(layerData.data);
            layerTree.set(item.id, {
                layerConfig: layerData,
                layer: layer
            })
            break;
        }
        case 'gltf':{
            let layer = cf3d.addGltf(layerData.data);
            layerTree.set(item.id, {
                layerConfig: layerData,
                layer: layer
            })
            break;
        }
        case 'imageLayer':{
            let layer = cf3d.addImageLayer(layerData.data);
            layerTree.set(item.id, {
                layerConfig: layerData,
                layer: layer
            })
            break;
        }
        case 's3m':{
            cf3d.addS3mTilesByPlugin(layerData.data.url,layerData.data.sceneName,layerData.data.options,(layer)=>{
                layerTree.set(item.id, {
                    layerConfig: layerData,
                    layer: layer
                })
            })
        }
        default:{
            return;
        }
    }
}

export const removeLayerFromLayerTree = (item) => {
    if(layerTree.has(item.id)){
        const { layer, layerConfig } = layerTree.get(item.id);
        switch (layerConfig.type) {
            case 'geojson':{
                cf3d.removeGeoJsonLayer(layer);
                break;
            }
            case '3dtiles':{
                cf3d.removePrimitive(layer);
                break;
            }
            case 'gltf':{
                cf3d.removePrimitive(layer);
                break;
            }
            case 'imageLayer':{
                if(layerConfig.data.type === 'arcgis-mars3d'){
                    cf3d.removeMars3dImageLayer(layer);
                }else{
                    cf3d.removeImageLayer(layer);
                }

                break;
            }
            case 's3m':{
                cf3d.removeS3mLayer(layer);
                break;
            }
            default:{
                return;
            }
        }
        layerTree.delete(item.id)
    }
}


export const removeAllLayerFromTree = ()=>{
    layerTree.forEach((value,key)=>{
        const { layer, layerConfig } = value;
        switch (layerConfig.type) {
            case 'geojson':{
                cf3d.removeGeoJsonLayer(layer);
                break;
            }
            case '3dtiles':{
                cf3d.removePrimitive(layer);
                break;
            }
            case 'gltf':{
                cf3d.removePrimitive(layer);
                break;
            }
            case 'imageLayer':{
                if(layerConfig.data.type === 'arcgis-mars3d'){
                    cf3d.removeMars3dImageLayer(layer);
                }else{
                    cf3d.removeImageLayer(layer);
                }

                break;
            }
            default:{
                return;
            }
        }
    })
    layerTree.clear();
}

export function clickTreeNode(node){
    if(layerTree.has(node.id)){
        cf3d.flyToObject(layerTree.get(node.id).layer);
    }
}

export function changeLayerOpacity(opacity, node){
    console.log('=============================changeLayerOpacity',opacity, node)
    if(node.mapInfo && layerTree.has(node.id)){
        if(node.mapInfo.type === '3dtiles'){
            layerTree.get(node.id).layer.style= new Cesium.Cesium3DTileStyle({color: "color('rgba(255,255,255,"+opacity+")')"});
        }else{
            layerTree.get(node.id).layer.alpha = opacity
        }
    }
}