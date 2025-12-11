import {getCesiumScenes} from "@/config/cesium/index"
import {httpGetJSON} from "@/api";

const scenesMap = new Map();

const CesiumData = {
    landPolygons: []
}

const layerTree = new Map();

export function initCesium(type: String) {
    const cesiumScenes = getCesiumScenes();

    cesiumScenes[type].layers.forEach(item => {
        let layer = null;
        switch (item.type) {
            case "imageLayer": {
                layer = cf3d.addImageLayer(item.layer);
                break;
            }
            case "3dtiles": {
                layer = cf3d.add3Dtiles(item.layer);
                break;
            }
            case "s3m": {
                cf3d.addS3mTilesByPlugin(item.layer.url, item.layer.sceneName, item.layer.options,
                    (s3mLayer) => {
                        if (scenesMap.has(type)) {
                            scenesMap.get(type).push({config: item, layer: s3mLayer})
                        } else {
                            scenesMap.set(type, [{config: item, layer: s3mLayer}])
                        }
                    })
                break;
            }
            case "gltf": {
                layer = cf3d.addGltf(item.layer);
                break;
            }
        }
        if (layer) {
            if (scenesMap.has(type)) {
                scenesMap.get(type).push({config: item, layer: layer})
            } else {
                scenesMap.set(type, [{config: item, layer: layer}])
            }
        }
    })
}

export function switchBaseLayer(type) {
    if (!scenesMap.has(type)) {
        initCesium(type)
    } else {
        scenesMap.get(type).forEach(item => {
            if (item.config.type === 's3m') {
                item.layer.visible = true
            } else {
                item.layer.show = true;
            }
        })
    }
    scenesMap.forEach((value, key) => {
        if (key !== type) {
            value.forEach(item => {
                if (item.config.type === 's3m') {
                    item.layer.visible = false
                } else {
                    item.layer.show = false;
                }
            })
        }
    })
}

export const flyToViewpoint = (vp: Object) => {
    cf3d.flyTo(vp);
}

export const switchMode = (is3D: boolean) => {
    if (is3D) {
        cf3d.to3D()
        console.log("转成3D")
    } else {
        cf3d.to2D()
        console.log("转成2D")
    }
}

export const startDraw = ({type, callback}) => {
    cf3d.drawAction({
        type: type,
        style: {
            color: "#FFFFFF",
            opacity: 0,
            clampToGround: true,
            outline: true,
            outlineWidth: 3,
            outlineColor: '#ffff00',
            outlineOpacity: 0.5,
            show: false,
        },
        callback: (d) => {
            if (callback && typeof callback === 'function') {
                callback(d);
            }
        }
    });
}

export const clearDraw = () => {
    cf3d.clearDraw();
}

export const changeLayerTree = (item, checked) => {
    if (!item.mapInfo) return;
    if (checked) {
        if (!layerTree.has(item.id)) {
            if (typeof item.mapInfo === 'string') {
                httpGetJSON(item.mapInfo).then(res => {
                    addLayerFromLayerTree(item, res)
                })
            } else if (typeof item.mapInfo === 'object') {
                addLayerFromLayerTree(item, item.mapInfo)
            }
        }
    } else {
        if (layerTree.has(item.id)) {
            removeLayerFromLayerTree(item);
            layerTree.delete(item.id);
        }
    }
}

export const addLayerFromLayerTree = (item, layerData) => {
    switch (layerData.type) {
        case 'geojson': {
            let layer = cf3d.addGeoJsonLayer(layerData.data);
            layerTree.set(item.id, {
                layerConfig: layerData,
                layer: layer
            })
            break;
        }
        case '3dtiles': {
            let layer = cf3d.add3Dtiles(layerData.data);
            layerTree.set(item.id, {
                layerConfig: layerData,
                layer: layer
            })
            break;
        }
        case 'gltf': {
            let layer = cf3d.addGltf(layerData.data);
            layerTree.set(item.id, {
                layerConfig: layerData,
                layer: layer
            })
            break;
        }
        case 'imageLayer': {
            let layer = cf3d.addImageLayer(layerData.data);
            layerTree.set(item.id, {
                layerConfig: layerData,
                layer: layer
            })
            break;
        }
        default: {
            return;
        }
    }
}

export const removeLayerFromLayerTree = (item) => {
    if (layerTree.has(item.id)) {
        const {layer, layerConfig} = layerTree.get(item.id);
        switch (layerConfig.type) {
            case 'geojson': {
                cf3d.removeGeoJsonLayer(layer);
                break;
            }
            case '3dtiles': {
                cf3d.removePrimitive(layer);
                break;
            }
            case 'gltf': {
                cf3d.removePrimitive(layer);
                break;
            }
            case 'imageLayer': {
                cf3d.removeImageLayer(layer);
                break;
            }
            default: {
                return;
            }
        }
        layerTree.delete(item.id)
    }
}

export const removeAllLayerFromTree = () => {
    layerTree.forEach((value, key) => {
        const {layer, layerConfig} = value;
        switch (layerConfig.type) {
            case 'geojson': {
                cf3d.removeGeoJsonLayer(layer);
                break;
            }
            case '3dtiles': {
                cf3d.removePrimitive(layer);
                break;
            }
            case 'gltf': {
                cf3d.removePrimitive(layer);
                break;
            }
            case 'imageLayer': {
                if (layerConfig.data.type === 'arcgis-mars3d') {
                    cf3d.removeMars3dImageLayer(layer);
                } else {
                    cf3d.removeImageLayer(layer);
                }

                break;
            }
            default: {
                return;
            }
        }
    })
    layerTree.clear();
}

export const showPointsIconOnMap = (points) => {
    if (!points.length || points.length === 0) return;
    let layer = cf3d.createGraphicLayer();
    cf3d.addBillBoardByMars3D(points, layer)
    return layer;
}

export const removePointsFromMap = (pointLayer) => {
    cf3d.removeGraphicLayer(pointLayer);
}

export const lookAt = (lng, lat) => {
    cf3d.flyToPoint({
        lng: lng,
        lat: lat,
        range: 1000
    })
}

export const changeThreeDTileAlpha = (type, alpha) => {
    const cesiumScenes = getCesiumScenes();
    if (!cesiumScenes[type]) return;

    if (scenesMap.has(type)) {
        scenesMap.get(type).forEach(item => {
            if (item.config.type === '3dtiles') {
                item.layer.style = new Cesium.Cesium3DTileStyle({color: "color('rgba(255,255,255," + alpha + ")')"});
            }
        })
    }
}

export const clipTileset = (latLngArr) => {
    scenesMap.forEach((value, key) => {
        value.forEach(item => {
            if (item.config.type === '3dtiles') {
                cf3d.clippingTilset(item.layer, latLngArr, {bottom: 0, top: null});
            }
        })
    })
}

export const clearClip = () => {
    scenesMap.forEach((value, key) => {
        value.forEach(item => {
            if (item.config.type === '3dtiles') {
                cf3d.clearClipTilset(item.layer);
            }
        })
    })
}

export const setTilesetStyle = (type, style) => {
    scenesMap.get(type).forEach(item => {
        console.log('=================setTilesetStyle', style, item);
        if (item.config.type === '3dtiles') {
            if (style) {
                item.layer.style = new Cesium.Cesium3DTileStyle(style);
            } else {
                item.layer.style = undefined;
            }
        }
    })
}

export const setGltfStyle = (type, color) => {
    scenesMap.get(type).forEach(item => {
        if (item.config.type === 'gltf') {
            item.layer.color = Cesium.Color.fromCssColorString(color)
        }
    })
}



