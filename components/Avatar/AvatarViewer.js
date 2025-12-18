import { Fragment, Suspense, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, useProgress } from '@react-three/drei'
import * as THREE from 'three';
import AvatarLoader from './AvatarLoader';
import Image from 'next/image';
import { LuLoaderCircle } from 'react-icons/lu';

export default function AvatarViewer({
    avatarId = null,
    avatarPath,
    avatarThumbnail = "",
    animationName,
    shadows = true,
    intensity = 1.0,
    blendFramesRef = null,
    audioCtxRef = null,
    referenceTimestamp = null,
    scale = 1,
    onLoaded,
    loaderSteps = []
}) {

    const ref = useRef();

    const [avatarLoaded, setAvatarLoaded] = useState(false);

    const handleAvatarLoaded = (loaded = false) => {
        setAvatarLoaded(loaded);
        onLoaded?.(loaded);
    }

    return (
        <Fragment>
            <Canvas
                gl={{ preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1 }}
                shadows
                dpr={[1, 1.5]}
                camera={{ position: [0, 0.5, 2.5], fov: 45 }}
            >
                <ambientLight intensity={0.3} color="#ffffff" />
                <directionalLight
                    intensity={0.8 * Math.PI}
                    color="#ffffff"
                    position={[0.5, 0, 0.866]}
                />
                <Suspense fallback={null}>
                    <Stage
                        controls={ref}
                        intensity={intensity}
                        contactShadow={true}
                        shadows={shadows}
                        adjustCamera={false}
                        environment={null}
                    >
                        <AvatarLoader
                            scale={scale}
                            shadows={shadows}
                            avatarId={avatarId}
                            avatarPath={avatarPath}
                            animationName={animationName}
                            onLoaded={handleAvatarLoaded}
                            audioCtxRef={audioCtxRef}
                            blendFramesRef={blendFramesRef}
                            referenceTimestamp={referenceTimestamp}
                        />

                    </Stage>
                </Suspense>
                <OrbitControls
                    ref={ref}
                    enablePan={true}
                    enableZoom={false}
                    enableRotate={false}
                />
            </Canvas>

            {(!avatarLoaded) && (
                <ThumbnailLoader
                    thumbnail={avatarThumbnail}
                    loaderSteps={loaderSteps}
                />
            )}
        </Fragment>
    )
}

const ThumbnailLoader = ({ thumbnail = "", loaderSteps = [] }) => {

    const { progress } = useProgress();

    const stepIndex = Math.min(Math.floor((progress / 100) * loaderSteps.length), loaderSteps.length - 1);

    return (
        <div className='absolute inset-0 z-20 flex items-center justify-center gap-2 backdrop-blur overflow-hidden transition-all duration-300'>
            {thumbnail && (
                <Image
                    src={thumbnail || ""}
                    width={1024}
                    height={1024}
                    quality={100}
                    alt={"Avatar Preview"}
                    className="w-auto h-[80%] relative"
                />
            )}
            <div className='inset-0 absolute backdrop-blur-md z-10 flex items-center justify-center flex-col transition-all duration-300 ease-in gap-2.5'>
                <LuLoaderCircle className='size-6 animate-spin text-secondary' />
                {loaderSteps?.length > 0 && (
                    <p className='text-dark-text-secondary font-[500] max-w-[70%]'>
                        {loaderSteps?.[stepIndex] || ""}
                    </p>
                )}
            </div>
        </div>
    )
}