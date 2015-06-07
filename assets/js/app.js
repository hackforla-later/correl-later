$( document ).ready(function() {

    
    nv.addGraph(function() {
        var chart = nv.models.cumulativeLineChart()
            .useInteractiveGuideline(true)
            .x(function(d) { return parseFloat(d[0])})
            .y(function(d) { return d[1] })

        chart.dispatch.on('renderEnd', function() {
            console.log('render complete: cumulative line with guide line');
        });

        chart.xAxis.tickFormat(function(d) {
            var minute = 60000;
            var date_temp = new Date(d*1000 );
            date_temp =   new Date( date_temp.getTime() + ( date_temp.getTimezoneOffset() * minute ) );
            return d3.time.format('%m/%d/%y')(date_temp)
        });


        chart.xAxis.axisLabel('Date')



        chart.yAxis.tickFormat(d3.format("%"));

        chart.yAxis.axisLabel('Percent of Drought')

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
            url: "data/drought_data_d3.json",
            type: "GET",
            dataType: "json",
            async: false
        });
                

        return ajax_call.responseJSON;
       
    }
});
