const gameArea = document.querySelector('.game-area');
const character = document.querySelector('.character');
const pauseBtn = document.querySelector('.pause-btn');
const pauseWindow = document.querySelector('.pause-window');
//const resumeBtn = document.querySelector('.resume-btn');
const pauseExitBtn = document.querySelector('.pause-exit-btn');
// const gameOverExitBtn = document.querySelector('.game-over-exit-btn');
const gamePassExitBtn = document.querySelector('.game-Completed-buttons');
const gameExitBtn = document.querySelectorAll('.game-over-exit-btn');
const gameOverWindow = document.querySelector('.game-over-window');
const gamePassWindow = document.querySelector('.game-pass-window');
const retryBtn = document.querySelector('.retry-btn');
const hintMessage = document.getElementById('hintMessage');
var completionTime = 0;
    

let characterY = window.innerHeight / 2;
let gravity = 0.3;
let jumpPower = -5;
let velocity = 0;
let isJumping = false;
let isGameStarted = false;
let isPaused = false;
let jumpHeight = -5.5;
let rewardCollected = 0;
let counterDisplay;
let currentRound = 1;
let rewardsNeedPerAround = currentRound * 5;

// 空格键跳跃
window.addEventListener('keydown', function (event) {
    if (event.code === 'Space' && !isPaused) {
        if (!isGameStarted) {
            isGameStarted = true;
        }
        if (!isJumping) {
            velocity = jumpHeight;
            isJumping = true;
        }
    }
});

window.addEventListener('keyup', function (event) {
    if (event.code === 'Space') {
        isJumping = false;
    }
});

// Pause btn
pauseBtn.addEventListener('click', function () {
    isPaused = true; // stop the game
    pauseWindow.style.display = 'flex';
    document.querySelectorAll('.obstacle').forEach(obstacle => {
        obstacle.style.animationPlayState = 'paused'; // stop animation
    });
    document.querySelectorAll('.reward').forEach(reward => {
        reward.style.animationPlayState = 'paused'; // stop page
    });
});


// Back button for pause interface
pauseExitBtn.addEventListener('click', function () {
    window.location.href = './index.html';
});

gameExitBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
        window.location.href = './index.html';
    })
});

// Try Again button
retryBtn.addEventListener('click', function () {
    location.reload();
});

// refresh character location and check collection
function updateCharacter() {
    if (isPaused) return;
    if (isGameStarted) {
        if (!isJumping) {
            velocity += gravity;
        }
        characterY += velocity;

        // avoid character down out screen
        if (characterY + character.offsetHeight >= window.innerHeight) {
            characterY = window.innerHeight - character.offsetHeight;
            velocity = 0;
        }

        // avoid character up out screen
        if (characterY <= 0) {
            characterY = 0;
            velocity = 0;
        }

        // refresh location
        character.style.top = `${characterY}px`;

        checkCollision();
        checkRewardCollection();
    }

    requestAnimationFrame(updateCharacter);
}

updateCharacter();

// Creat Obstacle
const bottomImages = [
    {image: 'assets/images/weeds.png', threatName: 'Weeds'},
    {image: 'assets/images/bug.png', threatName: 'Bug'},
    {image: 'assets/images/clearing_of_vegetation.png', threatName: 'Clearing of Vegetation'},
    {image: 'assets/images/collectors.png', threatName: 'Collectors'},
    {image: 'assets/images/inappropriate_fire_regimes.png', threatName: 'Inappropriate Fire Regimes'},
    {image: 'assets/images/road_maintenance.png', threatName: 'Road Maintenance'},
    {image: 'assets/images/weeds_lantana.png', threatName: 'Weeds Lantana'},
    {image: 'assets/images/weeds_mistflower.png', threatName: 'Weeds Mistflower'},
    {image: 'assets/images/weeds_gamba_grass.png', threatName: 'Weeds Gamba Grass'},
];

const topImages = [
    {image: 'assets/images/weeds.png', threatName: 'Weeds'},
    {image: 'assets/images/bug.png', threatName: 'Bug'},
    {image: 'assets/images/clearing_of_vegetation.png', threatName: 'Clearing of Vegetation'},
    {image: 'assets/images/collectors.png', threatName: 'Collectors'},
    {image: 'assets/images/inappropriate_fire_regimes.png', threatName: 'Inappropriate Fire Regimes'},
    {image: 'assets/images/road_maintenance.png', threatName: 'Road Maintenance'},
    {image: 'assets/images/weeds_lantana.png', threatName: 'Weeds Lantana'},
    {image: 'assets/images/weeds_mistflower.png', threatName: 'Weeds Mistflower'},
    {image: 'assets/images/weeds_gamba_grass.png', threatName: 'Weeds Gamba Grass'},
];

const rewardImages = ['assets/images/water.png', 'assets/images/sun.png'];
const screenHeight = window.innerHeight;
const gap = 400; // gap of pipe

// 2.5s creat obstacle
const obstacleGenerationInterval = setInterval(() => {
    createObstacle();
}, 2500);

// Collision detection
function checkCollision() {
    const characterRect = character.getBoundingClientRect();

    document.querySelectorAll('.obstacle').forEach(obstacle => {
        const obstacleRect = obstacle.getBoundingClientRect();

        // Check if the character overlaps with the obstacle
        if (characterRect.right > obstacleRect.left &&
            characterRect.left < obstacleRect.right &&
            characterRect.bottom > obstacleRect.top &&
            characterRect.top < obstacleRect.bottom) {

            isPaused = true;
            gameOverWindow.style.display = 'flex';

            document.querySelectorAll('.obstacle').forEach(obstacle => {
                obstacle.style.animationPlayState = 'paused';
            });

            document.querySelectorAll('.reward').forEach(reward => {
                reward.style.animationPlayState = 'paused';
            });

            clearInterval(obstacleGenerationInterval);
        }
    });
}

function createObstacle() {
    if (isPaused) return; // stop game, stop creat obstacle

    const animationDuration = 3; // Animation duration set to 3 seconds, shared by obstacles and bonus items

    const bottomContainer = document.createElement('div');
    const topContainer = document.createElement('div');
    bottomContainer.classList.add('obstacle');
    topContainer.classList.add('obstacle');

    const bottomImageElement = document.createElement('div');
    const topImageElement = document.createElement('div');
    bottomImageElement.classList.add('obstacle-image');
    topImageElement.classList.add('obstacle-image');

    const randomBottomObject = bottomImages[Math.floor(Math.random() * bottomImages.length)];
    const randomTopObject = topImages[Math.floor(Math.random() * topImages.length)];

    bottomImageElement.style.backgroundImage = `url(${randomBottomObject.image})`;
    topImageElement.style.backgroundImage = `url(${randomTopObject.image})`;

    // Create a text element that displays the threat name
    const bottomThreatText = document.createElement('div');
    bottomThreatText.classList.add('threat-text');
    bottomThreatText.innerText = randomBottomObject.threatName;

    const topThreatText = document.createElement('div');
    topThreatText.classList.add('threat-text');
    topThreatText.innerText = randomTopObject.threatName;

    // Add image elements and text elements to the obstacle container in sequence
    bottomContainer.appendChild(bottomImageElement);
    bottomContainer.appendChild(bottomThreatText);

    topContainer.appendChild(topImageElement);
    topContainer.appendChild(topThreatText);


    const maxBottomHeight = screenHeight - gap;
    const randomBottomHeight = Math.floor(Math.random() * (maxBottomHeight - 200)) + 50;
    const topObstacleHeight = screenHeight - randomBottomHeight - gap;

    bottomContainer.style.height = `${randomBottomHeight}px`;
    topContainer.style.height = `${topObstacleHeight}px`;

    bottomContainer.style.width = '150px';
    topContainer.style.width = '150px';

    topContainer.style.top = '0';
    bottomContainer.style.bottom = '0';

    bottomContainer.appendChild(bottomImageElement);
    topContainer.appendChild(topImageElement);

    gameArea.appendChild(bottomContainer);
    gameArea.appendChild(topContainer);

    // Set animation for obstacles
    bottomContainer.style.animationDuration = `${animationDuration}s`;
    topContainer.style.animationDuration = `${animationDuration}s`;

    // remove container
    setTimeout(() => {
        if (!isPaused) {
            bottomContainer.remove();
            topContainer.remove();
        }
    }, animationDuration * 1000);

    // Delayed generation of bonus items (after 1 second)
    setTimeout(generateReward, 1000);
}

function generateReward() {
    if (isPaused) return;

    const animationDuration = 3;

    //generation of bonus items
    const reward = document.createElement('div');
    reward.classList.add('reward');
    const randomRewardImage = rewardImages[Math.floor(Math.random() * rewardImages.length)];
    reward.style.backgroundImage = `url(${randomRewardImage})`;

    // Randomly generates bonus items anywhere in the screen
    const randomRewardTop = Math.floor(Math.random() * (screenHeight - 50));
    reward.style.top = `${randomRewardTop}px`;
    reward.style.position = 'absolute';
    reward.style.zIndex = '5';
    reward.style.right = '0';

    reward.style.animation = `moveObstacle ${animationDuration}s linear infinite`;

    gameArea.appendChild(reward);

    // remove reward
    setTimeout(() => {
        if (!isPaused) {
            reward.remove();
        }
    }, animationDuration * 1000);
}

updateRewardCollectionnumber(rewardCollected);


function checkRewardCollection() {
    const characterRect = character.getBoundingClientRect();
    const rewardRect = document.querySelectorAll('.reward');

    rewardRect.forEach(reward => {
        const rewardPosition = reward.getBoundingClientRect();
        if (
            characterRect.right > rewardPosition.left &&
            characterRect.left < rewardPosition.right &&
            characterRect.bottom > rewardPosition.top &&
            characterRect.top < rewardPosition.bottom
        ) {

            reward.remove();
            console.log('Reward collected!');

            rewardCollected += 1;
            updateRewardCollectionnumber(rewardCollected);
            rewardCountPass();
        }
    });
}

function updateRewardCollectionnumber(count) {
    if (!counterDisplay) {
        counterDisplay = document.createElement('div');
        counterDisplay.id = 'rewardCount';
        counterDisplay.style.color = "white";
        counterDisplay.style.fontSize = '40px';
        counterDisplay.style.fontWeight = 'bold';
        counterDisplay.style.fontFamily = "Courier New";
        counterDisplay.style.position = "absolute";
        counterDisplay.style.left = '10px';
        counterDisplay.style.top = '10px';
        counterDisplay.style.textShadow = "2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000";
        document.body.appendChild(counterDisplay);
    }
    counterDisplay.innerText = `Need: ${rewardsNeedPerAround} | Plant Collected: ${count}`;
}

// POST save data to session.js
async function sendPostRequest(completionTime) {
    const response = await fetch('/session.php?route=session_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'data':{
            'level':completionTime
        }})  // using completionTime as data
    });

    if (!response.ok) {  // check data
        throw new Error('Network response was not ok: ' + response.statusText);
    }

    const data = await response.json();
    if (data.status === 'success') {
        console.log('POST work:', data);
    } else {
        console.error('POST Wrong:', data.message);
    }
}

function saveGameProgress(completionTime) {
     localStorage.setItem('level', completionTime);
    console.log(localStorage.getItem('level'));
}

function getGameProgress() {
    const level = parseInt(localStorage.getItem('level'));
    completionTime =  level ? level : 0;
}

// GET
async function sendGetRequest() {
    try {
        const response = await fetch('/session.php?route=session_data', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const data = await response.json();  //  JSON
        if (data.status === 'success') {
            console.log('GET response data:', data.data.level);  // return data
            return data.data.level;
        } else {
            console.error('Error in GET request:', data.message);
            return null;
        }
    } catch (error) {
        console.error('Error in GET request:', error);
        return null;
    }
}

// async/await and sendGetRequest
async function gameInit() {
    // completionTime = await sendGetRequest();
    getGameProgress();
    if (completionTime !== null) {
        console.log('Completion time:', completionTime);

    } else {
        console.error('Failed to get completion time');
    }
}



// check pass
function rewardCountPass() {
    if (rewardCollected >= rewardsNeedPerAround) {
        isPaused = true;
        gamePassWindow.style.display = 'flex';
        document.querySelectorAll('.obstacle').forEach(obstacle => {
            obstacle.style.animationPlayState = 'paused';
        });
        document.querySelectorAll('.reward').forEach(reward => {
            reward.style.animationPlayState = 'paused';
        });

        clearInterval(obstacleGenerationInterval);



        // return main page
        const gamePassExitBtn = document.querySelectorAll('.game-pass-exit-btn');
        gamePassExitBtn.forEach(btn => {
            gameCompleted();
            btn.addEventListener('click', () => {
                window.location.href = './index.html';
            });
        });
    }
}

async function gameCompleted() {
    try {
        completionTime++;

        // await sendPostRequest(completionTime);
        saveGameProgress(completionTime);


    } catch (error) {
        console.error('Error in gameCompleted:', error);
    }
}


function showHintMessage() {
    hintMessage.style.display = 'block';

    setTimeout(() => {
        hintMessage.style.display = 'none';
    }, 3500);
}


showHintMessage();

// const api_link = 'https://www.stateoftheenvironment.des.qld.gov.au/2020/datasets/indicator-1-4-2-4.csv';
// const api_link = '../csv/threats.csv';
const api_link = './csv/threats.csv';
var threatjson;


async function ready() {
    try {
        threatjson = await parseCSV(api_link);
        // console.log(threatjson);
    } catch (error) {
        console.error(error.message);
    }

    // const threat = document.getElementById('threatData'); // link to HTML
    const fragment = document.createDocumentFragment();
    for (let array of threatjson) {
        let threats = array.Threat;
        let p = document.createElement('p');
        p.innerText = threats;
        fragment.appendChild(p);
    }
    $('#threatData').append(fragment);
}

function parseCSV(api_link) {
    return new Promise((resolve, reject) => {
        Papa.parse(api_link, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function (result) {
                resolve(result.data);
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}

//video.animation
const video = document.getElementById('videoPlayer');


video.controls = false;


video.autoplay = true;
video.muted = true;


video.loop = false;
video.addEventListener('ended', function() {
});


// gamePassExitBtn.addEventListener('click', function () {
//     gameCompleted();
// })
gameInit();
