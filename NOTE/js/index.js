$(document).ready(function () {
    //TEST ADMIN
    if (Cookies.get('admin') == "true") {
        $(".connexion").text("Connecté");
        $(".connexion").removeClass("btn-primary");
        $(".connexion").addClass("btn-success");
        addRemoveButton();
    }
    //https://bloc.viennedoc.fr/NotesService.asmx/getAllNoteJSON
    var notes = [];
    var clients = [];
    var techs = [];
    var timer;
    var clientNewNote;
    var techNewNote;
    var importantNewNote = false;
    var pictureBase64NewNote = "";
    $("[name='my-checkbox']").bootstrapSwitch();
    $(":file").filestyle();
    /*$("#input-20").fileinput({
        browseClass: "btn btn-primary btn-block"
        , showCaption: false
        , showRemove: false
        , showUpload: false
    });*/
    $.ajax({
        url: 'https://bloc.viennedoc.fr/NotesService.asmx/getAllNoteJSON'
        , type: "POST"
        , crossDomain: true
        , success: function (data) {
            $lesNotes = $(data).find("string").text();
            $json = $.parseJSON($lesNotes);
            $.each($json, function ($number, $obj) {
                notes[$number] = $obj;
                $important = $obj["important"] == true ? '<div class="corner-ribbon top-right sticky red">Important</div>' : '';
                if ($obj["idPhoto"] != 0) {
                    $(".row.notes").append('<div class="col-md-12 col-md-offset-3"><div class="col-md-6 divNote">' + $important + '<h2 class="col-md-12">' + $obj["client"] + '</h2>' + '<p class="col-md-12 note">' + $obj["note"] + '</p>' + '<img class="col-md-12" id="img' + $number + '"></img>' + '<div class="col-md-12 text-right"><a class="btn btn-default" id="' + $number + '"><span class="glyphicon glyphicon-pencil"></span>Modifier</a></div>' + '<div class="col-md-12"><hr></div>' + '<p class="col-md-8" >' + $obj["Tech"] + '</p>' + '<p class="col-md-4 text-right date">' + $obj["noteDate"].split(" ")[0] + '</p>' + '</div></div>')
                    $.ajax({
                        url: 'https://bloc.viennedoc.fr/NotesService.asmx/getPicture'
                        , type: "POST"
                        , data: {
                            id: $obj["idPhoto"]
                        }
                        , crossDomain: true
                        , success: function (data) {
                            $img = $(data).find("string").text();
                            var src = "data:image/jpeg;base64,";
                            src += $img;
                            document.getElementById('img' + $number).setAttribute('src', src);
                        }
                    });
                }
                else {
                    $(".row.notes").append('<div class="col-md-12 col-md-offset-3"><div class="col-md-6 divNote">' + $important + '<h2 class="col-md-12">' + $obj["client"] + '</h2>' + '<p class="col-md-12 note" id="' + $obj["_id"] + '">' + $obj["note"] + '</p>' + '<div class="col-md-12 text-right"><a class="btn btn-default modifyButton" id="' + $number + '"><span class="glyphicon glyphicon-pencil"></span>Modifier</a></div>' + '<div class="col-md-12"><hr></div>' + '<p class="col-md-8" >' + $obj["Tech"] + '</p>' + '<p class="col-md-4 text-right date">' + $obj["noteDate"].split(" ")[0] + '</p>' + '</div></div>')
                }
                //$obj = "";
            });
        }
        , error: function (xhr, status, error) {
            alert(error); //do something if there is an error
        }
    });
    $(document).on("click", ".btn.btn-default", function () {
        bootbox.dialog({
            title: "Nouvelle note :"
            , message: '<div class="row">  ' + '<div class="col-md-12"> ' + '<form class="form-horizontal"> ' + '<textarea class="form-control modification" id="' + notes[$(this).attr('id')]["_id"] + '" contentEditable>' + notes[$(this).attr('id')]["note"] + '</textarea> ' + '</form> </div>  </div>'
            , buttons: {
                success: {
                    label: "Save"
                    , className: "btn-success"
                    , callback: function () {
                        var note = $("textarea.modification").val();
                        var idNote = $("textarea.modification").attr('id');
                        var fullDate = new Date();
                        var twoDigitMonth = ((fullDate.getMonth().length + 1) === 1) ? (fullDate.getMonth() + 1) : '0' + (fullDate.getMonth() + 1);
                        var date = fullDate.getDate() + "/" + twoDigitMonth + "/" + fullDate.getFullYear() + " " + fullDate.getHours() + "-" + fullDate.getMinutes() + "-" + fullDate.getSeconds();
                        $.ajax({
                            url: 'https://bloc.viennedoc.fr/NotesService.asmx/updateNote'
                            , type: "POST"
                            , data: {
                                note: note
                                , date: date
                                , idNote: idNote
                            }
                            , crossDomain: true
                            , success: function (data) {
                                $("p#" + idNote).text(note);
                            }
                        });
                    }
                }
            }
        });
    });
    $(document).on("keyup", "textarea", function () {
        autosize($(this));
    });
    $("#customers-search input").keyup(function () {
        $(".dropdown-menu.dropdown-menu-right .list-group").empty();
        if (clients.length === 0) {
            $.ajax({
                url: 'https://bloc.viennedoc.fr/NotesService.asmx/CustomersJSON'
                , type: "POST"
                , crossDomain: true
                , success: function (data) {
                    $lesClients = $(data).find("string").text();
                    $json = $.parseJSON($lesClients);
                    $.each($json, function ($number, $obj) {
                        clients[$number] = $obj;
                    });
                    filterClients();
                }
            });
        }
        else {
            filterClients();
        }
    });
    $("#techs-search input").keyup(function () {
        $("#techs-search .dropdown-menu.dropdown-menu-right .list-group").empty();
        if (techs.length === 0) {
            $.ajax({
                url: 'https://bloc.viennedoc.fr/NotesService.asmx/getTechJSON'
                , type: "POST"
                , crossDomain: true
                , success: function (data) {
                    $lesTechs = $(data).find("string").text();
                    $json = $.parseJSON($lesTechs);
                    $.each($json, function ($number, $obj) {
                        techs[$number] = $obj;
                    });
                    filterTechs();
                }
            });
        }
        else {
            filterTechs();
        }
    });

    function filterTechs() {
        clearTimeout(timer);
        timer = setTimeout(function () {
            if ($("#techs-search input").val() !== "") {
                $("#techs-search .dropdown.dropdown-lg").addClass("open");
                $.each(techs, function ($number, $obj) {
                    if ($obj["name"].toLowerCase().match("^" + $("#techs-search input").val().toLowerCase())) {
                        $("#techs-search .dropdown-menu.dropdown-menu-right .list-group").append('<a href="#" id="' + $number + '" class="list-group-item tech">' + $obj["name"] + '</a>');
                    }
                });
            }
            else {
                $("#techs-search .dropdown.dropdown-lg").removeClass("open");
            }
        }, 200);
    }

    function filterClients() {
        clearTimeout(timer);
        timer = setTimeout(function () {
            if ($("#customers-search input").val() !== "") {
                $("#customers-search .dropdown.dropdown-lg").addClass("open");
                $.each(clients, function ($number, $obj) {
                    if ($obj["name"].toLowerCase().match("^411" + $("#customers-search input").val().toLowerCase())) {
                        $("#customers-search .dropdown-menu.dropdown-menu-right .list-group").append('<a href="#" id="' + $number + '" class="list-group-item customer">' + $obj["name"] + '</a>');
                    }
                    else if ($obj["name"].toLowerCase().match("^" + $("#customers-search input").val().toLowerCase())) {
                        $("#customers-search .dropdown-menu.dropdown-menu-right .list-group").append('<a href="#" id="' + $number + '" class="list-group-item customer">' + $obj["name"] + '</a>');
                    }
                });
            }
            else {
                $("#customers-search .dropdown.dropdown-lg").removeClass("open");
            }
        }, 200);
    }
    $(document).on("click", ".list-group-item.customer", function () {
        $("#customers-search input").val($(this).text());
        $("#customers-search .dropdown.dropdown-lg").removeClass("open");
        clientNewNote = clients[$(this).attr("id")];
    });
    $(document).on("click", ".list-group-item.tech", function () {
        $("#techs-search input").val($(this).text());
        $("#techs-search .dropdown.dropdown-lg").removeClass("open");
        techNewNote = techs[$(this).attr("id")];
    });
    $('input[name="my-checkbox"]').on('switchChange.bootstrapSwitch', function (event, state) {
        importantNewNote = state;
    });
    $(".buttons .btn-success").click(function () {
        $important = importantNewNote == true ? '<div class="corner-ribbon top-right sticky red">Important</div>' : '';
        var note = $("#textareaNote").val();
        var fullDate = new Date();
        var twoDigitMonth = ((fullDate.getMonth().length + 1) === 1) ? (fullDate.getMonth() + 1) : '0' + (fullDate.getMonth() + 1);
        var date = fullDate.getDate() + "/" + twoDigitMonth + "/" + fullDate.getFullYear();
        var idPhoto = "";
        if (clientNewNote != null && techNewNote != null && note != "") {
            if (pictureBase64NewNote != "") {
                $.ajax({
                    url: 'https://bloc.viennedoc.fr/NotesService.asmx/uploadPhoto'
                    , type: "POST"
                    , data: {
                        image: pictureBase64NewNote
                    }
                    , crossDomain: true
                    , success: function (data) {
                        idPhoto = $(data).find("string").text();
                        $.ajax({
                            url: 'https://bloc.viennedoc.fr/NotesService.asmx/addNote'
                            , type: "POST"
                            , data: {
                                note: note
                                , date: date + " " + fullDate.getHours() + "-" + fullDate.getMinutes() + "-" + fullDate.getSeconds()
                                , idClient: clientNewNote["_id"]
                                , idTech: techNewNote["_id"]
                                , important: importantNewNote
                                , photo: idPhoto
                            }
                            , crossDomain: true
                            , success: function (data) {}
                        });
                    }
                });
            }
            else {
                $.ajax({
                    url: 'https://bloc.viennedoc.fr/NotesService.asmx/addNote'
                    , type: "POST"
                    , data: {
                        note: note
                        , date: date + " " + fullDate.getHours() + "-" + fullDate.getMinutes() + "-" + fullDate.getSeconds()
                        , idClient: clientNewNote["_id"]
                        , idTech: techNewNote["_id"]
                        , important: importantNewNote
                        , photo: idPhoto
                    }
                    , crossDomain: true
                    , success: function (data) {}
                });
            }
            if (pictureBase64NewNote == "") {
                $(".row.notes").prepend($('<div class="col-md-12 col-md-offset-3"><div class="col-md-6 divNote">' + $important + '<h2 class="col-md-12">' + clientNewNote["name"] + '</h2>' + '<p class="col-md-12 note">' + note + '</p>' + '<div class="col-md-12"><hr></div>' + '<p class="col-md-8" >' + techNewNote["name"] + '</p>' + '<p class="col-md-4 text-right date">' + date + '</p>' + '</div></div>').fadeIn("slow"));
            }
            else {
                $(".row.notes").prepend($('<div class="col-md-12 col-md-offset-3"><div class="col-md-6 divNote">' + $important + '<h2 class="col-md-12">' + clientNewNote["name"] + '</h2>' + '<p class="col-md-12 note">' + note + '</p>' + '<img class="col-md-12" src="data:image/png;base64,' + pictureBase64NewNote + '"></img>' + '<div class="col-md-12"><hr></div>' + '<p class="col-md-8" >' + techNewNote["name"] + '</p>' + '<p class="col-md-4 text-right date">' + date + '</p>' + '</div></div>').fadeIn("slow"));
            }
        }
    });
    $('input[type=file]').change(function () {
        if (this.files && this.files[0]) {
            var FR = new FileReader();
            FR.onload = function (e) {
                pictureBase64NewNote = e.target.result.substring(e.target.result.indexOf("base64,") + 7);
            };
            FR.readAsDataURL(this.files[0]);
        }
    });
    var deco = false;
    $(".connexion").click(function () {
        if ($(".connexion").text() == "Se déconnecter") {
            $(".connexion").text("Déconnecté");
            $(".connexion").removeClass("btn-danger");
            $(".connexion").addClass("btn-primary");
            deco = true;
            Cookies.remove('admin');
            removeRemoveButton();
        }
        else {
            $("#login-modal").modal('toggle');
        }
    });
    $(".connexion").hover(function () {
        if ($(".connexion").text() == "Déconnecté") {
            $(".connexion").text("Se connecter");
            $(".connexion").removeClass("btn-primary");
            $(".connexion").addClass("btn-success");
        }
        else {
            $(".connexion").text("Se déconnecter");
            $(".connexion").removeClass("btn-success");
            $(".connexion").addClass("btn-danger");
        }
    }, function () {
        if (deco != true) {
            if ($(".connexion").text() == "Se connecter") {
                $(".connexion").text("Déconnecté");
                $(".connexion").removeClass("btn-success");
                $(".connexion").addClass("btn-primary");
            }
            else {
                $(".connexion").text("Connecté");
                $(".connexion").removeClass("btn-danger");
                $(".connexion").addClass("btn-success");
            }
        }
        deco = false;
    });
    $('.login.loginmodal-submit').click(function () {
        var login = $("input[name='user']").val();
        var mdp = $("input[name='pass']").val();
        $.ajax({
            url: 'https://bloc.viennedoc.fr/NotesService.asmx/isAdmin'
            , type: "POST"
            , data: {
                login: login
                , mdp: mdp
            }
            , crossDomain: true
            , success: function (data) {
                var isAdmin = $(data).find("boolean").text();
                if (isAdmin == "true") {
                    $("#login-modal").modal('toggle');
                    $(".connexion").text("Connecté");
                    $(".connexion").removeClass("btn-primary");
                    $(".connexion").addClass("btn-success");
                    //CREATION DU COOKIE
                    //Cookies.set('admin', 'true');
                    //var inTwoMinutes = new Date(new Date().getTime() + 2 * 60 * 1000);
                    Cookies.set('admin', 'true', {
                        expires: 100000
                    });
                    addRemoveButton();
                }
            }
        });
    });

    function addRemoveButton() {
        var modifyButtons = $(".modifyButton");
        $.each(modifyButtons, function ($number, $obj) {
            $($obj).after('<a class="btn btn-danger removeButton" id="' + $number + '"><span class="glyphicon glyphicon-trash"></span></a>');
        });
    };

    function removeRemoveButton() {
        $(".removeButton").remove();
    };
});
