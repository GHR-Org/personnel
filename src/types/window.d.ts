import * as THREE from 'three';

declare global {
  interface Window {
    __three_camera?: THREE.PerspectiveCamera;
    __three_renderer?: THREE.WebGLRenderer;
  }
}
