$( document ).ready(function() {

    nv.addGraph(function() {
        var chart = nv.models.cumulativeLineChart()
            .useInteractiveGuideline(true)
            .x(function(d) { return d[0] })
            .y(function(d) { return d[1]/100 })
            .color(d3.scale.category10().range())
            .duration(300)
            .clipVoronoi(false);
        chart.dispatch.on('renderEnd', function() {
            console.log('render complete: cumulative line with guide line');
        });

        chart.xAxis.tickFormat(function(d) {
            return d3.time.format('%m/%d/%y')(new Date(d))
        });

        chart.yAxis.tickFormat(d3.format(''));

        d3.select('#chart1 svg')
            .datum(cumulativeTestData())
            .call(chart);

        nv.utils.windowResize(chart.update);

        chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
        chart.state.dispatch.on('change', function(state){
            nv.log('state', JSON.stringify(state));
        });

        return chart;
    });


    function cumulativeTestData() {

        var ajax_call = $.ajax({
            url: "data/sample.json",
            type: "GET",
            dataType: "json",
            async: false
        });

        return ajax_call.responseJSON;
    }
});