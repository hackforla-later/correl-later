$( document ).ready(function() {

    var getDroughtData = function() {
        var data = null;
        $.ajax({
            url: "data/drought_data_d3.json",
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
                }).success(function(chart) {
                    addGraph(chart, "chart" + i);
                });
            }
        });
    };

    var addGraph = function(data, id) {
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