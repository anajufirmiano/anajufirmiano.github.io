import json
import os
import urllib.request

# Configurações do seu perfil
GITHUB_USERNAME = "anajufirmiano"
JSON_PATH = "projects.json"

# Palavras-chave para categorização automática
DATA_KEYWORDS = {"python", "sql", "pandas", "data", "etl", "csv", "jupyter", "analysis", "pipeline"}
WEB_KEYWORDS = {"html", "css", "javascript", "js", "web", "frontend", "portfolio", "react"}

def get_repos():
    url = f"https://api.github.com/users/{GITHUB_USERNAME}/repos?sort=created&per_page=100"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Portfolio-Sync-Bot"}
    )
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode())

def classify_repo(repo):
    language = (repo.get("language") or "").lower()
    description = (repo.get("description") or "").lower()
    topics = [t.lower() for t in repo.get("topics", [])]
    
    combined_text = f"{language} {description} {' '.join(topics)}"
    
    if any(k in combined_text for k in DATA_KEYWORDS):
        return "Engenharia de Dados"
    if any(k in combined_text for k in WEB_KEYWORDS):
        return "Desenvolvimento Web"
    return "Desenvolvimento Web"

def main():
    # 1. Carrega o arquivo JSON existente ou cria lista vazia
    if os.path.exists(JSON_PATH):
        with open(JSON_PATH, "r", encoding="utf-8") as f:
            try:
                projects = json.load(f)
            except json.JSONDecodeError:
                projects = []
    else:
        projects = []

    existing_urls = {p.get("repoUrl") for p in projects}
    repos = get_repos()
    new_projects = []

    # 2. Varre os repositórios públicos
    for repo in repos:
        # Ignora forks ou o repositório especial de perfil (README de usuário)
        if repo.get("fork") or repo.get("name") == GITHUB_USERNAME:
            continue

        repo_url = repo.get("html_url")
        if repo_url in existing_urls:
            continue

        # Monta a lista de tags/tecnologias
        tags = []
        if repo.get("language"):
            tags.append(repo["language"])
        for topic in repo.get("topics", []):
            if topic not in tags:
                tags.append(topic)

        # Monta o card formatado
        new_project = {
            "id": repo.get("name"),
            "title": repo.get("name").replace("-", " ").replace("_", " ").title(),
            "category": classify_repo(repo),
            "description": repo.get("description") or "Projeto desenvolvido para o portfólio.",
            "tags": tags,
            "repoUrl": repo_url,
            "deployUrl": repo.get("homepage") or "",
            "image": "assets/img/default-cover.png",
            "featured": True
        }
        new_projects.append(new_project)

    # 3. Adiciona os novos no início da lista e regrava o arquivo
    if new_projects:
        updated_list = new_projects + projects
        with open(JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(updated_list, f, indent=2, ensure_ascii=False)
        print(f"Sucesso: {len(new_projects)} novo(s) projeto(s) adicionado(s)!")
    else:
        print("Nenhum repositório novo encontrado.")

if __name__ == "__main__":
    main()