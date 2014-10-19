var dauer = 60000;
var geraten = 0;

var wortlisten;
var wörter;

function zeige(seite) {
    $('#content').off('click keydown');
    $('#content > div').each(function () {
        if (this.id == seite) {
            $(this)
                .css('display', 'inherit')
                .css('position', 'absolute')
                .css("left", $(window).width() / 2 - $(this).width() / 2 + "px")
                .css("top", $(window).height() / 2 - $(this).height() / 2 + "px");
        } else {
            $(this).css('display', 'none');
        }
    });
}

function vorbereitung () {
    zeige('vorbereitung');
    $.getJSON('/wortlisten', function (data) {
        wortlisten = data;
        kategorien = [];
        for (kategorie in wortlisten) {
            kategorien.push(kategorie);
        }
        kategorien.sort();
        $('#kategorie').empty();
        kategorien.forEach(function (kategorie) {
            $('#kategorie').append("<option>" + kategorie + "</option>");
        });
        zeige('auswahl');
    });
}

function spielStart () {
    zeige('spiel');
    wörter = wortlisten[$('#kategorie').val()];
    geraten = 0;
    nächstesWort();
    $('#content')
        .on('click keydown', function () {
            geraten = geraten + 1;
            nächstesWort();
            return false;
        })
        .focus();
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
    zeige('ergebnis');
    setTimeout(function () {
        $('#neu').css('display', 'inline-block');
    }, 2000);
}

$(document).ready(function () {

    function maximize() {
        $('#content')
            .width($(window).width())
            .height($(window).height());
    }

    $(window).on('resize', maximize);
    maximize();

    $('#auswahl form').on('submit', spielStart);
    $('#neu').on('click', function () {
        $('#neu').css('display', 'none');
        vorbereitung();
        return false;
    });
    vorbereitung();
});
