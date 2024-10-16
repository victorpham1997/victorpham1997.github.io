import * as THREE from "https://cdn.skypack.dev/three@0.133.1";
import { ImprovedNoise } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/math/ImprovedNoise.js";
import { AsciiEffect } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/effects/AsciiEffect.js";
import Stats  from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/libs/stats.module.js";
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/loaders/GLTFLoader.js';

gsap.registerPlugin(TextPlugin) 

// Define page to theme mapping
var themeMap = {
    'art' : ['light', [189,195,199]],
    'projects' : ['dark', [0, 35, 0]],
    'ap' : ['dark', [0, 35, 0]]
  };

// Read from localStorage to obtain theme if needed
let currentUrl = window.location.href;
// if

let darkTheme = localStorage.getItem("dark_theme");
if (darkTheme==null){
    darkTheme = true;
    localStorage.setItem("dark_theme", darkTheme);
}else{
    darkTheme = darkTheme === 'true';
}

//asign version
const version = 'v2.0.4'
var versionText = document.querySelector('.version');
versionText.textContent  = version;






// site properties 
var root = document.querySelector(':root');
var style = getComputedStyle(root);
var content  = document.getElementById('projects-content');
let btnCount = 5;

// screen properties
const w = window.innerWidth;
const h = window.innerHeight;
let divider = 200;

// noise properties
let gridSizeW;
let gridSizeH;
const coords = [];
const colors = [];
let points = [];
let x;
let y;
let z = 0;
let r;
let g;
let b;
let point = {
    position: {},
    rate: 0.0,
};
let theme;


// ascii properties
const rbgThreshold = 255;
let ascii_set = ' .:/\\@#'
let ascii_set2 = ' ._/\\0@'
let ascii_resolution = 0.1;
// const [r0_d, g0_d, b0_d] = [45,52,54];
const [r0_d, g0_d, b0_d] = [30, 35, 30];
const [r0_l, g0_l, b0_l] = [189,195,199];
let bgColor;
let r0;
let g0;
let b0;
let pSize = 10;
let gap = 0.1;



// Define Scene
const scene = new THREE.Scene();

// Define Camera
const camera = new THREE.OrthographicCamera( w / - divider,w / divider,h / divider, h / - divider, 2, 1000 );
camera.position.z = 500;

// Define Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);

// Define ascii effect
const effect = new AsciiEffect( renderer, ascii_set2, { invert: true, resolution: ascii_resolution } );
effect.setSize( w, h );

function applyThemeMap (identifyString){
    // currentUrl = window.location.href;
    console.log(identifyString);
    if( Object.keys(themeMap).some(v => identifyString.includes(v))){
        var mappedThemeStr = Object.keys(themeMap).find(v => identifyString.includes(v));
        console.log(Object.keys(themeMap));
        console.log(mappedThemeStr);
        
        theme = themeMap[mappedThemeStr][0]
        r0 = themeMap[mappedThemeStr][1][0];
        g0 = themeMap[mappedThemeStr][1][1];
        b0 = themeMap[mappedThemeStr][1][2]
        console.log(`dark_theme is ${theme === "dark"}`)
        localStorage.setItem("dark_theme", theme === "dark");

        return true;
    };
    return false
}   

function initTheme(darkTheme){
    if( !applyThemeMap(window.location.href)){
        if(darkTheme){
            theme = 'dark'
            r0 = r0_d;
            g0 = g0_d;
            b0 = b0_d;
        }else{
            theme = 'light'
            r0 = r0_l;
            g0 = g0_l;
            b0 = b0_l;
        }
    }
    // root.style.setProperty('--border-color', style.getPropertyValue(`--border-color-${theme}`));
    // root.style.setProperty('--font-color', style.getPropertyValue(`--font-color-${theme}`));
    root.style.setProperty('--background-color', style.getPropertyValue(`--background-color-${theme}`));

        
    effect.domElement.style.backgroundColor = style.getPropertyValue(`--background-color-${theme}`);
    effect.domElement.style.color = `rgb(${r0}, ${g0}, ${b0})`;
    
    gsap.to(":root", { 
        duration: getComputedStyle(root).getPropertyValue('--animation_duration'),
        '--border-color': getComputedStyle(root).getPropertyValue(`--border-color-${theme}`),
        '--font-color': getComputedStyle(root).getPropertyValue(`--font-color-${theme}`),
        '--project-title-color': getComputedStyle(root).getPropertyValue(`--project-title-color-${theme}`),
        '--blur': getComputedStyle(root).getPropertyValue(`--blur-${theme}`),    
        '--theme-button-background': getComputedStyle(root).getPropertyValue(`--theme-button-background-${theme}`),    
    });

    // gsap.to(effect.domElement.style, { 
    //     duration: 0.25,
    //     backgroundColor: style.getPropertyValue(`--background-color-${theme}`),
    // });
}

initTheme(darkTheme);



function applyTheme(darkTheme, overwrite = false){
    if(!overwrite){
        if (darkTheme){
            theme = 'dark';
            r0 = r0_d;
            g0 = g0_d;
            b0 = b0_d;
        }else{
            theme = 'light';
            r0 = r0_l;
            g0 = g0_l;
            b0 = b0_l;
        }
        localStorage.setItem("dark_theme", darkTheme);
    }

    bgColor = style.getPropertyValue(`--background-color-${theme}`);
    gsap.to(":root", { 
        duration: getComputedStyle(root).getPropertyValue('--animation_duration'),
        '--border-color': getComputedStyle(root).getPropertyValue(`--border-color-${theme}`),
        '--font-color': getComputedStyle(root).getPropertyValue(`--font-color-${theme}`),
        '--font-background-color': getComputedStyle(root).getPropertyValue(`--font-background-color-${theme}`),
        '--background-color': getComputedStyle(root).getPropertyValue(`--background-color-${theme}`),
        '--theme-button-background': getComputedStyle(root).getPropertyValue(`--theme-button-background-${theme}`),    
        '--blur': getComputedStyle(root).getPropertyValue(`--blur-${theme}`),    
        '--project-title-color': getComputedStyle(root).getPropertyValue(`--project-title-color-${theme}`),

    });

    gsap.to(effect.domElement.style, { 
        duration: 1,
        backgroundColor: bgColor,
    });
    gsap.to(effect.domElement.style, { 
        duration: 1,
        color: `rgb(${r0}, ${g0}, ${b0})`,
    });
    // projectsOverflowIndicator();

}
document.body.appendChild(effect.domElement);

// Define noise effect



gridSizeW = w/(divider*gap);
gridSizeH = h/(divider*gap);
function updateArr(gridW, gridH){
    points = [];
    for (let i = -gridW; i < gridW; i += 1) {
        for (let j = -gridH; j < gridH; j += 1) {
            x = i * gap;
            y = j * gap;
            r = Math.random();
            g = Math.random();
            b = Math.random();
            point = {
                position: {
                    x,
                    y,
                    z,
                },
                    color: new THREE.Color(r, g, b),
            };

            points.push(point);
            coords.push(x, y, z);
            colors.push(r, g, b);
        }
    }
}

updateArr(gridSizeW, gridSizeH);

// Define stat tracking 
// let stats = new Stats();
// container.appendChild( stats.dom );

// Define Points
const geo = new THREE.BufferGeometry();
geo.setAttribute("position", new THREE.Float32BufferAttribute(coords, 3));
geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
const mat = new THREE.PointsMaterial({ size: pSize, vertexColors: true });
const pointsObj = new THREE.Points(geo, mat);
const Noise = new ImprovedNoise();

function updatePoints(t) {
    const coords = [];
    const cols = [];
    let ns;
    const nScale = 0.65;
    const zPosScale = 1.5;
    const highColor = new THREE.Color(100, 74, 57);
    const lowColor = new THREE.Color(20, 10, 0);
    points.forEach((p, i) => {
        ns = Noise.noise(p.position.x * nScale, p.position.y * nScale, t);
        p.position.z = ns * zPosScale;
        p.color.lerpColors(lowColor, highColor, ns * 1.5);
        let { r, g, b } = p.color;
        cols.push(r, g, b);
        let {x, y, z } = p.position;
        coords.push(x, y, z);
    });
    geo.setAttribute("position", new THREE.Float32BufferAttribute(coords, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
}

scene.add(pointsObj);


// Helper functions


document.querySelector(".cr_box").onclick = function() { 
    const duration = 1;
    var frame = document.querySelector("#frame");

    btnCount --;
    if(btnCount == 0){
        gsap.to('.n4v_box', {duration: 0, visibility: "visible"});
        gsap.to('.n4v_box', {duration: duration, text: "Secret Unlocked"});
        gsap.to('.n4v_box', {duration: duration, text: "", delay:duration+0.5});
        gsap.to('.n4v_box', {duration: duration-0.25, text: "Zen Mode: Off", delay:duration*2+0.5});
        console.log(window.getComputedStyle(frame).getPropertyValue('opacity'));
        document.querySelector(".n4v_box").onclick = function() { 
            if(window.getComputedStyle(frame).getPropertyValue('opacity') == 1){
                gsap.to('.n4v_box', {duration: 0.2, text: "Zen Mode:"});
                gsap.to('.n4v_box', {duration: 0.2, text: "Zen Mode: On", delay:0.2});
                gsap.to('#frame', {duration: duration, opacity: 0});
                gsap.to('#frame', {duration: 0, visibility: 'hidden', delay:duration});


            }else{
                gsap.to('.n4v_box', {duration: 0.2, text: "Zen Mode:"});
                gsap.to('.n4v_box', {duration: 0.2, text: "Zen Mode: Off", delay:0.2});
                gsap.to('#frame', {duration: 0, visibility: 'visible'});
                gsap.to('#frame', {duration: duration, opacity: 1});
            }
        }
    }
}




function randomRGB(mult, val){
    let rand_val = Math.random();
    const rangeOffset = 30
    let range = [Math.min(val - rangeOffset, 0), Math.max(val + rangeOffset, 255)]
    if (rand_val*(range[1] - range[0]) + range[0] > val){
        val += mult;
    }else{
        val -= mult;
    }
    return val
}

function controlHeaderVis(tab){
    if (tab.classList.contains("no-header")){
        gsap.to('#header', {duration: tabSwitchAnimationDuration, opacity:0});
        gsap.to('#header', {duration: 0, display:'none', delay:tabSwitchAnimationDuration});
    }else{
        gsap.to('#header', {duration: 0, display:'block'});
        gsap.to('#header', {duration: tabSwitchAnimationDuration, opacity:1, delay:tabSwitchAnimationDuration});
    }
};


// function projectsOverflowIndicator(){
//     if (content.scrollHeight > content.offsetHeight) {
//         console.log('element overflows');
//         overflowIndicator.style.visibility = 'visible';
//     }else{
//         overflowIndicator.style.visibility = 'hidden';
//     }

// }

// if(document.getElementById('projects-content')){
//     document.getElementById('projects-content').addEventListener('scroll', event => {
//         const {scrollHeight, scrollTop, clientHeight} = event.target;
    
//         if (Math.abs(scrollHeight - clientHeight - scrollTop) < 1) {
//             console.log('scrolled');
//             overflowIndicator.style.visibility = 'hidden';
    
    
    
//         }else{
//             console.log('unscrolled');
//             overflowIndicator.style.visibility = 'visible';
    
//         }
//     });
// }

// if ( document.getElementById('projects-content') ) {
//     console.log(element.scrollHeight);
//     console.log(element.clientHeight);
//     console.log(element.offsetHeight);
// }


// Define html/css interacting functions

// mouseenter tab
function onHoverTab(tab){
    const text0 = tab.textContent.split(' ')[0];

    tab.addEventListener('mouseenter', () => {
    gsap.to(`#${tab.id}`, {duration: text_animation_duration, text: text0 + " #"});
    gsap.to(`#${tab.id}`, {duration: text_animation_duration, text: text0 + " _-", delay: text_animation_duration});
    gsap.to(`#${tab.id}`, {duration: text_animation_duration, text: text0 + " <<", delay: text_animation_duration*2});
    });

    // Mouse leave event
    tab.addEventListener('mouseleave', () => {
        gsap.to(`#${tab.id}`, {duration: 0.25, text: text0 });
    });
}

// onClick Switch tab
// console.log(location.hash);
const tabSwitchAnimationDuration = 0.25;

function toggleTab(selectedTab) {
    var tabs = document.querySelectorAll(".menu_text");

    tabs.forEach(function(tab) {

        if (tab.id == selectedTab) {
                tab.classList.add("is-active");
                gsap.to(`#${tab.id}`, {duration: 0.2, text: tab.textContent.split(' ')[0] + " <", delay: 0.1});
                gsap.to(`#${tab.id}-content`, {duration: tabSwitchAnimationDuration, display: 'block', opacity: 1, delay: tabSwitchAnimationDuration});
                controlHeaderVis(tab);
                applyThemeMap(tab.id);
                applyTheme(null, true);


        } else {
            onHoverTab(tab);
            if (tab.classList.contains("is-active")) {
                tab.classList.remove("is-active");
                // tab.textContent = tab.textContent.split(' ')[0];
                gsap.to(`#${tab.id}`, {duration: 0.25, text: tab.textContent.split(' ')[0]});
                gsap.to(`#${tab.id}-content`, {duration: tabSwitchAnimationDuration, display: 'none', opacity: 0});

            }
            else{
                document.querySelector(`#${tab.id}-content`).style.display = 'none';
                document.querySelector(`#${tab.id}-content`).style.opacity = 0;
            };
        }
    });
}
  

// Tab
var tabs = document.querySelectorAll(".menu_text");
const text_animation_duration = 0.07
const active_id = location.hash.replace("#", "");

// Init active tab
if(active_id) {
    tabs.forEach(function(tab) {
        if (tab.id == active_id ) {
            tab.classList.add("is-active");
            gsap.to(`#${tab.id}-content`, {duration: 1, display: 'block', opacity: 1});
            controlHeaderVis(tab);

        }else{
            tab.classList.remove("is-active");
        };
    });
};


// Set tab event
tabs.forEach(function(tab) {
    // Mouse onclick event
    tab.onclick = function(){toggleTab(tab.id, tabs)};

    if (!tab.classList.contains("is-active")) {
        onHoverTab(tab);


    }else{
        tab.textContent += ' <';
    }
});


function switchTheme() {
    // darkTheme = darkThemeBtn.classList.contains('is-active');
    darkTheme = localStorage.getItem("dark_theme") === 'true';
    applyTheme(!darkTheme);
  
};

document.getElementById("theme_dark").onclick = switchTheme;
// switchTheme();

// Define animation

let i = 0;
const timeMult = 0.0007;
function animate(timeStep) {
    requestAnimationFrame(animate);
    updatePoints(timeStep * timeMult);
    // applyTheme(darkTheme);
    effect.render(scene, camera);
    
    // stats.update();
    if (timeStep > i*500){
        r0 = randomRGB(0.5, r0);
        g0 = randomRGB(0.5, g0);
        b0 = randomRGB(0.5, b0);
        effect.domElement.style.color = `rgb(${r0}, ${g0}, ${b0})`;
        // console.log(`rgb(${r0}, ${g0}, ${b0})`)
        i++;
    }
}

// START!
animate(0);


// Define window resize

function handleWindowResize() {
    camera.left = window.innerWidth  / - divider;
    camera.right = window.innerWidth  /  divider;
    camera.top = window.innerHeight  /  divider;
    camera.bottom = window.innerHeight  / - divider;
    camera.updateProjectionMatrix();
    // renderer.setSize(window.innerWidth, window.innerHeight);
    
    gridSizeW =  window.innerWidth/(divider*gap);
    gridSizeH =  window.innerHeight/(divider*gap);
    updateArr(gridSizeW, gridSizeH)
    effect.setSize( window.innerWidth, window.innerHeight);
    // projectsOverflowIndicator();


    
}
// effect.setSize( window.innerWidth, window.innerHeight );
window.addEventListener("resize", handleWindowResize, false);



// ----------------------------------
function checkOverflow(el)
{
    if (el.scrollHeight > el.offsetHeight) {
        return true;
    }
    return false;
}

// ----------------ART PAGE FUNCTION------------------


