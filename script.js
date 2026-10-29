/**
 * PORTFÓLIO - SCRIPT ULTRA BLINDADO
 * script.js
 */

const dadosPadrao = {
  profile: {
    name: "Ana Júlia Firmiano",
    avatarImage: "pixel.png",
    languages: "Português, Inglês",
    role: "Engenheira de Dados & Desenvolvedora Web",
    status: "Disponível para novos projetos",
    bio: "Desenvolvo interfaces web modernas, intuitivas e eficientes, integradas à estruturação de pipelines de dados, automações com Python, Pandas e análise técnica.",
    email: "anajuliafirmiano1@gmail.com",
    location: "Rio de Janeiro, Brasil",
    experience: "+2 anos",
    completedProjects: 18,
    satisfaction: "100%",
    stack: "Python • SQL • JavaScript • HTML/CSS",
    focus: "Engenharia de Dados & Desenvolvimento Web"
  },
  skills: [
    { name: "Python", category: "Dados", level: "Intermediário" },
    { name: "Automação & ETL", category: "Dados", level: "Avançado" },
    { name: "Pandas & Tratamento de Dados", category: "Dados", level: "Intermediário" },
    { name: "Git & GitHub", category: "DevOps", level: "Avançado" },
    { name: "Excel Avançado", category: "Analytics", level: "Avançado" },
    { name: "Desenvolvimento Web (HTML, CSS, JS)", category: "Web", level: "Avançado" }
  ],
  projects: [
    {
      id: "pipeline-clima-postgresql",
      title: "Pipeline Clima Postgresql",
      category: "Engenharia de Dados",
      tag: "Automação & ETL",
      description: "Pipeline automatizado para coleta, ingestão e modelagem de dados meteorológicos em banco de dados PostgreSQL.",
      technologies: ["Python", "PostgreSQL", "ETL"],
      tags: ["Python", "PostgreSQL", "ETL"],
      demoUrl: "",
      deployUrl: "",
      repoUrl: "https://github.com/anajufirmiano/pipeline-clima-postgresql",
      image: "",
      featured: true
    },
    {
      id: "barbearia",
      title: "Barbearia",
      category: "Desenvolvimento Web",
      tag: "Landing Page",
      description: "Modelo conceitual de Landing Page para Barbearia com tabela de serviços e agendamento via WhatsApp (HTML5, CSS3 responsivo).",
      technologies: ["HTML5", "CSS3", "JavaScript"],
      tags: ["HTML5", "CSS3", "JavaScript"],
      demoUrl: "https://model-barbearia.netlify.app",
      deployUrl: "https://model-barbearia.netlify.app",
      repoUrl: "https://github.com/anajufirmiano/barbearia",
      image: "",
      featured: true
    },
    {
      id: "pizzaria",
      title: "Pizzaria",
      category: "Desenvolvimento Web",
      tag: "Gastronomia & Delivery",
      description: "Modelo de Landing Page conceitual para Pizzaria Napolitana e alta gastronomia (HTML5, CSS3 responsivo).",
      technologies: ["HTML5", "CSS3", "JavaScript"],
      tags: ["HTML5", "CSS3", "JavaScript"],
      demoUrl: "https://modelpizzaria.netlify.app",
      deployUrl: "https://modelpizzaria.netlify.app",
      repoUrl: "https://github.com/anajufirmiano/pizzaria",
      image: "",
      featured: true
    }
  ],
  socials: [
    { name: "GitHub", url: "https://github.com/anajufirmiano" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/ana-júlia-firmiano-454966258" }
  ]
};

// Inicializa a estrutura garantindo que os arrays padrão sempre existam
let portfolioData = {
  profile: { ...dadosPadrao.profile },
  skills: [...dadosPadrao.skills],
  projects: [...dadosPadrao.projects],
  socials: [...dadosPadrao.socials]
};

function setText(id, text) {
  const el = document.getElementById(id);
  if (el && text !== undefined && text !== null) {
    el.innerText = text;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Renderiza a tela IMEDIATAMENTE com os dados padrão (nunca fica vazia)
  renderizarInterface();
  configurarEventos();

  // 2. Busca os projetos dinâmicos do projects.json em segundo plano
  await carregarProjetosExternos();
});

async function carregarProjetosExternos() {
  try {
    const response = await fetch("projects.json");
    if (!response.ok) {
      console.warn(`[Portfólio] Falha ao carregar projects.json (Status HTTP ${response.status}). Mantendo dados padrão.`);
      return;
    }

    const json = await response.json();
    let listaProjetos = [];

    if (Array.isArray(json)) {
      listaProjetos = json;
    } else if (json && Array.isArray(json.projects)) {
      listaProjetos = json.projects;
    }

    if (listaProjetos.length > 0) {
      // Garante exclusão do portfólio pessoal e projetos não desejados caso persistam em cache antigo
      portfolioData.projects = listaProjetos.filter(
        p => p.id !== "anajufirmiano.github.io" && !String(p.title).toLowerCase().includes("portfólio pessoal")
      );

      // Respeita o filtro ativo no momento
      const activeBtn = document.querySelector(".filter-btn.active");
      const filtroAtivo = activeBtn ? activeBtn.dataset.category : "all";
      renderizarProjetos(portfolioData.projects, filtroAtivo);
      console.log(`[Portfólio] Sucesso: ${portfolioData.projects.length} projetos carregados de projects.json.`);
    } else {
      console.warn("[Portfólio] projects.json carregado, mas a lista de projetos retornou vazia.");
    }
  } catch (err) {
    console.error("[Portfólio] Erro na requisição ou parse de projects.json:", err);
  }
}

function renderizarInterface() {
  const { profile, skills, projects, socials } = portfolioData;

  const iniciais = (profile.name || "AJ")
    .split(" ")
    .map(p => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  setText("logoInitials", iniciais);
  setText("logoName", profile.name);
  setText("profileName", profile.name);
  setText("profileLanguages", profile.languages || "Português • Inglês");
  setText("profileRole", profile.role);
  setText("profileLocation", profile.location);
  setText("profileStatus", profile.status);
  setText("profileStack", profile.stack);
  setText("profileFocus", profile.focus);

  const avatarEl = document.getElementById("avatarInitials");
  if (avatarEl) {
    if (profile.avatarImage) {
      avatarEl.innerHTML = `<img src="${profile.avatarImage}" alt="${profile.name}" class="avatar-photo" onerror="this.parentElement.innerText='${iniciais}'">`;
    } else {
      avatarEl.innerText = iniciais;
    }
  }

  setText("heroStatus", profile.status);
  setText("heroBio", profile.bio);
  setText("metricExp", profile.experience);
  setText("metricProjects", profile.completedProjects);
  setText("metricSat", profile.satisfaction);
  setText("contactEmailDisplay", profile.email);
  setText("footerCopy", `© ${new Date().getFullYear()} ${profile.name}. Todos os direitos reservados.`);

  renderizarSkills(skills || []);
  renderizarProjetos(projects || []);
  renderizarSociais(socials || []);
}

function renderizarSkills(skills) {
  const container = document.getElementById("skillsContainer");
  if (!container) return;
  container.innerHTML = "";

  (skills || []).forEach(skill => {
    const el = document.createElement("div");
    el.className = "skill-card";
    el.innerHTML = `
      <span class="skill-name">${skill.name || ""}</span>
      <span class="skill-badge">${skill.level || ""}</span>
    `;
    container.appendChild(el);
  });
}

function normalizarCategoria(cat = "") {
  const c = String(cat).toLowerCase().trim();
  if (c.includes("dado") || c.includes("data") || c.includes("etl") || c.includes("sql") || c.includes("python")) {
    return "dados";
  }
  if (c.includes("web") || c.includes("front") || c.includes("html") || c.includes("landing")) {
    return "web";
  }
  return c;
}

function renderizarProjetos(projects, filtro = "all") {
  const container = document.getElementById("projectsContainer");
  if (!container) {
    console.error("[Portfólio] Elemento #projectsContainer não foi encontrado no DOM.");
    return;
  }
  container.innerHTML = "";

  if (!Array.isArray(projects) || projects.length === 0) {
    container.innerHTML = `<p class="empty-msg" style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">Nenhum projeto disponível no momento.</p>`;
    return;
  }

  const lista = projects.filter(p => {
    if (!filtro || filtro === "all") return true;
    const catFiltro = normalizarCategoria(filtro);
    const catProjeto = normalizarCategoria(p.category || "");
    return catFiltro === catProjeto;
  });

  if (lista.length === 0) {
    container.innerHTML = `<p class="empty-msg" style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">Nenhum projeto encontrado nesta categoria.</p>`;
    return;
  }

  lista.forEach(project => {
    const techs = Array.isArray(project.technologies) 
      ? project.technologies 
      : (Array.isArray(project.tags) ? project.tags : []);

    const mainTag = project.tag || (techs.length > 0 ? techs[0] : (project.category || "Projeto"));
    const repoUrl = project.repoUrl || project.repo_url || project.github_url || "#";
    const siteUrl = project.demoUrl || project.deployUrl || project.demo_url || "";
    const hasSite = Boolean(siteUrl && siteUrl.trim() !== "" && siteUrl !== "#");
    const thumbImg = (project.image && project.image !== "assets/img/default-cover.png") ? project.image : (project.thumbnail || "");

    const fallbackVisual = `
      <div class="visual-fallback">
        <div class="visual-graphic-lines">
          <div class="v-line w-80"></div>
          <div class="v-line rose"></div>
          <div class="v-line w-50"></div>
        </div>
        <span class="visual-badge-category">${project.category || "Geral"}</span>
      </div>
    `;

    const visualContent = thumbImg
      ? `<img src="${thumbImg}" alt="${project.title || "Projeto"}" class="project-thumb-img" onerror="this.parentElement.innerHTML = \`<div class='visual-fallback'><div class='visual-graphic-lines'><div class='v-line w-80'></div><div class='v-line rose'></div><div class='v-line w-50'></div></div><span class='visual-badge-category'>${project.category || 'Geral'}</span></div>\`;">`
      : fallbackVisual;

    const el = document.createElement("div");
    el.className = "project-card card-clickable";
    el.setAttribute("data-id", project.id);
    el.addEventListener("click", () => {
      abrirModal(project.id);
    });

    el.innerHTML = `
      <div class="project-thumb-box">
        <div class="project-thumb-top">
          <div class="project-thumb-dots">
            <span></span><span></span><span></span>
          </div>
          <span class="project-thumb-tag">${mainTag}</span>
        </div>
        <div class="project-thumb-visual">
          ${visualContent}
        </div>
      </div>

      <h3 class="project-title">${project.title || "Projeto"}</h3>
      <p class="project-desc">${project.description || ""}</p>
      
      <div class="project-techs">
        ${techs.map(t => `<span class="tech-tag">${t}</span>`).join("")}
      </div>

      <div class="project-actions">
        <button type="button" class="link-btn open-modal-btn" data-id="${project.id}" onclick="event.stopPropagation(); abrirModal('${project.id}');">
          Ver Detalhes &rarr;
        </button>
        ${hasSite 
          ? `<a href="${siteUrl}" target="_blank" rel="noopener noreferrer" class="link-btn site-btn" onclick="event.stopPropagation();">Acessar Site &nearr;</a>`
          : `<a href="${repoUrl}" target="_blank" rel="noopener noreferrer" class="link-btn repo-btn" onclick="event.stopPropagation();">Repositório &nearr;</a>`
        }
      </div>
    `;
    container.appendChild(el);
  });
}

function renderizarSociais(socials) {
  const container = document.getElementById("socialLinksContainer");
  if (!container) return;
  container.innerHTML = "";

  (socials || []).forEach(soc => {
    const a = document.createElement("a");
    a.href = soc.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = "social-pill";
    a.innerText = soc.name;
    container.appendChild(a);
  });
}

function abrirModal(id) {
  const projeto = portfolioData.projects.find(p => String(p.id) === String(id));
  if (!projeto) {
    console.warn(`[Portfólio] Projeto com ID "${id}" não encontrado para exibição no modal.`);
    return;
  }

  const modal = document.getElementById("projectModal");
  const content = document.getElementById("modalContent");
  if (!modal || !content) return;

  const techs = Array.isArray(projeto.technologies) 
    ? projeto.technologies 
    : (Array.isArray(projeto.tags) ? projeto.tags : []);

  const repoUrl = projeto.repoUrl || projeto.repo_url || projeto.github_url || "#";

  content.innerHTML = `
    <span class="section-tag">${projeto.category || "Projeto"} // ${projeto.tag || ""}</span>
    <h2 style="font-size: 1.6rem; color: var(--beige); margin: 6px 0 16px 0;">${projeto.title || ""}</h2>
    <p style="color: var(--text-secondary); margin-bottom: 22px; font-size: 0.96rem;">${projeto.description || ""}</p>
    
    <div style="margin-bottom: 24px;">
      <h4 style="font-size: 0.76rem; color: var(--moss-green); font-family: var(--font-mono); margin-bottom: 10px;">STACK UTILIZADA:</h4>
      <div class="project-techs">
        ${techs.map(t => `<span class="tech-tag">${t}</span>`).join("")}
      </div>
    </div>

    <div style="display: flex; gap: 14px; margin-top: 10px; flex-wrap: wrap;">
      <a href="${repoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">Ver no GitHub</a>
    </div>
  `;

  modal.classList.remove("hidden");
}

function configurarEventos() {
  const botoesFiltro = document.querySelectorAll(".filter-btn");
  botoesFiltro.forEach(btn => {
    btn.addEventListener("click", () => {
      botoesFiltro.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderizarProjetos(portfolioData.projects, btn.dataset.category);
    });
  });

  const copyBtn = document.getElementById("copyEmailBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(portfolioData.profile.email);
      exibirToast("E-mail copiado para a área de transferência!");
    });
  }

  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwrPiVg-DLbMgu8AAivGrk7xcKWBaE6_RKbFzkVcpo8Hy1nMl5cgBbzBRhzlXZZp1Dc/exec";

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const btnOriginalText = submitBtn ? submitBtn.innerText : "Enviar Mensagem";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "Enviando...";
      }

      const formData = new URLSearchParams();
      formData.append("name", document.getElementById("name").value);
      formData.append("email", document.getElementById("email").value);
      formData.append("message", document.getElementById("message").value);

      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: formData.toString()
        });

        exibirToast("Mensagem enviada com sucesso!");
        form.reset();
      } catch (error) {
        console.error("Erro no envio:", error);
        exibirToast("Erro de conexão ao enviar.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = btnOriginalText;
        }
      }
    });
  }

  const modal = document.getElementById("projectModal");
  const closeBtn = document.getElementById("closeModalBtn");
  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    });
  }
}

function exibirToast(msg) {
  const toast = document.getElementById("toast");
  const msgEl = document.getElementById("toastMsg");
  if (!toast || !msgEl) return;
  msgEl.innerText = msg;
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}
