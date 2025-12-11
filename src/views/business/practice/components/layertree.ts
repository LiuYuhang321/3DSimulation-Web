import store from "@/store/index";
import {ApiConfig, httpRequest} from "@/api";

const loadedLayerMap = new Map();
let lastViewpoint = null;

const addItemLayer = (key,item)=> {
    if(!item) return;
    switch (item.type){
        case 'geojson':{
            if(loadedLayerMap.has(key)){
                loadedLayerMap.get(key).layer.push(cf3d.addGeoJsonLayer(item.layer));
            }
            break;
        }
        case '3dtiles':{
            if(loadedLayerMap.has(key)){
                loadedLayerMap.get(key).layer.push(cf3d.add3Dtiles(item.layer));
            }
            break;
        }
        case 'gltf':{
            if(loadedLayerMap.has(key)){
                loadedLayerMap.get(key).layer.push(cf3d.addGltf(item.layer));
            }
            break;
        }
        case 'imageLayer':{
            if(loadedLayerMap.has(key)){
                loadedLayerMap.get(key).layer.push(cf3d.addImageLayer(item.layer));
            }
            break;
        }
        case 'mars3d-thing':{
            if(loadedLayerMap.has(key)){
                loadedLayerMap.get(key).layer.push(cf3d.addMars3dThing(item.layer));
            }
            break;
        }
        default:{
            return;
        }
    }
}

const addLayerFromLayerTree = (key, nodeData) => {
    const { layerInfo } = nodeData;
    if(!layerInfo) return;
    if(Array.isArray(layerInfo)){
        layerInfo.forEach(item=>{
            addItemLayer(key, item);
        })
    }else{
        addItemLayer(key, layerInfo);
    }
    if(key.startsWith('005-') && loadedLayerMap.has(key)){
        loadedLayerMap.get(key).layer[0].on('click',(event)=>{
            lastViewpoint = {
                ...cf3d.viewer.camera.position,
                h: cf3d.viewer.camera.heading,
                p: cf3d.viewer.camera.pitch,
                r: cf3d.viewer.camera.roll
            };
            store.commit('basemap/updatePanorama',{props: event.czmObject.properties.getValue(), panoramaUrl: loadedLayerMap.get(key).node.panoramaUrl, show: false})
            let flyto = null;
            if(loadedLayerMap.get(key).node.viewpoint){
                flyto = loadedLayerMap.get(key).node.viewpoint;
            }else{
                flyto = {...cf3d.getPositionFromLnglat({...cf3d.getLnglatFromPosition(event.cartesian)}),
                    h: cf3d.viewer.camera.heading,
                    p: cf3d.viewer.camera.pitch,
                    r: cf3d.viewer.camera.roll
                }
            }
            cf3d.flyTo(flyto, ()=>{
                store.commit('basemap/updatePanorama',{props: event.czmObject.properties.getValue(), panoramaUrl: loadedLayerMap.get(key).node.panoramaUrl, show: true})
            });
        })
    }
    if(key.startsWith('003-') && loadedLayerMap.has(key)){
        loadedLayerMap.get(key).layer[0].on('click',(event)=>{
            store.commit('basemap/updatePracticePointData',event.czmObject.properties.getValue())
        })
    }
}

export const goLastviewPoint = () => {
    if(lastViewpoint){
        cf3d.flyTo(lastViewpoint);
        lastViewpoint = null;
    }
}

export const addLayerByKeys = (keys, nodes) =>{
    keys.forEach((key,index)=>{
        if(!loadedLayerMap.has(key)){
            loadedLayerMap.set(key, {node: nodes[index], layer: []})
            addLayerFromLayerTree(key, nodes[index]);
        }
    })
}

export const removeLayerByKeys = (keys) =>{
    keys.forEach(key=>{
        if(loadedLayerMap.has(key)){
            const node = loadedLayerMap.get(key);
            loadedLayerMap.delete(key);
            node.layer.forEach((item,index)=>{
                if(item){
                    const type = Array.isArray(node.node.layerInfo)?node.node.layerInfo[index].type:node.node.layerInfo.type
                    switch (type){
                        case 'geojson':{
                            cf3d.removeGeoJsonLayer(item);
                            break;
                        }
                        case '3dtiles':{
                            cf3d.removePrimitive(item);
                            break;
                        }
                        case 'gltf':{
                            cf3d.removePrimitive(item);
                            break;
                        }
                        case 'imageLayer':{
                            cf3d.removeImageLayer(item);
                            break;
                        }
                        case 'mars3d-thing':{
                            cf3d.removeMars3dThing(item);
                            break;
                        }
                        default:{
                            return;
                        }
                    }
                }
            })
        }
    })
}

export const setPositionToLayer = (key) => {
    if(loadedLayerMap.has(key)){
        const node = loadedLayerMap.get(key);
        /*if(key.startsWith('003-')){
            store.commit('basemap/updatePracticePointData',node.layer.properties.getValue());
        }*/
        if(node.layer){
            if(node.node.viewpoint){
                cf3d.flyTo(node.node.viewpoint);
            }else{
                switch (node.node.layerInfo.type){
                    case 'geojson':{
                        cf3d.flyToExtent({...node.layer[0].getRectangle(true), height: 0})
                        break;
                    }
                    case '3dtiles':{
                        cf3d.flyToObject(node.layer[0]);
                        break;
                    }
                    case 'gltf':{
                        cf3d.flyToObject(node.layer[0]);
                        break;
                    }
                    case 'imageLayer':{
                        cf3d.flyToObject(node.layer[0]);
                        break;
                    }
                    case 'mars3d-thing':{
                        //cf3d.removeMars3dThing(node.layer);
                        break;
                    }
                    default:{
                        return;
                    }
                }
            }
        }
    }
}


// get personal layers functions
const addPersonalTreeNodes = (key, nodedata) => {
    const {nodeDatas} = nodedata;
    if (!nodeDatas || nodeDatas[0] === undefined) return;
    let res = JSON.parse(JSON.stringify(nodeDatas[0]))
    // console.log(res)
    let ctx = JSON.parse(res.dataStyle)
    let obj = eval('(' + ctx + ')');
    console.log(obj)
    switch (nodeDatas[0].geo.type) {
        case 'Point' : {
            if (obj.type === 'Label') {
                if (loadedLayerMap.has(key)) {
                    loadedLayerMap.get(key).layer = cf3d.showMarks(obj.type, {
                        position: res.geo.coordinates,
                        style: {
                            text: obj.text,
                            font_family: obj.font_family,
                            font_size: obj.font_size,
                            color: obj.color,
                            visibleDepth: false,
                            scaleByDistance: obj.scaleByDistance,
                            scaleByDistance_far: obj.scaleByDistance_far,
                            scaleByDistance_farValue: obj.scaleByDistance_farValue,
                            scaleByDistance_near: obj.scaleByDistance_near,
                            scaleByDistance_nearValue: obj.scaleByDistance_nearValue,
                        }
                    })
                }
            } else {
                if (loadedLayerMap.has(key)) {
                    console.log(JSON.parse(JSON.stringify(nodeDatas[0].geo)))
                    loadedLayerMap.get(key).layer = cf3d.showMarks(nodeDatas[0].geo.type, {
                        position: res.geo.coordinates,
                        style: {
                            color: obj.color,
                            pixelSize: obj.pixelSize,
                            outline: true,
                            outlineColor: obj.outlineColor,
                            outlineWidth: obj.outlineWidth,
                            visibleDepth: false,
                            clampToGround: true
                        }
                    })
                }
            }
            break;
        }
        case 'LineString' : {
            if (loadedLayerMap.has(key)) {
                if (obj.materialType === 'LineFlow') {
                    loadedLayerMap.get(key).layer = cf3d.showMarks(nodeDatas[0].geo.type, {
                        positions: res.geo.coordinates,
                        style: {
                            clampToGround: obj.clampToGround,
                            width: obj.width,
                            depthFail: true,
                            materialType: obj.materialType,
                            materialOptions: {
                                color: obj.materialcolor,
                            }
                        }
                    })
                } else {
                    loadedLayerMap.get(key).layer = cf3d.showMarks(nodeDatas[0].geo.type, {
                        positions: res.geo.coordinates,
                        style: {
                            clampToGround: obj.clampToGround,
                            materialType: obj.materialType,
                            materialOptions: {
                                color: obj.materialcolor,
                                dashLength: obj.materialdashLength,
                            },
                            width: obj.width
                        }
                    })
                }
            }
            break;
        }
        case 'Polygon' : {
            if (loadedLayerMap.has(key)) {
                loadedLayerMap.get(key).layer = cf3d.showMarks(nodeDatas[0].geo.type, {
                    positions: res.geo.coordinates,
                    style: {
                        material: obj.material,
                        outline: true,
                        outlineWidth: obj.outlineWidth,
                        outlineColor: obj.outlineColor,
                        clampToGround: obj.clampToGround,
                        width: obj.width,
                        color: obj.color,
                    }
                })
            }
            break;
        }
        default: {
            return;
        }
    }
}

export const addPersonalLayerByKeys = (keys, nodes) => {
    keys.forEach((key, index) => {
        if (!loadedLayerMap.has(key)) {
            loadedLayerMap.set(key, {node: nodes[index], layer: null});
            addPersonalTreeNodes(key, nodes[index])
        }
    })
}

export const removePersonalLayerByKeys = (keys) => {
    keys.forEach(key => {
        if (loadedLayerMap.has(key)) {
            const node = loadedLayerMap.get(key);
            loadedLayerMap.delete(key);
            if (node.layer) {
                console.log(node.layer)
                cf3d.removeMarks(node.layer)
            }
        }
    })
}

//对图层树的数据重新排序
export const changeTreeData = (node: any, arg1: string, arg2: string) => {
    let nodeData = [];
    nodeData = node;
    nodeData.sort(Collate(arg1, arg2));
    let changeData = CollateChild(nodeData, arg1, arg2)
    return changeData
}

//排序方法
const Collate = (props1: any, props2: any) => {
    return (a: any, b: any) => {
        if (a[props1] === b[props1]) return a[props2] - b[props2];
        return a[props1] - b[props1]
    }
}

//对child重新排序
const CollateChild = (data: any, arg1: string, arg2: string) => {
    let changeData = []
    for (let i = 0; i < data.length; i++) {
        if (data[i].hasOwnProperty('child') && data[i].child !== null) {
            changeData = data[i].child.sort(Collate(arg1, arg2))
            CollateChild(data[i].child, arg1, arg2)
        }
    }
    return data
}
