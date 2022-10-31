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
        // $('alertweekend').removeClass('d-none');
        
    }
});


$(document).ready(function () {

    $('#getDataBtn').on('click', getData);

});

// console.log(datevalue);

function getData() {

    $.ajax({

        
        url: `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${searchVal.value}.BSE&outputsize=full&apikey=OT7RL8UB4YVGID5U`, // API URL
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

            if (response['Error Message']) {
                $('#alertweekend').addClass('d-none');
                $('#alertcard').removeClass('d-none');
                $('#loader').addClass('d-none');
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
                let volume = response['Time Series (Daily)'][latestdate]['5. volume'];

                $('#loader').addClass('d-none');
                $('#alertcard').addClass('d-none');
                $('#alertweekend').addClass('d-none');
                $('#loader').addClass('d-none');
                $('.data').removeClass('d-none');
                $('#date').text(latestdate);
                $('#symbolname').text(symbolname);
                $('#open').text(open);
                $('#high').text(high);
                $('#low').text(low);
                $('#close').text(close);
                $('#volume').text(volume / 1000 + "k");
                document.getElementById('datepicker').value = "";
                




                $('#goBtn').on('click', function () {
                    window.open(`https://www.google.com/finance/quote/${searchVal.value}:NSE?sa=X&ved=2ahUKEwipzdGMluz6AhXktGMGHWFMAXIQ3ecFegQIJRAY`, `_blank`);
                })

            }
            else {

                // console.log(datevalue);
            
                // let latestdate = response['Meta Data'][datevalue];
                let symbolname = response['Meta Data']['2. Symbol'];
                let open = response['Time Series (Daily)'][datevalue]['1. open'];
                let high = response['Time Series (Daily)'][datevalue]['2. high'];
                let low = response['Time Series (Daily)'][datevalue]['3. low'];
                let close = response['Time Series (Daily)'][datevalue]['4. close'];
                let volume = response['Time Series (Daily)'][datevalue]['5. volume'];

                $('#alertweekend').addClass('d-none');
                $('#loader').addClass('d-none');
                $('#alertcard').addClass('d-none');
                $('.data').removeClass('d-none');
                $('#date').text(datevalue);
                $('#symbolname').text(symbolname);
                $('#open').text(open);
                $('#high').text(high);
                $('#low').text(low);
                $('#close').text(close);
                $('#volume').text(volume / 1000 + "k");
                document.getElementById('datepicker').value = "";
                
    

                $('#goBtn').on('click', function () {
                    window.open(`https://www.google.com/finance/quote/${searchVal.value}:NSE?sa=X&ved=2ahUKEwipzdGMluz6AhXktGMGHWFMAXIQ3ecFegQIJRAY`, `_blank`);
                })
            }
        },

        error: function (error, status) {

        }
    })
}