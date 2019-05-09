var userGroups = ",";
var cookieConsentDismissed = false;
var statusMap = new Map();

function isCookieConsentDismissed() {
    if (cookieConsentDismissed) return true;
    if (getCookie('cookieconsent_status') == 'dismiss') {
        cookieConsentDismissed = true;
        return true;
    }
    return false;
}

function appeal() {
  $.ajax({
    url: "https://marktplatz.bewegung.jetzt/search?q=tags%3Aaufruf%20category%3A13%20order%3Alatest_topic",
    beforeSend: function(xhr){
        xhr.setRequestHeader('Accept', 'application/json');
    },
    error: function(answer) {
        document.getElementById('appeal').innerHTML = "Fehler bei Abruf";
    },
    success: function(answer) {
        if (answer != null) {
            if (answer.topics != null && answer.topics.length > 0) {
                
                var a = document.createElement("a");
                a.href = "https://marktplatz.bewegung.jetzt/t/appeal/"+answer.topics[0].id;
                a.target = "_blank";
                a.innerHTML = answer.topics[0].title;// oder fancy_title oder slug ???
                document.getElementById('appeal').appendChild(a);
            } else {
                $.ajax({
                    url: "https://abstimmen.bewegung.jetzt/?f=v",
                    headers: {'X-Requested-With': 'XMLHttpRequest'},
                    beforeSend: function(xhr){
                        xhr.setRequestHeader('Accept', 'application/json');
                    },
                    error: function(answer) {
                        document.getElementById('appeal').innerHTML = "keine";
                    },
                    success: function(answer) {
                        if (answer != null && answer.content != null && answer.content.initiatives != null) {
                            var x;
                            var id = 0;
                            for (x = 0; x < answer.content.initiatives.length; x++) {
                                if (answer.content.initiatives[x].einordnung == "plenumsabwaegung") {
                                    id = answer.content.initiatives[x].id;
                                    break;
                                }
                            }
                            if (id > 0) {
                                var a = document.createElement("a");
                                a.href = "https://abstimmen.bewegung.jetzt/?f=v#init-card-"+id;
                                a.target = "_blank";
                                a.innerHTML = "Plenumsabwägung";
                                document.getElementById('appeal').appendChild(a);
                            } else {
                                document.getElementById('appeal').innerHTML = "keine";
                            }
                        } else {
                            document.getElementById('appeal').innerHTML = "keine";
                        }
                    }
                });
            }
        }
    }
  });
}

function gesuche() {
  $.ajax({
    url: "https://marktplatz.bewegung.jetzt/search?q=category%3A94%20after%3A2017-10-10%20status%3Aopen%20order%3Alatest_topic",
    beforeSend: function(xhr){
        xhr.setRequestHeader('Accept', 'application/json');
    },
    error: function(answer) {
        document.getElementById('gesuche').innerHTML = "Fehler bei Abruf";
    },
    success: function(answer) {
        if (answer != null) {
            if (answer.topics != null && answer.topics.length > 0) {
                var a = document.createElement("a");
                a.href = "https://marktplatz.bewegung.jetzt/t/gesuche/"+answer.topics[0].id;
                a.target = "_blank";
                a.innerHTML = answer.topics[0].title.replace(/:[a-z_]*:/g,'');
                document.getElementById('gesuche').appendChild(a);
                if (answer.topics.length >= 2) {
                    var li = document.createElement("li");
                    document.getElementById('gesuche').parentElement.appendChild(li);
                    if (answer.topics.length == 2) {
                        a = document.createElement("a");
                        a.href = "https://marktplatz.bewegung.jetzt/t/gesuche/"+answer.topics[1].id;
                        a.target = "_blank";
                        a.innerHTML = answer.topics[1].title.replace(/:[a-z_]*:/g,'');
                        li.appendChild(a);
                    } else {
                        a = document.createElement("a");
                        a.href = "https://marktplatz.bewegung.jetzt/c/informationen-und-aktuelles/wir-suchen";
                        a.target = "_blank";
                        a.innerHTML = answer.topics.length-1 + " weitere";
                        li.appendChild(a);
                    }
                }
            } else {
                document.getElementById('gesuche').innerHTML = "aktuell kein Gesuche";
            }
        }
    }
  });
}

document.getElementById("support").addEventListener("mousedown", function(){
    setCookie('supportlastvisit',statusMap.get('support'));
    document.getElementById('s').innerHTML = 'sucht Unterstützung (0)';
    setTimeout(function() {
       document.getElementById('support').href = 'https://abstimmen.bewegung.jetzt/?f=s';
    }, 100);
});
document.getElementById("discuss").addEventListener("mousedown", function(){
    setCookie('discusslastvisit',statusMap.get('discuss'));
    document.getElementById('d').innerHTML = 'in Diskussion (0)';
    setTimeout(function() {
       document.getElementById('discuss').href = 'https://abstimmen.bewegung.jetzt/?f=d';
    }, 100);
});
document.getElementById("vote").addEventListener("mousedown", function(){
    setCookie('votelastvisit',statusMap.get('vote'));
    document.getElementById('v').innerHTML = 'Abstimmung (0)';
    setTimeout(function() {
       document.getElementById('vote').href = 'https://abstimmen.bewegung.jetzt/?f=v';
    }, 100);
    
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
            var ic = getInitiatives("support",answer.content.initiatives);
            document.getElementById('s').innerHTML = "sucht Unterstützung ("+ic[1]+")";
            if (ic[1] > 0) document.getElementById('support').href = "https://abstimmen.bewegung.jetzt/?f=s#init-card-"+ic[0];
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
        if (answer != null && answer.content != null && answer.content.initiatives != null) {
            var ic = getInitiatives("discuss",answer.content.initiatives);
            document.getElementById('d').innerHTML = "in Diskussion ("+ic[1]+")";
            if (ic[1] > 0) document.getElementById('discuss').href = "https://abstimmen.bewegung.jetzt/?f=d#init-card-"+ic[0];
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
        if (answer != null && answer.content != null && answer.content.initiatives != null) {
            var ic = getInitiatives("vote",answer.content.initiatives);
            document.getElementById('v').innerHTML = "Abstimmung ("+ic[1]+")";
            if (ic[1] > 0) document.getElementById('vote').href = "https://abstimmen.bewegung.jetzt/?f=v#init-card-"+ic[0];
        }
    }
  });
}

function getInitiatives(status,arr) {
    var x;
    var id;
    var firstid = 0;
    var newids = 0;
    var c = ",";
    var clast = getCookie(status+"lastvisit");
    for (x = 0; x < arr.length; x++) {
        id = arr[x].id;
        c += id + ",";
        if (clast.indexOf(","+id+",") < 0) {
            if (newids == 0) firstid = id;
            newids++;
        }
    }
    statusMap.set(status,c);
    return [firstid,newids];
}


function setCookie(cname, cvalue) {
    if (isCookieConsentDismissed()) {
        var d = new Date();
        d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
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
                    var orga = "<strong>Daten aus HolaSpirit:</strong><br><br><table><tr><th>Kreis</th><th>Ansprechpartner (MP-Benutzername)</th></tr>";
                    for (x = 0; x < members.length; x++) {
                        myMap.set(members[x].id,members[x].displayName+((members[x].customFields.marktplatzNutzername && members[x].customFields.marktplatzNutzername.value)?" (@"+members[x].customFields.marktplatzNutzername.value+")":""));
                    }
                    for (x = 0; x < roles.length; x++) {
                        if (roles[x].leadLinkMember != null) orga += "<tr><td>"+roles[x].name + ":&nbsp;</td><td>" + myMap.get(roles[x].leadLinkMember) + "</td></tr>";
                    }
                    orga += "</table>";
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

function collapsePanels() {
  if (jQuery(window).width() < 768) {  
      jQuery('.panel-collapse').removeClass('in');
      jQuery('.collapsable').addClass('collapsed');
  } else {
      if (getCookie("showInfo") != "") {
          jQuery("#info").addClass("in");
          jQuery("#ainfo").removeClass("collapsed");
      }
      if (getCookie("showMp") != "") {
          jQuery("#mp").addClass("in");
          jQuery("#amp").removeClass("collapsed");
      }
      if (getCookie("showInitiativen") != "") {
          jQuery("#initiativen").addClass("in");
          jQuery("#ainitiativen").removeClass("collapsed");
      }
      if (getCookie("showTools") != "") {
          jQuery("#tools").addClass("in");
          jQuery("#atools").removeClass("collapsed");
      }
      if (getCookie("showMgmt") != "") {
          jQuery("#mgmt").addClass("in");
          jQuery("#amgmt").removeClass("collapsed");
      }
      if (getCookie("showIt") != "") {
          jQuery("#it").addClass("in");
          jQuery("#ait").removeClass("collapsed");
      }
  }
}