function GradientSVG() {
    const gradientTransform = `rotate(130)`;
    return (
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
                <linearGradient id="gradientColor" x1="0%" y1="0%" x2="40%" y2="0%" gradientTransform={gradientTransform}>

                    <stop offset="0" stopColor="#89c73e" />

                    <stop offset="0.14285714285714285" stopColor="#a8d539" />

                    <stop offset="0.2857142857142857" stopColor="#cce236" />

                    <stop offset="0.42857142857142855" stopColor="#eee833" />

                    <stop offset="0.5714285714285714" stopColor="#f1bf2b" />

                    <stop offset="0.7142857142857143" stopColor="#ea7e1e" />

                    <stop offset="0.8571428571428571" stopColor="#d9401b" />

                    <stop offset="1" stopColor="#c21e2b" />

                </linearGradient>

            </defs>
        </svg>
    );
}

export default GradientSVG;
