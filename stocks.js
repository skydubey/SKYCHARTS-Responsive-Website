$('#loader').addClass('d-none');
$('.alert').addClass('d-none');
let searchVal = document.getElementById('inputsearch');

$(document).ready(function () {

    $('#getDataBtn').on('click', getData);

});

function getData() {
    $.ajax({

        url: `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${searchVal.value}.BSE&outputsize=full&apikey=DEMO`, // API URL
        type: 'GET', // GET OR POST

        beforeSend: function (response, status) {
            // THIS FUNCTION CALL BEFORE AJAX API HITS
            // HERE WE CAN SHOW OUR LOADER.
            $('#loader').removeClass('d-none');
            $('.data').addClass('d-none');
        },

        success: function (response, status, error, data) {
            // ONCE OUR API CALL SEND SUCCESS
            // THIS FUNCTION GETS CALLED.

            if (response['Error Message']) {
                $('.alert').removeClass('d-none');
                $('#loader').addClass('d-none');
                $('#date').text("");
                $('#symbolname').text("");
                $('#open').text("");
                $('#high').text("");
                $('#low').text("");
                $('#close').text("");
                $('#volume').text("");
            }
            else {
                let latestdate = response['Meta Data']['3. Last Refreshed'];
                let symbolname = response['Meta Data']['2. Symbol'];
                let open = response['Time Series (Daily)'][latestdate]['1. open'];
                let high = response['Time Series (Daily)'][latestdate]['2. high'];
                let low = response['Time Series (Daily)'][latestdate]['3. low'];
                let close = response['Time Series (Daily)'][latestdate]['4. close'];
                let volume = response['Time Series (Daily)'][latestdate]['5. volume'];

                $('#loader').addClass('d-none');
                $('.data').removeClass('d-none');
                $('#date').text(latestdate);
                $('#symbolname').text(symbolname);
                $('#open').text(open);
                $('#high').text(high);
                $('#low').text(low);
                $('#close').text(close);
                $('#volume').text(volume/1000 + "k");
                $('.alert').addClass('d-none');
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



