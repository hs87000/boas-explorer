# -*- coding: utf-8 -*-
"""
Reconstruit boas_enrichment.json a partir de BOAS_modes_de_fonctionnement.docx.

Le .docx contient un tableau a 5 colonnes :
  Nom | Comment ca marche | Limites | Criteres d'inclusion | Criteres d'exclusion
dans le MEME ordre que les 48 outils de boas_data.json.

Pour chaque ligne du tableau, on recupere le slug (dernier segment de ficheUrl)
et le nom canonique de l'outil correspondant dans boas_data.json (alignement par
index, verifie par recouvrement de tokens du nom), puis on ecrit l'enrichissement.
"""
import zipfile, re, json, sys, unicodedata

sys.stdout.reconfigure(encoding="utf-8")

DOCX = "BOAS_modes_de_fonctionnement.docx"
DATA = "../app/src/data/boas_data.json"  # source de verite consommee par l'app React
OUT = "boas_enrichment.json"

TXT = re.compile(r"<w:t(?:\s[^>]*)?>(.*?)</w:t>", re.S)


def unesc(s):
    return (s.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
             .replace("&quot;", '"').replace("&apos;", "'"))


def parse_docx_table(path):
    xml = zipfile.ZipFile(path).read("word/document.xml").decode("utf-8")
    rows = re.findall(r"<w:tr\b.*?</w:tr>", xml, re.S)
    parsed = []
    for r in rows:
        cells = re.findall(r"<w:tc\b.*?</w:tc>", r, re.S)
        if len(cells) != 5:
            continue
        vals = []
        for c in cells:
            paras = re.split(r"</w:p>", c)
            pt = [unesc("".join(TXT.findall(p))).strip() for p in paras]
            pt = [p for p in pt if p]
            vals.append(" ".join(pt).strip())
        parsed.append(vals)
    return parsed[1:]  # drop header row


def slug_of(fiche_url):
    return (fiche_url or "").rstrip("/").rsplit("/", 1)[-1]


def norm(s):
    s = unicodedata.normalize("NFD", s or "").encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


def overlap(a, b):
    sa, sb = set(norm(a).split()), set(norm(b).split())
    if not sa or not sb:
        return 0.0
    return len(sa & sb) / min(len(sa), len(sb))


def main():
    body = parse_docx_table(DOCX)
    tools = json.load(open(DATA, encoding="utf-8"))["tools"]
    if len(body) != len(tools):
        print(f"ATTENTION : {len(body)} lignes docx vs {len(tools)} outils.")

    enrichment = []
    for i, (row, tool) in enumerate(zip(body, tools)):
        name, how, lim, incl, excl = row
        ov = overlap(name, tool["name"])
        flag = "" if ov >= 0.2 else "  <-- VERIFIER ALIGNEMENT"
        print(f"{i+1:2d} | ov={ov:.2f} | {slug_of(tool['ficheUrl'])}{flag}")
        enrichment.append({
            "slug": slug_of(tool["ficheUrl"]),
            "name": tool["name"],
            "howItWorks": how,
            "limits": lim,
            "inclusion": incl,
            "exclusion": excl,
        })

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(enrichment, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"\n{len(enrichment)} entrees ecrites dans {OUT}")


if __name__ == "__main__":
    main()
