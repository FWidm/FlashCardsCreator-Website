/**
 * Created by Fabian-Desktop on 22.02.2017.
 */
var countAnswers = 1;

//Add a new Answer
$("#addAnswerTemplate").click(function () {
        console.log("Woop");
        countAnswers++;
        $("#answers").append('<div id="answer-' + countAnswers + '">'
            + '<h4 class="sub-heading">Answer ' + countAnswers + ':</h4>'
            + '<label for="answer-' + countAnswers + '-text">Answer text:</label>'
            + '<textarea class="form-control" rows="5" id="answer-' + countAnswers + '-text"></textarea>'
            + '<label for="answer-' + countAnswers + '-hint">Answer hint text:</label>'
            + '<textarea class="form-control" rows="5" id="answer-' + countAnswers + '-hint"></textarea>'
            + '<label for="answer-' + countAnswers + '-url">Answer URL:</label>'
            + '<input class="form-control" rows="5" id="answer-' + countAnswers + '-url"></input>'
            + '<label>Is the answer correct? (for Multiple Choice cards!)</label><br/>'
            + '<label class="radio-inline"><input type="radio" name="answer-' + countAnswers + '-correct">Correct</label>'
            + '<label class="radio-inline"><input type="radio" name="answer-' + countAnswers + '-correct">False</label>'
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

function setDeleteButtonActive(setActive) {
    var button=$("#deleteAnswerTemplate");
    if(setActive)
        button.removeClass("disabled").addClass("active");
    else
        button.removeClass("active").addClass("disabled");
}