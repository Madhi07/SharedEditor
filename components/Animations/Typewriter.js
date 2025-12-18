"use client";

import clsx from "clsx";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function Typewriter({
    content = "",
    showCursor = true,
    cursorContent = "|",
    className = "",
    cursorClassName = "",
    typingSpeed = 0.05,
    pauseTime = 1.5,
    repeat = -1,
    cursorBlinkSpeed = 0.6,
    deleteBeforeRepeat = false,
    onComplete = () => {},
}) {
    const textRef = useRef(null);
    const cursorRef = useRef(null);
    const timelineRef = useRef(null);

    useEffect(() => {
        if (!content) return;

        // 🔥 Import plugin only in browser
        import("gsap/TextPlugin").then(({ default: TextPlugin }) => {
            gsap.registerPlugin(TextPlugin);

            const blink = gsap.fromTo(
                cursorRef.current,
                { autoAlpha: 0 },
                {
                    autoAlpha: 1,
                    duration: cursorBlinkSpeed,
                    repeat: -1,
                    yoyo: true,
                    ease: "power1.inOut",
                }
            );

            const chars = content.length;
            const duration = chars * typingSpeed;

            const typeOnce = () => {
                const tl = gsap.timeline({
                    onComplete: () => {
                        onComplete();
                        if (repeat !== 0) {
                            gsap.delayedCall(pauseTime, () => {
                                if (deleteBeforeRepeat) {
                                    gsap.to(textRef.current, {
                                        text: "",
                                        duration: chars * typingSpeed * 0.5,
                                        ease: "power1.inOut",
                                        onComplete: typeOnce,
                                    });
                                } else {
                                    typeOnce();
                                }
                            });
                        }
                    },
                });

                tl.to(textRef.current, {
                    text: { value: content },
                    duration,
                    ease: "none",
                });

                timelineRef.current = tl;
            };

            typeOnce();

            return () => {
                blink.kill();
                timelineRef.current?.kill();
            };
        });
    }, [content]);

    return (
        <p className={clsx("inline-flex items-center", className)}>
            <span ref={textRef}></span>
            {showCursor && (
                <span ref={cursorRef} className={clsx("ml-[2px]", cursorClassName)}>
                    {cursorContent}
                </span>
            )}
        </p>
    );
}
