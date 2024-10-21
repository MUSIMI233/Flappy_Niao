//把csv转成json获取数据
// const api_link = 'https://www.stateoftheenvironment.des.qld.gov.au/2020/datasets/indicator-1-4-2-4.csv';
// const api_link = '../csv/threats.csv';
const api_link = './csv/threats.csv';
var threatjson;
document.addEventListener('DOMContentLoaded', ready);

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
                resolve(result.data); // Resolve the promise with the parsed result
            },
            error: function (error) {
                reject(error); // Reject the promise with the error
            }
        });
    });
}
