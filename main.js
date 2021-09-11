//#region Initialization
var btnLoadData = document.getElementById("btn-upload");
var pltData = document.getElementById('plt-panel');
var selVarX = document.getElementById('sel-var-x');
var selVarY = document.getElementById('sel-var-y');
// Structures
var struct_data = {}
//#endregion

//#region Load Data
btnLoadData.onchange = function() {
    let file = btnLoadData.files[0];
    let reader = new FileReader();
    reader.addEventListener('load', function(e) {
        let text = e.target.result;
        var lines = text.split('\r\n');

        var dataHead = lines[0].split('\t');
        // Create Key for each Column
        for (i=0; i<dataHead.length; i++) {
            struct_data[dataHead[i]] = [];
            // Add to dropdown
            var optX = document.createElement('option');
            optX.value = i;
            optX.innerHTML = dataHead[i];
            selVarX.appendChild(optX);
            selVarX.selectedIndex = 3;
            var optY = document.createElement('option');
            optY.value = i;
            optY.innerHTML = dataHead[i];
            selVarY.appendChild(optY);
            selVarY.selectedIndex = 4;
        }
        // Add Data to Each Key
        for (i=1; i<lines.length; i++) {
            var lineData = lines[i].split('\t')
            for (j=0; j<dataHead.length; j++) {
                struct_data[dataHead[j]].push(lineData[j])
            }
        }
        struct_data.TIMESTAMP = struct_data.TIMESTAMP.map( function(value) { 
            return value - struct_data.TIMESTAMP[0]; 
        } );
        console.log(struct_data)
        plotData(dataHead[3], dataHead[4])
    });
    reader.readAsText(file);
};
//#endregion

//#region Plot Features
selVarX.onchange = function() {
    var dataHead = Object.keys(struct_data)
    plotData(dataHead[selVarX.value], dataHead[selVarY.value]);
}
selVarY.onchange = function() {
    var dataHead = Object.keys(struct_data)
    plotData(dataHead[selVarX.value], dataHead[selVarY.value]);
}

function plotData(idX, idY) {
    var data = [{
        x: struct_data[idX],
        y: struct_data[idY]
        }]
    console.log([idX, idY, data])
    var layout = {
        xaxis: {
          title: idX,
          titlefont: {
            family: 'Arial, sans-serif',
            size: 18,
            color: 'black'
          }
        },
        yaxis: {
          title: idY,
          titlefont: {
            family: 'Arial, sans-serif',
            size: 18,
            color: 'black'
          }
        }
      };
    var config = {responsive: true}
    Plotly.newPlot(
        pltData, data, layout, config);
}
//#endregion