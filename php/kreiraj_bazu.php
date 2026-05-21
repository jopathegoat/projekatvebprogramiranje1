<?php

include "konekcija_sa_bazom.php";

 $sql = "
CREATE TABLE IF NOT EXISTS pacijenti (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ime TEXT,
    godine INTEGER,
    pozicija TEXT,
    tim TEXT,
    visina REAL,
    tezina REAL,
    ppg REAL,
    apg REAL,
    rpg REAL,
    prstenovi INTEGER,
    napomena TEXT,
    slika TEXT
)
";

$baza->exec($sql);

$existingColumns = [];
$result = $baza->query("PRAGMA table_info(pacijenti)");
while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
    $existingColumns[] = $row['name'];
}

$fieldsToAdd = [
    'pozicija' => 'TEXT',
    'tim' => 'TEXT',
    'ppg' => 'REAL',
    'apg' => 'REAL',
    'rpg' => 'REAL',
    'prstenovi' => 'INTEGER'
];

foreach ($fieldsToAdd as $field => $type) {
    if (!in_array($field, $existingColumns, true)) {
        $baza->exec("ALTER TABLE pacijenti ADD COLUMN $field $type");
    }
}

echo "Baza i tabela su uspešno kreirane.<br>";
echo "Putanja baze: " . $putanja;

?>