<?php

include "konekcija_sa_bazom.php";

$id = $_POST["id"];
$ime = $_POST["ime"];
$godine = $_POST["godine"];
$pozicija = $_POST["pozicija"];
$tim = $_POST["tim"];
$visina = $_POST["visina"];
$tezina = $_POST["tezina"];
$ppg = $_POST["ppg"];
$apg = $_POST["apg"];
$rpg = $_POST["rpg"];
$prstenovi = $_POST["prstenovi"];
$napomena = $_POST["napomena"];

$staraSlikaUpit = $baza->prepare("SELECT slika FROM pacijenti WHERE id = :id");
$staraSlikaUpit->bindValue(":id", $id);
$staraSlikaRez = $staraSlikaUpit->execute();
$staraSlikaRed = $staraSlikaRez->fetchArray(SQLITE3_ASSOC);
$nazivSlike = $staraSlikaRed["slika"];

if (isset($_FILES["slika"]) && $_FILES["slika"]["error"] == 0) {
    $folder = __DIR__ . "/../uploads/";

    if (!file_exists($folder)) {
        mkdir($folder, 0777, true);
    }

    $originalniNaziv = $_FILES["slika"]["name"];
    $privremenaPutanja = $_FILES["slika"]["tmp_name"];

    $ekstenzija = pathinfo($originalniNaziv, PATHINFO_EXTENSION);

    $noviNaziv = time() . "_" . rand(1000, 9999) . "." . $ekstenzija;
    $novaPutanja = $folder . $noviNaziv;

    move_uploaded_file($privremenaPutanja, $novaPutanja);
    $nazivSlike = $noviNaziv;
}

$upit = $baza->prepare("
UPDATE pacijenti SET
    ime = :ime,
    godine = :godine,
    pozicija = :pozicija,
    tim = :tim,
    visina = :visina,
    tezina = :tezina,
    ppg = :ppg,
    apg = :apg,
    rpg = :rpg,
    prstenovi = :prstenovi,
    napomena = :napomena,
    slika = :slika
WHERE id = :id
");

$upit->bindValue(":id", $id);
$upit->bindValue(":ime", $ime);
$upit->bindValue(":godine", $godine);
$upit->bindValue(":pozicija", $pozicija);
$upit->bindValue(":tim", $tim);
$upit->bindValue(":visina", $visina);
$upit->bindValue(":tezina", $tezina);
$upit->bindValue(":ppg", $ppg);
$upit->bindValue(":apg", $apg);
$upit->bindValue(":rpg", $rpg);
$upit->bindValue(":prstenovi", $prstenovi);
$upit->bindValue(":napomena", $napomena);
$upit->bindValue(":slika", $nazivSlike);

$rezultat = $upit->execute();

if ($rezultat) {
    echo "Igrač uspešno izmenjen.";
} else {
    echo "Greška pri izmeni.";
}

?>
