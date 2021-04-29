var duration = 60000;
var wordDuration = 1000;
var readCount = 0;

var wordlists;
var words;

function show(seite) {
    $('#content').off('click keydown');
/*
    var elements = document.querySelectorAll('#content > div');
    for(var element of elements) {
        if (element.id === seite) {
            element.style.display = 'inherit';
            element.style.position = 'absolute';
            element.style.left = (window.clientWidth / 2 - element.offsetWidth / 2) + "px";
            element.style.top = (window.clientHeight / 2 - element.offsetHeight / 2) + "px";
        } else {
            element.style.display = 'none';
        }
    }
*/
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

function prepare() {
    show('vorbereitung');
    $.getJSON('/wordlists', function (data) {
        wordlists = data;
        categories = [];
        for (category in wordlists) {
            categories.push(category);
        }
        categories.sort();
        $('#kategorien').empty();
        categories.forEach(function (kategorie) {
            $('#kategorien').append("<option>" + kategorie + "</option>");
        });
        show('auswahl');
    });
}

function gameStart() {
    show('spiel');
    wordDuration = $('#delay').val();
    duration = $('#duration').val() * 1000;
    words = wordlists[$('#kategorie').val()].slice(0);
    if ($('#mischen:checked').val()) {
        knuthShuffle(words);
    }
    readCount = 0;
    nextWord();
    $('#content')
        .on('click keydown', function (event) {
            if (event.type === 'keydown' && event.key.length > 1) {
                return;
            }
            readCount = readCount + 1;
            nextWord();
            return false;
        })
        .focus();
    if (duration > 0) {
        var element = document.querySelector('#progress .inner');
        element.classList.remove("animation");
        void element.offsetWidth;
        element.style.animationDuration = duration + "ms";
        element.classList.add("animation");

        setTimeout(gameEnd, duration);
    }
    return false;
}

var wortTimeout;

function nextWord() {
    if (wortTimeout) {
        clearTimeout(wortTimeout);
    }
    let currentWord = readCount % words.length;
    document.getElementById('wort').innerHTML = words[currentWord];
    document.getElementById('wort').style.color = 'black';
    wortTimeout = setTimeout(function () {
        document.getElementById('wort').style.color = 'white';
    }, wordDuration);
}

function gameEnd() {
    var text;
    switch (readCount) {
        case 0:
            text = "Kein Wort gelesen!";
            break;
        case 1:
            text = "Ein gelesenes Wort!";
            break;
        default:
            text = readCount + " gelesene Wörter!";
    }
    document.getElementById('gelesene-worte').innerHTML = text;
    show('ergebnis');
    setTimeout(function () {
        document.getElementById('neu').style.display = 'inline-block';
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

    $('#auswahl form').on('submit', gameStart);
    $('#neu').on('click', function () {
        document.getElementById('neu').style.display = 'none';
        prepare();
        return false;
    });
    prepare();
});
