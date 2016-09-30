<?php

class BDD{

    function connexion(){
        $dsn="/SRVAPPLIS:4900/HyperFileSQL";
        $login="Admin";
        $mdp="";

        odbc_connect($dsn,$login,$mdp) or die("echec connexion");
    }

}

?>
