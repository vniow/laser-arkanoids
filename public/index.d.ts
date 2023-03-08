declare const canvas: any;
declare const gl: any;
declare const vsSource = "\nattribute vec2 a_position;\nattribute vec3 a_color;\n\nuniform vec2 u_resolution;\n\nvarying vec3 v_color;\n\nvoid main() {\n  \n    // Convert the position from NDC to pixels\n    vec2 pixels = a_position * u_resolution;\n\n    // Convert the position from pixels to clip space\n    vec2 clipSpace = vec2((pixels.x / u_resolution.x) * 2.0 - 1.0, (pixels.y / u_resolution.y) * 2.0 - 1.0);\n    clipSpace.x *= u_resolution.x / u_resolution.y;\n\n    // Pass the color to the fragment shader\n    v_color = a_color;\n    // gl_PointSize = min(u_resolution.x, u_resolution.y) * 0.01;\n    gl_PointSize = 100.0;\n}\n\n";
declare const fsSource = "\n    precision mediump float;\n\n    varying vec3 v_color;\n\n    void main() {\n        gl_FragColor = vec4(v_color, 1);\n    }\n";
declare const vs: any;
declare const fs: any;
declare const program: any;
declare const positionLocation: any;
declare const colorLocation: any;
declare const resolutionLocation: any;
declare const buffer: any;
declare const vertexData: number[];
declare const size = 2;
declare const type: any;
declare const stride: number;
declare const offset = 0;
declare const colorOffset: number;
