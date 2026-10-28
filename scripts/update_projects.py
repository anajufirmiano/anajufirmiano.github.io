import json
import os
import urllib.request

# Configurações do perfil
GITHUB_USERNAME = "anajufirmiano"
JSON_PATH = "projects.json"

# Palavras-chave para categorização automática estrita
DATA_KEYWORDS = {"python", "sql", "pandas", "etl", "csv", "jupyter", "scrap", "data", "pipeline"}
WEB_KEYWORDS = {"html", "css", "javascript", "js", "react", "web", "frontend"}

def get_repos():
    url = f"https://api.github.com/users/{GITHUB_USERNAME}/repos?sort=created&per_page=100"
    headers = {
        "User-Agent": "Portfolio-Sync-Bot",
        "Accept": "application/vnd.github.v3+json"
    }
    
    # Usa o token do GitHub Actions se estiver presente no ambiente
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
        
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode())

def classify_repo(repo):
    language = (repo.get("language") or "").lower()
    description = (repo.get("description") or "").lower()
    topics = [t.lower() for t in repo.get("topics", [])]
    
    combined_text = f"{language} {description} {' '.join(topics)}"
    
    # Categorias alinhadas com os filtros do script.js: "Dados", "Web", "Analytics"
    if any(k in combined_text for k in DATA_KEYWORDS):
        return "Dados", "Automação & ETL"
    if any(k in combined_text for k in WEB_KEYWORDS):
        return "Web", "Desenvolvimento Web"
    return "Web", "Geral"

def main():
    # 1. Carrega o arquivo existente ou inicializa com a estrutura correta
    current_data = {"projects": []}
    if os.path.exists(JSON_PATH):
        with open(JSON_PATH, "r", encoding="utf-8") as f:
            try:
                loaded = json.load(f)
                if isinstance(loaded, dict) and "projects" in loaded:
                    current_data = loaded
                elif isinstance(loaded, list):
                    current_data = {"projects": loaded}
            except json.JSONDecodeError:
                pass

    existing_urls = {p.get("repoUrl") for p in current_data.get("projects", [])}
    repos = get_repos()
    new_projects = []

    # 2. Varre os repositórios públicos
    for repo in repos:
        # Ignora forks, repositórios arquivados ou o repositório especial de perfil (README)
        if repo.get("fork") or repo.get("archived") or repo.get("name") == GITHUB_USERNAME:
            continue

        repo_url = repo.get("html_url")
        if repo_url in existing_urls:
            continue

        # Monta a lista de tecnologias
        techs = []
        if repo.get("language"):
            techs.append(repo["language"])
        for topic in repo.get("topics", []):
            if topic not in techs:
                techs.append(topic)

        category, tag = classify_repo(repo)

        # Monta o card no formato exato esperado pelo script.js
        card = {
            "id": repo.get("id"),
            "title": repo.get("name").replace("-", " ").replace("_", " ").title(),
            "category": category,
            "tag": tag,
            "description": repo.get("description") or "Projeto desenvolvido e disponibilizado no GitHub.",
            "technologies": techs if techs else [category],
            "demoUrl": repo.get("homepage") or "#",
            "repoUrl": repo_url
        }
        new_projects.append(card)

    # 3. Atualiza o JSON preservando a chave "projects"
    if new_projects:
        current_data["projects"] = new_projects + current_data.get("projects", [])
        with open(JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(current_data, f, indent=2, ensure_ascii=False)
        print(f"Sucesso: {len(new_projects)} novo(s) projeto(s) adicionado(s)!")
    else:
        print("Nenhum repositório novo encontrado.")

if __name__ == "__main__":
    main()
