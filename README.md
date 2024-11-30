
# Convert 229

**Convert 229** est un utilitaire Node.js qui modifie vos contacts en suivant ces règles :
1. Ajoute le préfixe **`old `** aux noms des contacts existants.
2. Duplique les contacts avec des modifications apportées aux nouveaux :
   - Pour chaque numéro béninois (`+229`), ajoute **`01`** après le préfixe.
   - Pour les numéros locaux (8 chiffres sans préfixe), ajoute **`01`** au début pour en faire des numéros à 10 chiffres.

**Attention : Ce script duplique vos contacts (ancien et nouveau).**

**Notes : Dans 1 mois je vais mettre en place le script de suppression des constacts avec la mention old.**

---

## Installation

Avant de commencer, assurez-vous d'avoir **Node.js** installé sur votre machine.

1. Clonez ce dépôt ou copiez les fichiers nécessaires.
2. Installez les dépendances avec la commande suivante :
   ```bash
   npm install
   ```

---

## Préparation des données

Placez votre fichier CSV dans le dossier `csv/`. Assurez-vous que le fichier se nomme **`contacts.csv`** et respecte la structure suivante :
- Les colonnes des noms (par exemple, `First Name`, `Middle Name`, etc.).
- Les colonnes des numéros de téléphone (par exemple, `Phone 1 - Value`, `Phone 2 - Value`, etc.).

---

## Utilisation

Exécutez le script avec la commande suivante :

```bash
npm run dev
```

Le script :
1. Lira les contacts depuis le fichier `csv/contacts.csv`.
2. Traitera chaque contact en appliquant les règles mentionnées ci-dessus.
3. Générera un nouveau fichier CSV dans le dossier `output/`.

---

## Résultat

Le fichier généré sera nommé **`contacts.csv`** et se trouvera dans le dossier `output/`. Il contiendra vos contacts modifiés, avec les anciens et les nouveaux regroupés.

---

## Exemple

### Entrée (dans `csv/contacts.csv`) :
```csv
First Name,Phone 1 - Value,Phone 2 - Value
John,+22995301784,99006977
Jane,95301784,+22999006977
```

### Sortie (dans `output/contacts.csv`) :
```csv
First Name,Phone 1 - Value,Phone 2 - Value
John,+22995301784,99006977
old John,+2290195301784,0199006977
Jane,95301784,+22999006977
old Jane,0195301784,+2290199006977
```

---

## Remarques

1. **Attention aux doublons** :
   - Le script supprime les doublons éventuels dans les numéros de téléphone pour chaque contact.

2. **Structure des fichiers** :
   - Assurez-vous que votre fichier source CSV contient bien les colonnes nécessaires (`First Name`, `Phone 1 - Value`, etc.).
   - Si votre fichier CSV est mal formaté, le script risque de ne pas fonctionner correctement.

---