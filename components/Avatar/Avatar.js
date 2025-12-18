import { useAnimations } from '@react-three/drei';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { useEffect, useRef } from 'react';
import { useAvatarContext } from '@/context/useAvatarContext';
import * as THREE from 'three';
import { blendShapesMap } from './constants';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module';

export default function Avatar({ avatarPath, animationName, setIsAvatarLoaded, ...props }) {

    const groupRef = useRef();
    const { audio, blendFrames } = useAvatarContext();
    const { gl, camera } = useThree();

    const { scene, animations } = useLoader(
        GLTFLoader,
        avatarPath ? `${process.env.WEB_URL}/api/proxy?url=${encodeURIComponent(avatarPath)}` : "",
        (loader) => {
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('three/examples/jsm/libs/draco/');
            loader.setDRACOLoader(dracoLoader);
            loader.setMeshoptDecoder(MeshoptDecoder);
        },
    );

    const { actions } = useAnimations(animations, scene);

    // Set tone mapping
    useEffect(() => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1;
    }, [gl]);


    useEffect(() => {
        if (!scene) return;

        scene.updateMatrixWorld();

        const box = new THREE.Box3().setFromObject(scene);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());
        scene.position.sub(center);

        camera.near = size / 100;
        camera.far = size * 100;
        camera.updateProjectionMatrix();
        camera.lookAt(center)


        resetMorphTargets(scene, 1);
        setIsAvatarLoaded(true);
    }, [scene]);



    // Head look
    // useFrame((state) => {
    //     scene.lookAt(state.camera.position);
    // });

    // play animations
    useEffect(() => {
        const action = actions[animationName];
        if (!action) return;


        // Fade out all other actions
        for (let key in actions) {
            if (key !== animationName) actions[key].fadeOut(0.5);
        }

        action.reset().fadeIn(0.5).play();

    }, [animationName, actions]);

    // Play audio useeffect
    useEffect(() => {
        if (!audio) return;
        // setTimeout(() => {
        audio.play();
        // }, 500);
    }, [audio]);


    // Lip-sync frame application
    useFrame((_, delta) => {

        if (!audio || audio.paused || audio.ended || blendFrames?.length === 0) return;

        const currentTime = audio.currentTime;


        const currentFrame = blendFrames.find(
            (frame) =>
                currentTime >= frame.timeCode &&
                currentTime < frame.timeCode + 0.016 // assuming 60 FPS
        );

        // resetMorphTargets(scene, 0.5);

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

            // const name = rawName.charAt(0).toLowerCase() + rawName.slice(1);
            // lerpMorphTarget(
            //     scene,
            //     name,
            //     currentFrame[key],
            //     1
            // );
        }


    });

    return (
        <group
            castShadow={true}
            receiveShadow={true}
            ref={groupRef}
            dispose={null}
            {...props}
        >
            <primitive object={scene} />
        </group>
    );
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



//Smooth lip-sync not yet tested...
// useFrame(() => {
//     if (!audio || audio.paused || audio.ended || !blendFrames?.length) return;

//     const fps = 60; // or 30, depending on your export
//     const frameIndex = Math.floor(audio.currentTime * fps);

//     const prev = blendFrames[Math.max(0, frameIndex)];
//     const next = blendFrames[Math.min(blendFrames.length - 1, frameIndex + 1)];

//     // interpolate between prev & next
//     const t = (audio.currentTime * fps) - frameIndex;
//     const interpolated = {};

//     for (const key in prev) {
//         if (!key.startsWith("blendShapes.")) continue;
//         interpolated[key] = THREE.MathUtils.lerp(prev[key], next[key], t);
//     }

//     // apply to morph targets
//     for (const key in interpolated) {
//         const rawName = key.replace("blendShapes.", "");
//         const keyName = rawName.charAt(0).toLowerCase() + rawName.slice(1);
//         const target = blendShapesMap?.[keyName];
//         if (!target) continue;
//         lerpMorphTarget(scene, target, interpolated[key], 1);
//     }
// });
