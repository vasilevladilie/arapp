import * as THREE from "../../lib/node_modules/three/build/three.module.js"

// import { OrbitControls } from './jsm/controls/OrbitControls.js';

/// One single function that starts the video capture and binds the renderer to a certain element in the document

class VideoCapture {
    constructor(viewportElement) {
        this.camera = null;
        this.scene = null;
        this.renderer = null;
        this.viewportElement = viewportElement;
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    init() {
        this.camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 100);
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );

        this.camera.position.z = 1.0;

        const texture = new THREE.VideoTexture( this.viewportElement );	
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.NearestFilter;
        texture.format = THREE.RGBFormat;

        const geometry = new THREE.PlaneBufferGeometry( 4, 3);
        geometry.scale( 1, 1, 1);
        const material = new THREE.MeshBasicMaterial( { map: texture } );

        const mesh = new THREE.Mesh( geometry, material );
        mesh.scale.x = 0.4; // 4 71
                                //  -> film
        mesh.scale.y = 0.3; // 3 6
        mesh.lookAt( this.camera.position );
        this.scene.add( mesh );

        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.viewportElement.appendChild( this.renderer.domElement );

        window.addEventListener( 'resize', this.onWindowResize, false );

        if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {
            const constraints = { video: { width: 1280, height: 720, facingMode: 'user' } };

            async function getMedia(viewport, constraints) {
                let stream = null;
                try {
                    stream = await navigator.mediaDevices.getUserMedia(constraints);
                    viewport.srcObject = stream;
                    viewport.play();
                } catch(error) {
                    console.error( 'Unable to access the camera/webcam.', error );
                }
            };
            getMedia(this.viewportElement, constraints);

        } else {
            console.error( 'MediaDevices interface not available.' );
        }
    }

    render() {
        //window.requestAnimationFrame( this.animate );
        this.renderer.render( this.scene, this.camera );
    }
}

export { VideoCapture }