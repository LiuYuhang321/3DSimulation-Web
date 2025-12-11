import {flyToByModule} from "@/utils/ModulesInit";
import router from "@/router";

let currentGraphic = null;

let distanceMesure = null;
let distanceSurMesure = null;
let areaMesure = null;
let surfaceMeasure = null;
//复位
export const reset = () => {
    flyToByModule(router.currentRoute.value.fullPath);
}
//23D转换
export const to2D = () => {
    cf3d.to2D();
}
export const to3D = () => {
    cf3d.to3D();
}

export const resetCompass = () => {
    cf3d.resetCompass();
}

//指北针开始旋转
export const startCompass = () => {
    cf3d.startCompass();
}
//指北针停止旋转
export const stopCompass = () => {
    cf3d.stopCompass();
}
//定点旋转
export const startRotate = () => {
    cf3d.startRotate();
}
//停止定点旋转
export const stopRotate = () => {
    cf3d.stopRotate();
}
//剖面分析
export const measureSection = () => {
    cf3d.measureSection();
}
//清除剖面
export const measureClear = () => {
    cf3d.measureClear();
    cf3d.hideTipMarker()
}
//添加参照物
export const CreateEllipsoid = (longitude, latitude, height, r, color) => {
    return cf3d.CreateEllipsoid(longitude, latitude, height, r, color)
}
//更改参照物属性
export const ChangeEllipsoid = (obj, longitude, latitude, height, r, color) => {
    cf3d.ChangeEllipsoid(obj, longitude, latitude, height, r, color)
}
//移除参照物
export const removeEntity = () => {
    cf3d.removeEllipsoid();
}
//移动参照物
export const moveEntity = (obj, r, callback) => {
    return cf3d.moveModel(obj, r, callback)
}
//移除移除参照物事件
export const removeSetmoveEntityAction = (obj) => {
    cf3d.removeSetmoveEntityAction(obj)
}
//打开编辑
export const openEdit = () => {
    cf3d.openEdit();
}
//关闭编辑
export const closeEdit = () => {
    cf3d.closeEdit();
}

//标记标记点
export const addMarkerPoint = (style, callback) => {
    //cf3d.startDrawGraphic('point');
    cf3d.drawAction({
        type: 'point',
        addHeight: 20,
        style: {...style, visibleDepth: false},
        callback: (graphic) => {
            currentGraphic = graphic;
            if (callback && typeof callback === "function") {
                callback(graphic.toGeoJSON());
            }
        }
    })
}

//标记图标点
export const addbillboard = (style, callback) => {
    //cf3d.startDrawGraphic('point');
    cf3d.drawAction({
        type: 'billboard',
        style: {...style, visibleDepth: false,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,},
        callback: (graphic) => {
            currentGraphic = graphic;
            if (callback && typeof callback === "function") {
                callback(graphic.toGeoJSON());
            }
        }
    })
}




export const updatePointStyle = (style) => {
    if (currentGraphic) {
        currentGraphic.entity.point.pointName = style.pointName;
        currentGraphic.entity.point.layerName = style.layerName;
        currentGraphic.entity.point.graphicType = style.graphicType;
        currentGraphic.entity.point.color = Cesium.Color.fromCssColorString(style.color);
        currentGraphic.entity.point.pixelSize = Number(style.pixelSize);
        currentGraphic.entity.point.outlineColor = Cesium.Color.fromCssColorString(style.outlineColor);
        currentGraphic.entity.point.outlineWidth = Number(style.outlineWidth);
    }
}
//标记线
export const addMarkerPolyline = (style, callback) => {
    cf3d.startDrawGraphics('polyline',style,(graphic) => {
        cf3d.clearDrawGraphic(graphic);
    })
    cf3d.drawActions({
        type: 'polylineP',
        style: {...style, 
        "distanceDisplayCondition": true,
        "distanceDisplayCondition_far": 8000,
        "distanceDisplayCondition_near": 0,
        "materialType": "LineFlow",
        "materialOptions": {
          "color":style.color,
          "image": "./assets/images/marker/arrow.png",
          "repeat": {
            "x": 100,
            "y": 1
          },
          "speed": 20}},
        callback: (graphic) => {
            console.log(graphic.toGeoJSON())
            currentGraphic = graphic;
            if (callback && typeof callback === "function") {
                callback(graphic.toGeoJSON());
            }
        }
    });

}

export const updatePolylineStyle = (style) => {
    if (currentGraphic) {
        currentGraphic.entity.polyline.width = Number(style.width);
        currentGraphic.entity.polyline.color = Cesium.Color.fromCssColorString(style.color);
        currentGraphic.entity.polyline.clampToGround = Boolean(style.clampToGround);
    }
}

//标记面
export const addMarkerPolygon = (style, callback) => {
    //cf3d.startDrawGraphic('polyline');
    cf3d.drawAction({
        type: 'polygon',
        style: {...style, outline: true},
        callback: (graphic) => {
            // console.log('=================================addMarkerPolygon', graphic);
            console.log(graphic.toJSON())
            currentGraphic = graphic;
            if (callback && typeof callback === "function") {
                callback(graphic.toGeoJSON());
            }
        }
    })
}

export const updatePolygonStyle = (style) => {
    if (currentGraphic) {
        currentGraphic.entity.polygon.name = style.name;
        currentGraphic.entity.polygon.layer = style.layer;
        currentGraphic.entity.polygon.styleType = style.styleType;
        currentGraphic.entity.polygon.material = Cesium.Color.fromCssColorString(style.material);
        currentGraphic.entity.polygon.fillColor = Cesium.Color.fromCssColorString(style.fillColor);
        currentGraphic.entity.polygon.outlineColor = Cesium.Color.fromCssColorString(style.outlineColor);
        currentGraphic.entity.polygon.outlineWidth = Number(style.outlineWidth);
        currentGraphic.entity.polygon.clampToGround = Boolean(style.clampToGround);
    }
}
//标记文本
export const addMarkerText = (style, callback) => {
    //cf3d.startDrawGraphic('point');
    cf3d.drawAction({
        type: 'label',
        addHeight: 20,
        style: {
            ...style,
            horizontalOrigin: 0,
            verticalOrigin: 1,
            visibleDepth: false,
            font: `${style.font_size}px sans-serif`
        },
        callback: (graphic) => {
            console.log(graphic.toJSON())
            currentGraphic = graphic;
            if (callback && typeof callback === "function") {
                callback(graphic.toGeoJSON());
            }
        }
    })
}

export const updateLabelStyle = (style) => {
    if (currentGraphic) {
        currentGraphic.entity.label.name = style.name;
        currentGraphic.entity.label.layer = style.layer;
        currentGraphic.entity.label.styleType = style.styleType;
        currentGraphic.entity.label.text = style.text;
        currentGraphic.entity.label.font = `${style.font_size}px sans-serif`;
        currentGraphic.entity.label.fillColor = Cesium.Color.fromCssColorString(style.color);
        currentGraphic.entity.label.scaleByDistance = Boolean(style.scaleByDistance);
        currentGraphic.entity.label.scaleByDistance_far = style.scaleByDistance_far
        currentGraphic.entity.label.scaleByDistance_farValue = style.scaleByDistance_farValue
        currentGraphic.entity.label.scaleByDistance_near = style.scaleByDistance_near
        currentGraphic.entity.label.scaleByDistance_nearValue = style.scaleByDistance_nearValue

        //currentGraphic.entity.label.backgroundColor = Cesium.Color.fromCssColorString(style.backgroundColor);

    }
}
//清除点线面标记
export const removeMarker = () => {
    currentGraphic = null;
    cf3d.clearDraw()
}


//测量直线距离
export const measureLength = (callback) => {
    cf3d.measureLength((val) => {
        console.log("量测结果", val)
        distanceMesure = val.distance
        if (callback && typeof callback === "function") {
            callback(distanceMesure);
        }
    });
}
//测量贴地距离
export const measureSurLength = (callback) => {
    cf3d.measureSurLength((val) => {
        console.log("量测结果", val)
        distanceSurMesure = val.distance
        if (callback && typeof callback === "function") {
            callback(distanceMesure);
        }
    });
}


//测量水平面积
export const measureArea = (callback) => {
    cf3d.measureArea((val) => {
        console.log("量测结果", val)
        areaMesure = val._measured.area
        console.log(areaMesure)
        if (callback && typeof callback === "function") {
            callback(areaMesure);
        }
    });
}
//测量贴地面积
export const measureSurface = (callback) => {
    cf3d.measureSurface((val) => {
        console.log("量测结果", val)
        surfaceMeasure = val._measured.area
        console.log(surfaceMeasure)
        if (callback && typeof callback === "function") {
            callback(surfaceMeasure);
        }
    });
}
//清除测量
export const clearMeasure = () => {
    cf3d.measureClear();
}
//截屏
export const screenShot = (callback) => {
    cf3d.screenShot(callback);
}
//全屏
export const fullScreen = () => {
    cf3d.enterFullScreen();
}
//退出全屏
export const cancelScreen = () => {
    cf3d.exitFullScreen();
}

export const getFullScreenStatus = () => {
    return cf3d.getFullScreenStatus();
}
