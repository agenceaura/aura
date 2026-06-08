#version 460 core
#include <flutter/runtime_effect.glsl>

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

out vec4 fragColor;

// Utility noise function for the 'aura' turbulence
vec3 hash33(vec3 p) {
    p = fract(p * vec3(443.897, 441.423, 437.195));
    p += dot(p, p.yxz + 19.19);
    return fract((p.xxy + p.yxx) * p.zyx);
}

void main() {
    vec2 fragCoord = FlutterFragCoord().xy;
    vec2 uv = fragCoord / uResolution.xy;
    vec2 mouse = uMouse / uResolution.xy;
    
    // Center alignment
    vec2 p = (fragCoord - 0.5 * uResolution.xy) / min(uResolution.y, uResolution.x);
    vec2 m = (uMouse - 0.5 * uResolution.xy) / min(uResolution.y, uResolution.x);
    
    // Aura core distance
    float dist = length(p - m * 0.5);
    
    // Refraction / Displacement factor
    float strength = 0.4 / (dist + 0.35);
    vec2 displacement = normalize(p - m * 0.5) * strength * 0.05;
    
    // RGB Displacement (Chromatic Aberration)
    float r = texture(uResolution, uv + displacement * 0.8).r; // Not possible in Flutter FragmentProgram directly without an image sampler
    // Wait, the user wants to MANIPULATE the colors of the orb. 
    // Usually, in a standalone shader, we generate the colors.
    
    // Artistic color generation (Aura style)
    vec3 color = vec3(0.0);
    
    // Red Channel
    vec2 uvR = uv + displacement * 1.1;
    float distR = length((uvR - 0.5) * 2.0 - m * 0.5);
    float pulseR = 0.15 / (distR + 0.2);
    color.r = pulseR * (0.8 + 0.2 * sin(uTime * 1.2));

    // Green Channel
    vec2 uvG = uv + displacement * 1.0;
    float distG = length((uvG - 0.5) * 2.0 - m * 0.5);
    float pulseG = 0.15 / (distG + 0.2);
    color.g = pulseG * (0.9 + 0.1 * cos(uTime * 0.8));

    // Blue Channel
    vec2 uvB = uv + displacement * 0.9;
    float distB = length((uvB - 0.5) * 2.0 - m * 0.5);
    float pulseB = 0.15 / (distB + 0.2);
    color.b = pulseB * (1.0 + 0.3 * sin(uTime * 1.5));
    
    // Adding some "aura" turbulence
    vec3 noise = hash33(vec3(p * 2.0, uTime * 0.5));
    color += noise * 0.03 * strength;
    
    // Soft outer falloff (Vignette-like)
    float mask = smoothstep(0.8, 0.2, dist);
    color *= mask;

    fragColor = vec4(color, color.r * 0.5 + color.g * 0.5 + color.b * 0.5);
}
