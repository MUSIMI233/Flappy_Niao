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

// 暂停按钮
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

// continue
/*resumeBtn.addEventListener('click', function () {
    isPaused = false; //
    pauseWindow.style.display = 'none'; //
    document.querySelectorAll('.obstacle').forEach(obstacle => {
        obstacle.style.animationPlayState = 'running'; //
    });
    document.querySelectorAll('.reward').forEach(reward => {
        reward.style.animationPlayState = 'running'; //
    });
});

*/
// Back button for pause interface
pauseExitBtn.addEventListener('click', function () {
    window.location.href = '/index.html';
});

// The return button on the game end interface
// gameOverExitBtn.addEventListener('click', function() {
//     window.location.href = '/index.html';
// });
//
// gamePassExitBtn.addEventListener('click', function() {
//     window.location.href = '/index.html';
// });
gameExitBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
        window.location.href = '/index.html';
    })
});

// Try Again按钮
retryBtn.addEventListener('click', function () {
    location.reload(); // 重新加载页面
});

// 更新角色的位置并进行碰撞检测
function updateCharacter() {
    if (isPaused) return;
    if (isGameStarted) {
        if (!isJumping) {
            velocity += gravity;
        }
        characterY += velocity;

        // 防止角色掉出屏幕底部
        if (characterY + character.offsetHeight >= window.innerHeight) {
            characterY = window.innerHeight - character.offsetHeight;
            velocity = 0;
        }

        // 防止角色飞出屏幕顶部
        if (characterY <= 0) {
            characterY = 0;
            velocity = 0;
        }

        // 更新角色位置
        character.style.top = `${characterY}px`;

        checkCollision();
        checkRewardCollection();
    }

    requestAnimationFrame(updateCharacter);
}

updateCharacter();

// Creat Obstacle
// button images
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

    const animationDuration = 3; // 动画持续时间设为3秒，障碍物和奖励物品共用

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

    // 移除障碍物
    setTimeout(() => {
        if (!isPaused) {
            bottomContainer.remove();
            topContainer.remove();
        }
    }, animationDuration * 1000);

    // 延迟生成奖励物品（1秒后）
    setTimeout(generateReward, 1000); // 在障碍物生成后1秒生成奖励物品
}

function generateReward() {
    if (isPaused) return;

    const animationDuration = 3;

    // 生成奖励物品
    const reward = document.createElement('div');
    reward.classList.add('reward');
    const randomRewardImage = rewardImages[Math.floor(Math.random() * rewardImages.length)];
    reward.style.backgroundImage = `url(${randomRewardImage})`;

    // 随机生成奖励物品在屏幕中的任意位置
    const randomRewardTop = Math.floor(Math.random() * (screenHeight - 50));
    reward.style.top = `${randomRewardTop}px`;
    reward.style.position = 'absolute';
    reward.style.zIndex = '5';
    reward.style.right = '0';

    reward.style.animation = `moveObstacle ${animationDuration}s linear infinite`;

    gameArea.appendChild(reward);

    // 移除奖励物品
    setTimeout(() => {
        if (!isPaused) {
            reward.remove(); // 移除奖励物品
        }
    }, animationDuration * 1000); // 动画结束后移除
}

updateRewardCollectionnumber(rewardCollected);

// 检测玩家是否收集了奖励物品
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
            // 玩家收集到了奖励
            reward.remove(); // 移除奖励物品
            console.log('Reward collected!');
            // 增加个数
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

// POST 请求：将数据发送到服务器并保存到 session 和文件
async function sendPostRequest(completionTime) {
    const response = await fetch('/session.php?route=session_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'data':{
            'level':completionTime
        }})  // 將 completionTime 作為數據發送
    });

    if (!response.ok) {  // 檢查響應狀態碼
        throw new Error('Network response was not ok: ' + response.statusText);
    }

    const data = await response.json();
    if (data.status === 'success') {
        console.log('POST 成功:', data);
    } else {
        console.error('POST 錯誤:', data.message);
    }
}

// GET 请求：从服务器获取会话数据
async function sendGetRequest() {
    try {
        const response = await fetch('/session.php?route=session_data', {
            method: 'GET',  // 指定为 GET 请求
            headers: {
                'Content-Type': 'application/json'  // 设置请求头，期望 JSON 响应
            }
        });

        if (!response.ok) {  // 检查响应状态码
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const data = await response.json();  // 將響應解析為 JSON
        if (data.status === 'success') {
            console.log('GET response data:', data.data.level);  // 输出服务器返回的会话数据
            return data.data.level;  // 返回 completionTime
        } else {
            console.error('Error in GET request:', data.message);  // 错误处理
            return null;
        }
    } catch (error) {
        console.error('Error in GET request:', error);  // 网络或其他错误处理
        return null;
    }
}

// 在外部使用 async/await 調用 sendGetRequest 函數
async function gameInit() {
    // 使用 await 等待 sendGetRequest 完成，並獲取返回的 completionTime
    completionTime = await sendGetRequest();

    if (completionTime !== null) {
        console.log('Completion time:', completionTime);  // 獲取並使用 completionTime
        // 在這裡繼續處理 completionTime，或者進行後續操作
    } else {
        console.error('Failed to get completion time');
    }
}

// 发送分数到服务器并处理页面跳转
// function sendScoreToServer(score) {
//     // 使用 AJAX 发送分数
//     const xhr = new XMLHttpRequest();
//     xhr.open('POST', 'update_game.php', true);
//     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//     xhr.onreadystatechange = function() {
//         if (xhr.readyState === 4 && xhr.status === 200) {
//             // 在AJAX成功完成后再设置页面跳转
//             console.log('Score sent to server successfully.');
//         }
//     };
//     xhr.send('score=' + score);
// }

// 检测通关
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

        // 发送分数到服务器
        // sendScoreToServer(rewardCollected);

        // 添加跳转回主界面的逻辑
        const gamePassExitBtn = document.querySelectorAll('.game-pass-exit-btn');
        gamePassExitBtn.forEach(btn => {
            gameCompleted();
            btn.addEventListener('click', () => {
                window.location.href = '/index.html'; // 主界面路径，调整为你的实际路径
            });
        });
    }
}

async function gameCompleted() {
    try {
        completionTime++;
        // 使用 await 等待 POST 請求完成
        await sendPostRequest(completionTime);

        // POST 完成後進行跳轉
       // window.location.href = '/index.html';
    } catch (error) {
        console.error('Error in gameCompleted:', error);
    }
}

// 显示提示信息
function showHintMessage() {
    hintMessage.style.display = 'block'; // 显示提示

    // 3.5秒后隐藏提示
    setTimeout(() => {
        hintMessage.style.display = 'none';
    }, 3500);
}

// 在游戏开始时调用提示函数
showHintMessage();

// const api_link = 'https://www.stateoftheenvironment.des.qld.gov.au/2020/datasets/indicator-1-4-2-4.csv';
// const api_link = '../csv/threats.csv';
const api_link = './csv/threats.csv';
var threatjson;

// 异步加载CSV数据
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
                resolve(result.data); // 解析成功，返回数据
            },
            error: function (error) {
                reject(error); // 解析失败，返回错误
            }
        });
    });
}

// 获取视频元素
const video = document.getElementById('videoPlayer');

// 隐藏所有默认控件
video.controls = false;

// 自动播放并静音
video.autoplay = true;
video.muted = true;

// 确保视频只播放一次
video.loop = false;  // 禁止循环播放
video.addEventListener('ended', function() {
    console.log('视频播放结束');
    // 视频结束后，你可以执行一些操作，例如显示一个消息
    // 或者改变页面上的其他元素。
});


// gamePassExitBtn.addEventListener('click', function () {
//     gameCompleted();
// })
gameInit();
