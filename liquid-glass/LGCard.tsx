import { ReactNode } from "react";

type Props = {
    p?: string;
    children: ReactNode;
};

export default function LGCard({ children, p = "p-6" }: Props) {
    return (
        <>
            <div className="relative font-semibold overflow-hidden rounded-2xl shadow-lg flex items-center justify-center gap-2 w-full">
                {/* Glass effect layer */}
                <div
                    className="absolute inset-0 z-0 backdrop-blur-[3px] overflow-hidden isolate"
                    style={{ filter: "url(#glass-distortion)" }}
                ></div>

                {/* Tint layer */}
                <div className="absolute inset-0 z-10 bg-black/10"></div>

                {/* Shine layer */}
                <div className="absolute inset-0 z-20 overflow-hidden rounded-2xl shadow-[inset_2px_2px_1px_0_rgba(255,255,255,0.2),inset_-1px_-1px_1px_1px_rgba(255,255,255,0.2)]"></div>

                {/* Content layer */}
                <div className="z-30 text-2xl text-black w-full">
                    <div
                        className={`flex items-center justify-center gap-2 w-full rounded-2xl ${p}`}
                    >
                        {children}
                    </div>
                </div>
            </div>

            {/* SVG Filter - keeping this unchanged as it's not convertible to Tailwind */}
            <svg style={{ display: "none" }}>
                <filter
                    id="glass-distortion"
                    x="0%"
                    y="0%"
                    width="100%"
                    height="100%"
                    filterUnits="objectBoundingBox"
                >
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.01 0.01"
                        numOctaves="1"
                        seed="5"
                        result="turbulence"
                    />

                    <feComponentTransfer in="turbulence" result="mapped">
                        <feFuncR
                            type="gamma"
                            amplitude="1"
                            exponent="10"
                            offset="0.5"
                        />
                        <feFuncG
                            type="gamma"
                            amplitude="0"
                            exponent="1"
                            offset="0"
                        />
                        <feFuncB
                            type="gamma"
                            amplitude="0"
                            exponent="1"
                            offset="0.5"
                        />
                    </feComponentTransfer>

                    <feGaussianBlur
                        in="turbulence"
                        stdDeviation="3"
                        result="softMap"
                    />

                    <feSpecularLighting
                        in="softMap"
                        surfaceScale="5"
                        specularConstant="1"
                        specularExponent="100"
                        lighting-color="white"
                        result="specLight"
                    >
                        <fePointLight x="-200" y="-200" z="300" />
                    </feSpecularLighting>

                    <feComposite
                        in="specLight"
                        operator="arithmetic"
                        k1="0"
                        k2="1"
                        k3="1"
                        k4="0"
                        result="litImage"
                    />

                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="softMap"
                        scale="150"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </svg>
        </>
    );
}
