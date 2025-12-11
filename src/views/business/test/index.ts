import {createThreeObject, addFBXModel, addGLTFModel, addOBJModel} from "@/utils/ThreejsUtil"
import {ApiConfig, httpRequest} from "@/api/index"

export const addModel = (container: any) => {
    const {scene, camera, orbitControls, renderer} = createThreeObject({
        container: container,
        cameraOptions: {
            position: [100, 100, 100],
            fov: 75,
            aspect: 1,
            near: 0.1,
            far: 2000
        },

        sceneOption: {
            background: "#a0a0a0"
        }
    })
    // addOBJModel('./data/obj/Model2.obj', scene, (object: any)=>{
    //     console.log('=========================addOBJModel Model.obj', object);
    //     renderer.render(scene, camera);
    // })

    // addGLTFModel('./data/gltf/Model.gltf', scene, (object: any) => {
    //     console.log('=========================addFBXModel 123.gltf', object);
    //     renderer.render(scene, camera);
    // })

    addFBXModel('./data/fbx/test01.FBX', scene, (object: any)=>{
        console.log('=========================addFBXModel 123.gltf', object);
        renderer.render(scene, camera);
    })


}
