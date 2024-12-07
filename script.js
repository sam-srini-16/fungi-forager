// Initialize Lenis
const lenis = new Lenis();


function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);


const LEGEND = {
    'cap-shape': {
        'b': 'Bell',
        'c': 'Conical',
        'x': 'Convex',
        'f': 'Flat',
        'k': 'Knobbed',
        's': 'Sunken'
    },
    'cap-surface': {
        'f': 'Fibrous',
        'g': 'Grooves',
        'y': 'Scaly',
        's': 'Smooth'
    },
    'cap-color': {
        'n': 'Brown',
        'b': 'Buff',
        'c': 'Cinnamon',
        'g': 'Gray',
        'r': 'Green',
        'p': 'Pink',
        'u': 'Purple',
        'e': 'Red',
        'w': 'White',
        'y': 'Yellow'
    },
    'bruises': {
        't': 'Bruises',
        'f': 'No Bruises'
    },
    'odor': {
        'a': 'Almond',
        'l': 'Anise',
        'c': 'Creosote',
        'y': 'Fishy',
        'f': 'Foul',
        'm': 'Musty',
        'n': 'None',
        'p': 'Pungent',
        's': 'Spicy'
    },
    'gill-attachment': {
        'a': 'Attached',
        'd': 'Descending',
        'f': 'Free',
        'n': 'Notched'
    },
    'gill-spacing': {
        'c': 'Close',
        'w': 'Crowded',
        'd': 'Distant'
    },
    'gill-size': {
        'b': 'Broad',
        'n': 'Narrow'
    },
    'gill-color': {
        'k': 'Black',
        'n': 'Brown',
        'b': 'Buff',
        'h': 'Chocolate',
        'g': 'Gray',
        'r': 'Green',
        'o': 'Orange',
        'p': 'Pink',
        'u': 'Purple',
        'e': 'Red',
        'w': 'White',
        'y': 'Yellow'
    },
    'stalk-shape': {
        'e': 'Enlarging',
        't': 'Tapering'
    },
    'stalk-root': {
        'b': 'Bulbous',
        'c': 'Club',
        'u': 'Cup',
        'e': 'Equal',
        'z': 'Rhizomorphs',
        'r': 'Rooted',
        '?': 'Missing'
    },
    'stalk-surface-above-ring': {
        'f': 'Fibrous',
        'y': 'Scaly',
        'k': 'Silky',
        's': 'Smooth'
    },
    'stalk-surface-below-ring': {
        'f': 'Fibrous',
        'y': 'Scaly',
        'k': 'Silky',
        's': 'Smooth'
    },
    'stalk-color-above-ring': {
        'n': 'Brown',
        'b': 'Buff',
        'c': 'Cinnamon',
        'g': 'Gray',
        'o': 'Orange',
        'p': 'Pink',
        'e': 'Red',
        'w': 'White',
        'y': 'Yellow'
    },
    'stalk-color-below-ring': {
        'n': 'Brown',
        'b': 'Buff',
        'c': 'Cinnamon',
        'g': 'Gray',
        'o': 'Orange',
        'p': 'Pink',
        'e': 'Red',
        'w': 'White',
        'y': 'Yellow'
    },
    'veil-type': {
        'p': 'Partial',
        'u': 'Universal'
    },
    'veil-color': {
        'n': 'Brown',
        'o': 'Orange',
        'w': 'White',
        'y': 'Yellow'
    },
    'ring-number': {
        'n': 'None',
        'o': 'One',
        't': 'Two'
    },
    'ring-type': {
        'c': 'Cobwebby',
        'e': 'Evanescent',
        'f': 'Flaring',
        'l': 'Large',
        'p': 'Pendant',
        's': 'Sheathing',
        'z': 'Zone'
    },
    'spore-print-color': {
        'k': 'Black',
        'n': 'Brown',
        'b': 'Buff',
        'h': 'Chocolate',
        'r': 'Green',
        'o': 'Orange',
        'u': 'Purple',
        'w': 'White',
        'y': 'Yellow'
    },
    'population': {
        'a': 'Abundant',
        'c': 'Clustered',
        'n': 'Numerous',
        's': 'Scattered',
        'v': 'Several',
        'y': 'Solitary'
    },
    'habitat': {
        'g': 'Grasses',
        'l': 'Leaves',
        'm': 'Meadows',
        'p': 'Paths',
        'u': 'Urban',
        'w': 'Waste',
        'd': 'Woods'
    }
}


let mushrooms = [];
let edibleMushrooms = [];
let poisonousMushrooms = [];
const edibleProbabilities = {};
const poisonousProbabilities = {};


const calculateButton = document.getElementById('calculate-btn');
const property1Select = document.getElementById('visualition-property-1');
const property2Select = document.getElementById('visualition-property-2');

async function loadMushrooms() {
    try {
        const response = await fetch('mushrooms.json');
        const mushrooms = await response.json();
        return mushrooms;
    } catch (error) {
        console.error('Error loading mushrooms data:', error);
        return [];
    }
}

async function mainEvent() {
    calculateButton.addEventListener('click', handleCalculate);

    if (mushrooms.length === 0) {
        mushrooms = await loadMushrooms();
        edibleMushrooms = mushrooms.filter(mushroom => mushroom["class"] === "e");
        poisonousMushrooms = mushrooms.filter(mushroom => mushroom["class"] === "p");

        populateVisualizationSelect();
    }

    loadSVG();
}

// SVG
function loadSVG() {
    fetch("forest.svg")
        .then((response) => { return response.text(); })
        .then((svg) => {
            document.getElementById('bg_forest').innerHTML = svg;
            document.querySelector('#bg_forest svg').setAttribute("preserveAspectRatio", "xMidYMid slice");
            setAnimationScroll();
        })
}

// Music control
const backgroundMusic = document.getElementById('background-music');
const muteButton = document.getElementById('mute-button');
let isMuted = true;
let passedProbabilitySection = false;

// Toggle mute button
muteButton.addEventListener('click', () => {
    if (isMuted) {
        backgroundMusic.play();
        muteButton.innerHTML = '<img src="unmute.png" alt="unmuted">';
    } else {
        backgroundMusic.pause();
        muteButton.innerHTML = '<img src="mute.png" alt="muted">';
    }
    isMuted = !isMuted;
});

const probabilitySection = document.getElementById('edibility-calculator');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            backgroundMusic.pause();
            muteButton.innerHTML = '<img src="mute.png" alt="muted">';
            isMuted = true;
        }
    });
}, { threshold: 0.5 });

observer.observe(probabilitySection);



// text animation
const foragerOrager = new SplitType('#fungi-title');

gsap.to('.char', { y: -20, duration: 0.1, stagger: 0.05, delay: 1.2 })
    
// landinganimation
function setAnimationScroll() {
    gsap.registerPlugin(ScrollTrigger);
    
 
    gsap.timeline({
        scrollTrigger: {
            trigger: "#bg_forest",
            start: "top 0%",
            end: "center 30%",
            scrub: true
        }
    }).to("#mute-button", {
        position: "fixed",
        top: "20px",
        right: "20px",
        left: "auto", 
        bottom: "auto", 
        transform: "translate(0, 0)",
        duration: 1
    });

    
    gsap.timeline({
        scrollTrigger: {
            trigger: "#bg_forest",
            start: "top 0%",
            end: "center 30%",
            scrub: 2,
            pin: true
        }
    }).add([
        gsap.to("#fungi-title", 1, { opacity: 0 }),
        gsap.to("#forager-f", 1, { opacity: 0 }),
        gsap.to("#forager-orager", 1, { opacity: 0 }),
        gsap.to("#fg_left", 1, { x: -150 }),
        gsap.to("#fg_right",1, { x: 150 }),
        gsap.to("#bg_left", 2, { x: -50 }),
        gsap.to("#bg_right", 2, { x: 50 })
    ]);

  
    gsap.timeline({
        scrollTrigger: {
            trigger: "#caution",
            start: "top 50%",
            end: "bottom 60%",
            scrub: 6,
            onComplete: () => {
                mushroomTimeline.play();
            }
        }
    })
    .from("#caution-title", {
        y: 200,
        opacity: 0,
        duration: 5
    })
    .from("#caution-text-1", {
        y: 200,
        opacity: 0,
        duration: 10
    }, "+=2")
    .from("#caution-text-2", {
        y: 100,
        opacity: 0,
        duration: 10
    }, "+=2");

    // .to("#caution-text-1", {
    //     opacity: 0,
    //     y: 20,
    //     duration: 10,
    //     delay: 3
    // }, "+=4")
    // .to("#caution-text-2", {
    //     opacity: 0,
    //     y: 20,
    //     duration: 5
    // }, "+=1")
    // .to("#caution-title", {
    //     opacity: 0,
    //     y: -50,
    //     duration: 2
    // }, "+=1");


    const mushroomTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: "#caution",
            start: "top top",
            end: "+=300%",
            pin: true,
            scrub: 2,
            anticipatePin: 1
        }
    });

    mushroomTimeline
        .set(".scattered-mushrooms", { 
            opacity: 1
        })
        // First pair animation
        .to("#mushroom1, #mushroom2", {
            y: 0,
            opacity: 1,
            duration: 2,
            stagger: 0.1,
            ease: "power1.in"
        })
        .to({}, {duration: 0.5}) 
      
        .to("#mushroom1, #mushroom2", {
            y: "-100vh",
            opacity: 1,
            duration: 2,
            stagger: 0.1,
            ease: "power1.out"
        })
        .to("#mushroom3, #mushroom4", {
            y: 0,
            opacity: 1,
            duration: 2,
            stagger: 0.1,
            ease: "power1.in"
        }, "<")
        .to({}, {duration: 0.5}) 
       
        .to("#mushroom3, #mushroom4", {
            y: "-100vh",
            opacity: 1,
            duration: 2,
            stagger: 0.1,
            ease: "power1.out"
        })
        .to("#mushroom5, #mushroom6", {
            y: 0,
            opacity: 1,
            duration: 2,
            stagger: 0.1,
            ease: "power1.in"
        }, "<")
        .to({}, {duration: 0.5}) 
      
        .to("#mushroom5, #mushroom6", {
            y: "-100vh",
            opacity: 1,
            duration: 2,
            stagger: 0.1,
            ease: "power1.out"
        });

}

let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});


function updateParallax() {
    document.querySelectorAll('.object').forEach(function(move) {
        const moving_value = move.getAttribute('data-value');
        

        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        
        const x = (currentX * moving_value) / 250;
        const y = (currentY * moving_value) / 250;
    
        move.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    
    requestAnimationFrame(updateParallax);
}


requestAnimationFrame(updateParallax);

// edibility calculator text animation
const title = document.querySelector("#mushroom-edibility-title");

title.innerHTML = title.innerHTML.repeat(3);

gsap.set("#mushroom-edibility-title", {
    x: "0%" 
});

gsap.to("#mushroom-edibility-title", {
    scrollTrigger: {
        trigger: "#edibility-calculator",
        start: "top 80%",
        toggleActions: "play none none reverse"
    },
    x: "-50%", 
    duration: 15,
    ease: "none",
    repeat: -1
});

// heatmap text animation   

const title1 = document.querySelector("#whole-dataset-title");

title1.innerHTML = title1.innerHTML.repeat(3);

gsap.set("#whole-dataset-title", {
    x: "0%" 
});

gsap.to("#whole-dataset-title", {
    scrollTrigger: {
        trigger: "#whole-dataset",
        start: "top 80%",
        toggleActions: "play none none reverse"
    },
    x: "-50%", 
    duration: 15, 
    ease: "none",
    repeat: -1
});



// Calculate Probability

function handleCalculate(event) {
    event.preventDefault();
    try {
        const probability = getProbabilityEdibleAll();
        const resultElements = document.querySelectorAll('#result-div p');
        const resultDiv = document.getElementById('result-div');
        
        // border animation
        resultDiv.classList.add('active');
        
        
        document.querySelectorAll('input[type="radio"]:checked + .radio-label').forEach(label => {
            label.style.transform = 'scale(1.05)';
        });
        
        resultElements.forEach(element => {
            element.hidden = false;
            element.style.opacity = 0;
        });

        //probability result animation

        gsap.to(resultElements[0], {
            opacity: 1,
            duration: 1,
            y: -150,
            ease: 'power1.inOut',
            onComplete: () => {
                gsap.to(resultElements[1], {
                    opacity: 1,
                    duration: 1,
                    y: -100,
                    ease:"power1.inOut",
                    delay: 1,
                    onComplete: () => {
                        document.getElementById('probability-result').textContent = `${Math.round(probability * 100)}%`;
                        gsap.to(resultElements[2], {
                            opacity: 1,
                            duration: 1,
                            y: 0,
                            ease: "power1.inOut",
                        });
                    }
                });
            }
        });

        //reset button  
        calculateButton.textContent = 'Reset';
        calculateButton.removeEventListener('click', handleCalculate);
        calculateButton.addEventListener('click', handleReset);
    }
    catch (error) {
        alert(error.message);
    }
}

// radio buttons 

function handleReset(event) {
    event.preventDefault();
    document.getElementById('probability-form').reset();

    document.querySelectorAll('.radio-label').forEach(label => {
        label.style.transform = 'scale(1)';
    });
    

    document.getElementById('result-div').classList.remove('active');
    
  
    const resultElements = document.querySelectorAll('#result-div p');
    gsap.to(resultElements, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
            resultElements.forEach(element => {
                element.hidden = true;
            });
        }
    });

    // probability calculator 
    calculateButton.textContent = 'Calculate Probability';
    calculateButton.removeEventListener('click', handleReset);
    calculateButton.addEventListener('click', handleCalculate);
}
function getProbabilityEdible(property, value) {
    if (!edibleProbabilities[property]) {
        edibleProbabilities[property] = edibleMushrooms.filter(mushroom => mushroom[property] === value).length;
    }
    if (!poisonousProbabilities[property]) {
        poisonousProbabilities[property] = poisonousMushrooms.filter(mushroom => mushroom[property] === value).length;
    }
    return edibleProbabilities[property] / (edibleProbabilities[property] + poisonousProbabilities[property]);
}

function getProbabilityEdibleAll() {
    const capShape = document.querySelector('input[name="cap-shape"]:checked')?.value;
    const capColor = document.querySelector('input[name="cap-color"]:checked')?.value;
    const capSurface = document.querySelector('input[name="cap-surface"]:checked')?.value;
    const stalkShape = document.querySelector('input[name="stalk-shape"]:checked')?.value;

    if (!capShape || !capColor || !capSurface || !stalkShape) {
        throw new Error('Please fill in all fields');
    }

    const probabilityCapShape = getProbabilityEdible("cap-shape", capShape);
    const probabilityCapColor = getProbabilityEdible("cap-color", capColor);
    const probabilityCapSurface = getProbabilityEdible("cap-surface", capSurface);
    const probabilityStalkShape = getProbabilityEdible("stalk-shape", stalkShape);

    console.log(probabilityCapShape, probabilityCapColor, probabilityCapSurface, probabilityStalkShape);

    return (probabilityCapShape * probabilityCapColor
        * probabilityCapSurface * probabilityStalkShape);
}

// Visualization

function populateVisualizationSelect() {
    Object.keys(mushrooms[0]).forEach(property => {
        if (property === "class") return;
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');

        option1.value = property;
        option1.textContent = property;
        option2.value = property;
        option2.textContent = property;

        property1Select.appendChild(option1);
        property2Select.appendChild(option2);
    });

    property2Select.selectedIndex = 1;
    property1Select.addEventListener('change', handleVisualizationChange);
    property2Select.addEventListener('change', handleVisualizationChange);
    buildVisualization(property1Select.value, property2Select.value);
}

function handleVisualizationChange(event) {
    const property1 = property1Select.value;
    const property2 = property2Select.value;

    if (property1 === property2) {
        alert('Properties cannot be the same');
        return;
    }

    buildVisualization(property1, property2);
}

function buildVisualization(property1, property2) {
    const property1Values = Object.entries(LEGEND[property1]).map(([key, value]) => ({ key, value }));
    const property2Values = Object.entries(LEGEND[property2]).map(([key, value]) => ({ key, value }));

    const zValues = property1Values.map(p1 => {
        return property2Values.map(p2 => {
            const edibleCount = edibleMushrooms.filter(m =>
                m[property1] === p1.key && m[property2] === p2.key
            ).length;
            const poisonousCount = poisonousMushrooms.filter(m =>
                m[property1] === p1.key && m[property2] === p2.key
            ).length;

            return edibleCount + poisonousCount === 0 ? 0 :
                Math.round((edibleCount / (edibleCount + poisonousCount)) * 100);
        });
    });

    const data = [{
        z: zValues,
        x: property2Values.map(p => p.value),
        y: property1Values.map(p => p.value),
        type: 'heatmap',
        colorscale: [
            [0, '#B22222'],     
            [0.5, '#FFC125'],   
            [1, '#1B4D3E']      
        ],
        hoverongaps: false
    }];

    const layout = {
        title: {
            text: `Probability that a mushroom is edible given ${property1} and ${property2}`,
            font: {
                family: '"Offside", sans-serif'
            }
        },
        xaxis: {
            title: property2.replace(/-/g, ' '),
            tickangle: 45,
            side: 'bottom',
            tickfont: {
                family: '"Offside", sans-serif'
            },
            titlefont: {
                family: '"Offside", sans-serif'
            }
        },
        yaxis: {
            title: property1.replace(/-/g, ' '),
            tickfont: {
                family: '"Offside", sans-serif'
            },
            titlefont: {
                family: '"Offside", sans-serif'
            }
        },
        margin: {
            l: 150,
            b: 150,
            t: 100,
            r: 50
        },
        height: 1000,
        width: 1200,
        annotations: [],
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };

    // https://plotly.com/javascript/heatmaps/
    for (let i = 0; i < property1Values.length; i++) {
        for (let j = 0; j < property2Values.length; j++) {
            const currentValue = zValues[i][j];
            const textColor = 'black'

            layout.annotations.push({
                xref: 'x',
                yref: 'y',
                x: property2Values[j].value,
                y: property1Values[i].value,
                text: currentValue + '%',
                font: {
                    family: '"Offside", sans-serif',
                    size: 12,
                    color: textColor
                },
                showarrow: false
            });
        }
    }

    Plotly.newPlot('visualization', data, layout);
}



document.addEventListener("DOMContentLoaded", async () => mainEvent());

