import { useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { blendShapesMap } from "./constants";
import * as THREE from 'three';
import { getAsset, saveAsset } from "@/utils/assetDB";

export default function AvatarLoader({
    shadows = true,
    avatarPath,
    avatarId = null,
    animationName,
    onLoaded,
    isAudioPlaying = false,
    audioCtxRef = null,
    blendFramesRef = null,
    referenceTimestamp = null,
    nextPlayTime = null,
    scale = 1
}) {

    const [scene, setScene] = useState(null);
    const [animations, setAnimations] = useState([]);

    const { actions } = useAnimations(animations, scene);

    const { camera, size } = useThree();

    const groupRef = useRef(null);

    useEffect(() => {
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('three/examples/jsm/libs/draco/');
        loader.setDRACOLoader(dracoLoader);
        loader.setMeshoptDecoder(MeshoptDecoder);

        async function loadGLB() {
            let blob = await getAsset(avatarId);

            if (!blob) {
                console.log('Fetching from API');
                const res = await fetch(`${process.env.WEB_URL}/api/proxy?url=${encodeURIComponent(avatarPath)}`);
                blob = await res.blob();
                await saveAsset(avatarId, blob);
            } else {
                console.log('Loaded from assetDB');
            }

            const glbUrl = URL.createObjectURL(blob);

            loader.load(glbUrl, (gltf) => {
                const scene = gltf.scene || gltf.scenes[0];

                setAnimations(gltf.animations);

                scene.traverse((obj) => {
                    if (obj.isMesh) {
                        obj.castShadow = obj.receiveShadow = shadows
                        obj.material.envMapIntensity = 0.8
                    }
                })

                onLoaded?.(true);
                resetMorphTargets(scene, 1);

                // Compute bounding box
                const box = new THREE.Box3().setFromObject(scene);
                const size = new THREE.Vector3();
                box.getSize(size);
                const center = new THREE.Vector3();
                box.getCenter(center);

                // Center model at origin
                scene.position.sub(center);


                setScene(scene);

                // Add scene to group
                if (groupRef.current) {
                    groupRef.current.clear();
                    groupRef.current.add(scene);
                }
            });
        }

        loadGLB();

    }, [avatarPath, avatarId]);

    useEffect(() => {
        const aspect = size.width / size.height
        camera.position.z = aspect > 1 ? 2.5 : 5
        camera.updateProjectionMatrix()
    }, [size, camera]);


    useEffect(() => {
        const action = actions[animationName];
        if (!action) return;


        // Fade out all other actions
        for (let key in actions) {
            if (key !== animationName) actions[key].fadeOut(0.3);
        }

        action.reset().fadeIn(0.3).play();

    }, [animationName, actions]);



    useFrame((_, delta) => {

        if (!audioCtxRef?.current || blendFramesRef?.current?.length === 0 || !referenceTimestamp.current) return;

        // Normalize audio clock into server timeline
        const elapsed = audioCtxRef.current.currentTime - referenceTimestamp.current;

        const currentFrame = blendFramesRef.current.find(
            (frame) =>
                elapsed >= frame.timeCode &&
                elapsed < frame.timeCode + 0.016 // ~60fps window
        );

        if (!currentFrame) return;

        // Apply blendshapes
        for (const key in currentFrame) {
            if (!key.startsWith("blendShapes.")) continue;

            const rawName = key.replace("blendShapes.", "");

            const keyName = rawName?.charAt(0)?.toLowerCase() + rawName.slice(1);
            lerpMorphTarget(
                scene,
                blendShapesMap?.[keyName],
                currentFrame[key],
                1
            );
        }


    });


    // Head look
    // useFrame((state) => {
    //     state.scene.lookAt(state.camera.position);
    // });

    return <group scale={scale} ref={groupRef} />
}


const resetMorphTargets = (scene, speed = 0.1) => {
    if (!scene) return;

    scene.traverse((child) => {
        if (child.isSkinnedMesh && child.morphTargetDictionary) {

            for (const key in child.morphTargetDictionary) {
                const index = child.morphTargetDictionary[key];
                child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
                    child.morphTargetInfluences[index],
                    0,
                    speed
                );
            }
        }
    })
}

const lerpMorphTarget = (scene, target, value, speed = 0.1) => {
    if (!scene) return;

    scene.traverse((child) => {
        if (child.isSkinnedMesh && child.morphTargetDictionary) {
            const index = child.morphTargetDictionary[target];

            if (index === undefined || child.morphTargetInfluences[index] === undefined) return;

            child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
                child.morphTargetInfluences[index],
                value,
                speed
            );
            // }
        }
    });
}