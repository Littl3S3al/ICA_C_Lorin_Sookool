import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/OrbitControls.js';




// variables for event listeners
const beginBtn = document.querySelector('#btn-begin');
const overlay = document.querySelector('#overlay');
const threeJsWindow = document.querySelector('#three-js-container');


// three.js functions
const main  = () => {

    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    renderer.autoClear = false;


    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 10;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;
    camera.position.y = 1;
    camera.updateProjectionMatrix();

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0x000000   , 0.3 );

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.maxDistance = 3;


    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0.5, 1, 1 ).normalize();
    scene.add( light );

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
    });

    const outerMaterial = [
        new THREE.MeshBasicMaterial({ map: outerTextures[0]}),
        new THREE.MeshBasicMaterial({ map: outerTextures[1]}),
        new THREE.MeshBasicMaterial({ map: outerTextures[2]}),
        new THREE.MeshBasicMaterial({ map: outerTextures[3]}),
        new THREE.MeshBasicMaterial({ map: outerTextures[4]}),
        new THREE.MeshBasicMaterial({ map: outerTextures[5]})
    ];

    var inner = document.querySelectorAll('.inner');
    var innerTextures = [];
    inner.forEach(video => {
        video.play();
        video.needsUpdate = true;
        video.addEventListener('play', function() {
            this.currentTime = 3;
        }, false);

        var texture = new THREE.VideoTexture( video );
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;
        innerTextures.push(texture);
    });

    const innerMaterial = [
        new THREE.MeshBasicMaterial({ map: innerTextures[0]}),
        new THREE.MeshBasicMaterial({ map: innerTextures[1]}),
        new THREE.MeshBasicMaterial({ map: innerTextures[2]}),
        new THREE.MeshBasicMaterial({ map: innerTextures[3]}),
        new THREE.MeshBasicMaterial({ map: innerTextures[4]}),
        new THREE.MeshBasicMaterial({ map: innerTextures[5]})
    ];


    const makeInstance = (material, x, scale) => {
        const geometry = new THREE.BoxBufferGeometry(x, x, x);  
        const cube = new THREE.Mesh(geometry, material);
        cube.rotation.y = 45 * Math.PI /180;
        if(scale){
            geometry.scale(-1, 1, 1)
        }
        scene.add(cube);
        return cube;
    }

    const cubes = [
        makeInstance(outerMaterial, 1, false),
        makeInstance(innerMaterial, 0.99, true),
    ]

    const loader = new THREE.TextureLoader();

    const groundSize = 20;
    const groundTexture = loader.load(assets + 'map.png');
    groundTexture.magFilter = THREE.NearestFilter;
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.magFilter = THREE.NearestFilter;
    const repeats = 5;
    groundTexture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneBufferGeometry(groundSize, groundSize);
    const planeMat = new THREE.MeshPhongMaterial({map: groundTexture});

    const mapMesh = new THREE.Mesh(planeGeo, planeMat);
    mapMesh.receiveShadow = true;
    mapMesh.rotation.x = Math.PI * -.5;
    mapMesh.position.y = -1;

    scene.add(mapMesh);

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
     const render = () => {

        var zoom = controls.target.distanceTo( controls.object.position )

        if(zoom > 0.5){
            inner.forEach(video => {
                video.volume = 0
            })
            outer.forEach(video => {
                video.volume = 1;
            })
        } else {
            outer.forEach(video => {
                video.volume = 0;
            })
            inner.forEach(video => {
                video.volume = 1
            })
        }

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

