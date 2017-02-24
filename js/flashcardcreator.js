/**
 * Created by Fabian-Desktop on 22.02.2017.
 */
$(document).ready(function () {
    var countAnswers = 0;
    var card = new Object();
    var question = new Object();

    card.answers = [];


//Add a new Answer
    $("#save").click(function () {
            console.log("Save");
            //set to default if not set
            if (card.multipleChoice == undefined) {
                card.multipleChoice = false;
            }
            card.rating=0;
            var count = 0;
            do {
                if (card.answers[count] == undefined) {
                    break;
                }
                if (card.answers[count].answerCorrect == undefined) {
                    console.log("Setting iscorrect");
                    card.answers[count].answerCorrect = false;
                }
                count++;
            } while (count <= countAnswers);

            //console.log(JSON.stringify(card));
            previewJsonInCodeBlock();
            if (!jsonComplete()) {
                hideSuccess();
                showErrorWarning("<strong>Please make sure to fill in all the details.</strong> Request not sent.");
            }
            else {
                console.log("Request ready to be sent!");
                hideErrorWarning();
                PostNewCard();
            }

        }
    );


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

    function showSuccess(text) {
        var success= $('#success');

        if (text != undefined) {
            success.html(text);
        }
        if(success.hasClass("hidden"))
            success.removeClass("hidden");

    }

    function hideSuccess() {
        var success= $('#success');

        if(!success.hasClass("hidden"))
            success.addClass("hidden");
    }


    function PostNewCard() {
        jQuery.ajax({
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+getCookie(tokenCookieName)
            },
            type: 'POST',
            url: "http://" + ip + ":" + port + "/cards",
            data: JSON.stringify(card),
            dataType: 'json',
            success: function (data, status, jqXHR) {
                console.log("status=" + status);
                console.log(jqXHR);
                showSuccess("<strong>Card has been posted.</strong> Card created has id: "+data.id);
            },
            error: function (jqXHR, status) {
                console.log("status=" + status);

                console.log(jqXHR.responseText);
            },
            contentType: "application/json"

        });

        return false;
    }

    function jsonComplete() {
        var valid = true;
        //question
        console.log(card);
        if (card.question == undefined) {
            valid = false;
        } else {
            if (card.question.questionText == undefined || card.question.mediaURI == undefined)
                valid = false;
        }

        var i = 0;
        do {
            if (card.answers[i] == undefined) {
                return false;
            }
            else if (card.answers[i].answerText == undefined || card.answers[i].answerHint == undefined
                || card.answers[i].answerCorrect == undefined || card.answers[i].mediaURI == undefined) {
                return false;
            }
            i++;
        } while (i <= countAnswers);


        return valid;
    }




    $("#addAnswerTemplate").click(function () {
            console.log("Woop");
            countAnswers++;
            $("#answers").append('<div id="answer-' + countAnswers + '">'
                + '<h4 class="sub-heading">Answer ' + (countAnswers + 1) + ':</h4>'
                + '<label for="answer-' + countAnswers + '-text">Answer text:</label>'
                + '<textarea class="form-control answer-text" rows="5" id="answer-' + countAnswers + '-text"></textarea>'
                + '<label for="answer-' + countAnswers + '-hint">Answer hint text:</label>'
                + '<textarea class="form-control answer-hint" rows="5" id="answer-' + countAnswers + '-hint"></textarea>'
                + '<label for="answer-' + countAnswers + '-url">Answer URL:</label>'
                + '<input class="form-control answer-url" id="answer-' + countAnswers + '-url"></input>'
                + '<label>Is the answer correct? (for Multiple Choice cards!)</label><br/>'
                + '<label><input class=" answer-correct" type="checkbox" id="answer-' + countAnswers + '-correct"> Answer is correct</label>'
                + '<br/>'
                /*+ '<button type="button" class="btn btn-default pull-right" id="deleteAnswerTemplate"> <span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>'*/
                + '<hr></div>');
            setDeleteButtonActive(true);
        }
    );

    $("#deleteAnswerTemplate").click(function () {
            if (countAnswers > 0) {
                console.log("removing: " + countAnswers);
                $("#answer-" + countAnswers).remove();
                card.answers.splice(countAnswers, 1);
                countAnswers--;
                previewJsonInCodeBlock();
            }
            if (countAnswers <= 0)
                setDeleteButtonActive(false);
        }
    );


    /**
     * Parse answers
     */
    $('#answers').bind('DOMNodeInserted DOMNodeRemoved', function () {
        console.log("DOMTree changed new count of answers=" + countAnswers);
    });

    $('body').on('change', 'textarea.answer-text', function () {
        var id = String(event.target.id);//convert from answer-$number-text to $number.
        var cardId = Number(id.split("-")[1]);

        if (!isNaN(cardId)) {
            console.log("TEXT from card: " + cardId + " | type: " + typeof cardId);
            var answerText = $(event.target).val();
            console.log(answerText);
            if (card.answers[cardId] == null)
                card.answers[cardId] = new Object();
            card.answers[cardId].answerText = answerText;
        }
    });

    $('body').on('change', 'textarea.answer-hint', function () {
        var id = String(event.target.id);
        //convert from answer-$number-text to $number.
        var cardId = Number(id.split("-")[1]);

        if (!isNaN(cardId)) {
            console.log("TEXT from card: " + cardId + " | type: " + typeof cardId);
            var answerHint = $(event.target).val();
            console.log(answerHint);
            if (card.answers[cardId] == null)
                card.answers[cardId] = new Object();
            card.answers[cardId].answerHint = answerHint;
        }
    });

    $('body').on('change', 'input.answer-url', function () {
        var id = String(event.target.id);
        //convert from answer-$number-text to $number.
        var cardId = Number(id.split("-")[1]);

        if (!isNaN(cardId)) {
            console.log("TEXT from card: " + cardId + " | type: " + typeof cardId);
            var answerURI = $(event.target).val();
            console.log(answerURI);
            if (card.answers[cardId] == null)
                card.answers[cardId] = new Object();
            card.answers[cardId].mediaURI = answerURI;
        }
    });

    $('body').on('change', 'input.answer-correct', function () {
        var $input = $(this);

        console.log("TEXT from: " + event.target.id + " | value=" + $input.prop('checked'));
        var id = String(event.target.id);
        //convert from answer-$number-text to $number.
        var cardId = Number(id.split("-")[1]);

        if (!isNaN(cardId)) {
            console.log("TEXT from card: " + cardId + " | type: " + typeof cardId);
            if (card.answers[cardId] == null)
                card.answers[cardId] = new Object();
            card.answers[cardId].answerCorrect = $input.prop('checked');
        }
    });

    /**
     * Parse normal fields
     */
    $("#question").change(function () {
        question.questionText = $("#question").val();
        card.question = question;
        console.log(card);
    });

    $("#question-url").change(function () {
        question.mediaURI = $("#question-url").val();
        card.question = question;
        console.log(card);
    });


    $("#tags-input").change(function () {
        var commaSeparatedTags = "" + $("#tags-input").val();
        //console.log(commaSeparatedTags+ " | type: "+typeof commaSeparatedTags);
        card.tags =[];
        var tags = commaSeparatedTags.replace(/\s/g, '').split(',');
        for(var i=0; i<tags.length; i++){
            if(tags[i]=="")
                break;
            if(card.tags[i]==null){
                card.tags[i]=new Object();
            }
            card.tags[i].tagName=tags[i];
        }
        console.log(card);
    });

    //get radio group multiple choice
    $("#multiple-choice").change(function () {
        var bool = $("#multiple-choice").prop('checked');
        if (bool != null) {
            card.multipleChoice = bool;
            console.log(card);
        }

    });

    function previewJsonInCodeBlock() {
        $('#json-output').text(JSON.stringify(card, null, 4));
        $('code').each(function (i, block) {
            hljs.highlightBlock(block);
        });
    }

    function setDeleteButtonActive(setActive) {
        var button = $("#deleteAnswerTemplate");
        if (setActive)
            button.removeClass("disabled").addClass("active");
        else
            button.removeClass("active").addClass("disabled");
    }
});