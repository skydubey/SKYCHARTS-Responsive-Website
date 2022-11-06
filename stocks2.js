
// GLOBAL VARIABLES

let searchVal = document.getElementById('inputsearch');
let datepicker = document.getElementById('datepicker');

// TO PREVENT USER FROM ENTERING OR SELECTING WEEKENDS ON DATE PICKER 

datepicker.addEventListener('input', function (e) {
    var day = new Date(this.value).getUTCDay();
    if ([6, 0].includes(day)) {
        e.preventDefault();
        this.value = '';
        Swal.fire({
            title: 'Error!',
            text: 'Indian Markets are close on weekends',
            icon: 'error',
            confirmButtonText: 'Okay'
        })
    }
});
$('#launchchart').on('click', function () {
    $('#chartcontainer').removeClass('d-none');
    $('#daily').click();
})

// function sweetloading(){
//     setTimeout(function() {
//         swal.fire({
//             icon: 'success',
//             html: '<h5>Success!</h5>'
//         });
//     }, 500);
// }

function scrolling() {
    window.scrollTo(0, 360);
}

document.getElementById("clicktofocus").addEventListener("click", () => {
    document.getElementById("inputsearch").focus();
});



function getData() {

    $.ajax({


        url: `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${searchVal.value}.BSE&outputsize=full&apikey=OT7RL8UB4YVGID5U`, // API URL
        type: 'GET', // GET OR POST

        beforeSend: function (response, status) {
            // THIS FUNCTION CALL BEFORE AJAX API HITS
            // HERE WE CAN SHOW OUR LOADER.

            // SHOWING ALL LOADING SPINNERS 

            $('#loader').removeClass('d-none');
            $('#getdataloader').removeClass('d-none');

            $('#percentchange').text("");
            $('#rupeechange').text("");
            $('#date').text("");
            $('#date').text("");
            $('#symbolname').text("");
            $('#open').text("");
            $('#high').text("");
            $('#low').text("");
            $('#close').text("");
            $('#volume').text("");

        },

        success: function (response, status, error, data) {

            // ONCE OUR API CALL SEND SUCCESS
            // THIS FUNCTION GETS CALLED.
            let datevalue = document.getElementById('datepicker').value;

            // Variables for Chart 

            let dates = response['Time Series (Daily)'];

            if (response['Error Message']) {


                $('#getdataloader').addClass('d-none');
                $('#loader').addClass('d-none');

                Swal.fire({
                    title: 'Error!',
                    text: 'No Data Found',
                    icon: 'error',
                    confirmButtonText: 'Okay'
                })

                $('#datequery').text("");
                $('#prevclose').text("");
                $('#ltp').text("");
                $('#lastupdated').text("");
                $('#date').text("");
                $('#date').text("");
                $('#symbolname').text("");
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
                let volume = response['Time Series (Daily)'][latestdate]['6. volume'];

                // let latestdateonpage = Object.keys(dates)[0];
                let onedaybefdate = Object.keys(dates)[1];

                let latestclosing = response['Time Series (Daily)'][latestdate]['4. close'];
                let onedaybefclosing = response['Time Series (Daily)'][onedaybefdate]['4. close'];

                let changeinrupee = latestclosing - onedaybefclosing;
                let changeinper = (changeinrupee * 100) / onedaybefclosing;

                $('#containerScrip').removeClass('d-none');
                $('.footer').removeClass('d-none');


                if (Math.sign(changeinrupee) == -1) {

                    $('#rupeechange').removeClass('neutral');
                    $('#ltp').removeClass('neutral');
                    $('#percentchange').removeClass('neutral');

                    $('#rupeechange').removeClass('positive');
                    $('#ltp').removeClass('positive');
                    $('#percentchange').removeClass('positive');
                   

                    $('#rupeechange').addClass('negative');
                    $('#ltp').addClass('negative');
                    $('#percentchange').addClass('negative');
                    $('#rupeechange').text(parseFloat(changeinrupee).toFixed(2));
                    $('#percentchange').text(parseFloat(changeinper).toFixed(2) + "%");
                }
                else if (Math.sign(changeinrupee) == 1) {
                    
                    $('#rupeechange').removeClass('neutral');
                    $('#ltp').removeClass('neutral');
                    $('#percentchange').removeClass('neutral');

                    $('#rupeechange').removeClass('negative');
                    $('#ltp').removeClass('negative');
                    $('#percentchange').removeClass('negative');

                    $('#rupeechange').addClass('positive');
                    $('#ltp').addClass('positive');
                    $('#percentchange').addClass('positive');
                    $('#rupeechange').text("+" + parseFloat(changeinrupee).toFixed(2));
                    $('#percentchange').text("+" + parseFloat(changeinper).toFixed(2) + "%");
                }

                else {

                    // Removinig Classes 

                    $('#rupeechange').removeClass('negative');
                    $('#ltp').removeClass('negative');
                    $('#percentchange').removeClass('negative');

                    $('#rupeechange').removeClass('positive');
                    $('#ltp').removeClass('positive');
                    $('#percentchange').removeClass('positive');

                    // Adding Classes 

                    
                    $('#rupeechange').addClass('neutral');
                    $('#ltp').addClass('neutral');
                    $('#percentchange').addClass('neutral');

                    $('#rupeechange').text(parseFloat(changeinrupee).toFixed(2));
                    $('#percentchange').text(parseFloat(changeinper).toFixed(2) + "%");

                }


                // HIDING ALL LOADING SPINNERS 
                $('#getdataloader').addClass('d-none');
                $('#loader').addClass('d-none');


                // DATA INPUT IN HTML 

               
                $('#lastupdated').text(latestdate);
                $('#datequery').text(latestdate);
                $('#symbolname').text(symbolname);
                $('#open').text(parseFloat(open).toFixed(2));
                $('#high').text(parseFloat(high).toFixed(2));
                $('#low').text(parseFloat(low).toFixed(2));
                $('#ltp').text(parseFloat(close).toFixed(2));
                $('#close').text(parseFloat(close).toFixed(2));
                $('#prevclose').text(parseFloat(onedaybefclosing).toFixed(2));

                $('#volume').text(volume / 1000 + "k");
                document.getElementById('datepicker').value = "";

                $('#goBtn').on('click', function () {
                    window.open(`https://www.google.com/finance/quote/${searchVal.value}:NSE?sa=X&ved=2ahUKEwipzdGMluz6AhXktGMGHWFMAXIQ3ecFegQIJRAY`, `_blank`);
                })

                $('.linktodata').click();
                // DAILY CHART GENERATOR FUNCTION
                $('#daily').click(function chartGenerateDaily() {

                    console.log('Started Chart GEnerator DAILY');

                    let latestyear = Object.keys(dates)[0];
                    var lastKey = Object.keys(dates).reverse()[0];

                    // 2022-01-01
                    // 0123456789

                    if (!(parseInt(lastKey) == parseInt(latestyear) && (parseInt(lastKey)[5] == 1 && parseInt(lastKey)[6] == 0))) {

                        lengthofdata = Object.keys(dates);
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

                        let newlatestdate = latestdate.replace(regex, ", ");
                        let newbefoneday = befoneday.replace(regex, ", ");
                        let newbeftwoday = beftwoday.replace(regex, ", ");
                        let newbefthreeday = befthreeday.replace(regex, ", ");
                        let newbeffourday = beffourday.replace(regex, ", ");
                        let newbeffiveday = beffiveday.replace(regex, ", ");
                        let newbefsixday = befsixday.replace(regex, ", ");
                        let newbefsevenday = befsevenday.replace(regex, ", ");
                        let newbefeightday = befeightday.replace(regex, ", ");
                        let newbefnineday = befnineday.replace(regex, ", ");
                        let newbeftenday = beftenday.replace(regex, ", ");

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
                    }

                    else {
                        alert("Not Enough Data To Show");
                    }



                })

                $('#daily').click();


                // WEEKLY CHART GENERATOR FUNCTION 
                $('#weekly').click(function () {
                    console.log('Started Chart GEnerator Weekly');
                    let dates = response['Time Series (Daily)'];

                    let latestyear = Object.keys(dates)[0];
                    var lastKey = Object.keys(dates).reverse()[0];
                    //2022-01-01
                    //0123456789

                    console.log(parseInt(lastKey[6]));

                    if (parseInt(lastKey) == parseInt(latestyear) && (parseInt(lastKey[6]) >= 9)) {
                        $('#daily').click();
                    }

                    else {


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

                        const regex = /-/gi

                        let newlatestweek = latestweek.replace(regex, ", ");
                        let newbefoneweek = befoneweek.replace(regex, ", ");
                        let newbeftwoweek = beftwoweek.replace(regex, ", ");
                        let newbefthreeweek = befthreeweek.replace(regex, ", ");
                        let newbeffourweek = beffourweek.replace(regex, ", ");
                        let newbeffiveweek = beffiveweek.replace(regex, ", ");
                        let newbefsixweek = befsixweek.replace(regex, ", ");
                        let newbefsevenweek = befsevenweek.replace(regex, ", ");
                        let newbefeightweek = befeightweek.replace(regex, ", ");
                        let newbefnineweek = befnineweek.replace(regex, ", ");
                        let newbeftenweek = beftenweek.replace(regex, ", ");
                        let newbefelevenweek = befelevenweek.replace(regex, ", ");
                        let newbeftwelveweek = beftwelveweek.replace(regex, ", ");

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
                    }
                })

                // MONTHLY CHART GENERATOR FUNCTION 

                $('#monthly').click(function () {

                    let latestyear = Object.keys(dates)[0];
                    var lastKey = Object.keys(dates).reverse()[0];

                    if (parseInt(lastKey) == parseInt(latestyear) && (parseInt(lastKey[6]) >= 9)) {
                        $('#daily').click();
                    }

                    else {
                        let dates = response['Time Series (Daily)'];

                        console.log('Started Chart GEnerator Monthly');

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

                        const regex = /-/gi

                        let newlatestmonth = latestmonth.replace(regex, ", ");
                        let newbefonemonth = befonemonth.replace(regex, ", ");
                        let newbeftwomonth = beftwomonth.replace(regex, ", ");
                        let newbefthreemonth = befthreemonth.replace(regex, ", ");
                        let newbeffourmonth = beffourmonth.replace(regex, ", ");
                        let newbeffivemonth = beffivemonth.replace(regex, ", ");
                        let newbefsixmonth = befsixmonth.replace(regex, ", ");
                        let newbefsevenmonth = befsevenmonth.replace(regex, ", ");
                        let newbefeightmonth = befeightmonth.replace(regex, ", ");
                        let newbefninemonth = befninemonth.replace(regex, ", ");
                        let newbeftenmonth = beftenmonth.replace(regex, ", ");
                        let newbefelevenmonth = befelevenmonth.replace(regex, ", ");
                        let newbeftwelvemonth = beftwelvemonth.replace(regex, ", ");

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
                    }

                })


                // YEARLY CHART GENERATOR FUNCTION 

                $('#yearly').click(function () {
                    let dates = response['Time Series (Daily)'];

                    console.log('Started Chart GEnerator Yearly');


                    // console.log(dates);
                    var lastKey = Object.keys(dates).reverse()[0];
                    // var lastyear = Object.keys(dates).reverse()[0];



                    // console.log("This is lastt key" + parseInt(lastKey[6]));

                    let latestyear = Object.keys(dates)[0];
                    let befoneyear = Object.keys(dates)[250];
                    let beftwoyear = Object.keys(dates)[500];
                    let befthreeyear = Object.keys(dates)[750];
                    let beffouryear = Object.keys(dates)[1000];
                    let beffiveyear = Object.keys(dates)[1250];
                    let befsixyear = Object.keys(dates)[1500];
                    let befsevenyear = Object.keys(dates)[1750];
                    let befeightyear = Object.keys(dates)[2000];
                    let befnineyear = Object.keys(dates)[2250];
                    let beftenyear = Object.keys(dates)[2500];
                    let befelevenyear = Object.keys(dates)[2750];
                    let beftwelveyear = Object.keys(dates)[3000];
                    let befthirteenyear = Object.keys(dates)[3250];
                    let beffourtyear = Object.keys(dates)[3500];
                    let beffiftyear = Object.keys(dates)[3750];
                    let befsixteenyear = Object.keys(dates)[4000];
                    // let befseventyear = Object.keys(dates)[4250];

                    console.log("This is latest year" + parseInt(latestyear));

                    if (parseInt(lastKey) == parseInt(latestyear) && (parseInt(lastKey[6]) >= 9)) {
                        $('#daily').click();
                    }
                    else if (parseInt(lastKey) == parseInt(latestyear)) {
                        $('#weekly').click();
                    }

                    else if (parseInt(lastKey) == (parseInt(latestyear) - 1)) {
                        $('#monthly').click();
                        console.log("This is last key" + parseInt(lastKey[1]));
                    }

                    else if (parseInt(lastKey) == (parseInt(latestyear) - 2)) {
                        const regex = /-/gi
                        var newlatestyear = latestyear.replace(regex, ", ");
                        var newbefoneyear = befoneyear.replace(regex, ", ");
                    }

                    else if (parseInt(lastKey) == (parseInt(latestyear) - 3)) {
                        const regex = /-/gi
                        var newlatestyear = latestyear.replace(regex, ", ");
                        var newbefoneyear = befoneyear.replace(regex, ", ");
                        var newbeftwoyear = beftwoyear.replace(regex, ", ");
                    }
                    else if (parseInt(lastKey) == (parseInt(latestyear) - 4)) {
                        const regex = /-/gi
                        var newlatestyear = latestyear.replace(regex, ", ");
                        var newbefoneyear = befoneyear.replace(regex, ", ");
                        var newbeftwoyear = beftwoyear.replace(regex, ", ");
                        var newbefthreeyear = befthreeyear.replace(regex, ", ");
                    }
                    else if (parseInt(lastKey) == (parseInt(latestyear) - 5)) {
                        const regex = /-/gi
                        var newlatestyear = latestyear.replace(regex, ", ");
                        var newbefoneyear = befoneyear.replace(regex, ", ");
                        var newbeftwoyear = beftwoyear.replace(regex, ", ");
                        var newbefthreeyear = befthreeyear.replace(regex, ", ");
                        var newbeffouryear = beffouryear.replace(regex, ", ");
                    }
                    else if (parseInt(lastKey) == (parseInt(latestyear) - 6)) {
                        const regex = /-/gi
                        var newlatestyear = latestyear.replace(regex, ", ");
                        var newbefoneyear = befoneyear.replace(regex, ", ");
                        var newbeftwoyear = beftwoyear.replace(regex, ", ");
                        var newbefthreeyear = befthreeyear.replace(regex, ", ");
                        var newbeffouryear = beffouryear.replace(regex, ", ");
                        var newbeffiveyear = beffiveyear.replace(regex, ", ");
                    }
                    else if (parseInt(lastKey) == (parseInt(latestyear) - 7)) {
                        const regex = /-/gi
                        var newlatestyear = latestyear.replace(regex, ", ");
                        var newbefoneyear = befoneyear.replace(regex, ", ");
                        var newbeftwoyear = beftwoyear.replace(regex, ", ");
                        var newbefthreeyear = befthreeyear.replace(regex, ", ");
                        var newbeffouryear = beffouryear.replace(regex, ", ");
                        var newbeffiveyear = beffiveyear.replace(regex, ", ");
                        var newbefsixyear = befsixyear.replace(regex, ", ");
                    }
                    else if (parseInt(lastKey) == (parseInt(latestyear) - 8)) {
                        const regex = /-/gi
                        var newlatestyear = latestyear.replace(regex, ", ");
                        var newbefoneyear = befoneyear.replace(regex, ", ");
                        var newbeftwoyear = beftwoyear.replace(regex, ", ");
                        var newbefthreeyear = befthreeyear.replace(regex, ", ");
                        var newbeffouryear = beffouryear.replace(regex, ", ");
                        var newbeffiveyear = beffiveyear.replace(regex, ", ");
                        var newbefsixyear = befsixyear.replace(regex, ", ");
                        var newbefsevenyear = befsevenyear.replace(regex, ", ");
                    }
                    else if (parseInt(lastKey) == (parseInt(latestyear) - 9)) {
                        const regex = /-/gi
                        var newlatestyear = latestyear.replace(regex, ", ");
                        var newbefoneyear = befoneyear.replace(regex, ", ");
                        var newbeftwoyear = beftwoyear.replace(regex, ", ");
                        var newbefthreeyear = befthreeyear.replace(regex, ", ");
                        var newbeffouryear = beffouryear.replace(regex, ", ");
                        var newbeffiveyear = beffiveyear.replace(regex, ", ");
                        var newbefsixyear = befsixyear.replace(regex, ", ");
                        var newbefsevenyear = befsevenyear.replace(regex, ", ");
                        var newbefeightyear = befeightyear.replace(regex, ", ");
                    }
                    else if (parseInt(lastKey) == (parseInt(latestyear) - 10)) {
                        const regex = /-/gi
                        var newlatestyear = latestyear.replace(regex, ", ");
                        var newbefoneyear = befoneyear.replace(regex, ", ");
                        var newbeftwoyear = beftwoyear.replace(regex, ", ");
                        var newbefthreeyear = befthreeyear.replace(regex, ", ");
                        var newbeffouryear = beffouryear.replace(regex, ", ");
                        var newbeffiveyear = beffiveyear.replace(regex, ", ");
                        var newbefsixyear = befsixyear.replace(regex, ", ");
                        var newbefsevenyear = befsevenyear.replace(regex, ", ");
                        var newbefeightyear = befeightyear.replace(regex, ", ");
                        var newbefnineyear = befnineyear.replace(regex, ", ");
                    }
                    else if (parseInt(lastKey) == (parseInt(latestyear) - 11)) {
                        const regex = /-/gi
                        var newlatestyear = latestyear.replace(regex, ", ");
                        var newbefoneyear = befoneyear.replace(regex, ", ");
                        var newbeftwoyear = beftwoyear.replace(regex, ", ");
                        var newbefthreeyear = befthreeyear.replace(regex, ", ");
                        var newbeffouryear = beffouryear.replace(regex, ", ");
                        var newbeffiveyear = beffiveyear.replace(regex, ", ");
                        var newbefsixyear = befsixyear.replace(regex, ", ");
                        var newbefsevenyear = befsevenyear.replace(regex, ", ");
                        var newbefeightyear = befeightyear.replace(regex, ", ");
                        var newbefnineyear = befnineyear.replace(regex, ", ");
                        var newbeftenyear = beftenyear.replace(regex, ", ");
                    }
                    else if (parseInt(lastKey) == (parseInt(latestyear) - 12)) {
                        const regex = /-/gi
                        var newlatestyear = latestyear.replace(regex, ", ");
                        var newbefoneyear = befoneyear.replace(regex, ", ");
                        var newbeftwoyear = beftwoyear.replace(regex, ", ");
                        var newbefthreeyear = befthreeyear.replace(regex, ", ");
                        var newbeffouryear = beffouryear.replace(regex, ", ");
                        var newbeffiveyear = beffiveyear.replace(regex, ", ");
                        var newbefsixyear = befsixyear.replace(regex, ", ");
                        var newbefsevenyear = befsevenyear.replace(regex, ", ");
                        var newbefeightyear = befeightyear.replace(regex, ", ");
                        var newbefnineyear = befnineyear.replace(regex, ", ");
                        var newbeftenyear = beftenyear.replace(regex, ", ");
                        var newbefelevenyear = befelevenyear.replace(regex, ", ");
                    }
                    else if (parseInt(lastKey) == (parseInt(latestyear) - 13)) {
                        const regex = /-/gi
                        var newlatestyear = latestyear.replace(regex, ", ");
                        var newbefoneyear = befoneyear.replace(regex, ", ");
                        var newbeftwoyear = beftwoyear.replace(regex, ", ");
                        var newbefthreeyear = befthreeyear.replace(regex, ", ");
                        var newbeffouryear = beffouryear.replace(regex, ", ");
                        var newbeffiveyear = beffiveyear.replace(regex, ", ");
                        var newbefsixyear = befsixyear.replace(regex, ", ");
                        var newbefsevenyear = befsevenyear.replace(regex, ", ");
                        var newbefeightyear = befeightyear.replace(regex, ", ");
                        var newbefnineyear = befnineyear.replace(regex, ", ");
                        var newbeftenyear = beftenyear.replace(regex, ", ");
                        var newbefelevenyear = befelevenyear.replace(regex, ", ");
                        var newbeftwelveyear = beftwelveyear.replace(regex, ", ");
                    }
                    else if (parseInt(lastKey) == (parseInt(latestyear) - 14)) {
                        const regex = /-/gi
                        var newlatestyear = latestyear.replace(regex, ", ");
                        var newbefoneyear = befoneyear.replace(regex, ", ");
                        var newbeftwoyear = beftwoyear.replace(regex, ", ");
                        var newbefthreeyear = befthreeyear.replace(regex, ", ");
                        var newbeffouryear = beffouryear.replace(regex, ", ");
                        var newbeffiveyear = beffiveyear.replace(regex, ", ");
                        var newbefsixyear = befsixyear.replace(regex, ", ");
                        var newbefsevenyear = befsevenyear.replace(regex, ", ");
                        var newbefeightyear = befeightyear.replace(regex, ", ");
                        var newbefnineyear = befnineyear.replace(regex, ", ");
                        var newbeftenyear = beftenyear.replace(regex, ", ");
                        var newbefelevenyear = befelevenyear.replace(regex, ", ");
                        var newbeftwelveyear = beftwelveyear.replace(regex, ", ");
                        var newbefthirtyear = befthirteenyear.replace(regex, ", ");
                    }
                    else if (parseInt(lastKey) == (parseInt(latestyear) - 15)) {
                        const regex = /-/gi
                        var newlatestyear = latestyear.replace(regex, ", ");
                        var newbefoneyear = befoneyear.replace(regex, ", ");
                        var newbeftwoyear = beftwoyear.replace(regex, ", ");
                        var newbefthreeyear = befthreeyear.replace(regex, ", ");
                        var newbeffouryear = beffouryear.replace(regex, ", ");
                        var newbeffiveyear = beffiveyear.replace(regex, ", ");
                        var newbefsixyear = befsixyear.replace(regex, ", ");
                        var newbefsevenyear = befsevenyear.replace(regex, ", ");
                        var newbefeightyear = befeightyear.replace(regex, ", ");
                        var newbefnineyear = befnineyear.replace(regex, ", ");
                        var newbeftenyear = beftenyear.replace(regex, ", ");
                        var newbefelevenyear = befelevenyear.replace(regex, ", ");
                        var newbeftwelveyear = beftwelveyear.replace(regex, ", ");
                        var newbefthirtyear = befthirteenyear.replace(regex, ", ");
                        var newbeffourtyear = beffourtyear.replace(regex, ", ");
                    }
                    else if (parseInt(lastKey) == (parseInt(latestyear) - 16)) {
                        const regex = /-/gi
                        var newlatestyear = latestyear.replace(regex, ", ");
                        var newbefoneyear = befoneyear.replace(regex, ", ");
                        var newbeftwoyear = beftwoyear.replace(regex, ", ");
                        var newbefthreeyear = befthreeyear.replace(regex, ", ");
                        var newbeffouryear = beffouryear.replace(regex, ", ");
                        var newbeffiveyear = beffiveyear.replace(regex, ", ");
                        var newbefsixyear = befsixyear.replace(regex, ", ");
                        var newbefsevenyear = befsevenyear.replace(regex, ", ");
                        var newbefeightyear = befeightyear.replace(regex, ", ");
                        var newbefnineyear = befnineyear.replace(regex, ", ");
                        var newbeftenyear = beftenyear.replace(regex, ", ");
                        var newbefelevenyear = befelevenyear.replace(regex, ", ");
                        var newbeftwelveyear = beftwelveyear.replace(regex, ", ");
                        var newbefthirtyear = befthirteenyear.replace(regex, ", ");
                        var newbeffourtyear = beffourtyear.replace(regex, ", ");
                        var newbeffiftyear = beffiftyear.replace(regex, ", ");
                    }
                    else if (parseInt(lastKey) == (parseInt(latestyear) - 17)) {
                        const regex = /-/gi
                        var newlatestyear = latestyear.replace(regex, ", ");
                        var newbefoneyear = befoneyear.replace(regex, ", ");
                        var newbeftwoyear = beftwoyear.replace(regex, ", ");
                        var newbefthreeyear = befthreeyear.replace(regex, ", ");
                        var newbeffouryear = beffouryear.replace(regex, ", ");
                        var newbeffiveyear = beffiveyear.replace(regex, ", ");
                        var newbefsixyear = befsixyear.replace(regex, ", ");
                        var newbefsevenyear = befsevenyear.replace(regex, ", ");
                        var newbefeightyear = befeightyear.replace(regex, ", ");
                        var newbefnineyear = befnineyear.replace(regex, ", ");
                        var newbeftenyear = beftenyear.replace(regex, ", ");
                        var newbefelevenyear = befelevenyear.replace(regex, ", ");
                        var newbeftwelveyear = beftwelveyear.replace(regex, ", ");
                        var newbefthirtyear = befthirteenyear.replace(regex, ", ");
                        var newbeffourtyear = beffourtyear.replace(regex, ", ");
                        var newbeffiftyear = beffiftyear.replace(regex, ", ");
                        var newbefsixtyear = befsixteenyear.replace(regex, ", ");
                    }


                    // let newlatestyear = latestyear.replace(regex, ", ");
                    // let newbefoneyear = befoneyear.replace(regex, ", ");
                    // let newbeftwoyear = beftwoyear.replace(regex, ", ");
                    // let newbefthreeyear = befthreeyear.replace(regex, ", ");
                    // let newbeffouryear = beffouryear.replace(regex, ", ");
                    // let newbeffiveyear = beffiveyear.replace(regex, ", ");
                    // let newbefsixyear = befsixyear.replace(regex, ", ");
                    // let newbefsevenyear = befsevenyear.replace(regex, ", ");
                    // let newbefeightyear = befeightyear.replace(regex, ", ");
                    // let newbefnineyear = befnineyear.replace(regex, ", ");
                    // let newbeftenyear = beftenyear.replace(regex, ", ");
                    // let newbefelevenyear = befelevenyear.replace(regex, ", ");
                    // let newbeftwelveyear = beftwelveyear.replace(regex, ", ");
                    // let newbefthirtyear = befthirteenyear.replace(regex, ", ");
                    // let newbeffourtyear = beffourtyear.replace(regex, ", ");
                    // let newbeffiftyear = beffiftyear.replace(regex, ", ");
                    // let newbefsixtyear = befsixteenyear.replace(regex, ", ");

                    latestyearclose = response['Time Series (Daily)'][latestyear]['4. close'];

                    switch (parseInt(lastKey)) {

                        case (parseInt(latestyear)):

                            $('#weekly').click();


                            break;

                        case (parseInt(latestyear) - 1):

                            $('#monthly').click();


                            break;

                        case (parseInt(latestyear) - 2):
                            console.log("Welcome to 2020");

                            befoneyearclose = response['Time Series (Daily)'][befoneyear]['4. close'];
                            // beftwoyearclose = response['Time Series (Daily)'][beftwoyear]['4. close'];

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
                                        // { x: new Date(newbeftwoyear), y: parseFloat(beftwoyearclose) },
                                        { x: new Date(newbefoneyear), y: parseFloat(befoneyearclose) },
                                        { x: new Date(newlatestyear), y: parseFloat(latestyearclose) },
                                    ]
                                }]
                            });
                            chart.render();


                            break;

                        case (parseInt(latestyear) - 3):
                            console.log("Welcome to 2019");

                            befoneyearclose = response['Time Series (Daily)'][befoneyear]['4. close'];
                            beftwoyearclose = response['Time Series (Daily)'][beftwoyear]['4. close'];
                            // befthreeyearclose = response['Time Series (Daily)'][befthreeyear]['4. close'];

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
                                        // { x: new Date(newbefthreeyear), y: parseFloat(befthreeyearclose) },
                                        { x: new Date(newbeftwoyear), y: parseFloat(beftwoyearclose) },
                                        { x: new Date(newbefoneyear), y: parseFloat(befoneyearclose) },
                                        { x: new Date(newlatestyear), y: parseFloat(latestyearclose) },
                                    ]
                                }]
                            });
                            chart.render();


                            break;

                        case (parseInt(latestyear) - 4):
                            console.log("Welcome to 2018");
                            befoneyearclose = response['Time Series (Daily)'][befoneyear]['4. close'];
                            beftwoyearclose = response['Time Series (Daily)'][beftwoyear]['4. close'];
                            befthreeyearclose = response['Time Series (Daily)'][befthreeyear]['4. close'];
                            // beffouryearclose = response['Time Series (Daily)'][beffouryear]['4. close'];

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
                                        // { x: new Date(newbeffouryear), y: parseFloat(beffouryearclose) },
                                        { x: new Date(newbefthreeyear), y: parseFloat(befthreeyearclose) },
                                        { x: new Date(newbeftwoyear), y: parseFloat(beftwoyearclose) },
                                        { x: new Date(newbefoneyear), y: parseFloat(befoneyearclose) },
                                        { x: new Date(newlatestyear), y: parseFloat(latestyearclose) },
                                    ]
                                }]
                            });
                            chart.render();


                            break;

                        case (parseInt(latestyear) - 5):
                            console.log("Welcome to 2017");
                            befoneyearclose = response['Time Series (Daily)'][befoneyear]['4. close'];
                            beftwoyearclose = response['Time Series (Daily)'][beftwoyear]['4. close'];
                            befthreeyearclose = response['Time Series (Daily)'][befthreeyear]['4. close'];
                            beffouryearclose = response['Time Series (Daily)'][beffouryear]['4. close'];
                            // beffiveyearclose = response['Time Series (Daily)'][beffiveyear]['4. close'];

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
                                        // { x: new Date(newbeffiveyear), y: parseFloat(beffiveyearclose) },
                                        { x: new Date(newbeffouryear), y: parseFloat(beffouryearclose) },
                                        { x: new Date(newbefthreeyear), y: parseFloat(befthreeyearclose) },
                                        { x: new Date(newbeftwoyear), y: parseFloat(beftwoyearclose) },
                                        { x: new Date(newbefoneyear), y: parseFloat(befoneyearclose) },
                                        { x: new Date(newlatestyear), y: parseFloat(latestyearclose) },
                                    ]
                                }]
                            });
                            chart.render();

                            break;

                        case (parseInt(latestyear) - 6):
                            console.log("Welcome to 2016");
                            befoneyearclose = response['Time Series (Daily)'][befoneyear]['4. close'];
                            beftwoyearclose = response['Time Series (Daily)'][beftwoyear]['4. close'];
                            befthreeyearclose = response['Time Series (Daily)'][befthreeyear]['4. close'];
                            beffouryearclose = response['Time Series (Daily)'][beffouryear]['4. close'];
                            beffiveyearclose = response['Time Series (Daily)'][beffiveyear]['4. close'];
                            // befsixyearclose = response['Time Series (Daily)'][befsixyear]['4. close'];

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
                                        // { x: new Date(newbefsixyear), y: parseFloat(befsixyearclose) },
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

                            break;

                        case (parseInt(latestyear) - 7):
                            console.log("Welcome to 2015");
                            befoneyearclose = response['Time Series (Daily)'][befoneyear]['4. close'];
                            beftwoyearclose = response['Time Series (Daily)'][beftwoyear]['4. close'];
                            befthreeyearclose = response['Time Series (Daily)'][befthreeyear]['4. close'];
                            beffouryearclose = response['Time Series (Daily)'][beffouryear]['4. close'];
                            beffiveyearclose = response['Time Series (Daily)'][beffiveyear]['4. close'];
                            befsixyearclose = response['Time Series (Daily)'][befsixyear]['4. close'];
                            // befsevenyearclose = response['Time Series (Daily)'][befsevenyear]['4. close'];

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
                                        // { x: new Date(newbefsevenyear), y: parseFloat(befsevenyearclose) },
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

                            break;

                        case (parseInt(latestyear) - 8):
                            console.log("Welcome to 2014");
                            befoneyearclose = response['Time Series (Daily)'][befoneyear]['4. close'];
                            beftwoyearclose = response['Time Series (Daily)'][beftwoyear]['4. close'];
                            befthreeyearclose = response['Time Series (Daily)'][befthreeyear]['4. close'];
                            beffouryearclose = response['Time Series (Daily)'][beffouryear]['4. close'];
                            beffiveyearclose = response['Time Series (Daily)'][beffiveyear]['4. close'];
                            befsixyearclose = response['Time Series (Daily)'][befsixyear]['4. close'];
                            befsevenyearclose = response['Time Series (Daily)'][befsevenyear]['4. close'];
                            // befeightyearclose = response['Time Series (Daily)'][befeightyear]['4. close'];

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
                                        // { x: new Date(newbefeightyear), y: parseFloat(befeightyearclose) },
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

                            break;

                        case (parseInt(latestyear) - 9):
                            console.log("Welcome to 2013");
                            befoneyearclose = response['Time Series (Daily)'][befoneyear]['4. close'];
                            beftwoyearclose = response['Time Series (Daily)'][beftwoyear]['4. close'];
                            befthreeyearclose = response['Time Series (Daily)'][befthreeyear]['4. close'];
                            beffouryearclose = response['Time Series (Daily)'][beffouryear]['4. close'];
                            beffiveyearclose = response['Time Series (Daily)'][beffiveyear]['4. close'];
                            befsixyearclose = response['Time Series (Daily)'][befsixyear]['4. close'];
                            befsevenyearclose = response['Time Series (Daily)'][befsevenyear]['4. close'];
                            befeightyearclose = response['Time Series (Daily)'][befeightyear]['4. close'];
                            // befnineyearclose = response['Time Series (Daily)'][befnineyear]['4. close'];

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
                                        // { x: new Date(newbefnineyear), y: parseFloat(befnineyearclose) },
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

                            break;

                        case (parseInt(latestyear) - 10):
                            console.log("Welcome to 2012");
                            befoneyearclose = response['Time Series (Daily)'][befoneyear]['4. close'];
                            beftwoyearclose = response['Time Series (Daily)'][beftwoyear]['4. close'];
                            befthreeyearclose = response['Time Series (Daily)'][befthreeyear]['4. close'];
                            beffouryearclose = response['Time Series (Daily)'][beffouryear]['4. close'];
                            beffiveyearclose = response['Time Series (Daily)'][beffiveyear]['4. close'];
                            befsixyearclose = response['Time Series (Daily)'][befsixyear]['4. close'];
                            befsevenyearclose = response['Time Series (Daily)'][befsevenyear]['4. close'];
                            befeightyearclose = response['Time Series (Daily)'][befeightyear]['4. close'];
                            befnineyearclose = response['Time Series (Daily)'][befnineyear]['4. close'];
                            // beftenyearclose = response['Time Series (Daily)'][beftenyear]['4. close'];

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
                                        // { x: new Date(newbeftenyear), y: parseFloat(beftenyearclose) },
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

                            break;

                        case (parseInt(latestyear) - 11):
                            console.log("Welcome to 2011");
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
                            // befelevenyearclose = response['Time Series (Daily)'][befelevenyear]['4. close'];

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
                                        // { x: new Date(newbefelevenyear), y: parseFloat(befelevenyearclose) },
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

                            break;

                        case (parseInt(latestyear) - 12):
                            console.log("Welcome to 2010");
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
                            // beftwelveyearclose = response['Time Series (Daily)'][beftwelveyear]['4. close'];

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
                                        // { x: new Date(newbeftwelveyear), y: parseFloat(beftwelveyearclose) },
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

                            break;

                        case (parseInt(latestyear) - 13):
                            console.log("Welcome to 2009");
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
                            // befthirtyearclose = response['Time Series (Daily)'][befthirteenyear]['4. close'];

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
                                        // { x: new Date(newbefthirtyear), y: parseFloat(befthirtyearclose) },
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

                            break;

                        case (parseInt(latestyear) - 14):
                            console.log("Welcome to 2008");
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
                            befthirtyearclose = response['Time Series (Daily)'][befthirteenyear]['4. close'];
                            // beffourtyearclose = response['Time Series (Daily)'][beffourtyear]['4. close'];

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
                                        // { x: new Date(newbeffourtyear), y: parseFloat(beffourtyearclose) },
                                        { x: new Date(newbefthirtyear), y: parseFloat(befthirtyearclose) },
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

                            break;

                        case (parseInt(latestyear) - 15):
                            console.log("Welcome to 2007");
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
                            befthirtyearclose = response['Time Series (Daily)'][befthirteenyear]['4. close'];
                            beffourtyearclose = response['Time Series (Daily)'][beffourtyear]['4. close'];
                            // beffiftyearclose = response['Time Series (Daily)'][beffiftyear]['4. close'];

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
                                        // { x: new Date(newbeffiftyear), y: parseFloat(beffiftyearclose) },
                                        { x: new Date(newbeffourtyear), y: parseFloat(beffourtyearclose) },
                                        { x: new Date(newbefthirtyear), y: parseFloat(befthirtyearclose) },
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

                            break;

                        case (parseInt(latestyear) - 16):
                            console.log("Welcome to 2006");
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
                            befthirtyearclose = response['Time Series (Daily)'][befthirteenyear]['4. close'];
                            beffourtyearclose = response['Time Series (Daily)'][beffourtyear]['4. close'];
                            beffiftyearclose = response['Time Series (Daily)'][beffiftyear]['4. close'];
                            // befsixtyearclose = response['Time Series (Daily)'][befsixteenyear]['4. close'];

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
                                        // { x: new Date(newbefsixtyear), y: parseFloat(befsixtyearclose) },
                                        { x: new Date(newbeffiftyear), y: parseFloat(beffiftyearclose) },
                                        { x: new Date(newbeffiftyear), y: parseFloat(beffiftyearclose) },
                                        { x: new Date(newbeffourtyear), y: parseFloat(beffourtyearclose) },
                                        { x: new Date(newbefthirtyear), y: parseFloat(befthirtyearclose) },
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

                            break;

                        case (parseInt(latestyear) - 17):
                            console.log("Welcome to 2005");
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
                            befthirtyearclose = response['Time Series (Daily)'][befthirteenyear]['4. close'];
                            beffourtyearclose = response['Time Series (Daily)'][beffourtyear]['4. close'];
                            beffiftyearclose = response['Time Series (Daily)'][beffiftyear]['4. close'];
                            befsixtyearclose = response['Time Series (Daily)'][befsixteenyear]['4. close'];
                            // befseventyearclose = response['Time Series (Daily)'][befseventyear]['4. close'];

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
                                        // { x: new Date(newbefseventyear), y: parseFloat(befseventyearclose) },
                                        { x: new Date(newbefsixtyear), y: parseFloat(befsixtyearclose) },
                                        { x: new Date(newbeffiftyear), y: parseFloat(beffiftyearclose) },
                                        { x: new Date(newbeffourtyear), y: parseFloat(beffourtyearclose) },
                                        { x: new Date(newbefthirtyear), y: parseFloat(befthirtyearclose) },
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

                            break;

                        default:
                            befoneyearclose = response['Time Series (Daily)'][befoneyear]['4. close'];
                            beftwoyearclose = response['Time Series (Daily)'][beftwoyear]['4. close'];
                            befthreeyearclose = response['Time Series (Daily)'][befthreeyear]['4. close'];
                            beffouryearclose = response['Time Series (Daily)'][beffouryear]['4. close'];
                            beffiveyearclose = response['Time Series (Daily)'][beffiveyear]['4. close'];

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
                            break;
                    }

                })
            }

            else {

                $('#containerScrip').removeClass('d-none');


                let latestdate = response['Meta Data']['3. Last Refreshed'];
                let symbolname = response['Meta Data']['2. Symbol'];
                let open = response['Time Series (Daily)'][datevalue]['1. open'];
                let high = response['Time Series (Daily)'][datevalue]['2. high'];
                let low = response['Time Series (Daily)'][datevalue]['3. low'];
                let close = response['Time Series (Daily)'][datevalue]['4. close'];
                let volume = response['Time Series (Daily)'][datevalue]['5. volume'];

                let onedaybefdate = Object.keys(dates)[1];

                let latestclosing = response['Time Series (Daily)'][latestdate]['4. close'];
                let onedaybefclosing = response['Time Series (Daily)'][onedaybefdate]['4. close'];

                let changeinrupee = latestclosing - onedaybefclosing;
                let changeinper = (changeinrupee * 100) / onedaybefclosing;

                $('#getdataloader').addClass('d-none');
                $('#loader').addClass('d-none');

                if (Math.sign(changeinrupee) == -1) {
                    $('#rupeechange').addClass('negative');
                    $('#ltp').addClass('negative');
                    $('#percentchange').addClass('negative');
                    $('#rupeechange').text(parseFloat(changeinrupee).toFixed(2));
                    $('#percentchange').text(parseFloat(changeinper).toFixed(2) + "%");
                }
                else if (Math.sign(changeinrupee) == 1) {
                    $('#rupeechange').removeClass('negative');
                    $('#ltp').removeClass('negative');
                    $('#percentchange').removeClass('negative');
                    $('#rupeechange').addClass('positive');
                    $('#ltp').addClass('positive');
                    $('#percentchange').addClass('positive');
                    $('#rupeechange').text("+" + parseFloat(changeinrupee).toFixed(2));
                    $('#percentchange').text("+" + parseFloat(changeinper).toFixed(2) + "%");
                }

                // $('#lastupdated').text(latestdate);
                $('#datequery').text(datevalue);
                $('#symbolname').text(symbolname);
                $('#open').text(parseFloat(open).toFixed(2));
                $('#high').text(parseFloat(high).toFixed(2));
                $('#low').text(parseFloat(low).toFixed(2));
                $('#ltp').text(parseFloat(close).toFixed(2));
                $('#close').text(parseFloat(close).toFixed(2));
                $('#prevclose').text(parseFloat(onedaybefclosing).toFixed(2));
                $('#volume').text(volume / 1000 + "k");
                document.getElementById('datepicker').value = "";

                $('#goBtn').on('click', function () {
                    window.open(`https://www.google.com/finance/quote/${searchVal.value}:NSE?sa=X&ved=2ahUKEwipzdGMluz6AhXktGMGHWFMAXIQ3ecFegQIJRAY`, `_blank`);
                })
                $('.linktodata').click();
            }
        },

        error: function (error, status) {

        }
    })
}


