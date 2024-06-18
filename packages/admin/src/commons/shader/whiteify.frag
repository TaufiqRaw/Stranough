in vec2 vTextureCoord;
in vec4 vColor;

uniform sampler2D uTexture;

void main(void)
{
    vec4 fg = texture2D(uTexture, vTextureCoord);

    gl_FragColor = vec4(1.0, 1.0, 1.0, texture2D(uTexture, vTextureCoord).a);
}