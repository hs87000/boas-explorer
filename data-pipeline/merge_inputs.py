# -*- coding: utf-8 -*-
"""
Fusionne boas_inputs_enrichment.json dans boas_data.json.

Pour chaque outil de boas_data.json :
  1. slug = dernier segment de ficheUrl (apres le dernier "/").
  2. on cherche l'entree d'enrichissement par slug, sinon par nom normalise (sans accents).
  3. on ajoute le champ inputData SANS ecraser un champ deja rempli.

Affiche le nombre d'outils enrichis et la liste des non-apparies.
Sauvegarde boas_data.json en conservant l'ordre des cles et l'indentation (2 espaces).
Un backup horodate est ecrit avant ecriture.
"""
import json, re, sys, shutil, unicodedata
from datetime import datetime

sys.stdout.reconfigure(encoding="utf-8")

DATA = "../app/src/data/boas_data.json"  # source de verite consommee par l'app React
ENRICH = "boas_inputs_enrichment.json"
FIELDS = ["inputData"]


def slug_of(fiche_url):
    return (fiche_url or "").rstrip("/").rsplit("/", 1)[-1]


def norm(s):
    s = unicodedata.normalize("NFD", s or "").encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


def is_empty(v):
    return v is None or (isinstance(v, str) and v.strip() == "")


def main():
    data = json.load(open(DATA, encoding="utf-8"))
    enrichment = json.load(open(ENRICH, encoding="utf-8"))

    by_slug = {e["slug"]: e for e in enrichment["tools"] if e.get("slug")}
    by_name = {norm(e.get("name")): e for e in enrichment["tools"] if e.get("name")}

    # backup avant ecriture
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    shutil.copyfile(DATA, f"{DATA}.{stamp}.bak")

    enriched = 0
    unmatched = []
    for tool in data["tools"]:
        slug = slug_of(tool.get("ficheUrl"))
        entry = by_slug.get(slug) or by_name.get(norm(tool.get("name")))
        if not entry:
            unmatched.append(f"{tool.get('id')} · {tool.get('name')} (slug: {slug})")
            continue
        added = False
        for f in FIELDS:
            if is_empty(tool.get(f)) and not is_empty(entry.get(f)):
                tool[f] = entry[f]
                added = True
        if added:
            enriched += 1

    with open(DATA, "w", encoding="utf-8", newline="\n") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)  # 2 espaces, ordre des cles preserve

    total = len(data["tools"])
    print(f"Outils enrichis : {enriched}/{total}")
    print(f"Non apparies    : {len(unmatched)}")
    for u in unmatched:
        print("  -", u)


if __name__ == "__main__":
    main()
