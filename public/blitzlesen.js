var dauer = 5000;
var geraten = 0;

var wörter = ['Hund', 'Katze', 'Maus', 'Dackel', 'Frosch', 'Huhn', 'Pferd', 'Gans', 'Papagei', 'Lachs', 'Schlange',
              'Hamster', 'Esel', 'Biene', 'Delfin', 'Fliege', 'Kuh', 'Skorpion', 'Schwan', 'Bär', 'Ziege', 'Tiger',
              'Pinguin', 'Leopard', 'Specht'];

function spielStart () {
    $('#login').css('display', 'none');
    $('#spiel').css('display', 'inherit')
    geraten = 0;
    nächstesWort();
    setTimeout(spielEnde, dauer);
    return false;
}

var wortTimeout;

function nächstesWort () {
    if (wortTimeout) {
        clearTimeout(wortTimeout);
    }
    $('#wort')
        .html(wörter.pop())
        .css('color', 'black');
    wortTimeout = setTimeout(function () {
        $('#wort').css('color', 'white');
    }, 1000);
}    

function spielEnde() {
    $('#spiel').css('display', 'none');
    var text;
    switch (geraten) {
    case 0:
        text = "Kein Wort gelesen!"; break;
    case 1:
        text = "Ein gelesenes Wort!"; break;
    default:
        text = geraten + " gelesene Wörter!";
    }
    $('#gelesene-worte').html(text);
    $('#ergebnis').css('display', 'inherit');
    setTimeout(function () {
        $('#neu').css('display', 'inline-block');
    }, 2000);
}

$(document).ready(function () {
    $('#login form').on('submit', spielStart);
    $('#spiel').on('click', function () {
        geraten = geraten + 1;
        nächstesWort();
        return false;
    });
    $('#neu').on('click', function () {
        $('#neu').css('display', 'none');
        $('#ergebnis').css('display', 'none');
        $('#login').css('display', 'inherit');
        return false;
    });
});
