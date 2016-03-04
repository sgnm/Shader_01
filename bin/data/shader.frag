/*
  shader.frag
*/

uniform vec2 u_resolution; // 画面の解像度(width,height)
uniform float u_time; // 起動してからの経過時間(秒)

#define PI 3.14159265359

void main() {
vec3 light_color = vec3(0.2,0.8,0.6);
  
  float t = u_time*20.0;
  
  vec2 position = ( gl_FragCoord.xy -  u_resolution.xy * .5 ) / u_resolution.x;   

  float angle = atan(position.y, position.x)/(2.*PI);
  angle -= floor(angle);
  
  float rad = length(position);
  
  float color = 0.0;
  float brightness = 0.015;
  float speed = .3;
  
  for (int i = 0; i < 10; i++) {
    float angleRnd = floor(angle*7.)+1.; // 弧を7分割する. angleRnd -> 1 ~ 7
    float angleRnd1 = fract(angleRnd*fract(angleRnd*.7235)*45.1); // 弧ごとに値を振り分ける
    float angleRnd2 = fract(angleRnd*fract(angleRnd*.82657)*13.724); // 弧ごとに値を振り分ける
    float t = t*speed + angleRnd1*10.; // 弧ごとにスピードを変える
    float radDist = sqrt(angleRnd2+float(i)); // 弧ごと & ループするごとに値を振り分ける
    
    float adist = radDist / rad *.05; // 描画するべき半径距離を決定
    float dist = (t*.1+adist);
    dist = abs(fract(dist)-.5); // 無限ループさせる. dist -> 0. ~ 0.5
    color +=  (1.0 / (dist)) *(.05 / rad) * brightness; // dist = (t*1.5+adist)の時点で、小数点以下が0.5に近い領域が明るくなる
                     // (1.0 / dist) の箇所は、画面中央ほど変化が激しく、外側に行くほど変化がなだらかになる。
                    // 従って、画面外側の方が線が太くなり、遠近感があるように見える。
                    // (.05 / rad)t によって中央ほど明るくさせる
    angle = fract(angle+.61);
  }
  gl_FragColor =  vec4(color,color,color,1.0)*vec4(light_color,1.0);
}