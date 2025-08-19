const gra = {
    kostki: [0, 0, 0, 0, 0],
    zatrzymanie: [false, false, false, false, false],
    liczbaRzutow: 0,
    punkty: {},
    uzyteFigury: {
        jedynki: false,
        //wypisać dalej figury
    },
};
const obrazKostki = [null, "icons/1.png", "icons/2.png", "icons/3.png", "icons/4.png", "icons/5.png", "icons/6.png"]
function losujKosc(){
    return Math.floor(Math.random() * 6) + 1;
}
//Funkcja losuje jedną kość. przechodzi i sparawdza która kość nie jest zatrzymana lepsze niż pętla i zawsze losowanie 5 kosci. 

function rzutKostkami(){
    if(gra.liczbaRzutow >= 3) return;
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
function zatrzymanieKosci(numer){
    if(gra.liczbaRzutow === 0) return;
    gra.zatrzymanie[numer] = !gra.zatrzymanie[numer];
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

    propozycje.jednki = licznik[0] *1;
    propozycje.dwojki = licznik[1] *2;
    propozycje.trojki = licznik[2] *3;
    propozycje.czworki = licznik[3] *4;
    propozycje.piatki = licznik[4] *5;
    propozycje.szostki = licznik[5] *6;

    propozycje.trzyTakieSame = licznik.some(l => l >= 3) ? suma : 0;
    propozycje.czteryTakieSame = licznik.some(l => l >= 4) ? suma : 0;
    propozycje.general = licznik.includes(5) ? 50 : 0;
    propozycje.szansa = suma;

    if (licznik.includes(3) && licznik.includes(2)) propozycje.full = 25;

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
    //console.log(`szukanieFigur`, propozycje);
    return propozycje;

}