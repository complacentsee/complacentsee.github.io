/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8836010362694301, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Load Page1-3"], "isController": false}, {"data": [1.0, 500, 1500, "Load Page2-2"], "isController": false}, {"data": [1.0, 500, 1500, "Load Page1-4"], "isController": false}, {"data": [1.0, 500, 1500, "Load Page2-3"], "isController": false}, {"data": [0.9981188118811881, 500, 1500, "Load Page1-1"], "isController": false}, {"data": [0.9516, 500, 1500, "Load Page2-0"], "isController": false}, {"data": [0.9999, 500, 1500, "Load Page1-2"], "isController": false}, {"data": [0.9998, 500, 1500, "Load Page2-1"], "isController": false}, {"data": [0.9315841584158416, 500, 1500, "Load Page1-0"], "isController": false}, {"data": [0.2169, 500, 1500, "Login With Password"], "isController": false}, {"data": [1.0, 500, 1500, "Load Page1-9"], "isController": false}, {"data": [1.0, 500, 1500, "Load Page2-8"], "isController": false}, {"data": [1.0, 500, 1500, "Load Page2-9"], "isController": false}, {"data": [1.0, 500, 1500, "Load Page1-7"], "isController": false}, {"data": [1.0, 500, 1500, "Load Page2-6"], "isController": false}, {"data": [1.0, 500, 1500, "Load Page1-8"], "isController": false}, {"data": [1.0, 500, 1500, "Load Page2-7"], "isController": false}, {"data": [1.0, 500, 1500, "Load Page1-5"], "isController": false}, {"data": [1.0, 500, 1500, "Load Page2-4"], "isController": false}, {"data": [1.0, 500, 1500, "Load Page1-6"], "isController": false}, {"data": [1.0, 500, 1500, "Load Page2-5"], "isController": false}, {"data": [0.726, 500, 1500, "Load Page1"], "isController": false}, {"data": [0.757, 500, 1500, "Load Page2"], "isController": false}, {"data": [0.0192, 500, 1500, "Login"], "isController": true}, {"data": [0.3316, 500, 1500, "Login With Password-0"], "isController": false}, {"data": [0.9896, 500, 1500, "Post Message"], "isController": false}, {"data": [0.9343, 500, 1500, "Login With Password-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 130100, 0, 0.0, 224.05425826287492, 1, 8279, 26.0, 536.9000000000015, 1070.9000000000015, 2127.0, 413.29665232888374, 523.3092196464423, 472.8377969477677], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Load Page1-3", 5000, 0, 0.0, 23.79439999999999, 2, 449, 15.0, 53.0, 74.0, 125.98999999999978, 16.014554026699464, 2.444252586750839, 10.400232981733799], "isController": false}, {"data": ["Load Page2-2", 5000, 0, 0.0, 22.391799999999986, 1, 363, 14.0, 51.0, 70.0, 125.0, 16.032989479152302, 2.388821489095964, 10.365077182811351], "isController": false}, {"data": ["Load Page1-4", 5000, 0, 0.0, 27.494599999999966, 1, 443, 17.0, 64.0, 84.0, 142.0, 16.015682556359188, 6.2833401466716206, 10.447886820774903], "isController": false}, {"data": ["Load Page2-3", 5000, 0, 0.0, 23.926399999999997, 1, 431, 15.0, 53.0, 71.0, 138.96999999999935, 16.033246540025395, 2.388859789659839, 10.427873237946207], "isController": false}, {"data": ["Load Page1-1", 5050, 0, 0.0, 25.35207920792065, 1, 1484, 10.0, 52.0, 80.0, 163.48999999999978, 16.09397607255993, 3.5167541179066997, 10.437026890882843], "isController": false}, {"data": ["Load Page2-0", 5000, 0, 0.0, 289.04680000000076, 21, 5562, 255.5, 495.90000000000055, 576.9499999999998, 801.9899999999998, 16.030367929004708, 64.49582150926716, 8.51613296228375], "isController": false}, {"data": ["Load Page1-2", 5000, 0, 0.0, 21.812400000000018, 2, 502, 13.0, 50.0, 67.0, 119.98999999999978, 16.012964095731906, 2.4469810758790316, 10.336649801679439], "isController": false}, {"data": ["Load Page2-1", 5000, 0, 0.0, 19.45719999999998, 1, 685, 10.0, 47.0, 65.0, 110.98999999999978, 16.03268101698502, 2.3887755300404345, 10.333563936728627], "isController": false}, {"data": ["Load Page1-0", 5050, 0, 0.0, 319.671485148515, 3, 5240, 293.0, 541.9000000000005, 631.0, 806.4899999999998, 16.0812149119036, 64.59259172462272, 8.545788721893699], "isController": false}, {"data": ["Login With Password", 5000, 0, 0.0, 1720.9304000000016, 93, 8279, 1723.5, 2592.0, 2837.95, 3458.639999999992, 15.892945121660496, 70.88263146942197, 21.720254863241205], "isController": false}, {"data": ["Load Page1-9", 5000, 0, 0.0, 26.84200000000001, 2, 483, 17.0, 60.0, 80.0, 136.98999999999978, 16.025538297831424, 2.424801663931641, 10.17261733298184], "isController": false}, {"data": ["Load Page2-8", 5000, 0, 0.0, 26.789199999999997, 1, 425, 17.0, 61.0, 81.0, 143.0, 16.0352004720763, 2.3891509140866027, 10.319528428806917], "isController": false}, {"data": ["Load Page2-9", 5000, 0, 0.0, 26.596799999999945, 1, 377, 18.0, 58.0, 76.0, 133.0, 16.03689769421485, 2.3948851517571628, 10.195332420833854], "isController": false}, {"data": ["Load Page1-7", 5000, 0, 0.0, 27.02539999999999, 1, 437, 18.0, 61.0, 83.0, 137.98999999999978, 16.02137892804158, 3.2701449313964552, 10.15433118953932], "isController": false}, {"data": ["Load Page2-6", 5000, 0, 0.0, 26.815999999999978, 1, 458, 18.0, 59.0, 78.0, 135.97999999999956, 16.033966354325003, 2.388967037772818, 10.31873420654314], "isController": false}, {"data": ["Load Page1-8", 5000, 0, 0.0, 26.551599999999933, 2, 399, 17.0, 59.0, 79.0, 138.98999999999978, 16.024459735340024, 2.6515473218320444, 10.29712377973739], "isController": false}, {"data": ["Load Page2-7", 5000, 0, 0.0, 26.79500000000004, 1, 297, 18.0, 61.0, 80.0, 135.98999999999978, 16.0344805469682, 2.389043649463807, 10.178137065946613], "isController": false}, {"data": ["Load Page1-5", 5000, 0, 0.0, 25.873799999999974, 2, 407, 17.0, 58.0, 78.0, 137.98999999999978, 16.01629818503309, 2.820526417682634, 10.354442931126714], "isController": false}, {"data": ["Load Page2-4", 5000, 0, 0.0, 28.036399999999976, 2, 314, 19.0, 63.0, 84.0, 136.0, 16.033555023954133, 2.388905751957697, 10.475047178735657], "isController": false}, {"data": ["Load Page1-6", 5000, 0, 0.0, 26.64659999999999, 2, 273, 18.0, 59.0, 81.0, 131.98999999999978, 16.019377038465727, 4.876210764540788, 10.293857700274252], "isController": false}, {"data": ["Load Page2-5", 5000, 0, 0.0, 26.422999999999938, 1, 488, 18.0, 58.0, 78.0, 127.0, 16.033709270370025, 2.3889287337698777, 10.381200435796217], "isController": false}, {"data": ["Load Page1", 5000, 0, 0.0, 557.5001999999993, 65, 5651, 524.5, 856.0, 962.9499999999998, 1205.0, 15.920169900053173, 94.298114036973, 100.7438923263189], "isController": false}, {"data": ["Load Page2", 5000, 0, 0.0, 521.5901999999994, 60, 5882, 491.0, 796.0, 896.0, 1144.9799999999996, 16.028929011079196, 85.98945940132752, 101.48002615119769], "isController": false}, {"data": ["Login", 5000, 0, 0.0, 3039.0122000000065, 326, 10990, 3030.5, 4048.9000000000005, 4376.749999999999, 6721.889999999998, 15.876241522087026, 272.1945267252712, 249.75822220625778], "isController": true}, {"data": ["Login With Password-0", 5000, 0, 0.0, 1394.4676000000043, 71, 7973, 1402.0, 2198.9000000000005, 2412.0, 2804.9699999999993, 15.895926192035507, 6.947637428229894, 11.944608757542618], "isController": false}, {"data": ["Post Message", 5000, 0, 0.0, 238.99140000000065, 31, 5263, 216.0, 356.0, 412.0, 559.9399999999987, 16.02584648521135, 22.387118444627497, 27.336726171970156], "isController": false}, {"data": ["Login With Password-1", 5000, 0, 0.0, 325.6188000000004, 19, 5415, 290.0, 527.0, 609.0, 814.9599999999991, 15.920271281422634, 64.0462283633563, 9.794698151656505], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 130100, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
