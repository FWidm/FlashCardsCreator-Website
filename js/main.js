var ip = "localhost";
var port = "9000";

//disable cache for REST calls globally
$.ajaxSetup({ cache: false });

$(function() {
    $("#sign-in").click( function()
        {
            getHeartbeat();

            var email=$("#email").val();
            var password=$("#password").val();
            console.log("email="+email);
            console.log("pw="+password);
            if(email.length<=0||password.length<=0)
                console.log("Password or email is not set, please try again")
            else {
                //retrieve token
            }
        }
    );
});

function getHeartbeat() {
    jQuery.ajax({
        type: "GET",
        url: "http://localhost:9000/heartbeat",
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