# MyBattery

Monitor per smartphone di un banco di 5 batterie LiFePO4 51,2 V con BMS DR-JC03, letto via RS485 da una scheda ESP32-S3.

- **Prova online**: https://giannipietroterzo-code.github.io/mybattery/ — sempre in modalità demo, con dati simulati.
  Si installa sul telefono: su iPhone *Condividi → Aggiungi alla schermata Home*, su Android *menu → Installa app*.
- **Uso reale**: la stessa pagina è servita dalla scheda ESP32 in rete locale e legge `GET /api/status`
  (formato descritto in testa a `index.html`). Nessun cloud.

File unico (`index.html`) senza dipendenze esterne, più manifest, icone e service worker per l'installazione.
