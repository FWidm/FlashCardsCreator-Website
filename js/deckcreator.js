/**
 * Created by Fabian-Desktop on 27.02.2017.
 */
var cards = [];
var deck = {};
var userGroup = {};

var cardPositionToId = [];

$(document).ready(function () {
    getUnassignedCards();

    $("#save").click(function () {
            console.log("Save");
            if (deckJSONComplete(deck)) {
                //remove all null values from our deck's cards array
                if (deck.cards != undefined) {
                    deck.cards = $.grep(deck.cards, function (n) {
                        return n == 0 || n
                    });
                }
                postGroup(userGroup);
            }
            else {
                hideSuccess();
                showErrorWarning("<strong>Please make sure to fill in all the details.</strong> Request not sent.");
            }
        }
    );


    $('#cards').on('click', '.list-group-item', function () {
        var $this = $(this);
        var cardId = $this.attr('id').split("card-")[1];
        var arrPosition = getKey(cardPositionToId, cardId);


        $this.toggleClass('active');
        if (deck.cards == undefined)
            deck.cards = [];
        //if the element is undefined, create it with the value true.
        if (deck.cards[arrPosition] == undefined || deck.cards[arrPosition].flashcardId == null) {
            console.log("was undefined");
            deck.cards[arrPosition] = {};
            deck.cards[arrPosition].flashcardId = cardId;
        }
        else {//if we unselect the element, we splice it from the array so that it only contains values we work with
            console.log("set null");
            deck.cards[arrPosition].flashcardId = null;
        }
        console.log("toggled card: " + cardId + " | value=" + deck.cards[arrPosition].flashcardId);
    });

    $("#deck-name").change(function () {
        deck.cardDeckName = $(this).val();
        $("#group-name").val(deck.cardDeckName + "_group");

        $("#group-name").change();
        console.log(deck);
    });

    $("#deck-description").change(function () {
        deck.cardDeckDescpription = $(this).val();
        $("#group-description").val(deck.cardDeckDescpription);
        $("#group-description").change();
        console.log(deck);
    });

    $("#group-name").change(function () {
        userGroup.name = $(this).val();
        console.log(userGroup);
    });

    $("#group-description").change(function () {
        userGroup.description = $(this).val();
        console.log(userGroup);
    });


});


function getKey(object, value) {
    for (var key in object) {
        if (object[key] == value)
            return key;
    }
    return undefined;
}

function previewJsonInCodeBlock(object) {
    console.log(object);



    $('#json-output').text(JSON.stringify(deck, null, 4));
    $('code').each(function (i, block) {
        hljs.highlightBlock(block);
    });
}
function showSuccess(text) {
    var success = $('#success');

    if (text != undefined) {
        success.html(text);
    }
    if (success.hasClass("hidden"))
        success.removeClass("hidden");

}

function hideSuccess() {
    var success = $('#success');

    if (!success.hasClass("hidden"))
        success.addClass("hidden");
}

function deckJSONComplete(deck) {
    var valid = true;
    //question
    console.log(deck);
    if (deck.cardDeckDescpription == undefined || deck.cardDeckName == undefined) {
        valid = false;
    }
    return valid;
}

function postDeck(deck) {
    console.log(JSON.stringify(userGroup));
    jQuery.ajax({
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookie(tokenCookieName)

        },
        type: 'POST',
        url: "http://" + ip + ":" + port + "/cardDecks",
        data: JSON.stringify(deck),
        dataType: 'json',
        success: function (data, status, jqXHR) {
            console.log("status=" + status);
            console.log(jqXHR);
            //show success
            hideErrorWarning();
            showSuccess("<strong>Deck has been posted.</strong> Deck created has id: " + data.id);
        },
        error: function (jqXHR, status) {
            console.log("status=" + status);
            var responsejson = jQuery.parseJSON(jqXHR.responseText);
            showErrorWarning(responsejson.description);
            //console.log(responsejson);
        },
        contentType: "application/json"
    });
}

function postGroup(group) {
    userGroup.users = [];
    userGroup.users[0] = {};
    userGroup.users[0].userId = getCookie(userIDCokieName);
    console.log(JSON.stringify(userGroup));
    jQuery.ajax({
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookie(tokenCookieName)

        },
        type: 'POST',
        url: "http://" + ip + ":" + port + "/groups",
        data: JSON.stringify(group),
        dataType: 'json',
        success: function (data, status, jqXHR) {
            console.log("status=" + status);
            console.log(jqXHR);
            deck.userGroup = {};
            deck.userGroup.groupId = data.id;
            console.log("deck.userGroup.id=" + deck.userGroup.groupId);
            previewJsonInCodeBlock(deck);
            postDeck(deck);
        },
        error: function (jqXHR, status) {
            console.log("status=" + status);
            var responsejson = jQuery.parseJSON(jqXHR.responseText);
            showErrorWarning(responsejson.description);
            //console.log(responsejson);
        },
        contentType: "application/json"
    });
}

function getUnassignedCards() {
    jQuery.ajax({
        type: "GET",
        url: "http://" + ip + ":" + port + "/cards?authorId=" + getCookie(userIDCokieName) + "&deckId=null",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, status, jqXHR) {
            console.log("status=" + status);
            console.log("data=" + data);
            cards = data;
            //empty the div.
            $('#list-cards').empty();

            if (cards.length > 0) {
                for (var key in cards) {
                    //console.log(card=cards[key]);
                    // console.log("id="+(id)+", text:"+cards[key].question.questionText);
                    cardPositionToId.push(cards[key].flashcardId);
                    addCardsToListView(cards[key].flashcardId, cards[key].question.questionText)

                }
                console.log(cardPositionToId);
            }
            else
                $('#list-cards').append("<p><strong>No unassigned cards could be found. <a href='createCard.html'> Please crate cards first.</strong></p>");

            console.log(jqXHR);

        },
        error: function (jqXHR, status) {
            console.log("status=" + status);
            console.log(jqXHR);

        }
    });
}

function addCardsToListView(id, questionText) {
    var html = '<div id="card-' + id + '"<a href="#" class="list-group-item list-group-item-action flex-column align-items-start">'
        + '<div class="d-flex w-100 justify-content-between">'
        + '<h4 class="mb-1">Card ' + id + ':</h4>'
        + '</div><p class="mb-1"><strong>Question:</strong> ' + questionText + '</p></a></div>';
    // console.log("adding... "+html);
    $('#list-cards').append(html);
}