// 获取元素
const guide = document.getElementById('guide');
const guideBtn = document.getElementById('guide-btn');
var completionTime = 0;

function getYear(year) {
	if(year) {
		return year.match(/[\d]{4}/); // This is regex: https://en.wikipedia.org/wiki/Regular_expression
	}
}

function iterateRecords(results) {

	console.log(results);

	// Setup the map as per the Leaflet instructions:
	// https://leafletjs.com/examples/quick-start/

	

	// Iterate over each record and add a marker using the Latitude field (also containing longitude)
	$.each(results.result.records, function(recordID, recordValue) {	
	});

}
//子页面
function openGameWindow() {
	window.location.href = "../flappybird.html";
}

$(document).ready(async function() {

	guideBtn.addEventListener('click', () => {
		// 首次点击后跳转到链接
		window.location.href = '../flappybird.html';

		// 隐藏指南并禁用按钮
		guide.style.display = 'none';
		guideBtn.disabled = true;

		// 在 localStorage 中存储 'guideHidden' 为 'true'
		localStorage.setItem('guideHidden', 'true');
	});

	var map = L.map('map').setView([-18.5, 145.5], 6);
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	var LeafIcon = L.Icon.extend({
		options: {
			shadowUrl: 'assets/images/leaf-shadow.png',
			iconSize:     [38, 95],
			shadowSize:   [50, 64],
			iconAnchor:   [22, 94],
			shadowAnchor: [4, 62],
			popupAnchor:  [-3, -76]
		}
	});

	var greenIcon = new LeafIcon({iconUrl: 'assets/images/leaf-green.png'}),
    	redIcon = new LeafIcon({iconUrl: 'assets/images/leaf-red.png'}),
		pinkIcon = new LeafIcon({iconUrl: 'assets/images/leaf-pink.png'}),
		purpleIcon = new LeafIcon({iconUrl: 'assets/images/leaf-purple.png'}),
    	orangeIcon = new LeafIcon({iconUrl: 'assets/images/leaf-orange.png'});

	L.icon = function (options) {
		return new L.Icon(options);
	};

	var familyIcons = {
		"Elatinaceae": greenIcon,
		"Dichapetalaceae": redIcon,
		"Bataceae": orangeIcon,
		"Acanthaceae": pinkIcon,
		"Clusiaceae": purpleIcon,
	};

	// 用于存储所有物种数据
	var speciesData = [];
	var currentFamilyIndex = 0;  // 当前显示的family索引
	var maxFamiliesToShow = 5;   // 最多显示5种family的标记
  

	// 从API获取物种数据
	fetch('https://biocache-ws.ala.org.au/ws/occurrences/search?q=data_resource_uid%3Adr2287&qualityProfile=AVH&fq=state%3A%22Queensland%22&fq=data_resource_uid%3A%22dr2287%22&fq=occurrence_status%3A%22PRESENT%22&fq=multimedia%3A%22Image%22&fq=(family%3A%22Acanthaceae%22%20OR%20family%3A%22Bataceae%22%20OR%20family%3A%22Clusiaceae%22%20OR%20family%3A%22Dichapetalaceae%22%20OR%20family%3A%22Elatinaceae%22)&qc=-_nest_parent_%3A*&pageSize=200')  // 替换为你的API URL
	  .then(response => response.json())
      .then(apiData => {
		speciesData = apiData.occurrences;  // 保存物种数据，但不立即显示
		//displaySpeciesOnMap(apiData.occurrences);  // 调用函数显示物种位置
      	console.log(speciesData);  // 检查数据
    })
    .catch(error => {
      console.error('Error fetching API data:', error);
    });

	/* // 定期检查 localStorage 中的 'gameCompleted' 状态
    setInterval(function () {
        if (localStorage.getItem('gameCompleted') === 'true') {
            console.log('Game completed, triggering onLevelSuccess');
            gameSuccessHandler();
            localStorage.removeItem('gameCompleted');  // 移除标志，避免重复触发
        }
    }, 1000);  // 每秒检查一次 */

	/*window.onload = function() {
		if (localStorage.getItem('gameCompleted') === 'true') {
			alert('主页面加载时检测到游戏完成的信号');
			// 在这里执行其他逻辑，例如更新页面的状态或显示提示
			console.log('Button clicked!');
			gameSuccessHandler();
			localStorage.removeItem('gameCompleted');
			console.log('REMOVE');

		}
	};

	// 监听 localStorage 中的变化，确保即使用户从子页面跳转回来，也能检测到信号
	window.addEventListener('storage', function(event) {
		if (event.key === 'gameCompleted' && event.newValue === 'true') {
			alert('主页面收到游戏完成的信号');
			// 在这里执行其他逻辑
			localStorage.removeItem('gameCompleted');
		}
	});
	*/

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

	// 当游戏成功通关时调用此函数
	function onLevelSuccess() {
		console.log("Current family index: " + currentFamilyIndex);
		if (currentFamilyIndex < maxFamiliesToShow && speciesData.length > 0) {
		  var familiesDisplayed = [];  // 记录已经显示过的family
		  var familyDataToShow = speciesData.filter(function (species) {
			if (!familiesDisplayed.includes(species.family)) {
			  familiesDisplayed.push(species.family);  // 添加到已显示的family
			  return true;
			}
			return false;
		  });
	
		  if (currentFamilyIndex < familyDataToShow.length) {
			var familyToDisplay = familyDataToShow[currentFamilyIndex].family;  // 获取当前 family
			console.log("Current family index: " + currentFamilyIndex);

			// 筛选出该 family 的所有物种
			var speciesToDisplay = speciesData.filter(function (species) {
				return species.family === familyToDisplay;
			});

			console.log("Displaying all species of family: " + familyToDisplay, speciesToDisplay);
			
			displaySpeciesOnMap(speciesToDisplay);  //显示该 family 的所有物种
			currentFamilyIndex++;  // 更新到下一个family
		  }
		} else {
		  console.log("All families have been shown or no more species data available.");
		}
	}

	// 根据API数据在地图上标记物种位置
	function displaySpeciesOnMap(speciesData) {
		speciesData.forEach(function (species) {
		  var lat = species.decimalLatitude;
		  var lng = species.decimalLongitude;
		  var family = species.family;
		  var name = species.scientificName;
		  var vernacularName = species.vernacularName || "Unknown Common Name";

		  // 根据family选择合适的图标
		  var icon = familyIcons[family] || familyIcons["Elatinaceae"];

		  if (lat && lng) {
		  	L.marker([lat, lng], { icon: icon })
		  	.addTo(map)
			.bindPopup(`<b>${name}</b><br>Family: ${family}<br>${vernacularName}`);
		  } else {
			  console.warn("Missing coordinates for species:", species);
		  }

		});
	}

	/* $('#successButton').click(function () {
		console.log('Button clicked!');
		gameSuccessHandler();  // 每次成功触发
	}); */

	function successButton(completionTime) {
		for (let i = 0; i < completionTime; i++) {
			console.log('Button clicked!');
			gameSuccessHandler();  // 每次成功触发
		}
	}

	 function gameSuccessHandler() {
		console.log('Game success logic triggered');
		onLevelSuccess();  // 每次游戏成功后调用，显示新的family
	}

	// // 在页面加载时请求完成次数并执行后续逻辑
    // getGameCompletionCount().then(gameCompletionCount => {
    //     console.log('Game completion count:', gameCompletionCount);
	//
    //     // 根据获取到的完成次数执行不同的逻辑
    //     if (gameCompletionCount > 0) {
    //         console.log('Game completed ' + gameCompletionCount + ' times');
    //         // 这里可以根据完成次数显示不同的内容
    //         for (let i = 0; i < gameCompletionCount; i++) {
    //             onLevelSuccess();  // 每次通关显示新家族物种
    //         }
    //     } else {
    //         console.log('No game completions detected');
    //     }
    // });

// 检查 localStorage 中是否有 'guideHidden' 键
if (localStorage.getItem('guideHidden') === 'true') {
	// 如果 guide 已被隐藏过，则不再显示指南，并使按钮禁用
	guide.style.display = 'none';
	guideBtn.disabled = true;  // 使按钮禁用
} else {
	// 如果未隐藏，则显示指南
	guide.style.display = 'flex';
}

	await gameInit();
	successButton(completionTime);

});


