import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/OrbitControls.js';




// variables for event listeners
const beginBtn = document.querySelector('#btn-begin');
const overlay = document.querySelector('#overlay');
const threeJsWindow = document.querySelector('#three-js-container');


// three.js functions
const main  = () => {

    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
        audio.play();
    })

    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    renderer.autoClear = false;
    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;
    camera.updateProjectionMatrix();

    const scene = new THREE.Scene();

    const controls = new OrbitControls( camera, renderer.domElement );
    // controls.enableZoom = false;


    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0.5, 1, 1 ).normalize();
    scene.add( light );

    scene.add( new THREE.AmbientLight( 0xffffff, 0.5 ) );

    var outer = document.querySelectorAll( '.outer' );
    var outerTextures = [];
    outer.forEach(video => {
        video.play();
        video.needsUpdate = true;
        video.addEventListener('play', function() {
            this.currentTime = 3;
        }, false);

        var texture = new THREE.VideoTexture( video );
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;
        outerTextures.push(texture);
    })


    const makeInstance = (x) => {
        const geometry = new THREE.BoxBufferGeometry(x, x, x);  
        const material = [
            new THREE.MeshPhongMaterial({ map: outerTextures[0], side: THREE.DoubleSide}),
            new THREE.MeshPhongMaterial({ map: outerTextures[1], side: THREE.DoubleSide}),
            new THREE.MeshPhongMaterial({ map: outerTextures[2], side: THREE.DoubleSide}),
            new THREE.MeshPhongMaterial({ map: outerTextures[3], side: THREE.DoubleSide}),
            new THREE.MeshPhongMaterial({ map: outerTextures[4], side: THREE.DoubleSide}),
            new THREE.MeshPhongMaterial({ map: outerTextures[5], side: THREE.DoubleSide})
        ];

        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        return cube;
    }

    const cubes = [
        makeInstance(1),
    ]

    const resizeRendererToDisplaySize = renderer => {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if(needResize) {
            renderer.setSize(width, height, false);
        };
        return needResize;
    }


     // render the scene
     renderer.render(scene, camera);

     // create a loop to render animation
     const render = (time) => {
         time *= 0.001; //convert time to seconds

         // call function to resize canvas
         if (resizeRendererToDisplaySize(renderer)) {
             const canvas = renderer.domElement;
             camera.aspect = canvas.clientWidth / canvas.clientHeight;
             camera.updateProjectionMatrix();
         }


         renderer.render(scene, camera);

         requestAnimationFrame(render);
     }
     requestAnimationFrame(render);

 }; //end of function






// event listeners
beginBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
    threeJsWindow.style.display = 'block';
    main();
});

beginBtn.addEventListener('touchend', () => {
    overlay.style.display = 'none';
    threeJsWindow.style.display = 'block';
    main();
});

