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

        let colors = ["black", "orange", "blue", "grey", "pink", "green", "yellow", "brown"];

        let ser = {};
        function getMatrixFromClusteredAr(clustedAr) {
            let countOfEl = 0;
            clustedAr.forEach((element) => {
                countOfEl += element.length;
            });
            let Matrix = [["X"]];

            let c = 0;
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

        let zxc = getSolvedArThresholMethhod(rows);
        var data = google.visualization.arrayToDataTable(getMatrixFromClusteredAr(zxc));
        var options = {
          title: titles[0],
          hAxis: {title: titles[1]},
          vAxis: {title: titles[2]},
          series: ser,
            // width: 2000,
            // height: 2000,
          legend: 'none',
          pointSize: 5,
        };

        var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

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