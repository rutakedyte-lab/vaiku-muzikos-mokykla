# Vaikų Muzikos Mokykla - Valdymo Sistema

Interaktyvus web projektas Vilniaus Broniaus Jonušo Muzikos Mokyklai, skirtas informacijos apie mokymosi dalykus (instrumentus), mokytojus ir užsiėmimus valdymui.

## Technologijos

- **Frontend**: React + Tailwind CSS
- **Database**: InstantDB (React integration)
- **Authentication**: LocalStorage-based (admin/viewer roles)
- **Video Storage**: IndexedDB (local browser storage)

## Funkcionalumai

### Duomenų valdymas
- **Mokiniai**: id, vardas, amžius, instrumentas
- **Mokytojai**: id, vardas, specialybė
- **Pamokos**: id, student_id, teacher_id, laikas, video_path

### CRUD operacijos
- ✅ **CREATE**: Formos pridėti mokiniui, mokytojui, pamokai
- ✅ **READ**: 
  - Visų mokinių sąrašas
  - Filtravimas pagal instrumentą
  - Mokytojo tvarkaraštis
- ✅ **UPDATE**: Redagavimo funkcionalumas
- ✅ **DELETE**: Ištrynimo funkcionalumas

### Video funkcionalumas
- Video įkėlimas pamokoms (naudojant IndexedDB)
- Video peržiūra

### Autentifikacija
- LocalStorage-based login sistema
- Dvi rolės: **admin** (pilnos teisės) ir **viewer** (tik peržiūra)

## Instaliacija

### 1. Įdiekite priklausomybes

```bash
# Root level
npm install

# Frontend
cd frontend
npm install
```

### 2. Sukurkite InstantDB schemą

InstantDB duomenų bazėje sukurkite šias lenteles:

```javascript
// students
{
  id: string,
  vardas: string,
  amžius: number,
  instrumentas: string
}

// teachers
{
  id: string,
  vardas: string,
  specialybė: string
}

// lessons
{
  id: string,
  student_id: string,
  teacher_id: string,
  laikas: string,
  video_path: string (optional)
}

// users (for authentication)
{
  id: string,
  username: string,
  password: string,
  role: string ('admin' or 'viewer')
}
```

**Svarbu**: Sukurkite demo vartotojus InstantDB:
- Admin: `username: 'admin'`, `password: 'admin123'`, `role: 'admin'`
- Viewer: `username: 'viewer'`, `password: 'viewer123'`, `role: 'viewer'`

### 3. Paleiskite projektą

```bash
# Root level
npm start

# Arba tiesiogiai frontend aplanke:
cd frontend
npm start
```

Aplikacija bus prieinama adresu: `http://localhost:3000`

## Naudojimas

### Prisijungimas

Atidarykite `http://localhost:3000` naršyklėje.

**Demo paskyros:**
- **Admin**: `admin` / `admin123` (pilnos teisės)
- **Viewer**: `viewer` / `viewer123` (tik peržiūra)

### Pagrindinės funkcijos

1. **Mokiniai** (`/students`)
   - Peržiūrėti visų mokinių sąrašą
   - Filtruoti pagal instrumentą
   - Pridėti/redaguoti/ištrinti mokinį (tik admin)

2. **Mokytojai** (`/teachers`)
   - Peržiūrėti visų mokytojų sąrašą
   - Peržiūrėti mokytojo tvarkaraštį
   - Pridėti/redaguoti/ištrinti mokytoją (tik admin)

3. **Pamokos** (`/lessons`)
   - Peržiūrėti visų pamokų sąrašą
   - Pridėti/redaguoti/ištrinti pamoką (tik admin)
   - Įkelti ir peržiūrėti pamokos video (tik admin)

## Dizainas

Projektas naudoja VBJMM brandbook dizaino gaires:
- **Spalvos**: Mėlyna (#00B0FF, #2693FF), Geltona (#F8EB1F), Melsva (#6CB9FF, #82C4FF)
- **Šriftai**: Merriweather (antraštėms), Arial/Neutral Sans (tekstui)
- **Grafiniai elementai**: Brando logotipo elementai

## Projektų struktūra

```
.
├── frontend/
│   ├── src/
│   │   ├── components/     # React komponentai
│   │   ├── pages/          # Puslapiai
│   │   ├── hooks/          # Custom React hooks (InstantDB)
│   │   ├── context/        # React Context (Auth)
│   │   ├── db/             # InstantDB konfigūracija
│   │   └── utils/          # Utilities (video storage)
│   └── public/
└── README.md
```

## Video saugojimas

Video failai saugomi naršyklės IndexedDB duomenų bazėje. Tai reiškia:
- Video yra lokalus kiekvienoje naršyklėje
- Video nėra sinchronizuojami tarp įrenginių
- Maksimalus failo dydis priklauso nuo naršyklės (paprastai ~50-100MB)

## Pastabos

- **Nėra backend serverio** - viskas veikia per InstantDB React integraciją
- Video saugojimas naudoja IndexedDB (lokalus naršyklės saugojimas)
- Autentifikacija naudoja LocalStorage
- Session duomenys saugomi LocalStorage

## Plėtros galimybės

- [ ] InstantDB file storage integracija video failams
- [ ] Paieška mokinių/mokytojų
- [ ] Eksportavimas į PDF/Excel
- [ ] Kalendoriaus peržiūra
- [ ] Email pranešimai
- [ ] Daugiau video formatų palaikymas

## InstantDB konfigūracija

Projektas naudoja InstantDB su React integracija. Įsitikinkite, kad:
1. InstantDB aplikacija sukurta su teisingu APP_ID
2. Schema sukonfigūruota InstantDB dashboard
3. Demo vartotojai sukurti `users` lentelėje
