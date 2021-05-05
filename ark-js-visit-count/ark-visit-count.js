'use strict';
var key = "t2yaz5wg";
var viskey = "VisitCnt";
var uniqueuser = "";
(function (win) {
    var loadHttp = function (act, url, callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
                if (callback) {
                    callback(this.responseText);
                }
            }
        };
        xhttp.open(act, url, true);
        xhttp.send();
    };

    var getVal = function () {
        loadHttp("GET", "https://keyvalue.immanuel.co/api/KeyVal/GetValue/" + key + "/" + viskey, function (data) {
            incrementVisit();
            var target = data.replace(new RegExp('"', 'g'), '');
            document.getElementById("vis-gcnt").textContent = target;
            a7.sendToUser((uniqueuser || key + makeid()), parseInt(target) + 1);
            recurCall();
        });
    }

    var incrementVisit = function () {
        loadHttp("POST", "https://keyvalue.immanuel.co/api/KeyVal/ActOnValue/" + key + "/" + viskey + "/increment", function (data) {
            //document.getElementById("vis-gcnt").textContent = data;
        });
    }
    incrementVisit();
    var elm = document.createElement('div');
    elm.style.position = "fixed";
    elm.style.top = "10px";
    elm.style.right = "15px";
    elm.style.textAlign = "center";
    elm.style.border = "2px green dashed";
    elm.style.textAlign = "center";
    elm.style.zIndex = "101";
    elm.style.backgroundColor = "cadetblue";
    var cnrl = '<span style="background-color:azure;display:inline-block;width:70px;padding:5px;">Visits</span><br /> \
                            <span style="color:white;font-size:large;" id="vis-gcnt"></span> <br /> \
                            <span style="background-color:azure;display:inline-block;width:70px;padding:5px;">Counts</span>';
    elm.innerHTML = cnrl;
    if (document.body == null) {
        document.appendChild("body"); //Not tested
    }
    document.body.appendChild(elm);
    var chat = $.connection.GroupHub;
    var single = $.connection.SingleHub;
    single.client.SendToUser = function (user, message) {
        $('#vis-gcnt').text(message);
    };
    chat.client.SendToGroup = function (grp, message) {

    };
    $.connection.hub.start().done(function () {
        console.log("connected..");
        uniqueuser = key + makeid();
        a7.addUser(uniqueuser);
        getVal();
    });
    function htmlEncode(value) {
        var encodedValue = $('<div />').text(value).html();
        return encodedValue;
    }
    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    var recurCall = function () {
        setTimeout(function () {
            getVal();
        }, Math.floor(Math.random() * 50000) + 10000);
    }
})(window);