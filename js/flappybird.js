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

let characterY = window.innerHeight / 2;
let gravity = 0.3; // 掉落速度
let jumpPower = -5;
let velocity = 0;
let isJumping = false;
let isGameStarted = false;
let isPaused = false;
let jumpHeight = -5.5; // 跳跃高度
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
    isPaused = true; // 暂停游戏
    pauseWindow.style.display = 'flex'; // 显示暂停窗口
    document.querySelectorAll('.obstacle').forEach(obstacle => {
        obstacle.style.animationPlayState = 'paused'; // 暂停障碍物动画
    });
    document.querySelectorAll('.reward').forEach(reward => {
        reward.style.animationPlayState = 'paused'; // 暂停奖励物品动画
    });
});

// 继续按钮
/*resumeBtn.addEventListener('click', function () {
    isPaused = false; // 恢复游戏
    pauseWindow.style.display = 'none'; // 隐藏暂停窗口
    document.querySelectorAll('.obstacle').forEach(obstacle => {
        obstacle.style.animationPlayState = 'running'; // 恢复障碍物动画
    });
    document.querySelectorAll('.reward').forEach(reward => {
        reward.style.animationPlayState = 'running'; // 恢复奖励物品动画
    });
});

*/
// 暂停界面的返回按钮
pauseExitBtn.addEventListener('click', function () {
    window.location.href = '/index.html';
});

// 游戏结束界面的返回按钮
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

// 障碍物生成
// 底部图片数组
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
const gap = 400; // 柱子间隔

// 定时生成障碍物，每2.5秒生成一次
const obstacleGenerationInterval = setInterval(() => {
    createObstacle();
}, 2500);

// 碰撞检测
function checkCollision() {
    const characterRect = character.getBoundingClientRect();

    document.querySelectorAll('.obstacle').forEach(obstacle => {
        const obstacleRect = obstacle.getBoundingClientRect();

        // 检查角色与障碍物是否有重叠
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
    if (isPaused) return; // 如果游戏暂停，不生成障碍物

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

    // 创建用于显示威胁名称的文本元素
    const bottomThreatText = document.createElement('div');
    bottomThreatText.classList.add('threat-text');
    bottomThreatText.innerText = randomBottomObject.threatName;

    const topThreatText = document.createElement('div');
    topThreatText.classList.add('threat-text');
    topThreatText.innerText = randomTopObject.threatName;

    // 将图片元素和文本元素依次添加到障碍物容器中
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

    // 设置障碍物的动画持续时间
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

// 发送分数到服务器并处理页面跳转
function sendScoreToServer(score) {
    // 使用 AJAX 发送分数
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'update_game.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // 在AJAX成功完成后再设置页面跳转
            console.log('Score sent to server successfully.');
        }
    };
    xhr.send('score=' + score);
}

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
        sendScoreToServer(rewardCollected);

        // 添加跳转回主界面的逻辑
        const gameOverExitBtns = document.querySelectorAll('.game-over-exit-btn');
        gameOverExitBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                window.location.href = '/index.html'; // 主界面路径，调整为你的实际路径
            });
        });
    }
}

function gameCompleted() {
    setTimeout(function () {
        // 存储游戏完成状态到 localStorage
        localStorage.setItem('gameCompleted', 'true');
        console.log('游戏完成信号已存储到 localStorage');

        // 跳转到主页面
        window.location.href = '/index.html';
    }, );
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

gamePassExitBtn.addEventListener('click', function () {
    gameCompleted();
})
