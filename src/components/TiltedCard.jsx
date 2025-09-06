// src/components/TiltedCard.jsx
import { useRef, useState, useMemo } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

const springValues = {
    damping: 30,
    stiffness: 100,
    mass: 2,
};

export default function TiltedCard({
                                       imageSrc,
                                       altText = 'Tilted card image',
                                       captionText = '',
                                       containerHeight = 'auto',   // natural height unless you need fixed
                                       containerWidth = '100%',
                                       imageHeight,                // optional: if provided, overrides responsive sizing
                                       imageWidth,                 // optional: if provided, overrides responsive sizing
                                       // NEW: responsive sizing controls
                                       aspectRatio = 1,            // e.g. 1 (square), 16/9, 4/3, 3/4
                                       minWidth = 180,             // px
                                       maxWidth = 420,             // px
                                       vwWidth = 40,               // % of viewport width used in clamp's middle value
                                       scaleOnHover = 1.1,
                                       rotateAmplitude = 14,
                                       showMobileWarning = true,
                                       showTooltip = false,
                                       overlayContent = null,
                                       displayOverlayContent = false,
                                   }) {
    const ref = useRef(null);

    // Mouse tracking for tooltip and tilt
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useSpring(useMotionValue(0), springValues);
    const rotateY = useSpring(useMotionValue(0), springValues);
    const scale = useSpring(1, springValues);
    const opacity = useSpring(0);

    const rotateFigcaption = useSpring(0, {
        stiffness: 350,
        damping: 30,
        mass: 1,
    });

    const [lastY, setLastY] = useState(0);

    // Compute responsive width via clamp(); height flows from aspect-ratio
    const responsiveWidth = useMemo(() => {
        // If user provided explicit width, just return it as-is
        if (imageWidth) return imageWidth;
    return `clamp(${minWidth}px, ${vwWidth}dvw, ${maxWidth}px)`;
    }, [imageWidth, minWidth, vwWidth, maxWidth]);

    const hasFixedHeight = Boolean(imageHeight);

    function handleMouse(e) {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

        rotateX.set(rotationX);
        rotateY.set(rotationY);

        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);

        const velocityY = offsetY - lastY;
        rotateFigcaption.set(-velocityY * 0.6);
        setLastY(offsetY);
    }

    function handleMouseEnter() {
        scale.set(scaleOnHover);
        opacity.set(1);
    }

    function handleMouseLeave() {
        opacity.set(0);
        scale.set(1);
        rotateX.set(0);
        rotateY.set(0);
        rotateFigcaption.set(0);
    }


    // Native touch event handlers for robust scroll prevention


    // Only show tilt effect on non-mobile devices
    const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (isMobile) {
        return (
            <figure
                className="relative w-full flex flex-col items-center touch-none"
                style={{ width: containerWidth, height: containerHeight }}
            >
                <img
                    src={imageSrc}
                    alt={altText}
                    className="object-cover rounded-[15px]"
                    style={{ width: '100%', height: '100%', borderRadius: '15px' }}
                />
                {captionText && (
                    <div
                        className="absolute left-1/2 bottom-[-10px] pointer-events-none px-2 py-1 text-[12px] sm:text-[13px] font-medium text-white rounded-md bg-black/60 backdrop-blur shadow-md z-[3]"
                        style={{ transform: 'translateX(-50%) translateZ(56px)' }}
                    >
                        {captionText}
                    </div>
                )}
            </figure>
        );
    }
    return (
        <figure
            ref={ref}
            className="relative w-full [perspective:1000px] flex flex-col items-center touch-none"
            style={{ width: containerWidth, height: containerHeight }}
            onMouseMove={handleMouse}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Tilted / zooming image container */}
            <motion.div
                className="relative [transform-style:preserve-3d]"
                style={{
                    // If explicit sizes were provided, use them. Otherwise be responsive.
                    width: responsiveWidth,
                    // With fixed height, respect it; otherwise let aspect-ratio handle height.
                    height: hasFixedHeight ? imageHeight : 'auto',
                    // Only apply aspect-ratio when height isn't fixed
                    aspectRatio: hasFixedHeight ? undefined : aspectRatio,
                    rotateX,
                    rotateY,
                    scale,
                }}
            >
                <img
                    src={imageSrc}
                    alt={altText}
                    className="absolute inset-0 object-cover rounded-[15px] [backface-visibility:hidden]"
                    style={{
                        // Let the img fill its parent box
                        width: '100%',
                        height: '100%',
                        // Ensure rounded corners apply to the image content
                        borderRadius: '15px',
                    }}
                />

                {displayOverlayContent && overlayContent && (
                    <div className="absolute inset-0 z-[2] [transform-style:preserve-3d]">
                        {overlayContent}
                    </div>
                )}

                {/* Floating, bottom-centered title WITH 3D (inherits parent tilt) */}
                {captionText && (
                    <div
                        className="
              absolute left-1/2 bottom-[-10px]
              pointer-events-none
              px-2 py-1 text-[12px] sm:text-[13px] font-medium text-white
              rounded-md bg-black/60 backdrop-blur
              shadow-md
              [transform-style:preserve-3d] [backface-visibility:hidden]
              z-[3]
            "
                        style={{
                            transform: 'translateX(-50%) translateZ(56px)',
                        }}
                    >
                        {captionText}
                    </div>
                )}
            </motion.div>

            {/* Optional mouse-follow tooltip (independent of the floating label) */}
            {showTooltip && (
                <motion.div
                    className="pointer-events-none absolute left-0 top-0 rounded-[4px] bg-white px-[10px] py-[4px] text-[10px] text-[#2d2d2d] opacity-0 z-[10] hidden sm:block"
                    style={{ x, y, opacity, rotate: rotateFigcaption }}
                >
                    {captionText}
                </motion.div>
            )}

            {/* Optional mobile warning */}
            {showMobileWarning && (
                <div className="absolute top-2 text-center text-[10px] block sm:hidden">
                    This effect is not optimized for mobile. Check on desktop.
                </div>
            )}
        </figure>
    );
}
