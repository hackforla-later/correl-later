$( document ).ready(function() {

    var getDroughtData = function(dir) {
        var data = null;
        $.ajax({
            url: "data/converted_json/" + dir + "/drought.json",
            type: "GET",
            dataType: "json",
            async: false
        }).success(function(d) {
            return data = d;
        }).error(function() {
            return [];
        });

        return data;
    };

    var monthlyDroughtData = getDroughtData("monthly");
    var yearlyDroughtData = getDroughtData("yearly");

    var updateSelect = function(chartId, chartTitle) {
        $("#charts-list").append("<option class='" + chartId + "'>Water Abundance Score vs. " + chartTitle + "</option>");
    };

    $("#charts-list").bind('change', function() {
        var chart = $(this).find(":selected");
        window.location = "#" + chart.attr("class");
    });

    var renderData = function() {
        $.ajax({
            url: "data/_index.json",
            type: "GET",
            dataType: "json"
        }).success(function(charts) {
            for (var i=0; i < charts["monthly"].length; i++) {
                $.ajax({
                    url: "data/converted_json/monthly/" + charts["monthly"][i].file,
                    type: "GET",
                    dataType: "json"
                }).success(function(secondary) {
                    addHCGraph(monthlyDroughtData, secondary, "chart");
                });
            }
            for (var i=0; i < charts["yearly"].length; i++) {
                var ts = new Date().getTime();
                $.ajax({
                    url: "data/converted_json/yearly/" + charts["yearly"][i].file,
                    type: "GET",
                    dataType: "json"
                }).success(function(secondary) {
                    addHCGraph(yearlyDroughtData, secondary, "chart");
                });
            }
        });
    };

    var addHCGraph = function(droughtData, secondary, id) {
        var seconds = new Date().getTime();
        $("#charts-content").append("<div id='" + id + seconds + "'></div>");
        updateSelect(id + seconds, secondary[0]["yAxisLabel"]);

        $("div#chart" + seconds).highcharts({
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: "Drought vs. " + secondary[0]["key"]
            },
            subtitle: {
                text: secondary[0].hasOwnProperty("correlation") ? "r = " + secondary[0]["correlation"] : ""
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Date'
                }
            },
            yAxis: [
                { // Primary yAxis
                    labels: {
                        format: "{value}",
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: secondary[0]["key"],
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    }
                },
                { // Secondary yAxis
                    labels: {
                        format: "{value}",
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    title: {
                        text: droughtData[0]["key"],
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    opposite: true
                }
            ],
            tooltip: {
                shared: true
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 80,
                verticalAlign: 'top',
                y: -10,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            series: [
                {
                    name: droughtData[0]["key"],
                    type: 'spline',
                    yAxis: 1,
                    data: droughtData[0]["values"]
                },
                {
                    name: secondary[0]["key"],
                    type: 'spline',
                    data: secondary[0]["values"]
                }
            ]
        })
        .after("<hr class='chart-separator'>")
    };


    var addNvd3Graph = function(data, id) {
        nv.addGraph(function () {
            var chart = nv.models.cumulativeLineChart()
                .useInteractiveGuideline(true)
                .x(function (d) {
                    return d[0];
                })
                .y(function (d) {
                    return d[1] / 100;
                })
                .color(d3.scale.category10().range())
                .duration(300)
                .clipVoronoi(false);
            chart.dispatch.on('renderEnd', function () {
                console.log('render complete: cumulative line with guide line');
            });

            chart.xAxis.tickFormat(function (d) {
                return d3.time.format('%m/%d/%y')(new Date(d))
            });

            chart.yAxis.tickFormat(d3.format(''));

            d3.select("#charts div:first-child")
                .append("svg")
                .attr("class", id)
                .datum([droughtData[0], data[0]])
                .call(chart);

            nv.utils.windowResize(chart.update);

            chart.dispatch.on('stateChange', function (e) {
                nv.log('New State:', JSON.stringify(e));
            });
            chart.state.dispatch.on('change', function (state) {
                nv.log('state', JSON.stringify(state));
            });

            return chart;
        });
    };

    // Generate all the charts
    renderData();
});