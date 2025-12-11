import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import  { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js"
import  { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import  { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"

export const createThreeObject = ({container, cameraOptions = {}, sceneOption = {}}) => {
    let _container = container as HTMLCanvasElement;
    if(typeof container === "string"){
        _container = document.getElementById(container) as HTMLCanvasElement;
    }
    console.log('==================createThreeObject',_container)
    if(!_container) return {};
    const {fov,aspect,near,far, position} = cameraOptions;
    const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
    if(position){
        camera.position.set(position[0],position[1],position[2])
    }
    const scene = new THREE.Scene();
    const {background,fog } = sceneOption;
    if(background){
        scene.background = new THREE.Color(background);
    }
    if(fog){
        scene.fog = new THREE.Fog(fog[0], fog[1], fog[2])
    }

    const light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    light.position.set( 0, 20, 0 );
    scene.add( light );
    const light2 = new THREE.DirectionalLight( 0xffffff );
    light2.position.set( 0, 20, 10 );
    light2.castShadow = true;
    scene.add( light2 );

    const renderer = new THREE.WebGLRenderer({ alpha: true, canvas: _container});
    renderer.setSize(300,400);
    renderer.render(scene, camera);
    const orbitControls = new OrbitControls(camera, _container);
    //orbitControls.enablePan = false;
    //orbitControls.enableRotate = false;
    orbitControls.update();
    orbitControls.addEventListener('change', ()=>{
        renderer.render(scene, camera);
    });
    return {scene, camera, orbitControls, renderer };
}

export const addFBXModel = (url, scene, callback) => {
    const loader = new FBXLoader();
    loader.load(url, (object) =>{
        object.traverse((mesh)=>{
            if(mesh.isMesh){
                mesh.receiveShadow = true;
                mesh.castShadow = true;
            }
        })
        scene.add(object);
        if(callback){
            callback(object);
        }
    })
}

export const addGLTFModel = (url, scene, callback) => {
    const loader = new GLTFLoader();
    loader.load(url, (object) =>{
        /*object.scene.traverse((mesh)=>{
            if(mesh.isMesh){
                mesh.frustumCulled = false;
                mesh.castShadow = true;
                mesh.material.emissive = mesh.material.color;
                mesh.material.emissiveMap = mesh.material.map;
            }
        })*/
        scene.add(object.scene);
        if(callback){
            callback(object);
        }
    })
}

export const addOBJModel = (url, scene, callback) => {
    const loader = new OBJLoader();
    loader.load(url, (object) =>{
        /*object.traverse((mesh)=>{
            if(mesh.isMesh){
                mesh.frustumCulled = false;
                mesh.castShadow = true;
                mesh.material.emissive = mesh.material.color;
                mesh.material.emissiveMap = mesh.material.map;
            }
        })*/
        scene.add(object);
        if(callback){
            callback(object);
        }
    })
}
