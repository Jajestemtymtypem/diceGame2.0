const gra = {
    kostki: [0, 0, 0, 0, 0],
    zatrzymanie: [false, false, false, false, false],
    liczbaRzutow: 0,
    punkty: {},
    czyTuraTrwa: false,
    uzyteFigury: {
        jedynki: false,
        dwojki: false,
        trojki: false,
        czworki: false,
        piatki: false,
        szostki: false,
        trzyTakieSame: false,
        czteryTakieSame: false,
        full: false,
        general: false, 
        szansa: false,
        malyStrit: false,
        duzyStrit: false,
    },
};
const obrazKostki = [null, "icons/1.png", "icons/2.png", "icons/3.png", "icons/4.png", "icons/5.png", "icons/6.png"]

function losujKosc(){
    return Math.floor(Math.random() * 6) + 1;
}
//Funkcja losuje jedną kość. przechodzi i sparawdza która kość nie jest zatrzymana lepsze niż pętla i zawsze losowanie 5 kosci. 

function rzutKostkami(){
    if(gra.liczbaRzutow >= 3) return;
    if(gra.liczbaRzutow === 0) gra.czyTuraTrwa = true;
    for( let i = 0; i < gra.kostki.length; i++){
        if(!gra.zatrzymanie[i]){
            gra.kostki[i] = losujKosc();
            const img = document.getElementById([i]);
            img.src = obrazKostki[gra.kostki[i]];
            szukanieFigur();
        }
    }
    gra.liczbaRzutow++;
    console.log(`rzutKostkami `, gra);
}
function zatrzymajKosc(numer){
    if(gra.liczbaRzutow === 0) return;
    gra.zatrzymanie[numer] = !gra.zatrzymanie[numer];
    const img = document.getElementById(numer);
    img.classList.toggle('zatrzymana', gra.zatrzymanie[numer]);

    }
function zliczanieKosci(){
    const licznik = [0, 0, 0, 0, 0, 0];
    for(const kosc of gra.kostki){
        licznik[kosc - 1]++;
    }
    return licznik;
}
function szukanieFigur(){
    const licznik = zliczanieKosci();
    const suma = gra.kostki.reduce((a, b) => a+b, 0);
    const propozycje = {};

    propozycje.jedynki = licznik[0] *1;
    propozycje.dwojki = licznik[1] *2;
    propozycje.trojki = licznik[2] *3;
    propozycje.czworki = licznik[3] *4;
    propozycje.piatki = licznik[4] *5;
    propozycje.szostki = licznik[5] *6;

    propozycje.trzyTakieSame = licznik.some(l => l >= 3) ? suma : 0;
    propozycje.czteryTakieSame = licznik.some(l => l >= 4) ? suma : 0;
    propozycje.general = licznik.includes(5) ? 50 : 0;
    propozycje.szansa = suma;

    const ma3 = licznik.includes(3);
    const ma2 = licznik.includes(2);
    const ile3 = licznik.filter(l => l === 3).length;
    const ile2 = licznik.filter(l => l === 2).length;

    const czyFull = ma3 && ma2 && ile3 === 1 && ile2 === 1;

    propozycje.full = czyFull ? 25 : 0;



    const malyStrit = [
        [0, 1, 2, 3],
        [1, 2, 3, 4],
        [2, 3, 4, 5],
    ];
    propozycje.malyStrit = malyStrit.some(s => s.every(i => licznik[i] > 0)) ? 30 : 0;

    const duzyStrit = [
        [0, 1, 2, 3, 4],
        [1, 2, 3, 4, 5],
    ];
    propozycje.duzyStrit = duzyStrit.some(s => s.every(i => licznik[i] > 0)) ? 40 : 0;
    console.log(`szukanieFigur`, propozycje);
    return propozycje;

}
function zatwierdzWynik(kategoria){
    if(gra.uzyteFigury[kategoria]) return; 
    const propozycje = szukanieFigur();
    gra.punkty[kategoria] = propozycje[kategoria];
    gra.uzyteFigury[kategoria] = true;

    gra.kostki = [0, 0, 0, 0, 0];
    gra.zatrzymanie = [false, false, false, false, false];
    gra.liczbaRzutow = 0;

    console.log("Zatwierdzono wynik:", kategoria, "=>", propozycje[kategoria]);
    gra.czyTuraTrwa = false;
    sprawdzKoniecGry();

}
function aktualizujWyniki(){
    for (const [kategoria, wynik] of Object.entries(gra.punkty)) {
        const el = document.getElementById(kategoria);
        if(el) {
            el.textContent = wynik;
            el.style.pointerEvents = `none`;
            el.style.opacity = `0.5`;
        }
        const suma = Object.values(gra.punkty).reduce((a, b) => a + b, 0);
         const sumaEl = document.getElementById('sumaPkt');
        if (sumaEl) sumaEl.textContent = suma + ' pkt';
    }
    const suma = Object.values(gra.punkty).reduce((a, b) => a + b, 0);
    document.getElementById(`sumaPkt`).textCintent = suma + `pkt`;
    
}
const polaWynikow = document.querySelectorAll(`.score`);

polaWynikow.forEach(pole => {
    pole.addEventListener(`click`, () => {
        const kategoria = pole.dataset.kategoria;
        if (!kategoria) return;

        if(gra.uzyteFigury[kategoria]) return;
        if (!gra.czyTuraTrwa) return;
        zatwierdzWynik(kategoria);
        aktualizujWyniki();
    });
});
function sprawdzKoniecGry(){
    const wysztkieUzyte = Object.values(gra.uzyteFigury).every(val => val === true);
    if(wysztkieUzyte) {
        const suma = Object.values(gra.punkty).reduce((a, b) => a+b, 0);
        setTimeout(() => {
            alert(`Koniec gry! Twój wynik końcowy to ${suma} punktów.`);
        }, 100);
        }
    }
