function getSolvedArThresholMethhod(rows) {
    let clusters = [[rows[0]]];
    const T = formT;

    rows.forEach((element, index, array) => {
        if (index !== 0 && clusters.every((elClust, indClust, arClust) => {
            let evklidDistance = Math.sqrt( ((element[1] - elClust[0][1])**2) + ((element[2] - elClust[0][2])**2) );
            if (evklidDistance > T) {
                return true;
            } else {
                elClust.push(element);
                return false;
            }
        })) {
            clusters.push([element]);
        }
    });
    return clusters;
}

// array: [[x: number1, y: number2, tooltip: string], ...]
function drawAr(rows) {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = new google.visualization.DataTable();
        const titles = rows.shift();

        let ser = {};
        let c = 0;
        function getMatrixFromClusteredAr(clustedAr) {
            let countOfEl = 0;
            clustedAr.forEach((element) => {
                countOfEl += element.length;
            });
            let Matrix = [["X"]];

            clustedAr.forEach((element, index) => {
                let color = "#" + (Math.floor(Math.random()*256*256*256).toString(16).toUpperCase() + "000000").slice(0, 6);

                
                element.forEach((el) => {
                    
                    Matrix[0].push(`${el[0]}, кластер - ${index}`);
                    let foo = new Array(countOfEl+1);
                    foo.fill(null);
                    foo[0] = el[1];
                    foo[Matrix[0].length-1] = el[2];
                    Matrix.push(foo);

                    
                    ser[c++] = {color};
                });
            });
            return Matrix;
        }

        let clstrs = getSolvedArThresholMethhod(rows);
        // console.log(clstrs);
        let mtrx = getMatrixFromClusteredAr(clstrs)
        var data = google.visualization.arrayToDataTable(mtrx);

        let d = mtrx[0];
        
        clstrs.forEach((element, index) => {
            /*Построение квадрата*/

            if (element.length > 1) {
                let arMinMax = element.reduce((prevEl, el) => {
                    if (el[1] < prevEl.minX) prevEl.minX = el[1]; 
                    if (el[2] < prevEl.minY) prevEl.minY = el[2];
                    if (el[1] > prevEl.maxX) prevEl.maxX = el[1];
                    if (el[2] > prevEl.maxY) prevEl.maxY = el[2];
                    return prevEl;
                }, {minX: Infinity, minY: Infinity, maxX: 0, maxY: 0});
                data.addColumn("number", "Граница кластера");
                d.push("1");
                
                let foo = (new Array(d.length)).fill(null);
                foo[0] = arMinMax.minX;
                foo[d.length-1] = arMinMax.minY;
                data.addRow(foo);

                foo[0] = arMinMax.maxX;
                foo[d.length-1] = arMinMax.minY;
                data.addRow(foo);

                foo[0] = arMinMax.maxX;
                foo[d.length-1] = arMinMax.maxY;
                data.addRow(foo);

                foo[0] = arMinMax.minX;
                foo[d.length-1] = arMinMax.maxY;
                data.addRow(foo);

                foo[0] = arMinMax.minX;
                foo[d.length-1] = arMinMax.minY;
                data.addRow(foo);

                ser[c++] = {pointSize: 0};
            }

            /**/
        });
        
        var options = {
          title: titles[0],
          hAxis: {title: titles[1]},
          vAxis: {title: titles[2]},
          series: ser,
            // width: 2000,
            height: 1000,
          legend: 'none',
          pointSize: 2,
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

        chart.draw(data, options);

        rows.unshift(titles);
    }
}

const file = document.getElementById('fileX');
const btn = document.querySelector("#buttonX");
const T = document.querySelector("#valT");

T.value = 800;
let formT = +T.value;


T.addEventListener("change", () => {
    formT = +T.value;
});

let globalData;

file.addEventListener("change", () => {
    readXlsxFile(file.files[0]).then(res => {
        globalData = res;
    });
});

btn.addEventListener("click", () => {
    document.querySelector("#chart_div").innerHTML = "";
    drawAr(globalData);
});

const adButton = document.querySelector("#adButton");
const adPointName = document.querySelector("#adPointName");
const adPointX = document.querySelector("#adPointX");
const adPointY = document.querySelector("#adPointY");
const adOutput = document.querySelector("#adOutput");



adPointName.value = "Херсонская область";
adPointX.value = 28;
adPointY.value = 1000;



adButton.addEventListener("click", () => {
    // console.log(adPointName.value, adPointX.value, adPointY.value);
    let formAdPointName = adPointName.value;
    let formAdPointX = +adPointX.value;
    let formAdPointY = +adPointY.value;
    
    let title = globalData.shift();
    let a = getSolvedArThresholMethhod(globalData);
    
    const pointClasses = [];
    
    a.forEach((element, index) => {
        let arMinMax = element.reduce((prevEl, el) => {
            if (el[1] < prevEl.minX) prevEl.minX = el[1]; 
            if (el[2] < prevEl.minY) prevEl.minY = el[2];
            if (el[1] > prevEl.maxX) prevEl.maxX = el[1];
            if (el[2] > prevEl.maxY) prevEl.maxY = el[2];
            return prevEl;
        }, {minX: Infinity, minY: Infinity, maxX: 0, maxY: 0});

        if ((formAdPointX < arMinMax.maxX) && 
            (formAdPointX > arMinMax.minX) && 
            (formAdPointY < arMinMax.maxY) && 
            (formAdPointY > arMinMax.minY)) 
            {
                pointClasses.push(index);
            }

    });
    
    if (pointClasses.length === 0) {
        let mClass;
        if (a.some((element, index) => {
            let middlePoint = element.reduce((prevEl, el) => {
                prevEl[0] += el[1];
                prevEl[1] += el[2];
                return prevEl;
            }, [0, 0]).map(el => el/element.length);

            if ( Math.sqrt( ((formAdPointX - middlePoint[0])**2) + ((formAdPointY - middlePoint[1])**2) ) < formT ) {
                mClass = index;
                return true;
            }

            return false;
        })) {
            adOutput.innerHTML = `Элемент не входит ни в один в класс, но может расширить ${mClass} класс (расстояние меньше порога)`;
        } else {
            adOutput.innerHTML = `Элемент не входит ни в один класс и лежит далеко от центров всех классов (расстояние больше порога)`;
            mClass = null;
        }

        console.log(mClass);
    } else if (pointClasses.length === 1) {
        adOutput.innerHTML = `Элемент входит в класс ${pointClasses[0]}`;
    } else {
        let finallyClass = pointClasses.map(el => {
            let x = 0;
            let y = 0;
            for (let i = 0; i < a[el].length; i++) {
                x += a[el][i][1];
                y += a[el][i][2];
            }
            x /= a[el].length;
            y /= a[el].length;

            return {class: el, x, y};
        }).map(el => {
            let r = Math.sqrt( ((el.x - formAdPointX)**2) + ((el.y - formAdPointY)**2) );

            return {class: el.class, r};
        }).reduce((prevEl, el) => {
            if (el.r < prevEl.r) return el;
        }).class;
        adOutput.innerHTML = `Элемент входит в несколько классов, но ближе к классу ${finallyClass}`;
    }


    // console.log(pointClasses);
    globalData.unshift(title);
});