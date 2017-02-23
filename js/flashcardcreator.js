/**
 * Created by Fabian-Desktop on 22.02.2017.
 */
$(document).ready(function () {
    var countAnswers = 1;
    var card = new Object();
    card.answers=[];

    var cardList;

//Add a new Answer
    $("#addAnswerTemplate").click(function () {
            console.log("Woop");
            countAnswers++;
            $("#answers").append('<div id="answer-' + countAnswers + '">'
                + '<h4 class="sub-heading">Answer ' + countAnswers + ':</h4>'
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
            if (countAnswers > 1) {
                $("#answer-" + countAnswers).remove();

                countAnswers--;

            }
            if (countAnswers <= 1)
                setDeleteButtonActive(false);
        }
    );

    /**
     * Parse answers
     */
    $('#answers').bind('DOMNodeInserted DOMNodeRemoved', function() {
        console.log("DOMTree changed new count of answers="+countAnswers);
    });

    $('body').on('change', 'textarea.answer-text', function() {
        console.log("TEXT from: "+event.target.id);
    });

    $('body').on('change', 'textarea.answer-hint', function() {
        console.log("TEXT from: "+event.target.id);
    });

    $('body').on('change', 'input.answer-url', function() {
        console.log("TEXT from: "+event.target.id);
    });

    $('body').on('change', 'input.answer-correct', function() {
        var $input = $(this);

        console.log("TEXT from: "+event.target.id + " | value="+$input.prop('checked'));
    });

    /**
     * Parse normal fields
     */
    $("#question").change(function () {
        card.question = $("#question").val();
        console.log(card);
    });

    $("#question-url").change(function () {
        card.questionUrl = $("#question-url").val();
        console.log(card);
    });

    $("#question-url").change(function () {
        card.questionUrl = $("#question-url").val();
        console.log(card);
    });

    $("#tags-input").change(function () {
        var commaSeparatedTags=""+$("#tags-input").val();
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


    function setDeleteButtonActive(setActive) {
        var button = $("#deleteAnswerTemplate");
        if (setActive)
            button.removeClass("disabled").addClass("active");
        else
            button.removeClass("active").addClass("disabled");
    }
});