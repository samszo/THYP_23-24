<?php
// Récupérer les paramètres POST
$gitRepo = "https://github.com/Sidahmed-ben/recommendation-des-films.git";//$_POST['gitRepo'];
$gitFolderRoot = "/Users/samszo/Sites/THYP_23-24_clones/";
$gitFolder = "projet1";//$_POST['gitFolder'];
$dbName = "omk_thyp_23-24_".$gitFolder;//$_POST['dbName'];

// Créer le répertoire
$directoryPath = $gitFolderRoot . $gitFolder;
if (!is_dir($directoryPath)) {
    if (mkdir($directoryPath, 0777, true)) {
        echo "Répertoire créé avec succès !<br/>";
        // Cloner le dépôt GitHub
        $cloneCommand = "git clone $gitRepo $directoryPath";
        $output = shell_exec($cloneCommand);

        // Vérifier si le clonage a réussi
        if (is_dir($directoryPath)) {
            echo "Clonage du dépôt GitHub réussi !<br/>";
        } else {
            echo "Échec du clonage du dépôt GitHub.<br/>";
        }        
    } else {
        echo "Erreur lors de la création du répertoire.<br/>";
    }
} else {
    echo "Le répertoire existe déjà.<br/>";
    // Pull le dépôt GitHub
    $pullCommand = "cd $directoryPath && git pull";
    $output = shell_exec($pullCommand);
    echo "GIT PULL : $output<br/>";
}

// Connexion à la base de données MySQL
$servername = "localhost";
$username = "omkTHYP2324";
$password = "omkTHYP2324";

// Création de la base de données
$connection = mysqli_connect($servername, $username, $password);

// Vérifier la connexion
if (!$connection) {
    die("Échec de la connexion à la base de données : " . mysqli_connect_error()."<br/>");
}

// Droper la base de données
$sql = "DROP DATABASE IF EXISTS `$dbName`";
if (mysqli_query($connection, $sql)) {
    echo "Base de données supprimée avec succès<br/>";
} else {
    echo "Erreur lors de la suppression de la base de données : " . mysqli_error($connection)."<br/>";
}

// Créer la base de données
$sql = "CREATE DATABASE `$dbName`";
if (mysqli_query($connection, $sql)) {
    echo "Base de données créée avec succès<br/>";
} else {
    echo "Erreur lors de la création de la base de données : " . mysqli_error($connection)."<br/>";
}
// Fermer la connexion
mysqli_close($connection);

// Création de la connexion
$connection = mysqli_connect($servername, $username, $password, $dbName);

// Vérifier la connexion
if (!$connection) {
    die("Échec de la connexion à la base de données : " . mysqli_connect_error()."<br/>");
}

// Chemin vers le fichier SQL à importer
$sqlFilePath = $directoryPath . "/omk/bdd/omk.sql";

// Lire le contenu du fichier SQL
$sqlContent = file_get_contents($sqlFilePath);

// Exécuter les requêtes SQL
if (mysqli_multi_query($connection, $sqlContent)) {
    echo "Fichier SQL importé avec succès !<br/>";
} else {
    echo "Échec de l'importation du fichier SQL : " . mysqli_error($connection)."<br/>";
}

// Fermer la connexion
mysqli_close($connection);

// Mettre à jour le fichier database.ini
$databaseIniPath = "/Users/samszo/Sites/omk_thyp_23-24/config/database.ini";
$databaseIniContent = '
user     = "'.$username.'"
password = "'.$password.'"
dbname   = "'.$dbName.'"
host     = "localhost"
;port     = 
;unix_socket = 
;log_path = 
';

if (file_put_contents($databaseIniPath, $databaseIniContent)) {
    echo "Fichier database.ini mis à jour avec succès !<br/>";
} else {
    echo "Échec de la mise à jour du fichier database.ini.<br/>";
}






