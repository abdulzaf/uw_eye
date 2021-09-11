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
    // INITIALIZE DATA STRUCTURE
    struct_data.SAMPLE = []
    addMenuOption(0, "SAMPLE", selVarX)
    addMenuOption(0, "SAMPLE", selVarY)

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
            addMenuOption(i+1, dataHead[i], selVarX)
            addMenuOption(i+1, dataHead[i], selVarY)
        }
        // Add Data to Each Key
        for (i=1; i<lines.length; i++) {
            var lineData = lines[i].split('\t')
            for (j=-1; j<dataHead.length; j++) {
                if (j==-1) {
                    struct_data["SAMPLE"].push(i)
                } else {
                    struct_data[dataHead[j]].push(lineData[j])
                }
            }
        }
        if (dataHead.includes("TIMESTAMP")) {
            struct_data.TIMESTAMP = struct_data.TIMESTAMP.map( function(value) { 
                return value - struct_data.TIMESTAMP[0]; 
            } );
        }
        console.log(struct_data)
        // SET UI
        plotData(dataHead[0], dataHead[0])
        selVarX.selectedIndex = 0;
        selVarY.selectedIndex = 0;
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

//#region UI Features
function addMenuOption(value, label, menuID) {
    var opt = document.createElement('option');
    opt.value = value;
    opt.innerHTML = label;
    menuID.appendChild(opt);
}
//#endregion