var squareCount = 16;
var emptySquare;

// Document ready function, called two functions and added events.

$(document).ready(function () {
    jQuery.event.props.push('dataTransfer');
    createBoard();
    addTiles();
    $('#gameBoard').on('dragstart', dragStarted);
    $('#gameBoard').on('dragend', dragEnded);
    $('#gameBoard').on('dragenter', preventDefault);
    $('#gameBoard').on('dragover', preventDefault);
    $('#gameBoard').on('drop', drop);
    scramble(); //called new function to scramble board
});

function createBoard() {
    for (var i = 0; i < squareCount; i++) {
        var $square = $('<div id="square' + i + '" data-square="' + i +'" class="square"></div>');
        $square.appendTo($('#gameBoard'));
    }
};

function addTiles() {
    emptySquare = squareCount - 1;
    for (var i = 0; i < emptySquare; i++) {
        var $square = $('#square' + i);
        var $tile = $('<div draggable="true" id="tile' + i + '" class="tile">' + (i + 1) + '</div>');
        $tile.appendTo($square);
    } 
};

// Added function to call target and add css class to the tile

function dragStarted(e) {
    var $tile = $(e.target)
    $tile.addClass('dragged');
    var sourceLocation = $tile.parent().data('square');
    e.dataTransfer.setData('text', sourceLocation.toString());
    e.dataTransfer.effectAllowed = 'move';
}

// function to remove dragged css class

function dragEnded(e) {
    $(e.target).removeClass('dragged');
}

// called function to prevent default on target

function preventDefault(e) {
    e.preventDefault();
}

// this function has an event parameter to verify that the target of the drop square has css class called square. 
// This function also compares the emptySquare with the value of the destination, if not equal, exits the drop function. 

function drop(e) {
    var $square= $(e.target);
    if ($square.hasClass('square')) {
        var destinationLocation = $square.data('square');
        if (emptySquare != destinationLocation) return;
        var sourceLocation = Number(e.dataTransfer.getData('text'));
        moveTile(sourceLocation);
        checkForWinner(); //added new function to check for a winner
    }
}

// this function is to check the distance between horizontal and vertical squares for a tile to move up or down

function moveTile(sourceLocation) {
    var distance = sourceLocation - emptySquare;
    if (distance < 0) distance = -(distance);
    if (distance == 1 || distance == 4) {
        swapTileAndEmptySquare(sourceLocation);
    }
}

// this function to retrieve tile from sourceLocation and assign different variables. 
// This allows to detach the dragged item from the DOM and assign the square to a new location and append the item to the target

function swapTileAndEmptySquare(sourceLocation) {
    var $draggedItem = $('#square' + sourceLocation).children();
    $draggedItem.detach();
    var $target = $('#square' + emptySquare);
    $draggedItem.appendTo($target);
    emptySquare = sourceLocation;
}

// this function is to scramble the board

function scramble() {
    for (var i = 0; i < 128; i++) {
        var random = Math.random()
        var sourceLocation;
        if (random < 0.5) {
            var column = emptySquare % 4
            if (column == 0 || (random < 0.25 && column != 3)) {
                sourceLocation = emptySquare + 1;
            }
            else {
                sourceLocation = emptySquare - 1;
            }
        }
        else {
            var row = Math.floor(emptySquare / 4)
            if (row == 0 || (random < 0.75 && row != 3)) {
                sourceLocation = emptySquare + 4;
            }
            else {
                sourceLocation = emptySquare - 4;
            }
        }
        swapTileAndEmptySquare(sourceLocation);
    }
}

// Function to check for a winner. If the tiles are in their correct square, the message changes to winner.

function checkForWinner() {
    if (emptySquare != squareCount - 1) return;
    for (var i = 0; i < emptySquare; i++) {
        if ($('#tile' + i).parent().attr('id') != 'square' + i) return;
    }
    $('#message').html('Winner!');
}