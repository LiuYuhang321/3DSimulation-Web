import axios from "axios";

export function getArcgisData(url,callback){
    axios.get(url).then(res=>{
        if(res.status === 200){
            if(callback && typeof callback === 'function'){
                callback(res.data)
            }
        }
    })
}

const isClockWise = (latLngArr) =>{
    if (latLngArr.length < 3) {
        return null
    }
    if (latLngArr[0] === latLngArr[latLngArr.length - 1]) {
        latLngArr = latLngArr.slice(0, latLngArr.length - 1)
    }
    let latMin = { i: -1, val: 90 }
    for (let i = 0; i < latLngArr.length; i++) {
        let lat = latLngArr[i][1]
        if (lat < latMin.val) {
            latMin.val = lat
            latMin.i = i
        }
    }
    let i1 = (latMin.i + latLngArr.length - 1) % latLngArr.length
    let i2 = latMin.i
    let i3 = (latMin.i + 1) % latLngArr.length

    let v2_1 = {
        lat: latLngArr[i2][1] - latLngArr[i1][1],
        lng: latLngArr[i2][0] - latLngArr[i1][0]
    }
    let v3_2 = {
        lat: latLngArr[i3][1] - latLngArr[i2][1],
        lng: latLngArr[i3][0] - latLngArr[i2][0]
    }
    let result = v3_2.lng * v2_1.lat - v2_1.lng * v3_2.lat
    // result>0 3-2在2-1的顺时针方向 result<0 3-2在2-1的逆时针方向 result==0 3-2和2-1共线，可能同向也可能反向
    return result === 0 ? (latLngArr[i3][0] < latLngArr[i1][0]) : (result > 0)
}

const getDataByRings = (rings, type, attributes,checkClockWise)=>{
    let res = [];
    let clockWise;
    let coordinates = [];
    let holes = [];
    rings.forEach((ring,index)=>{
        if(checkClockWise){
            clockWise = isClockWise(ring);
        }else{
            clockWise = true;
        }
        if(clockWise){
            if(coordinates.length > 0){
                res.push({
                    polygon: coordinates,
                    holes: holes,
                    props: {type: type, data: attributes}
                })
                coordinates = [];
                holes = [];
            }
            ring.forEach(c=>{
                coordinates.push(c[0])
                coordinates.push(c[1])
            })
        }else{
            const hole = []
            ring.forEach(c=>{
                hole.push(c[0])
                hole.push(c[1])
            })
            holes.push(hole)
        }
    })
    if(coordinates.length > 0){
        res.push({
            polygon: coordinates,
            holes: holes,
            props: {type: type, data: attributes}
        })
    }
    return res;
}

const getDataByGeojson = (coordinates, type, attributes)=>{
    let res = [];
    let _coordinates = [];
    let holes = [];
    coordinates.forEach((ring,index)=>{
        if(index === 0){
            ring.forEach(c=>{
                _coordinates.push(c[0])
                _coordinates.push(c[1])
            })
        }else{
            const hole = []
            ring.forEach(c=>{
                hole.push(c[0])
                hole.push(c[1])
            })
            holes.push(hole)
        }
    })
    if(_coordinates.length > 0){
        res.push({
            polygon: _coordinates,
            holes: holes,
            props: {type: type, data: attributes}
        })
    }
    return res;
}

export function getPolygonArray(data, type){
    if(data.geometryType === 'esriGeometryPolygon'){
        let polygonArray = [];
        if(data.geometry){
            polygonArray.push(...getDataByRings(data.geometry.rings,type, data.attributes, data.checkClockWise));
        }else if(data.features){
            data.features.forEach(item=>{
                polygonArray.push(...getDataByRings(item.geometry.rings,type,item.attributes,data.checkClockWise))
            })
        }
        return polygonArray;
    }else if(Array.isArray(data)){
        let polygonArray = [];
        data.forEach(item=>{
            polygonArray.push(...getPolygonArray(item, type));
        })
        return polygonArray;
    }
    return null;
}

export function getPolygonArrayFromGeojson(geojson, type){
    let polygonArray = [];
    geojson.features.forEach(item=>{
        let coordinates = item.geometry.coordinates;
        polygonArray.push(...getDataByGeojson(coordinates,type,item.properties))
    })
    return polygonArray;
}


