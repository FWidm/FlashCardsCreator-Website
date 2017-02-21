var ip = "localhost";
var port = "9000";

//disable cache for REST calls globally
$.ajaxSetup({ cache: false });

//redirect every time if no cookie useremail exists.
$( document ).ready(function() {
    console.log( "ready! loc="+window.location.pathname );
    var cookie=readCookie("useremail");
    if(!cookie && window.location.pathname != '/FlashCardsCreator/login.html'){
        console.log("Redirect to login!");
        window.location.href("login.html");
    }
});

$(function() {
    $("#buttonLogin").click( function()
        {
            var email=$("#inputEmail").val();
            var password=$("#inputPassword").val();

            if(email.length<=0||password.length<=0)
                console.log("Password or email is not set, please try again")
            else {
                if(checkCredentials(email,password)){
                    var days=10;
                    createCookie("useremail",email,days);
                    //create cookie for token
                    window.location.href("index.html");
                }

            }
        }
    );
});

function checkCredentials(email, password) {
    //ajax request
    return true;
}

function getHeartbeat() {
    jQuery.ajax({
        type: "GET",
        url: "http://"+ip+":"+port+"/heartbeat",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, status, jqXHR) {
            console.log("status="+status);
            console.log("data="+data.currentDate)
        },
        error: function (jqXHR, status) {
            console.log("status="+status);
        }
    });
}

function get(resource) {
    jQuery.ajax({
        type: "GET",
        url: "http://"+ip+":"+port+"/"+resource,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, status, jqXHR) {
            console.log("status="+status);
            console.log("data="+data.currentDate);
            return [status, data];
        },
        error: function (jqXHR, status) {
            console.log("status="+status);
            return status
        }
    });
}

function createCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}