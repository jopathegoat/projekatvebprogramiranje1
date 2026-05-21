var igraci = [];

var btnDodajPacijenta = document.getElementById("btnDodajPacijenta");
var btnPrikaziPacijente = document.getElementById("btnPrikaziPacijente");
var btnPrimeni = document.getElementById("btnPrimeni");
var btnSacuvajIzmene = document.getElementById("btnSacuvajIzmene");

var formaSekcija = document.getElementById("formaSekcija");
var pacijentiSekcija = document.getElementById("pacijentiSekcija");

var playerForm = document.getElementById("playerForm");
var editForm = document.getElementById("editForm");

var imeInput = document.getElementById("ime");
var godineInput = document.getElementById("godine");
var pozicijaInput = document.getElementById("pozicija");
var timInput = document.getElementById("tim");
var visinaInput = document.getElementById("visina");
var tezinaInput = document.getElementById("tezina");
var ppgInput = document.getElementById("ppg");
var apgInput = document.getElementById("apg");
var rpgInput = document.getElementById("rpg");
var prstenoviInput = document.getElementById("prstenovi");
var napomenaInput = document.getElementById("napomena");

var filterPozicija = document.getElementById("filterPozicija");
var sortiranje = document.getElementById("sortiranje");

var patientsContainer = document.getElementById("patientsContainer");
var brojPacijenata = document.getElementById("brojPacijenata");

var modalUredi = new bootstrap.Modal(document.getElementById("modalUredi"));

btnDodajPacijenta.addEventListener("click", prikaziFormu);
btnPrikaziPacijente.addEventListener("click", prikaziPacijente);
btnPrimeni.addEventListener("click", prikaziKarticePacijenata);
playerForm.addEventListener("submit", dodajPacijenta);
btnSacuvajIzmene.addEventListener("click", sacuvajIzmene);

function prikaziFormu() {
  formaSekcija.classList.remove("d-none");
  pacijentiSekcija.classList.add("d-none");
}

function dodajPacijenta(e) {
  e.preventDefault();

  var ime = imeInput.value.trim();
  var godine = parseInt(godineInput.value);
  var pozicija = pozicijaInput.value;
  var tim = timInput.value.trim();
  var visina = parseFloat(visinaInput.value);
  var tezina = parseFloat(tezinaInput.value);
  var ppg = parseFloat(ppgInput.value);
  var apg = parseFloat(apgInput.value);
  var rpg = parseFloat(rpgInput.value);
  var prstenovi = parseInt(prstenoviInput.value);
  var napomena = napomenaInput.value.trim();

  if (
    ime == "" ||
    isNaN(godine) ||
    pozicija == "" ||
    tim == "" ||
    isNaN(visina) ||
    isNaN(tezina) ||
    isNaN(ppg) ||
    isNaN(apg) ||
    isNaN(rpg) ||
    isNaN(prstenovi) ||
    godine <= 0 ||
    visina <= 0 ||
    tezina <= 0 ||
    ppg < 0 ||
    apg < 0 ||
    rpg < 0 ||
    prstenovi < 0
  ) {
    alert("Unesi ispravne podatke.");
    return;
  }

  var podaci = new FormData(playerForm);
  podaci.append("pozicija", pozicija);
  podaci.append("tim", tim);
  podaci.append("ppg", ppg);
  podaci.append("apg", apg);
  podaci.append("rpg", rpg);
  podaci.append("prstenovi", prstenovi);

  var zahtev = new XMLHttpRequest();
  zahtev.open("POST", "php/dodaj_pacijenta.php", true);

  zahtev.onload = function () {
    alert(zahtev.responseText);
    playerForm.reset();
    prikaziPacijente();
  };

  zahtev.send(podaci);
}

function prikaziPacijente() {
  formaSekcija.classList.add("d-none");
  pacijentiSekcija.classList.remove("d-none");

  var zahtev = new XMLHttpRequest();

  zahtev.open("GET", "php/prikazi_pacijente.php", true);

  zahtev.onload = function () {
    igraci = JSON.parse(zahtev.responseText);

    prikaziKarticePacijenata();
  };

  zahtev.send();
}

function prikaziKarticePacijenata() {
  patientsContainer.innerHTML = "";

  var listaZaPrikaz = igraci.slice();
  var pozicijaFilter = filterPozicija.value;

  if (pozicijaFilter != "Sve") {
    listaZaPrikaz = listaZaPrikaz.filter(function (igrac) {
      return igrac.pozicija == pozicijaFilter;
    });
  }

  var nacinSortiranja = sortiranje.value;

  if (nacinSortiranja == "ppg-asc") {
    listaZaPrikaz.sort(function (a, b) {
      return parseFloat(a.ppg) - parseFloat(b.ppg);
    });
  }

  if (nacinSortiranja == "ppg-desc") {
    listaZaPrikaz.sort(function (a, b) {
      return parseFloat(b.ppg) - parseFloat(a.ppg);
    });
  }

  if (nacinSortiranja == "rings-desc") {
    listaZaPrikaz.sort(function (a, b) {
      return parseInt(b.prstenovi) - parseInt(a.prstenovi);
    });
  }

  brojPacijenata.textContent = listaZaPrikaz.length + " NBA igrača";

  if (listaZaPrikaz.length == 0) {
    patientsContainer.innerHTML =
      '<div class="col-12">' +
      '<div class="empty-box p-5 text-center">' +
      '<h4 class="mb-2">Nema igrača za prikaz</h4>' +
      '<p class="text-muted mb-0">Dodaj igrača ili promeni filter.</p>' +
      "</div>" +
      "</div>";

    return;
  }

  for (var i = 0; i < listaZaPrikaz.length; i++) {
    var igrac = listaZaPrikaz[i];

    var linija = "line-pothranjenost";

    if (parseInt(igrac.prstenovi) >= 4) {
      linija = "line-normalna";
    } else if (parseInt(igrac.prstenovi) >= 1) {
      linija = "line-prekomerna";
    }

    var napomenaTekst = "Nema opisa.";

    if (igrac.napomena != "" && igrac.napomena != null) {
      napomenaTekst = igrac.napomena;
    }

    var slikaHTML = "";

      if (igrac.slika != "" && igrac.slika != null) {
        slikaHTML =
          '<img src="uploads/' +
          igrac.slika +
          '" class="card-img-top slika-igraca">';
    }

    var kartica = document.createElement("div");
    kartica.className = "col-12 col-md-6 col-xl-4";
      kartica.innerHTML =
        '<div class="card player-card">' +
      slikaHTML +
      '<div class="card-top-line ' +
      linija +
      '"></div>' +
      '<div class="card-body p-4">' +
      '<h4 class="card-title mb-3">' +
      igrac.ime +
      "</h4>" +
      '<div class="info-line"><strong>Pozicija:</strong> ' +
      igrac.pozicija +
      "</div>" +
      '<div class="info-line"><strong>Tim:</strong> ' +
      igrac.tim +
      "</div>" +
      '<div class="info-line"><strong>Godine:</strong> ' +
      igrac.godine +
      "</div>" +
      '<div class="info-line"><strong>Visina:</strong> ' +
      igrac.visina +
      " m</div>" +
      '<div class="info-line"><strong>Težina:</strong> ' +
      igrac.tezina +
      " kg</div>" +
      '<div class="info-line"><strong>PPG:</strong> ' +
      parseFloat(igrac.ppg).toFixed(1) +
      "</div>" +
      '<div class="info-line"><strong>APG:</strong> ' +
      parseFloat(igrac.apg).toFixed(1) +
      "</div>" +
      '<div class="info-line"><strong>RPG:</strong> ' +
      parseFloat(igrac.rpg).toFixed(1) +
      "</div>" +
      '<div class="info-line"><strong>Prstenovi:</strong> ' +
      igrac.prstenovi +
      "</div>" +
      '<div class="mt-3"><strong>Opis:</strong><p class="text-muted mb-0">' +
      napomenaTekst +
      "</p></div>" +
      '<div class="d-flex gap-2 mt-3">' +
      '<button class="btn btn-sm btn-outline-primary btn-uredi">Uredi</button>' +
      '<button class="btn btn-sm btn-outline-danger btn-obrisi">Obriši</button>' +
      "</div>" +
      "</div>" +
      "</div>";

    var btnUredi = kartica.querySelector(".btn-uredi");
    var btnObrisi = kartica.querySelector(".btn-obrisi");

    (function (p) {
      btnUredi.addEventListener("click", function () {
        otvoriUrediModal(p);
      });
      btnObrisi.addEventListener("click", function () {
        obrisiPacijenta(p.id, p.ime);
      });
    })(igrac);

    patientsContainer.appendChild(kartica);
  }
}

function otvoriUrediModal(igrac) {
  document.getElementById("editId").value = igrac.id;
  document.getElementById("editIme").value = igrac.ime;
  document.getElementById("editGodine").value = igrac.godine;
  document.getElementById("editPozicija").value = igrac.pozicija;
  document.getElementById("editTim").value = igrac.tim;
  document.getElementById("editVisina").value = igrac.visina;
  document.getElementById("editTezina").value = igrac.tezina;
  document.getElementById("editPpg").value = igrac.ppg;
  document.getElementById("editApg").value = igrac.apg;
  document.getElementById("editRpg").value = igrac.rpg;
  document.getElementById("editPrstenovi").value = igrac.prstenovi;
  document.getElementById("editNapomena").value = igrac.napomena || "";
  document.getElementById("editSlika").value = "";

  modalUredi.show();
}

function sacuvajIzmene() {
  var ime = document.getElementById("editIme").value.trim();
  var godine = parseInt(document.getElementById("editGodine").value);
  var pozicija = document.getElementById("editPozicija").value;
  var tim = document.getElementById("editTim").value.trim();
  var visina = parseFloat(document.getElementById("editVisina").value);
  var tezina = parseFloat(document.getElementById("editTezina").value);
  var ppg = parseFloat(document.getElementById("editPpg").value);
  var apg = parseFloat(document.getElementById("editApg").value);
  var rpg = parseFloat(document.getElementById("editRpg").value);
  var prstenovi = parseInt(document.getElementById("editPrstenovi").value);

  if (
    ime == "" ||
    isNaN(godine) ||
    pozicija == "" ||
    tim == "" ||
    isNaN(visina) ||
    isNaN(tezina) ||
    isNaN(ppg) ||
    isNaN(apg) ||
    isNaN(rpg) ||
    isNaN(prstenovi) ||
    godine <= 0 ||
    visina <= 0 ||
    tezina <= 0 ||
    ppg < 0 ||
    apg < 0 ||
    rpg < 0 ||
    prstenovi < 0
  ) {
    alert("Unesi ispravne podatke.");
    return;
  }

  var podaci = new FormData(editForm);
  podaci.append("pozicija", pozicija);
  podaci.append("tim", tim);
  podaci.append("ppg", ppg);
  podaci.append("apg", apg);
  podaci.append("rpg", rpg);
  podaci.append("prstenovi", prstenovi);

  var zahtev = new XMLHttpRequest();
  zahtev.open("POST", "php/uredi_pacijenta.php", true);

  zahtev.onload = function () {
    alert(zahtev.responseText);
    modalUredi.hide();
    prikaziPacijente();
  };

  zahtev.send(podaci);
}

function obrisiPacijenta(id, ime) {
  if (!confirm("Da li sigurno želiš da obrišeš igrača \"" + ime + "\"?")) {
    return;
  }

  var podaci = new FormData();
  podaci.append("id", id);

  var zahtev = new XMLHttpRequest();
  zahtev.open("POST", "php/obrisi_pacijenta.php", true);

  zahtev.onload = function () {
    alert(zahtev.responseText);
    prikaziPacijente();
  };

  zahtev.send(podaci);
}
