$(document).ready(function(){
    var referrer =  document.referrer;
    if(referrer === ""){
        window.location.replace("http://localhost:8080/note");
    }
});
