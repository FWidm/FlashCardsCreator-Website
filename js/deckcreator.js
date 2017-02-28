/**
 * Created by Fabian-Desktop on 27.02.2017.
 */
var cards = [];
var deck = [];
var cardPositionToId = [];

$(document).ready(function () {
    getUnassignedCards();

    $("#save").click(function () {
            console.log("Save");

        }
    );

    function getUnassignedCards() {
        jQuery.ajax({
            type: "GET",
            url: "http://" + ip + ":" + port + "/cards?user=" + getCookie(userIDCokieName) + "&deck=null",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, status, jqXHR) {
                console.log("status=" + status);
                console.log("data=" + data);
                cards = data;
                //empty the div.
                $('#list-cards').empty();
                for (var key in cards) {
                    //console.log(card=cards[key]);
                    // console.log("id="+(id)+", text:"+cards[key].question.questionText);
                    cardPositionToId.push(cards[key].flashcardId);
                    addCardsToListView(cards[key].flashcardId, cards[key].question.questionText)

                }
                console.log(cardPositionToId);

                console.log(jqXHR);

            },
            error: function (jqXHR, status) {
                console.log("status=" + status);

            }
        });
    }

    $('#cards').on('click', '.list-group-item', function () {
        var $this = $(this);
        var cardId = $this.attr('id').split("card-")[1];
        var arrPosition=getKey(cardPositionToId,cardId);


        $this.toggleClass('active');
        if (deck.cards == undefined)
            deck.cards = [];
        //if the element is undefined, create it with the value true.
        if (deck.cards[arrPosition] == undefined) {
            deck.cards[arrPosition] = new Object();

            deck.cards[arrPosition].flashcardId = cardId;
        }
        else //if we unselect the element, we splice it from the array so that it only contains values we work with
            deck.cards[arrPosition].flashcardId = null;

        console.log("toggled card: "+cardId+" | value="+deck.cards[arrPosition].flashcardId);
    });

    $("#deck-name").change(function () {
        deck.cardDeckName = $(this).val();
        console.log(deck);
    });

    $("#deck-description").change(function () {
        deck.cardDeckDescpription = $(this).val();
        console.log(deck);
    });

    function addCardsToListView(id, questionText) {
        var html = '<div id="card-' + id + '"<a href="#" class="list-group-item list-group-item-action flex-column align-items-start">'
            + '<div class="d-flex w-100 justify-content-between">'
            + '<h4 class="mb-1">Card ' + id + '</h4>'
            + '</div><p class="mb-1"><strong>Question:</strong>' + questionText + '</p></a></div>';
        // console.log("adding... "+html);
        $('#list-cards').append(html);

    }
});

function getKey(object, value) {
    for (var key in object) {
        if (object[key] == value)
            return key;
    }
    return undefined;
}