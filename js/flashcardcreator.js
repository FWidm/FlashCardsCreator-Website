/**
 * Created by Fabian-Desktop on 22.02.2017.
 */
$(document).ready(function () {
    var countAnswers = 0;
    var card = new Object();
    var question = new Object();

    card.answers = [];

    var cardList;


//Add a new Answer
    $("#save").click(function () {
            console.log("Save");
            //set to default if not set
            if (card.multiChoice == undefined) {
                card.multiChoice = false;
            }
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
                showWarning("Please make sure to fill in all the details. Request not sent.");
            }
            else {
                console.log("Request ready to be sent!");
                hideWarning();
            }

        }
    );

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

    function showWarning(text) {
        if (text != undefined) {
            $('#warning').text(text);
        }
        $('#warning').show();

    }

    function hideWarning() {
        $('#warning').hide();
    }

    function setWarningText(text) {
        console.log("Set warning text to: " + text);
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
                + '<input class="form-control answer-url" rows="5" id="answer-' + countAnswers + '-url"></input>'
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

        if (cardId != NaN) {
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

        if (cardId != NaN) {
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

        if (cardId != NaN) {
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

        if (cardId != NaN) {
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
        card.tags = commaSeparatedTags.replace(/\s/g, '').split(',');
        console.log(card);
    });

    //get radio group multiple choice
    $("#multiple-choice").change(function () {
        var bool = $("#multiple-choice").prop('checked');
        if (bool != null) {
            card.multiChoice = bool;
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