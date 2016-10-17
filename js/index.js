$(document).ready(function () {
    var mdp = "";
    var mdp1 = "";
    var mdp2 = "";
    var id = "";
    var droits = "";
    var cookie = "";

    function setConnexion() {
        if ($(".seconnecter").text() == "Connecté") {
            $(".seconnecter").text("Se connecter");
            $(".seconnecter").addClass("btn-primary");
            $(".seconnecter").removeClass("btn-success");
            Cookies.remove("admin");
            //https://srvmaint.viennedoc.com/
            $.ajax({
                url: 'https://srvmaint.viennedoc.com/CookieServices.asmx/removeCookies'
                , type: "POST"
                , async:false
                , data: {
                    cookie: cookie
                }
                , crossDomain: true
            });
        }
        else if ($(".seconnecter").text() == "Se connecter") {
            $(".seconnecter").text("Connecté");
            $(".seconnecter").removeClass("btn-primary");
            $(".seconnecter").addClass("btn-success");
            Cookies.set('admin', cookie);
        }
    };
    if (Cookies.get('admin')) {
        $(".seconnecter").text("Connecté");
        $(".seconnecter").removeClass("btn-primary");
        $(".seconnecter").addClass("btn-success");
    }
    $(".seconnecter").click(function () {
        if ($(this).text() == "Connecté") {
            setConnexion();
        }
        else if ($(this).text() == "Se connecter") {
            $("#login-modal").modal("toggle");
        }
    });
    $(document).keypress(function (e) {
        if (e.which == 13) {
            if ($("#login-modal").is(':visible')) {
                connect();
            }
        }
    });
    $('.login.loginmodal-submit').click(function () {
        connect();
    });

    function connect() {
        var login = $("input[name='user']").val();
        mdp = $("input[name='pass']").val();
        $.ajax({
            url: 'https://srvmaint.viennedoc.com/AdminServices.asmx/isAdmin'
            , type: "POST"
            , data: {
                login: login
                , mdp: mdp
            }
            , crossDomain: true
            , success: function (data) {
                var isAdmin = $(data).find("string").text();
                var stringSplit = isAdmin.split(";");
                if (stringSplit.length > 1 && stringSplit[3] != "") {
                    id = stringSplit[0];
                    //Premiere Connection
                    droits = stringSplit[2];
                    cookie = stringSplit[3]
                    if (stringSplit[1] == "1") {
                        $("#login-modal").modal('toggle');
                        $("#change-mdp-modal").modal('toggle');
                    }
                    else {
                        $("#login-modal").modal('toggle');
                        //CREATION DU COOKIE
                        setConnexion();
                    }
                }
                else {
                    $('.error.loginMdp').css("display", "block");
                }
            }
            , error: function (xhr, status, error) {
                alert(error); //do something if there is an error
            }
        });
    };
    //CHANGE MDP
    $(".changeMDP.changeMDPModal-submit").click(function () {
        var lastMDP = $("input[name='lastMDP']").val();
        if (lastMDP == mdp && mdp1 == mdp2) {
            $.ajax({
                url: 'https://srvmaint.viennedoc.com/AdminServices.asmx/changeMDP'
                , type: "POST"
                , data: {
                    newMDP: mdp1
                    , id: id
                }
                , crossDomain: true
                , success: function (data) {
                    $("#change-mdp-modal").modal('toggle');
                    //CREATION DU COOKIE
                    setConnexion();
                }
            });
        }
    });
    $("input[name='lastMDP']").focusout(function () {
        if ($(this).val() !== "") {
            if ($(this).val() == mdp) {
                $(this).css("border", "1px solid green");
            }
            else {
                $(this).css("border", "1px solid red");
            }
        }
    });
    $("input[name='lastMDP']").bind("change paste keyup", function () {
        if ($(this).val() == "") {
            $("input[name='lastMDP']").css("border", "1px solid #d9d9d9");
            $("input[name='lastMDP']").css("border-top", "1px solid #c0c0c0");
        }
    });
    $("input[name='newMDP1']").focusout(function () {
        if ($(this).val() !== "") {
            $(this).css("border", "1px solid green");
            mdp1 = $(this).val();
        }
    });
    $("input[name='newMDP1']").bind("change paste keyup", function () {
        if ($(this).val() == "") {
            $("input[name='newMDP1']").css("border", "1px solid #d9d9d9");
            $("input[name='newMDP1']").css("border-top", "1px solid #c0c0c0");
        }
    });
    $("input[name='newMDP2']").bind("change paste keyup", function () {
        mdp2 = $(this).val();
        if (mdp2 == "") {
            $("input[name='newMDP2']").css("border", "1px solid #d9d9d9");
            $("input[name='newMDP2']").css("border-top", "1px solid #c0c0c0");
        }
        else if (mdp1 == mdp2) {
            $(this).css("border", "1px solid green");
        }
        else {
            $(this).css("border", "1px solid red");
        }
    });
});
