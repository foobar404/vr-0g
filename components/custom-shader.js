// Star Nest shader by Pablo Roman Andrioli (MIT License)
// Adapted for A-Frame from Shadertoy

AFRAME.registerShader('galexy', {
    schema: {
        timeMsec: { type: 'time', is: 'uniform' }
    },

    vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: `
        #define iterations 17
        #define formuparam 0.53
        #define volsteps 20
        #define stepsize 0.1
        #define zoom 0.800
        #define tile 0.850
        #define speed 0.010
        #define brightness 0.0015
        #define darkmatter 0.300
        #define distfading 0.730
        #define saturation 0.850

        uniform float timeMsec;
        varying vec2 vUv;

        void main() {
            float iTime = timeMsec / 200000.0;
            vec2 iResolution = vec2(1.0, 1.0);
            vec2 fragCoord = vUv;
            
            // get coords and direction
            vec2 uv = fragCoord.xy / iResolution.xy - 0.5;
            uv.y *= iResolution.y / iResolution.x;
            vec3 dir = vec3(uv * zoom, 1.0);
            float time = iTime * speed + 0.25;
            
            // rotation (simplified, no mouse)
            float a1 = 0.5;
            float a2 = 0.8;
            mat2 rot1 = mat2(cos(a1), sin(a1), -sin(a1), cos(a1));
            mat2 rot2 = mat2(cos(a2), sin(a2), -sin(a2), cos(a2));
            dir.xz *= rot1;
            dir.xy *= rot2;
            vec3 from = vec3(1.0, 0.5, 0.5);
            from += vec3(time * 2.0, time, -2.0);
            from.xz *= rot1;
            from.xy *= rot2;
            
            // volumetric rendering
            float s = 0.1, fade = 1.0;
            vec3 v = vec3(0.0);
            for (int r = 0; r < volsteps; r++) {
                vec3 p = from + s * dir * 0.5;
                p = abs(vec3(tile) - mod(p, vec3(tile * 2.0)));
                float pa, a = pa = 0.0;
                for (int i = 0; i < iterations; i++) {
                    p = abs(p) / dot(p, p) - formuparam;
                    a += abs(length(p) - pa);
                    pa = length(p);
                }
                float dm = max(0.0, darkmatter - a * a * 0.001);
                a *= a * a;
                if (r > 6) fade *= 1.0 - dm;
                v += fade;
                v += vec3(s, s * s, s * s * s * s) * a * brightness * fade;
                fade *= distfading;
                s += stepsize;
            }
            v = mix(vec3(length(v)), v, saturation);
            gl_FragColor = vec4(v * 0.01, 1.0);
        }
    `
});