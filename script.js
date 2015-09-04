var func = function() {
    for(i = 0; i < 201; i += 2) {
        log(i);
    }

    for(i = 7; i < 501; i += 7) {
        log(i);
    }

    for(i = 3; i <= 30; i += 3) {
        log(i);
    }

    for(i = 2; i < 11; i++) {
        for(j = i; j <= (i * 10); j += i) {
            log(j);
        }
    }
}

var log = function(i) {
    document.getElementById("log").innerHTML += i + "<br>";
}

var clearDiv = function() {
    document.getElementById("log").innerHTML = "";
}
