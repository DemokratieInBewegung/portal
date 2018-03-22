var userGroups = ",";

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
                document.getElementById('appeal').innerHTML = "keine";
            }
        }
    }
  });
}

document.getElementById("support").addEventListener("click", function(){
    setCookie('supportlastvisit',getCookie('support'));
    document.getElementById('s').innerHTML = 'sucht Unterstützung (0)';
});
document.getElementById("discuss").addEventListener("click", function(){
    setCookie('discusslastvisit',getCookie('discuss'));
    document.getElementById('d').innerHTML = 'in Diskussion (0)';
});
document.getElementById("vote").addEventListener("click", function(){
    setCookie('votelastvisit',getCookie('vote'));
    document.getElementById('v').innerHTML = 'Abstimmung (0)';
});

function plenum() {
  /* auskommentiert, damit keine neuen Initiativen verpasst werden, wenn der User mal einen Tag nicht auf die neuen Initiativen schaut; User muss klicken, um Zähler auf 0 zu setzen
  var lastvisit = getCookie("lastvisit");
  if (lastvisit == "" || Number(lastvisit)+86400000 < new Date().getTime()) {
      setCookie("lastvisit",new Date().getTime());
      setCookie("supportlastvisit",getCookie("support"));
      setCookie("discusslastvisit",getCookie("discuss"));
      setCookie("votelastvisit",getCookie("vote"));
  }
  */
  $.ajax({
    url: "https://abstimmen.bewegung.jetzt/?f=s",
    headers: {'X-Requested-With': 'XMLHttpRequest'},
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
    headers: {'X-Requested-With': 'XMLHttpRequest'},
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
    headers: {'X-Requested-With': 'XMLHttpRequest'},
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

function holaSpirit() {
  var x;
  var roles;
  var members;
  $.ajax({
    url: "https://app.holaspirit.com/api/public/organizations/demokratie-in-bewegung-dib/roles",
    error: function(r) {
    },
    success: function(r) {
        if (r != null && r.data != null && r.data.length > 0) {
            roles = r.data;
        }
        $.ajax({
            url: "https://app.holaspirit.com/api/public/organizations/demokratie-in-bewegung-dib/members",
            error: function(m) {
            },
            success: function(m) {
                if (m != null && m.data != null && m.data.length > 0) {
                    members = m.data;
                    var myMap = new Map();
                    var orga = "<strong>aus HolaSpirit:</strong><br>";
                    for (x = 0; x < members.length; x++) {
                        myMap.set(members[x].id,members[x].displayName);
                    }
                    for (x = 0; x < roles.length; x++) {
                        if (roles[x].leadLinkMember != null) orga += roles[x].name + ": " + myMap.get(roles[x].leadLinkMember) + "<br>";
                    }
                    document.getElementById('contactsbody').innerHTML = orga;
                }
            }
        });
    }
  });
}

function getMPUserInfoAndDo(f) {
  $.ajax({
    url: "https://marktplatz.bewegung.jetzt/session/current.json",
    xhrFields: {
       withCredentials: true
    },
    error: function(session) {
        f();
    },
    success: function(session) {
        if (session != null && session.current_user != null) {
            var mpUsername = session.current_user.username;
            $.ajax({
                url: "https://marktplatz.bewegung.jetzt/users/"+mpUsername+".json",
                xhrFields: {
                   withCredentials: true
                },
                error: function(answer) {
                    f();
                },
                success: function(answer) {
                    if (answer != null && answer.user != null && answer.user.groups != null && answer.user.groups.length > 0) {
                        var mpgroups = answer.user.groups;
                        var x;
                        for (x = 0; x < mpgroups.length; x++) {
                            userGroups += mpgroups[x].name + ",";
                        }
                    }
                    f();
                }
            });
        }
    }
  });
}

function zoom() {
  if (userGroups.indexOf("Beweger_innen") >= 0) {
    var list = document.getElementById("zoom");
    list.innerHTML="";
    var li1 = document.createElement("li");
    var a1 = document.createElement("a");
    a1.href = "https://zoom.us/j/5564188890";
    a1.target = "_blank";
    var nobr1 = document.createElement("nobr");
    nobr1.innerHTML = "DiB1: 556-418-8890";
    a1.appendChild(nobr1);
    li1.appendChild(a1);
    var div1 = document.createElement("i");
    div1.innerHTML = " (Parteimitglieder)";
    li1.appendChild(div1);
    
    var li2 = document.createElement("li");
    var a2 = document.createElement("a");
    a2.href = "https://zoom.us/j/9464344297";
    a2.target = "_blank";
    var nobr2 = document.createElement("nobr");
    nobr2.innerHTML = "DiB2: 946-434-4297";
    a2.appendChild(nobr2);
    li2.appendChild(a2);
    var div2 = document.createElement("i");
    div2.innerHTML = " (Mitgl.+Beweger*innen)";
    li2.appendChild(div2);
    
    var li3 = document.createElement("li");
    var a3 = document.createElement("a");
    a3.href = "https://zoom.us/j/6125519791";
    a3.target = "_blank";
    var nobr3 = document.createElement("nobr");
    nobr3.innerHTML = "DiB3: 612-551-9791";
    a3.appendChild(nobr3);
    li3.appendChild(a3);
    var div3 = document.createElement("i");
    div3.innerHTML = " (Teams Bund)";
    li3.appendChild(div3);
    
    list.appendChild(li1);
    list.appendChild(li2);
    list.appendChild(li3);
    
  }
}

function wekan() {
  if (userGroups.indexOf("Team_Tech") >= 0) {
    var li = document.getElementById("wekan");
    var ul = document.createElement("ul");
    var li1 = document.createElement("li");
    var a1 = document.createElement("a");
    a1.href = "https://wekan.bewegung.jetzt/b/vxYn5NDMsu9iR6Wsp/backoffice-and-tooling";
    a1.target = "_blank";
    a1.innerHTML = "Backoffice&Tooling";
    li1.appendChild(a1);
    
    var li2 = document.createElement("li");
    var a2 = document.createElement("a");
    a2.href = "https://wekan.bewegung.jetzt/b/uQJxjrioxz2EG9nLi/initiativ-tool";
    a2.target = "_blank";
    a2.innerHTML = "Plenum-Entwicklung";
    li2.appendChild(a2);
    
    ul.appendChild(li1);
    ul.appendChild(li2);
    li.appendChild(ul);
  }
}

function setupSupportButton() {
  $('#btnSupport').ZammadForm({
    messageTitle: 'IT-Support Anfrage',
    messageSubmit: 'anfragen',
    messageThankYou: 'Vielen Dank für Ihre Anfrage (#%s). Wir melden uns umgehend!',
    showTitle: true,
    modal: true,
    attachmentSupport: true
  });
}