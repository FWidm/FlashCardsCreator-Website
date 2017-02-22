const ip = "localhost";
const port = "9000";
const emailCookieName = "userEmail";

//disable cache for REST calls globally
$.ajaxSetup({cache: false});

//redirect every time if no cookie useremail exists.
$(document).ready(function () {
    console.log("ready! loc=" + window.location.pathname);
    getHeartbeat();

    var cookie = readCookie(emailCookieName);
    console.log(cookie);
    if (!cookie && window.location.pathname != '/FlashCardsCreator/login.html') {
        console.log("Redirect to login!");
        window.location.href = "login.html";
    }
    else
        $("#show-profile").text("Hi, " + readCookie(emailCookieName));

});

/**
 * Button Handling
 */
$(function () {
    $("#buttonLogin").click(function () {
            var email = $("#inputEmail").val();
            var password = $("#inputPassword").val();

            if (email.length <= 0 || password.length <= 0)
                console.log("Password or email is not set, please try again")
            else {
                if (checkCredentials(email, password)) {
                    var days = 10;
                    createCookie(emailCookieName, email, days);
                    //create cookie for token
                    window.location.href = "index.html";
                }

            }
        }
    );
});

$(function () {
    $("#buttonLogout").click(function () {
        deleteCookie(emailCookieName);
        window.location.href = "login.html";
    })
});


function checkCredentials(email, password) {
    var credentials = new Object();
    credentials.email = email;
    credentials.password = password;
    console.log(credentials);
    jQuery.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'type': 'POST',
        'url': "http://" + ip + ":" + port + "/login",
        'data': credentials,
        'dataType': 'json',
        'success': function (data, status, jqXHR) {
            console.log("status=" + status);
            console.log("data=" + data.currentDate)
        },
        'error': function (jqXHR, status) {
            console.log("status=" + status);

            console.log(jqXHR.responseText);
        },
        'contentType': "application/json"

    });

    return false;
}

function getHeartbeat() {
    jQuery.ajax({
        type: "GET",
        url: "http://" + ip + ":" + port + "/heartbeat",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, status, jqXHR) {
            console.log("status=" + status);
            console.log("data=" + data.currentDate);
            if($("#server-status").hasClass("glyphicon")){
                $("#server-status").addClass("glyphicon-globe");
                $("#server-status").removeClass("glyphicon-remove");
            }
            return true;
        },
        error: function (jqXHR, status) {
            console.log("status=" + status);
            return false;
        }
    });
}

function get(resource) {
    jQuery.ajax({
        type: "GET",
        url: "http://" + ip + ":" + port + "/" + resource,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, status, jqXHR) {
            console.log("status=" + status);
            console.log("data=" + data.currentDate);
            return [status, data];
        },
        error: function (jqXHR, status) {
            console.log("status=" + status);
            return status
        }
    });
}

function createCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function deleteCookie(name) {
    createCookie(name, "", -1);
}