/**
 * Created by Fabian-Desktop on 27.02.2017.
 */
$(document).ready(function () {
    function getUnassignedCards() {
        jQuery.ajax({
            type: "GET",
            url: "http://" + ip + ":" + port + "/cards?user="+getCookie(userIDCokieName)+"&deck=null",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, status, jqXHR) {
                console.log("status=" + status);
                console.log("data=" + data.currentDate);

                return true;
            },
            error: function (jqXHR, status) {
                console.log("status=" + status);
                return false;
            }
        });
    }


});