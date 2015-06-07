$( document ).ready(function() {

    var getDroughtData = function() {
        var data = null;
        $.ajax({
            url: "data/drought.json",
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

    var droughtData = getDroughtData();

    var renderData = function() {
        $.ajax({
            url: "data/_index.json",
            type: "GET",
            dataType: "json"
        }).success(function(charts) {
            for (var i=0; i < charts.length; i++) {
                $.ajax({
                    url: "data/" + charts[i].file,
                    type: "GET",
                    dataType: "json"
                }).success(function(secondary) {
                    addHCGraph(droughtData, secondary, "chart");
                });
            }
        });
    };

    var addHCGraph = function(droughtData, secondary, id) {
        var seconds = new Date().getTime();
        $("#charts-content").append("<div id='" + id + seconds + "'></div>");

        $("div#" + id + seconds).highcharts({
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: "Drought vs. " + secondary[0]["key"]
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    month: '%e. %b',
                    year: '%b'
                },
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
                x: 120,
                verticalAlign: 'top',
                y: 100,
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
        .after("<hr>")
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