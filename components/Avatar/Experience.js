import { Canvas } from '@react-three/fiber';
import { Bounds, Center, OrbitControls } from '@react-three/drei';
import Avatar from './Avatar';
import { Fragment, useState } from 'react';
import { LuLoaderCircle } from 'react-icons/lu';
import Image from 'next/image';

export default function Experience({
    scale = [1, 1, 1],
    position = [0, 0, 0],
    rotation = [0.3, 0, 0],
    avatarPath = "",
    animationName = "A-Pose",
    thumbnail = null,
}) {

    const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);


    return (
        <Fragment>
            <Canvas
                shadows
                style={{
                    width: "100%",
                    height: "100%",
                    position: "relative"
                }}
                camera={{ fov: 60, near: 0.01, far: 1000 }}
            >
                <ambientLight intensity={0.3} color="#ffffff" />
                <directionalLight
                    castShadow
                    intensity={0.8 * Math.PI}
                    color="#ffffff"
                    position={[0.5, 0, 0.866]}
                />
                <OrbitControls
                    enableRotate={false}
                    enablePan={false}
                    enableZoom={false}
                />


                <Avatar
                    // scale={scale}
                    rotation={rotation}
                    // position={position}
                    avatarPath={avatarPath}
                    animationName={animationName}
                    setIsAvatarLoaded={setIsAvatarLoaded}
                />


            </Canvas>

            {!isAvatarLoaded && (
                <div className='absolute inset-0 flex items-center justify-center gap-2 bg-black/10 backdrop-blur overflow-hidden transition-all duration-300'>
                    <Image
                        src={thumbnail || ""}
                        width={1024}
                        height={1024}
                        quality={100}
                        alt={"Avatar Preview"}
                        className="w-auto h-[80%] relative"
                    />

                    <div className='inset-0 absolute bg-dark-bg-secondary/30 backdrop-blur-md z-10 flex items-center justify-center'>
                        <LuLoaderCircle className='size-6 animate-spin' />
                    </div>
                </div>
            )}

        </Fragment>
    );
}
