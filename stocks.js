$('#loader').addClass('d-none');
$('#alertcard').addClass('d-none');

let searchVal = document.getElementById('inputsearch');
let datepicker = document.getElementById('datepicker');

datepicker.addEventListener('input', function (e) {
    var day = new Date(this.value).getUTCDay();
    if ([6, 0].includes(day)) {
        e.preventDefault();
        this.value = '';
        // alert('Markets are closed at Weekends');
        $('#alertweekend').removeClass('d-none');
    }
});




$(document).ready(function () {

    $('#getDataBtn').on('click', getData);

});

// console.log(datevalue);

function getData() {

    $.ajax({


        url: `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${searchVal.value}.BSE&outputsize=full&apikey=DEMO`, // API URL
        type: 'GET', // GET OR POST

        beforeSend: function (response, status) {
            // THIS FUNCTION CALL BEFORE AJAX API HITS
            // HERE WE CAN SHOW OUR LOADER.
            $('#alertweekend').addClass('d-none');
            $('#loader').removeClass('d-none');
            $('.data').addClass('d-none');

        },

        success: function (response, status, error, data) {
            // ONCE OUR API CALL SEND SUCCESS
            // THIS FUNCTION GETS CALLED.
            let datevalue = document.getElementById('datepicker').value;

            // Variables for Chart 

            let dates = response['Time Series (Daily)'];




            // console.log(typeof(latestdate));
            // console.log(befonedayclose);
            // console.log(beftwodayclose);
            // console.log(befthreedayclose);
            // console.log(beffourdayclose);
            // console.log(beffivedayclose);
            // console.log(befsixdayclose);
            // console.log(befsevendayclose);
            // console.log(befeightdayclose);
            // console.log(befninedayclose);
            // console.log(beftendayclose);





            if (response['Error Message']) {
                $('#alertweekend').addClass('d-none');
                $('#alertcard').removeClass('d-none');
                $('#loader').addClass('d-none');
                $('#date').text("");
                // $('#symbolname').text("");
                $('#open').text("");
                $('#high').text("");
                $('#low').text("");
                $('#close').text("");
                $('#volume').text("");

            }

            else if (datevalue == "" || datevalue == undefined) {


                let latestdate = response['Meta Data']['3. Last Refreshed'];
                let symbolname = response['Meta Data']['2. Symbol'];
                let open = response['Time Series (Daily)'][latestdate]['1. open'];
                let high = response['Time Series (Daily)'][latestdate]['2. high'];
                let low = response['Time Series (Daily)'][latestdate]['3. low'];
                let close = response['Time Series (Daily)'][latestdate]['4. close'];
                let volume = response['Time Series (Daily)'][latestdate]['5. volume'];

                $('#alertweekend').addClass('d-none');
                $('#loader').addClass('d-none');
                $('.data').removeClass('d-none');
                $('#date').text(latestdate);
                // $('#symbolname').text(symbolname);
                $('#open').text(open);
                $('#high').text(high);
                $('#low').text(low);
                $('#close').text(close);
                $('#volume').text(volume / 1000 + "k");
                document.getElementById('datepicker').value = "";
                $('#alertcard').addClass('d-none');
                $('#loader').addClass('d-none');




                $('#goBtn').on('click', function () {
                    window.open(`https://www.google.com/finance/quote/${searchVal.value}:NSE?sa=X&ved=2ahUKEwipzdGMluz6AhXktGMGHWFMAXIQ3ecFegQIJRAY`, `_blank`);
                })

                // DAILY CHART GENERATOR FUNCTION
                
                $('#daily').click(function chartGenerateDaily(){
                    console.log('Started Chart GEnerator DAILY');

                    latestdate = Object.keys(dates)[0];
                    befoneday = Object.keys(dates)[1];
                    beftwoday = Object.keys(dates)[2];
                    befthreeday = Object.keys(dates)[3];
                    beffourday = Object.keys(dates)[4];
                    beffiveday = Object.keys(dates)[5];
                    befsixday = Object.keys(dates)[6];
                    befsevenday = Object.keys(dates)[7];
                    befeightday = Object.keys(dates)[8];
                    befnineday = Object.keys(dates)[9];
                    beftenday = Object.keys(dates)[10];


                    const regex = /-/gi

                    let newlatestdate = latestdate.replace(regex,", ");
                    let newbefoneday = befoneday.replace(regex,", ");
                    let newbeftwoday = beftwoday.replace(regex,", ");
                    let newbefthreeday = befthreeday.replace(regex,", ");
                    let newbeffourday = beffourday.replace(regex,", ");
                    let newbeffiveday = beffiveday.replace(regex,", ");
                    let newbefsixday = befsixday.replace(regex,", ");
                    let newbefsevenday = befsevenday.replace(regex,", ");
                    let newbefeightday = befeightday.replace(regex,", ");
                    let newbefnineday = befnineday.replace(regex,", ");
                    let newbeftenday = beftenday.replace(regex,", ");
                    
                    
                    console.log(newlatestdate);
                    console.log(latestdate);

                    latestdateclose = response['Time Series (Daily)'][latestdate]['4. close'];
                    befonedayclose = response['Time Series (Daily)'][befoneday]['4. close'];
                    beftwodayclose = response['Time Series (Daily)'][beftwoday]['4. close'];
                    befthreedayclose = response['Time Series (Daily)'][befthreeday]['4. close'];
                    beffourdayclose = response['Time Series (Daily)'][beffourday]['4. close'];
                    beffivedayclose = response['Time Series (Daily)'][beffiveday]['4. close'];
                    befsixdayclose = response['Time Series (Daily)'][befsixday]['4. close'];
                    befsevendayclose = response['Time Series (Daily)'][befsevenday]['4. close'];
                    befeightdayclose = response['Time Series (Daily)'][befeightday]['4. close'];
                    befninedayclose = response['Time Series (Daily)'][befnineday]['4. close'];
                    beftendayclose = response['Time Series (Daily)'][beftenday]['4. close'];
                    console.log(latestdateclose);


                    var chart = new CanvasJS.Chart("chartContainer", {
                        animationEnabled: true,
                        title: {
                            text: `Stock Price of ${searchVal.value.toUpperCase()} - BSE`
                        },
                        axisX: {
                            valueFormatString: "DD MMM",
                            crosshair: {
                                enabled: true,
                                snapToDataPoint: true
                            }
                        },
                        axisY: {
                            title: "Closing Price (in Rupee)",
                            valueFormatString: "₹##0.00",
                            crosshair: {
                                enabled: true,
                                snapToDataPoint: true,
                                labelFormatter: function (e) {
                                    return "₹" + CanvasJS.formatNumber(e.value, "##0.00");
                                }
                            }
                        },
                        data: [{
                            type: "area",
                            xValueFormatString: "DD MMM",
                            yValueFormatString: "₹##0.00",
                            dataPoints: [
                                // { x: new Date(2022, 10, 31), y: parseFloat(beftendayclose) },
                                { x: new Date(newbeftenday), y: parseFloat(beftendayclose) },
                                { x: new Date(newbefnineday), y: parseFloat(befninedayclose) },
                                { x: new Date(newbefeightday), y: parseFloat(befeightdayclose) },
                                { x: new Date(newbefsevenday), y: parseFloat(befsevendayclose) },
                                { x: new Date(newbefsixday), y: parseFloat(befsixdayclose) },
                                { x: new Date(newbeffiveday), y: parseFloat(beffivedayclose) },
                                { x: new Date(newbeffourday), y: parseFloat(beffourdayclose) },
                                { x: new Date(newbefthreeday), y: parseFloat(befthreedayclose) },
                                { x: new Date(newbeftwoday), y: parseFloat(beftwodayclose) },
                                { x: new Date(newbefoneday), y: parseFloat(befonedayclose) },
                                { x: new Date(newlatestdate), y: parseFloat(latestdateclose) },
                            ]
                        }]
                    });
                    chart.render();
                })
                // chartGenerateDaily();
                $('#daily').click();
                // chartGenerateDaily();

                // WEEKLY CHART GENERATOR FUNCTION 
                $('#weekly').click(function(){
                    let dates = response['Time Series (Daily)'];
                
                    console.log('Started Chart GEnerator Weekly');
                
                    latestweek = Object.keys(dates)[0];
                    befoneweek = Object.keys(dates)[5];
                    beftwoweek = Object.keys(dates)[10];
                    befthreeweek = Object.keys(dates)[15];
                    beffourweek = Object.keys(dates)[20];
                    beffiveweek = Object.keys(dates)[25];
                    befsixweek = Object.keys(dates)[30];
                    befsevenweek = Object.keys(dates)[35];
                    befeightweek = Object.keys(dates)[40];
                    befnineweek = Object.keys(dates)[45];
                    beftenweek = Object.keys(dates)[50];
                    befelevenweek = Object.keys(dates)[55];
                    beftwelveweek = Object.keys(dates)[60];


                    console.log(latestweek);
                    console.log(befoneweek);
                    console.log(beftwoweek);
                    console.log(befthreeweek);
                    console.log(beffourweek);
                    console.log(beffiveweek);
                    console.log(befsixweek);
                    console.log(befsevenweek);
                    console.log(befeightweek);
                    console.log(befnineweek);
                    console.log(beftenweek);
                    console.log(befelevenweek);
                    console.log(beftwelveweek);
                    
                
                
                    const regex = /-/gi
                
                    let newlatestweek = latestweek.replace(regex,", ");
                    let newbefoneweek = befoneweek.replace(regex,", ");
                    let newbeftwoweek = beftwoweek.replace(regex,", ");
                    let newbefthreeweek = befthreeweek.replace(regex,", ");
                    let newbeffourweek = beffourweek.replace(regex,", ");
                    let newbeffiveweek = beffiveweek.replace(regex,", ");
                    let newbefsixweek = befsixweek.replace(regex,", ");
                    let newbefsevenweek = befsevenweek.replace(regex,", ");
                    let newbefeightweek = befeightweek.replace(regex,", ");
                    let newbefnineweek = befnineweek.replace(regex,", ");
                    let newbeftenweek = beftenweek.replace(regex,", ");
                    let newbefelevenweek = befelevenweek.replace(regex,", ");
                    let newbeftwelveweek = beftwelveweek.replace(regex,", ");
                    
                    
                    console.log(latestweek);
                    console.log(newlatestweek);
                
                    latestweekclose = response['Time Series (Daily)'][latestweek]['4. close'];
                    befoneweekclose = response['Time Series (Daily)'][befoneweek]['4. close'];
                    beftwoweekclose = response['Time Series (Daily)'][beftwoweek]['4. close'];
                    befthreeweekclose = response['Time Series (Daily)'][befthreeweek]['4. close'];
                    beffourweekclose = response['Time Series (Daily)'][beffourweek]['4. close'];
                    beffiveweekclose = response['Time Series (Daily)'][beffiveweek]['4. close'];
                    befsixweekclose = response['Time Series (Daily)'][befsixweek]['4. close'];
                    befsevenweekclose = response['Time Series (Daily)'][befsevenweek]['4. close'];
                    befeightweekclose = response['Time Series (Daily)'][befeightweek]['4. close'];
                    befnineweekclose = response['Time Series (Daily)'][befnineweek]['4. close'];
                    beftenweekclose = response['Time Series (Daily)'][beftenweek]['4. close'];
                    befelevenweekclose = response['Time Series (Daily)'][befelevenweek]['4. close'];
                    beftwelveweekclose = response['Time Series (Daily)'][beftwelveweek]['4. close'];
                    console.log(latestweekclose);
                
                
                    var chart = new CanvasJS.Chart("chartContainer", {
                        animationEnabled: true,
                        title: {
                            text: `Stock Price of ${searchVal.value.toUpperCase()} - BSE`
                        },
                        axisX: {
                            valueFormatString: "DD MMM YYYY",
                            crosshair: {
                                enabled: true,
                                snapToDataPoint: true
                            }
                        },
                        axisY: {
                            title: "Closing Price (in Rupee)",
                            valueFormatString: "₹##0.00",
                            crosshair: {
                                enabled: true,
                                snapToDataPoint: true,
                                labelFormatter: function (e) {
                                    return "₹" + CanvasJS.formatNumber(e.value, "##0.00");
                                }
                            }
                        },
                        data: [{
                            type: "area",
                            xValueFormatString: "DD MMM YYYY",
                            yValueFormatString: "₹##0.00",
                            dataPoints: [
                                // { x: new Date(2022, 10, 31), y: parseFloat(beftendayclose) },
                                { x: new Date(newbeftwelveweek), y: parseFloat(beftwelveweekclose) },
                                { x: new Date(newbefelevenweek), y: parseFloat(befelevenweekclose) },
                                { x: new Date(newbeftenweek), y: parseFloat(beftenweekclose) },
                                { x: new Date(newbefnineweek), y: parseFloat(befnineweekclose) },
                                { x: new Date(newbefeightweek), y: parseFloat(befeightweekclose) },
                                { x: new Date(newbefsevenweek), y: parseFloat(befsevenweekclose) },
                                { x: new Date(newbefsixweek), y: parseFloat(befsixweekclose) },
                                { x: new Date(newbeffiveweek), y: parseFloat(beffiveweekclose) },
                                { x: new Date(newbeffourweek), y: parseFloat(beffourweekclose) },
                                { x: new Date(newbefthreeweek), y: parseFloat(befthreeweekclose) },
                                { x: new Date(newbeftwoweek), y: parseFloat(beftwoweekclose) },
                                { x: new Date(newbefoneweek), y: parseFloat(befoneweekclose) },
                                { x: new Date(newlatestweek), y: parseFloat(latestweekclose) },
                            ]
                        }]
                    });
                    chart.render();
                })

                // MONTHLY CHART GENERATOR FUNCTION 

                $('#monthly').click(function(){
                    let dates = response['Time Series (Daily)'];
                
                    console.log('Started Chart GEnerator Weekly');
                
                    latestmonth = Object.keys(dates)[0];
                    befonemonth = Object.keys(dates)[21];
                    beftwomonth = Object.keys(dates)[42];
                    befthreemonth = Object.keys(dates)[63];
                    beffourmonth = Object.keys(dates)[84];
                    beffivemonth = Object.keys(dates)[105];
                    befsixmonth = Object.keys(dates)[126];
                    befsevenmonth = Object.keys(dates)[147];
                    befeightmonth = Object.keys(dates)[168];
                    befninemonth = Object.keys(dates)[189];
                    beftenmonth = Object.keys(dates)[210];
                    befelevenmonth = Object.keys(dates)[231];
                    beftwelvemonth = Object.keys(dates)[252];


                    console.log(latestmonth);
                    console.log(befonemonth);
                    console.log(beftwomonth);
                    console.log(befthreemonth);
                    console.log(beffourmonth);
                    console.log(beffivemonth);
                    console.log(befsixmonth);
                    console.log(befsevenmonth);
                    console.log(befeightmonth);
                    console.log(befninemonth);
                    console.log(beftenmonth);
                    console.log(befelevenmonth);
                    console.log(beftwelvemonth);
                    
                
                
                    const regex = /-/gi
                
                    let newlatestmonth = latestmonth.replace(regex,", ");
                    let newbefonemonth = befonemonth.replace(regex,", ");
                    let newbeftwomonth = beftwomonth.replace(regex,", ");
                    let newbefthreemonth = befthreemonth.replace(regex,", ");
                    let newbeffourmonth = beffourmonth.replace(regex,", ");
                    let newbeffivemonth = beffivemonth.replace(regex,", ");
                    let newbefsixmonth = befsixmonth.replace(regex,", ");
                    let newbefsevenmonth = befsevenmonth.replace(regex,", ");
                    let newbefeightmonth = befeightmonth.replace(regex,", ");
                    let newbefninemonth = befninemonth.replace(regex,", ");
                    let newbeftenmonth = beftenmonth.replace(regex,", ");
                    let newbefelevenmonth = befelevenmonth.replace(regex,", ");
                    let newbeftwelvemonth = beftwelvemonth.replace(regex,", ");
                    
                    
                    console.log(latestmonth);
                    console.log(newlatestmonth);
                
                    latestmonthclose = response['Time Series (Daily)'][latestmonth]['4. close'];
                    befonemonthclose = response['Time Series (Daily)'][befonemonth]['4. close'];
                    beftwomonthclose = response['Time Series (Daily)'][beftwomonth]['4. close'];
                    befthreemonthclose = response['Time Series (Daily)'][befthreemonth]['4. close'];
                    beffourmonthclose = response['Time Series (Daily)'][beffourmonth]['4. close'];
                    beffivemonthclose = response['Time Series (Daily)'][beffivemonth]['4. close'];
                    befsixmonthclose = response['Time Series (Daily)'][befsixmonth]['4. close'];
                    befsevenmonthclose = response['Time Series (Daily)'][befsevenmonth]['4. close'];
                    befeightmonthclose = response['Time Series (Daily)'][befeightmonth]['4. close'];
                    befninemonthclose = response['Time Series (Daily)'][befninemonth]['4. close'];
                    beftenmonthclose = response['Time Series (Daily)'][beftenmonth]['4. close'];
                    befelevenmonthclose = response['Time Series (Daily)'][befelevenmonth]['4. close'];
                    beftwelvemonthclose = response['Time Series (Daily)'][beftwelvemonth]['4. close'];
                    console.log(latestmonthclose);
                
                
                    var chart = new CanvasJS.Chart("chartContainer", {
                        animationEnabled: true,
                        title: {
                            text: `Stock Price of ${searchVal.value.toUpperCase()} - BSE`
                        },
                        axisX: {
                            valueFormatString: "DD MMM YYYY",
                            crosshair: {
                                enabled: true,
                                snapToDataPoint: true
                            }
                        },
                        axisY: {
                            title: "Closing Price (in Rupee)",
                            valueFormatString: "₹##0.00",
                            crosshair: {
                                enabled: true,
                                snapToDataPoint: true,
                                labelFormatter: function (e) {
                                    return "₹" + CanvasJS.formatNumber(e.value, "##0.00");
                                }
                            }
                        },
                        data: [{
                            type: "area",
                            xValueFormatString: "DD MMM YYYY",
                            yValueFormatString: "₹##0.00",
                            dataPoints: [
                                // { x: new Date(2022, 10, 31), y: parseFloat(beftendayclose) },
                                { x: new Date(newbeftwelvemonth), y: parseFloat(beftwelvemonthclose) },
                                { x: new Date(newbefelevenmonth), y: parseFloat(befelevenmonthclose) },
                                { x: new Date(newbeftenmonth), y: parseFloat(beftenmonthclose) },
                                { x: new Date(newbefninemonth), y: parseFloat(befninemonthclose) },
                                { x: new Date(newbefeightmonth), y: parseFloat(befeightmonthclose) },
                                { x: new Date(newbefsevenmonth), y: parseFloat(befsevenmonthclose) },
                                { x: new Date(newbefsixmonth), y: parseFloat(befsixmonthclose) },
                                { x: new Date(newbeffivemonth), y: parseFloat(beffivemonthclose) },
                                { x: new Date(newbeffourmonth), y: parseFloat(beffourmonthclose) },
                                { x: new Date(newbefthreemonth), y: parseFloat(befthreemonthclose) },
                                { x: new Date(newbeftwomonth), y: parseFloat(beftwomonthclose) },
                                { x: new Date(newbefonemonth), y: parseFloat(befonemonthclose) },
                                { x: new Date(newlatestmonth), y: parseFloat(latestmonthclose) },
                            ]
                        }]
                    });
                    chart.render();
                })


                // YEARLY CHART GENERATOR FUNCTION 

                $('#yearly').click(function(){
                    let dates = response['Time Series (Daily)'];
                
                    console.log('Started Chart GEnerator Weekly');
                
                    latestyear = Object.keys(dates)[0];
                    befoneyear = Object.keys(dates)[250];
                    beftwoyear = Object.keys(dates)[500];
                    befthreeyear = Object.keys(dates)[750];
                    beffouryear = Object.keys(dates)[1000];
                    beffiveyear = Object.keys(dates)[1250];
                    befsixyear = Object.keys(dates)[1500];
                    befsevenyear = Object.keys(dates)[1750];
                    befeightyear = Object.keys(dates)[2000];
                    befnineyear = Object.keys(dates)[2250];
                    beftenyear = Object.keys(dates)[2500];
                    befelevenyear = Object.keys(dates)[2750];
                    beftwelveyear = Object.keys(dates)[3000];


                    console.log(latestyear);
                    console.log(befoneyear);
                    console.log(beftwoyear);
                    console.log(befthreeyear);
                    console.log(beffouryear);
                    console.log(beffiveyear);
                    console.log(befsixyear);
                    console.log(befsevenyear);
                    console.log(befeightyear);
                    console.log(befnineyear);
                    console.log(beftenyear);
                    console.log(befelevenyear);
                    console.log(beftwelveyear);
                    
                
                
                    const regex = /-/gi
                
                    let newlatestyear = latestyear.replace(regex,", ");
                    let newbefoneyear = befoneyear.replace(regex,", ");
                    let newbeftwoyear = beftwoyear.replace(regex,", ");
                    let newbefthreeyear = befthreeyear.replace(regex,", ");
                    let newbeffouryear = beffouryear.replace(regex,", ");
                    let newbeffiveyear = beffiveyear.replace(regex,", ");
                    let newbefsixyear = befsixyear.replace(regex,", ");
                    let newbefsevenyear = befsevenyear.replace(regex,", ");
                    let newbefeightyear = befeightyear.replace(regex,", ");
                    let newbefnineyear = befnineyear.replace(regex,", ");
                    let newbeftenyear = beftenyear.replace(regex,", ");
                    let newbefelevenyear = befelevenyear.replace(regex,", ");
                    let newbeftwelveyear = beftwelveyear.replace(regex,", ");
                    
                    
                    console.log(latestyear);
                    console.log(newlatestyear);
                
                    latestyearclose = response['Time Series (Daily)'][latestyear]['4. close'];
                    befoneyearclose = response['Time Series (Daily)'][befoneyear]['4. close'];
                    beftwoyearclose = response['Time Series (Daily)'][beftwoyear]['4. close'];
                    befthreeyearclose = response['Time Series (Daily)'][befthreeyear]['4. close'];
                    beffouryearclose = response['Time Series (Daily)'][beffouryear]['4. close'];
                    beffiveyearclose = response['Time Series (Daily)'][beffiveyear]['4. close'];
                    befsixyearclose = response['Time Series (Daily)'][befsixyear]['4. close'];
                    befsevenyearclose = response['Time Series (Daily)'][befsevenyear]['4. close'];
                    befeightyearclose = response['Time Series (Daily)'][befeightyear]['4. close'];
                    befnineyearclose = response['Time Series (Daily)'][befnineyear]['4. close'];
                    beftenyearclose = response['Time Series (Daily)'][beftenyear]['4. close'];
                    befelevenyearclose = response['Time Series (Daily)'][befelevenyear]['4. close'];
                    beftwelveyearclose = response['Time Series (Daily)'][beftwelveyear]['4. close'];
                    console.log(latestyearclose);
                
                
                    var chart = new CanvasJS.Chart("chartContainer", {
                        animationEnabled: true,
                        title: {
                            text: `Stock Price of ${searchVal.value.toUpperCase()} - BSE`
                        },
                        axisX: {
                            valueFormatString: "DD MMM YYYY",
                            crosshair: {
                                enabled: true,
                                snapToDataPoint: true
                            }
                        },
                        axisY: {
                            title: "Closing Price (in Rupee)",
                            valueFormatString: "₹##0.00",
                            crosshair: {
                                enabled: true,
                                snapToDataPoint: true,
                                labelFormatter: function (e) {
                                    return "₹" + CanvasJS.formatNumber(e.value, "##0.00");
                                }
                            }
                        },
                        data: [{
                            type: "area",
                            xValueFormatString: "DD MMM YYYY",
                            yValueFormatString: "₹##0.00",
                            dataPoints: [
                                // { x: new Date(2022, 10, 31), y: parseFloat(beftendayclose) },
                                { x: new Date(newbeftwelveyear), y: parseFloat(beftwelveyearclose) },
                                { x: new Date(newbefelevenyear), y: parseFloat(befelevenyearclose) },
                                { x: new Date(newbeftenyear), y: parseFloat(beftenyearclose) },
                                { x: new Date(newbefnineyear), y: parseFloat(befnineyearclose) },
                                { x: new Date(newbefeightyear), y: parseFloat(befeightyearclose) },
                                { x: new Date(newbefsevenyear), y: parseFloat(befsevenyearclose) },
                                { x: new Date(newbefsixyear), y: parseFloat(befsixyearclose) },
                                { x: new Date(newbeffiveyear), y: parseFloat(beffiveyearclose) },
                                { x: new Date(newbeffouryear), y: parseFloat(beffouryearclose) },
                                { x: new Date(newbefthreeyear), y: parseFloat(befthreeyearclose) },
                                { x: new Date(newbeftwoyear), y: parseFloat(beftwoyearclose) },
                                { x: new Date(newbefoneyear), y: parseFloat(befoneyearclose) },
                                { x: new Date(newlatestyear), y: parseFloat(latestyearclose) },
                            ]
                        }]
                    });
                    chart.render();
                })
                
                

            }

            else {

                console.log(datevalue);


                // console.log(datevalue - 0000-00-01);
                // let latestdate = response['Meta Data'][datevalue];
                let symbolname = response['Meta Data']['2. Symbol'];
                let open = response['Time Series (Daily)'][datevalue]['1. open'];
                let high = response['Time Series (Daily)'][datevalue]['2. high'];
                let low = response['Time Series (Daily)'][datevalue]['3. low'];
                let close = response['Time Series (Daily)'][datevalue]['4. close'];
                let volume = response['Time Series (Daily)'][datevalue]['5. volume'];

                $('#alertweekend').addClass('d-none');
                $('#loader').addClass('d-none');
                $('.data').removeClass('d-none');
                $('#date').text(datevalue);
                $('#symbolname').text(symbolname);
                $('#open').text(open);
                $('#high').text(high);
                $('#low').text(low);
                $('#close').text(close);
                $('#volume').text(volume / 1000 + "k");
                document.getElementById('datepicker').value = "";
                $('.#alertcard').addClass('d-none');
                $('#loader').addClass('d-none');

                $('#goBtn').on('click', function () {
                    window.open(`https://www.google.com/finance/quote/${searchVal.value}:NSE?sa=X&ved=2ahUKEwipzdGMluz6AhXktGMGHWFMAXIQ3ecFegQIJRAY`, `_blank`);
                })
            }
        },

        error: function (error, status) {

        }
    })



}


