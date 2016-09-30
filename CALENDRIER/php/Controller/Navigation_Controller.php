<?php

include_once 'php/Model/BDD.php';

    class Navigation {

        var $bdd;

        function bddConnexion(){
            $this->bdd = new BDD;
            $this->bdd->connexion();
        }

    }
?>
