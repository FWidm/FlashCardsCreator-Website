$(document).ready(function () {
    const ip = "134.60.51.194";
    const port = "9000";
    const emailCookieName = "userEmail";
    const tokenCookieName = "userToken";
    const userIDCokieName = "userId";
    const cookieDuration = 100;


//disable cache for REST calls globally
    $.ajaxSetup({cache: false});

//redirect every time if no cookie useremail exists.
    $(document).ready(function () {
        console.log("ready! loc=" + window.location.pathname);
        getHeartbeat();

        var cookie = getCookie(emailCookieName);
        console.log(cookie);
        if (!cookie && window.location.pathname != '/FlashCardsCreator/login.html') {
            console.log("Redirect to login!");
            window.location.href = "login.html";
        }
        else
            $("#show-profile").text("Hi, " + getCookie(emailCookieName));

    });

    /**
     * Button Handling
     */
    $(function () {
        $("#buttonLogin").click(function () {
                var email = $("#inputEmail").val();
                var password = $("#inputPassword").val();

                if (email.length <= 0 || password.length <= 0)
                    console.log("Password or email is not set, please try again");
                else {
                    if (getCookie(tokenCookieName) && getCookie(emailCookieName) && getCookie(userIDCokieName)) {
                        window.location.href = "index.html";

                    }
                    else {
                        checkCredentials(email, password);

                    }
                }
            }
        );
    });

    $(function () {
        $("#buttonLogout").click(function () {
            deleteCookie(emailCookieName);
            deleteCookie(tokenCookieName);
            //todo: logout from the api.
            window.location.href = "login.html";
        })
    });

    function showErrorWarning(text) {
        var warning= $('#warning');
        if (text != undefined) {
            warning.html(text);
        }
        if(warning.hasClass("hidden"))
            warning.removeClass("hidden");

    }

    function hideErrorWarning() {
        var warning= $('#warning');
        if(!warning.hasClass("hidden"))
            warning.addClass("hidden");
    }

    function checkCredentials(email, password) {
        var json = JSON.stringify({"email": email, "password": password});
        console.log(json);
        jQuery.ajax({
            headers: {
                'Content-Type': 'application/json'
            },
            type: 'POST',
            url: "http://" + ip + ":" + port + "/login",
            data: json,
            dataType: 'json',
            success: function (data, status, jqXHR) {
                console.log("status=" + status);
                console.log(jqXHR);
                createCookie(tokenCookieName, data.token, cookieDuration);
                createCookie(emailCookieName, email, cookieDuration);
                if(getCookie(userIDCokieName)==undefined && getCookie(emailCookieName)!=undefined){
                    getUserId(email);
                }



            },
            error: function (jqXHR, status) {
                console.log("status=" + status);
                var responsejson=jQuery.parseJSON(jqXHR.responseText);
                showErrorWarning(responsejson.description);
                console.log(responsejson);
            },
            contentType: "application/json"

        });

        return false;
    }

    function getUserId(email) {
        console.log("email="+email);
        jQuery.ajax({
            type: "GET",
            url: "http://" + ip + ":" + port + "/users?email="+email,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, status, jqXHR) {
                console.log("status=" + status);
                console.log("id=" + data[0].userId);
                console.log(jqXHR);
                createCookie(userIDCokieName,data[0].userId,cookieDuration);
                window.location.href = "index.html";
            },
            error: function (jqXHR, status) {
                console.log("status=" + status);
            }
        });
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
                if ($("#server-status").hasClass("glyphicon")) {
                    $("#server-status").addClass("glyphicon-globe");
                    $("#server-status").removeClass("glyphicon-remove");
                }
                console.log("Check for cookie userid... "+getCookie(userIDCokieName));

            },
            error: function (jqXHR, status) {
                console.log("status=" + status);
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

    function getCookie(name) {
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
});