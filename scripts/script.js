function getSolvedArThresholMethhod(rows) {
    let clusters = [[rows[0]]];
    const T = formT;

    rows.forEach((element, index, array) => {
        if (clusters.every((elClust, indClust, arClust) => {
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
            // console.log(clustedAr);

            // clustedAr.forEach((element, index) => {
            //     /*Построение квадрата*/

            //     if (element.length > 1) {
            //         let arMinMax = element.reduce((prevEl, el) => {
            //             if (el[1] < prevEl.minX) prevEl.minX = el[1]; 
            //             if (el[2] < prevEl.minY) prevEl.minY = el[2];
            //             if (el[1] > prevEl.maxX) prevEl.maxX = el[1];
            //             if (el[2] > prevEl.maxY) prevEl.maxY = el[2];
            //             return prevEl;
            //         }, {minX: Infinity, minY: Infinity, maxX: 0, maxY: 0});
            //         let original = (new Array(countOfEl+1)).fill(null);
            //         let len = Matrix[0].length-1;

            //         original[0] = arMinMax.minX;
            //         original[len] = arMinMax.minY;
            //         Matrix.push(original);

            //         original[0] = arMinMax.maxX;
            //         original[len] = arMinMax.minY;
            //         Matrix.push(original);

            //         original[0] = arMinMax.maxX;
            //         original[len] = arMinMax.maxY;
            //         Matrix.push(original);

            //         original[0] = arMinMax.minX;
            //         original[len] = arMinMax.maxY;
            //         Matrix.push(original);

            //         original[0] = arMinMax.minX;
            //         original[len] = arMinMax.minY;
            //         Matrix.push(original);
                    
            //         // console.log(arMinMax);
            //     }

            //     /**/
            // });

            return Matrix;
        }



        let clstrs = getSolvedArThresholMethhod(rows);
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
                data.addColumn("number", "Sqr");
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

                // console.log(arMinMax);
            }

            /**/
        });
        
        var options = {
          title: titles[0],
          hAxis: {title: titles[1]},
          vAxis: {title: titles[2]},
          series: ser,
            // width: 2000,
            // height: 2000,
          legend: 'none',
          pointSize: 2,
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

        chart.draw(data, options);
    }
}

const file = document.getElementById('fileX');
const btn = document.querySelector("#buttonX");
const T = document.querySelector("#valT");

T.value = 688;
let formT = +T.value;

btn.addEventListener("click", () => {
    readXlsxFile(file.files[0]).then(res => {
        document.querySelector("#chart_div").innerHTML = "";
        formT = +T.value;
        drawAr(res);
    });
});