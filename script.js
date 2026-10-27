/**
 * PORTFÓLIO - SCRIPT ULTRA BLINDADO
 * script.js
 */

const dadosPadrao = {
  profile: {
    name: "Ana Júlia Firmiano",
    avatarImage: "pixel_art.jpeg",
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
      id: 1,
      title: "Pipeline de Extração & ETL",
      category: "Dados",
      tag: "Automação & ETL",
      description: "Fluxo automatizado em Python para ingestão, tratamento e validação de registros brutos, estruturando pipelines limpos e performáticos.",
      technologies: ["Python", "ETL", "Pandas", "Git"],
      demoUrl: "#",
      repoUrl: "https://github.com/anajufirmiano"
    },
    {
      id: 2,
      title: "Gerenciador de Torneios & Tratamento Tabular",
      category: "Dados",
      tag: "Python & Pandas",
      description: "Sistema de chaveamento e consolidação de participantes, manipulando tabelas relacionais e geração de relatórios com Pandas.",
      technologies: ["Python", "Pandas", "CSV", "GitHub"],
      demoUrl: "#",
      repoUrl: "https://github.com/anajufirmiano"
    },
    {
      id: 3,
      title: "Interfaces Web & Landing Pages Responsivas",
      category: "Web",
      tag: "Desenvolvimento Web",
      description: "Construção de aplicações e sites institucionais modernos, acessíveis, otimizados para todos os dispositivos e com código semântico limpo.",
      technologies: ["HTML5", "CSS3", "JavaScript", "UI Design"],
      demoUrl: "#",
      repoUrl: "https://github.com/anajufirmiano"
    },
    {
      id: 4,
      title: "Modelagem de Métricas & Relatórios no Excel",
      category: "Analytics",
      tag: "Excel Avançado",
      description: "Planilhas analíticas dinâmicas, estruturadas com fórmulas complexas, tabelas de controle e painéis de indicadores visuais.",
      technologies: ["Excel Avançado", "Fórmulas", "Automação", "Analytics"],
      demoUrl: "#",
      repoUrl: "https://github.com/anajufirmiano"
    }
  ],
  socials: [
    { name: "GitHub", url: "https://github.com/anajufirmiano" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/ana-júlia-ferreira-firmiano-454966258" }
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

  // 2. Tenta buscar projetos atualizados em segundo plano
  await carregarProjetosExternos();
});

async function carregarProjetosExternos() {
  try {
    const response = await fetch("projects.json");
    if (!response.ok) return;

    const json = await response.json();
    let listaProjetos = [];

    if (Array.isArray(json)) {
      listaProjetos = json;
    } else if (json && Array.isArray(json.projects)) {
      listaProjetos = json.projects;
    }

    // Se encontrou projetos válidos, atualiza apenas a lista de projetos e redesenha os cards
    if (listaProjetos.length > 0) {
      portfolioData.projects = listaProjetos;
      renderizarProjetos(portfolioData.projects);
    }
  } catch (err) {
    console.warn("Mantendo dados locais padrão:", err);
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

function renderizarProjetos(projects, filtro = "all") {
  const container = document.getElementById("projectsContainer");
  if (!container) return;
  container.innerHTML = "";

  const lista = (projects || []).filter(p => {
    if (filtro === "all") return true;
    return (p.category || "").toLowerCase() === filtro.toLowerCase();
  });

  lista.forEach(project => {
    const techs = Array.isArray(project.technologies) 
      ? project.technologies 
      : (Array.isArray(project.tags) ? project.tags : []);

    const el = document.createElement("div");
    el.className = "project-card";
    el.innerHTML = `
      <div class="project-thumb-box">
        <div class="project-thumb-top">
          <div class="project-thumb-dots">
            <span></span><span></span><span></span>
          </div>
          <span class="project-thumb-tag">${project.tag || project.category || "Projeto"}</span>
        </div>
        <div class="project-thumb-visual">
          <div class="visual-graphic-lines">
            <div class="v-line w-80"></div>
            <div class="v-line rose"></div>
            <div class="v-line w-50"></div>
          </div>
          <span class="visual-badge-category">${project.category || "Geral"}</span>
        </div>
      </div>

      <h3 class="project-title">${project.title || "Projeto"}</h3>
      <p class="project-desc">${project.description || ""}</p>
      
      <div class="project-techs">
        ${techs.map(t => `<span class="tech-tag">${t}</span>`).join("")}
      </div>

      <div class="project-actions">
        <button class="link-btn open-modal-btn" data-id="${project.id}">
          Ver Detalhes &rarr;
        </button>
        <a href="${project.repoUrl || '#'}" target="_blank" class="link-btn">Repositório</a>
      </div>
    `;
    container.appendChild(el);
  });

  document.querySelectorAll(".open-modal-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      abrirModal(btn.dataset.id);
    });
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
    a.className = "social-pill";
    a.innerText = soc.name;
    container.appendChild(a);
  });
}

function abrirModal(id) {
  const projeto = portfolioData.projects.find(p => String(p.id) === String(id));
  if (!projeto) return;

  const modal = document.getElementById("projectModal");
  const content = document.getElementById("modalContent");
  if (!modal || !content) return;

  const techs = Array.isArray(projeto.technologies) 
    ? projeto.technologies 
    : (Array.isArray(projeto.tags) ? projeto.tags : []);

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

    <div style="display: flex; gap: 14px; margin-top: 10px;">
      <a href="${projeto.demoUrl || '#'}" target="_blank" class="btn btn-primary btn-sm">Demonstração</a>
      <a href="${projeto.repoUrl || '#'}" target="_blank" class="btn btn-secondary btn-sm">Ver no GitHub</a>
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
