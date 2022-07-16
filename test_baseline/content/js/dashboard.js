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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8948645161290323, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9999, 500, 1500, "Load Page1-3"], "isController": false}, {"data": [1.0, 500, 1500, "Load Page2-2"], "isController": false}, {"data": [0.9997, 500, 1500, "Load Page1-4"], "isController": false}, {"data": [0.9999, 500, 1500, "Load Page2-3"], "isController": false}, {"data": [0.99845, 500, 1500, "Load Page1-1"], "isController": false}, {"data": [0.9776, 500, 1500, "Load Page2-0"], "isController": false}, {"data": [1.0, 500, 1500, "Load Page1-2"], "isController": false}, {"data": [0.99995, 500, 1500, "Load Page2-1"], "isController": false}, {"data": [0.9685, 500, 1500, "Load Page1-0"], "isController": false}, {"data": [0.2149, 500, 1500, "Login With Password"], "isController": false}, {"data": [1.0, 500, 1500, "Load Page1-9"], "isController": false}, {"data": [1.0, 500, 1500, "Load Page2-8"], "isController": false}, {"data": [0.9998, 500, 1500, "Load Page2-9"], "isController": false}, {"data": [0.9998, 500, 1500, "Load Page1-7"], "isController": false}, {"data": [1.0, 500, 1500, "Load Page2-6"], "isController": false}, {"data": [1.0, 500, 1500, "Load Page1-8"], "isController": false}, {"data": [0.9999, 500, 1500, "Load Page2-7"], "isController": false}, {"data": [0.9998, 500, 1500, "Load Page1-5"], "isController": false}, {"data": [0.999, 500, 1500, "Load Page2-4"], "isController": false}, {"data": [1.0, 500, 1500, "Load Page1-6"], "isController": false}, {"data": [1.0, 500, 1500, "Load Page2-5"], "isController": false}, {"data": [0.6755, 500, 1500, "Load Page1"], "isController": false}, {"data": [0.699, 500, 1500, "Load Page2"], "isController": false}, {"data": [0.0125, 500, 1500, "Login"], "isController": true}, {"data": [0.33, 500, 1500, "Login With Password-0"], "isController": false}, {"data": [0.9903, 500, 1500, "Post Message"], "isController": false}, {"data": [0.9318, 500, 1500, "Login With Password-1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 150000, 0, 0.0, 208.62397333333203, 1, 8189, 33.0, 526.0, 1019.9000000000015, 2383.970000000005, 453.0763886791313, 3942.7512379368413, 465.2511205381415], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Load Page1-3", 5000, 0, 0.0, 16.591600000000028, 1, 575, 7.0, 41.0, 61.0, 114.0, 15.196552206235449, 5.810900372923391, 8.414497168882324], "isController": false}, {"data": ["Load Page2-2", 5000, 0, 0.0, 13.325399999999993, 2, 441, 6.0, 30.900000000000546, 48.0, 101.0, 15.200063232263046, 6.094423790302967, 8.357066015394624], "isController": false}, {"data": ["Load Page1-4", 5000, 0, 0.0, 72.03260000000029, 5, 674, 55.0, 158.0, 196.0, 291.9499999999989, 15.19673695664067, 370.07260051121824, 8.459121157505061], "isController": false}, {"data": ["Load Page2-3", 5000, 0, 0.0, 17.190000000000015, 1, 506, 8.0, 43.0, 63.0, 118.0, 15.200109440787974, 5.812409036845065, 8.41646684856131], "isController": false}, {"data": ["Load Page1-1", 10000, 0, 0.0, 53.94020000000009, 24, 960, 40.0, 90.0, 116.0, 232.97999999999956, 30.29651196257775, 108.64090723094424, 25.607061624620155], "isController": false}, {"data": ["Load Page2-0", 10000, 0, 0.0, 153.90580000000085, 2, 5487, 72.0, 404.0, 486.9499999999989, 672.0, 30.395968278767505, 110.23213365354219, 16.400168431659225], "isController": false}, {"data": ["Load Page1-2", 5000, 0, 0.0, 12.593999999999994, 1, 427, 7.0, 26.0, 44.0, 95.98999999999978, 15.195720884998783, 6.092534342329199, 8.35467857251398], "isController": false}, {"data": ["Load Page2-1", 10000, 0, 0.0, 49.71169999999991, 24, 671, 39.0, 85.0, 107.0, 172.0, 30.396522637810232, 109.0023813775704, 25.691592131860116], "isController": false}, {"data": ["Load Page1-0", 10000, 0, 0.0, 171.42579999999958, 2, 5890, 78.0, 438.0, 531.0, 712.9899999999998, 30.285409701022434, 109.83032516403335, 16.340516464662983], "isController": false}, {"data": ["Login With Password", 5000, 0, 0.0, 1730.5661999999998, 93, 8189, 1738.5, 2629.9000000000005, 2891.0, 3720.859999999997, 15.112086344416538, 67.1930554626792, 20.6530862847238], "isController": false}, {"data": ["Load Page1-9", 5000, 0, 0.0, 26.870399999999947, 1, 433, 17.0, 59.0, 81.0, 140.97999999999956, 15.197845553414348, 3.8077727101406103, 8.192588618637421], "isController": false}, {"data": ["Load Page2-8", 5000, 0, 0.0, 26.768599999999978, 1, 411, 17.0, 60.0, 80.0, 136.0, 15.200109440787974, 25.332080828481967, 8.312559850430924], "isController": false}, {"data": ["Load Page2-9", 5000, 0, 0.0, 27.404200000000053, 1, 665, 18.0, 62.0, 81.0, 139.98999999999978, 15.20057154148996, 3.8137996488667976, 8.194058096584431], "isController": false}, {"data": ["Load Page1-7", 5000, 0, 0.0, 25.821600000000014, 2, 761, 16.0, 57.900000000000546, 78.94999999999982, 144.0, 15.19766077605335, 84.05553092268039, 8.177647546489645], "isController": false}, {"data": ["Load Page2-6", 5000, 0, 0.0, 30.354399999999963, 1, 447, 21.0, 65.0, 87.0, 148.0, 15.200017024019068, 236.4993508167729, 8.312509310010427], "isController": false}, {"data": ["Load Page1-8", 5000, 0, 0.0, 25.804799999999975, 1, 474, 16.0, 59.0, 78.0, 137.98999999999978, 15.19766077605335, 25.327851537091412, 8.311220736904176], "isController": false}, {"data": ["Load Page2-7", 5000, 0, 0.0, 26.035600000000052, 1, 591, 17.0, 59.0, 77.0, 126.98999999999978, 15.200063232263046, 84.06896691440235, 8.178940274391541], "isController": false}, {"data": ["Load Page1-5", 5000, 0, 0.0, 27.30280000000004, 2, 673, 16.0, 63.0, 87.94999999999982, 144.98999999999978, 15.197014090671464, 41.488442100896016, 8.370230417127642], "isController": false}, {"data": ["Load Page2-4", 5000, 0, 0.0, 74.66639999999961, 5, 857, 60.0, 153.0, 193.0, 293.9499999999989, 15.199878400972791, 370.1492497435021, 8.460869813041496], "isController": false}, {"data": ["Load Page1-6", 5000, 0, 0.0, 29.9532, 1, 497, 21.0, 66.0, 85.0, 140.97999999999956, 15.19742981067042, 236.45894756278818, 8.311094427710385], "isController": false}, {"data": ["Load Page2-5", 5000, 0, 0.0, 28.647400000000033, 2, 414, 18.0, 66.0, 89.94999999999982, 142.0, 15.199878400972791, 41.49641021621827, 8.371808025535795], "isController": false}, {"data": ["Load Page1", 5000, 0, 0.0, 627.4819999999994, 85, 6588, 588.0, 949.0, 1084.9499999999998, 1358.8499999999967, 15.14004542013626, 909.7596340367146, 91.32818414080242], "isController": false}, {"data": ["Load Page2", 5000, 0, 0.0, 595.0544000000017, 96, 6310, 557.0, 901.0, 1015.8499999999995, 1309.9899999999998, 15.194797301403998, 913.0582485431988, 91.65845989333252], "isController": false}, {"data": ["Login", 5000, 0, 0.0, 3189.6206000000016, 300, 9662, 3151.0, 4285.0, 4662.9, 7157.159999999982, 15.094476327332776, 1902.259536383537, 228.4812113628576], "isController": true}, {"data": ["Login With Password-0", 5000, 0, 0.0, 1401.5757999999985, 65, 6974, 1421.0, 2263.0, 2465.95, 2910.9299999999985, 15.113365353516729, 6.605603317988229, 11.35657236808299], "isController": false}, {"data": ["Post Message", 5000, 0, 0.0, 236.51800000000085, 21, 5491, 213.0, 365.0, 413.0, 540.9899999999998, 15.197522195981167, 21.23743307391163, 25.92134800217173], "isController": false}, {"data": ["Login With Password-1", 5000, 0, 0.0, 328.19280000000003, 21, 5825, 285.0, 535.9000000000005, 620.0, 893.9599999999991, 15.142016977229435, 60.70801031152429, 9.31588935122514], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 150000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
