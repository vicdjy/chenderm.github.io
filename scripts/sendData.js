var logs = [];

var rstring = randomstring(
    32,
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
);

function randomstring(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function sendData(n, savedNum) {
    //Sessionid code
    var sessionid = rstring;

    //Accesstime code
    var currentDate = new Date();
    var date = currentDate.getDate();
    var month = currentDate.getMonth(); //Be careful! January is 0 not 1
    var year = currentDate.getFullYear();
    var time =
        currentDate.getHours() -
        5 +
        ':' +
        currentDate.getMinutes() +
        ':' +
        currentDate.getSeconds();
    var datestring = year + '-' + (month + 1) + '-' + date;
    var accesstime = datestring + ' ' + time;


    var ydatabase = null;
    var locationname = null;
    var ranges = null;
    var rangestart = null;
    var rangesend = null;
    var gtypedata = null;
    var colordata = null;
    var graphNum = null;
    var actionItem = null;


    if (savedNum == 'submit') {
        var el = document.getElementById("database" + n);
        var ydatabase = el.options[el.selectedIndex].value;

        //var xOption = "Year";

        el = document.getElementById("yaxis" + n);
        locationname = el.options[el.selectedIndex].value;

        el = document.getElementById("gtype" + n);
        gtypedata = el.options[el.selectedIndex].value;

        rangestart = $("#range" + n).data("from");
        rangesend = $("#range" + n).data("to");
        // var minDate = $("#range" + n).data("min");
        // var maxDate = $("#range" + n).data("max");

        colordata = document.getElementById("colorButton" + n).value;
        graphNum = n;
        actionItem = "submit";
    }
    else if (savedNum == 'setOptions') {
        var el = document.getElementById("database" + n);
        var ydatabase = el.options[el.selectedIndex].value;

        //var xOption = "Year";

        el = document.getElementById("yaxis" + n);
        locationname = el.options[el.selectedIndex].value;

        el = document.getElementById("gtype" + n);
        gtypedata = el.options[el.selectedIndex].value;

        rangestart = $("#range" + n).data("from");
        rangesend = $("#range" + n).data("to");
        // var minDate = $("#range" + n).data("min");
        // var maxDate = $("#range" + n).data("max");

        colordata = document.getElementById("colorButton" + n).value;
        graphNum = n;
        actionItem = "changedJSON";
    }
    else if (savedNum == 'download') {
        var el = document.getElementById("database" + n);
        var ydatabase = el.options[el.selectedIndex].value;

        //var xOption = "Year";

        el = document.getElementById("yaxis" + n);
        locationname = el.options[el.selectedIndex].value;

        el = document.getElementById("gtype" + n);
        gtypedata = el.options[el.selectedIndex].value;

        rangestart = $("#range" + n).data("from");
        rangesend = $("#range" + n).data("to");
        // var minDate = $("#range" + n).data("min");
        // var maxDate = $("#range" + n).data("max");

        colordata = document.getElementById("colorButton" + n).value;
        graphNum = n;
        actionItem = "downloadGraph";
    }






    var submitdata = {
        'sessionid': sessionid,
        'accesstime': accesstime,
        'yaxis': ydatabase,
        'locationdata': locationname,
        'lowdate': rangestart,
        'highdate': rangesend,
        'graphtype': gtypedata,
        'color': colordata,
        'graphNum': graphNum,
        'actionItem': actionItem
    };

    logs.push(submitdata);
    console.log(submitdata);

    //Send data to php code
    var submitdatastr = JSON.stringify(submitdata);
    // console.log(submitdatastr);

    $.ajax({
        url: '../data.php',
        type: 'POST',
        data: { submitdata: submitdatastr },
        success: function (response) {
            //do whatever.
            
            //alert(response.message);
            console.log(response);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert('Status: ' + textStatus);
            alert('Error: ' + errorThrown);
        },
    });
}
