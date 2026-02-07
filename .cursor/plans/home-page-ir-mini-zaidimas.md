# Home puslapis ir mini žaidimas (atnaujinta)

## Apžvalga

Pridedamas viešas Home puslapis su mokyklos pristatymu, mokytojų skyriumi, mokymo programomis, mini žaidimu „Atspėk instrumento garsą“ (instrumentai rodomi **ikonomis**) ir nuoroda į Pamokos. Esama aplikacija (Dashboard, Pamokos, Layout, auth) lieka nepakeista.

---

## Dabartinė struktūra (paliekama)

- **Maršrutai:** `frontend/src/App.js` – `/login`, `/` (Dashboard po ProtectedRoute), `/students`, `/teachers`, `/teachers/:id/schedule`, `/lessons`.
- **Auth:** `frontend/src/context/AuthContext.js` – localStorage + InstantDB/demo vartotojai; `frontend/src/components/ProtectedRoute.js` – neprietinus vartotojus nukreipia į `/login`.
- **Duomenys:** `frontend/src/hooks/useTeachers.js` – teachers su `vardas`, `specialybė` (InstantDB); mokymo programų DB nėra.
- **Stilius:** `frontend/tailwind.config.js` – brand-blue-1, brand-blue-2, brand-light-blue-2, brand-black; `frontend/src/index.css` – font-merriweather, font-neutral.

---

## Architektūra

- **„Smart“ `/`:** jei vartotojas neprisijungęs – rodyti **Home**; jei prisijungęs – rodyti **Dashboard**.
- Home neturi pilno admin Layout, tik minimalų header su logotipu ir „Prisijungti“.
- Nuoroda „Pamokos“ iš Home veda į `/lessons` → neprietinus nukreips į `/login`.

---

## 1. Maršrutai ir Home wrapper

**Failas:** `frontend/src/App.js`

- Importuoti `Home`.
- Route `path="/"`: jei `!user` → `<Home />`; jei `user` → `<ProtectedRoute><Dashboard /></ProtectedRoute>`.
- Kiti maršrutai nesikeičia.

---

## 2. Home puslapio komponentas

**Naujas failas:** `frontend/src/pages/Home.js`

- **Header:** logotipas (kaip Layout), dešinėje „Prisijungti“ → `Link to="/login"`.
- **Sekcijos:**
  1. **Mokykla** – pavadinimas + pristatymo tekstas.
  2. **Mokytojai** – `useTeachers()`, kortelės (vardas, specialybė).
  3. **Mokymo programos** – statinis sąrašas (programs.js arba masyvas).
  4. **Mini žaidimas** – žr. skyrių 4 (su **ikonomis**).
  5. **CTA** – „Peržiūrėti pamokas“ → `Link to="/lessons"`.

Brand klasės ir responzinis layout.

---

## 3. Mokymo programos duomenys

- Failas `frontend/src/data/programs.js` – masyvas `{ id, name, description? }` lietuviškai (Fortepijonas, Gitara, Smuikas, Fleita ir pan.). Home tik atvaizduoja.

---

## 4. Mini žaidimas „Atspėk, kokio instrumento garsas skamba“

- **Logika:** atsitiktinai parenkamas instrumentas, grojamas garsas; vartotojas renkasi iš 3–4 atsakymų; rodoma „Teisingai“ / „Neteisingai“, mygtukas „Kitas“.
- **Instrumentai atvaizduojami ikonomis:** kiekvienas atsakymo variantas rodomas kaip **ikona + pavadinimas** (kortelė arba mygtukas). Naudoti ikonų biblioteką (pvz. **react-icons** arba **Heroicons**), kad būtų vienodas stilius; kiekvienam instrumentui duomenyse priskiriama atitinkama ikona (fortepijonas, gitara, smuikas, fleita ir kt.).
- **Duomenys:** `frontend/src/data/instrumentSounds.js` – masyvas `{ id, name, soundFile, icon }` (icon – komponento pavadinimas arba ikonos raktas iš pasirinktos bibliotekos).
- **Garso failai:** `frontend/public/sounds/instruments/*.mp3` (4–6 failų).
- **UI:** sekcija su „Groti garsą“, 3–4 pasirinkimais (ikona + pavadinimas), rezultatas, „Kitas“.

---

## 5. Garso failai

- 4–6 trumpų instrumentų MP3 į `frontend/public/sounds/instruments/`. Failų vardai atitinka `instrumentSounds` konfigūraciją.

---

## 6. Layout ir navigacija

- Layout.js nekeisti; naudojamas tik užsiregistruotiems.
- Home turi savo minimalų header.

---

## Failų santrauka

| Veiksmas | Failas |
|----------|--------|
| Keisti | `frontend/src/App.js` – sąlyginis `/` (Home vs Dashboard) |
| Naujas | `frontend/src/pages/Home.js` |
| Naujas | `frontend/src/components/InstrumentGuessGame.js` – žaidimo UI, logika, **atsakymai su ikonomis** |
| Naujas | `frontend/src/data/programs.js` |
| Naujas | `frontend/src/data/instrumentSounds.js` – name, soundFile, **icon** |
| Nauji | `frontend/public/sounds/instruments/*.mp3` |

---

## Rezultatas

- Vieši lankytojai mato Home: mokykla, mokytojai, programos, mini žaidimas (**instrumentai ikonomis**) ir „Peržiūrėti pamokas“.
- Esami puslapiai, Layout, auth ir duomenys lieka tokie patys.
