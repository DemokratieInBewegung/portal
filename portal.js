function cachetStatus() {
  $.ajax({
    url: "https://status.bewegung.jetzt/api/v1/status",
    success: function(status) {
        if (status != null) {
            if (status.data.indexOf("Alle Systeme funktionieren") >= 0) {
                $('#cachet').attr("src","icons/cachet-green.png");
            } else {
                $('#cachet').attr("src","icons/cachet-red.png");
            }
        }
    }
  });
}

function appeal() {
  $.ajax({
    url: "https://marktplatz.bewegung.jetzt/search?q=tags%3Aaufruf%20%23informationen-und-aktuelles%20order%3Alatest_topic",
    beforeSend: function(xhr){
        xhr.setRequestHeader('Accept', 'application/json');
    },
    error: function(answer) {
        document.getElementById('appeal').innerHTML = "Fehler bei Abruf";
    },
    success: function(answer) {
        if (answer != null) {
            if (answer.topics != null && answer.topics.length >= 0) {
                
                var a = document.createElement("a");
                a.href = "https://marktplatz.bewegung.jetzt/t/appeal/"+answer.topics[0].id;
                a.target = "_blank";
                a.innerHTML = answer.topics[0].title;// oder fancy_title oder slug ???
                document.getElementById('appeal').appendChild(a);
            } else {
                document.getElementById('appeal').innerHTML = "-";
            }
        }
    }
  });
}

function plenum() {
  var lastvisit = getCookie("lastvisit");
  if (lastvisit == "" || Number(lastvisit)+86400000 < new Date().getTime()) {
      setCookie("lastvisit",new Date().getTime());
      setCookie("supportlastvisit",getCookie("support"));
      setCookie("discusslastvisit",getCookie("discuss"));
      setCookie("votelastvisit",getCookie("vote"));
  }
  $.ajax({
    url: "https://abstimmen.bewegung.jetzt/?f=s",
    beforeSend: function(xhr){
        xhr.setRequestHeader('Accept', 'application/json');
    },
    error: function(answer) {
        
    },
    success: function(answer) {
        if (answer != null && answer.content != null && answer.content.initiatives != null) {
            document.getElementById('s').innerHTML = "sucht Unterstützung ("+getInitiatives("support",answer.content.initiatives)+")";
        }
    }
  });
  
  $.ajax({
    url: "https://abstimmen.bewegung.jetzt/?f=d",
    beforeSend: function(xhr){
        xhr.setRequestHeader('Accept', 'application/json');
    },
    error: function(answer) {
        
    },
    success: function(answer) {
        if (answer != null) {
            if (answer != null && answer.content != null && answer.content.initiatives != null) {
                document.getElementById('d').innerHTML = "in Diskussion ("+getInitiatives("discuss",answer.content.initiatives)+")";
            }
        }
    }
  });
  
  $.ajax({
    url: "https://abstimmen.bewegung.jetzt/?f=v",
    beforeSend: function(xhr){
        xhr.setRequestHeader('Accept', 'application/json');
    },
    error: function(answer) {
        
    },
    success: function(answer) {
        if (answer != null) {
            if (answer != null && answer.content != null && answer.content.initiatives != null) {
                document.getElementById('v').innerHTML = "Abstimmung ("+getInitiatives("vote",answer.content.initiatives)+")";
            }
        }
    }
  });
}

function getInitiatives(status,arr) {
    var x;
    var id;
    var newids = 0;
    var c = ",";
    var clast = getCookie(status+"lastvisit");
    console.log(clast);
    for (x = 0; x < arr.length; x++) {
        id = arr[x].id;
        c += id + ",";
        if (clast.indexOf(","+id+",") < 0) newids++;
    }
    setCookie(status,c);
    return newids;
}


function setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}