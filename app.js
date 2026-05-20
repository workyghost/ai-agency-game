/**
 * AI Agency Tycoon - Core Game Engine
 * Workspace: c:/Users/murat/Desktop/ai-agency
 * Built with vanilla JavaScript, integrated with the retro terminal UI and canvas confetti.
 */

// Global Game State
const state = {
  level: 0,
  month: 1,
  mrr: 0, // monthly recurring revenue in USD
  cash: 15000, // seed capital
  workingHours: 10, // hours per week
  burnout: 0, // 0 to 100%
  clients: {
    trStandard: 0,
    trPremium: 0,
    intStandard: 0,
    intPremium: 0
  },
  badges: [],
  currentNiche: null, // 'local-service', 'ecommerce', 'b2b-saas'
  templatesCreated: false, // Level 0 condition
  serviceDefined: false, // Level 2 condition
  operationsAutomated: false, // Level 4 condition
  vaHired: false, // Level 6 helper
  
  // Demos in queue waiting to be called
  demoQueue: {
    tr: 0,
    int: 0
  },

  // Active Dialogue State
  inDemoCall: false,
  demoCallStep: 0,
  demoCallScore: 0,
  demoCallClientType: null, // 'trStandard', 'trPremium', 'intStandard', 'intPremium'

  // End Game State
  inEndDecision: false,
  gameCompleted: false,

  // Outbound campaign tracker for the current month
  outboundSentThisMonth: false,

  // Exchange rate USD -> TL
  exchangeRate: 33
};

// Niche definition and statistics
const niches = {
  'local-service': {
    name: 'Yerel Hizmet (Local Service Businesses)',
    desc: 'Klinikler, terapi merkezleri, spor salonları. Şablon uyumu %85 (en yüksek). Yönetmesi kolay.',
    templateAlignment: 0.85,
    prices: {
      trStandard: 360, // ~$360 (12,000 TL)
      trPremium: 750, // ~$750 (25,000 TL)
      intStandard: 1500,
      intPremium: 2800
    },
    hoursPerClient: {
      manual: 1.5,
      automated: 0.67, // ~40 mins
      va: 0.25 // ~15 mins
    },
    churnRate: {
      manual: 0.12,
      automated: 0.06,
      va: 0.03
    }
  },
  'ecommerce': {
    name: 'Butik E-Ticaret (DTC Brands)',
    desc: 'Shopify mağazaları, butikler. Şablon uyumu %70 (orta-yüksek). Kampanya ve lansman yönetimi gerektirir.',
    templateAlignment: 0.70,
    prices: {
      trStandard: 420, // ~14,000 TL
      trPremium: 800, // ~26,000 TL
      intStandard: 1750,
      intPremium: 3000
    },
    hoursPerClient: {
      manual: 2.0,
      automated: 0.8, // ~48 mins
      va: 0.3 // ~18 mins
    },
    churnRate: {
      manual: 0.15,
      automated: 0.08,
      va: 0.04
    }
  },
  'b2b-saas': {
    name: 'B2B SaaS / Koçlar (B2B SaaS & Coaches)',
    desc: 'Kurucular, premium koçlar. Şablon uyumu %55 (orta). Yüksek kişiselleştirme ister, fiyatları yüksektir.',
    templateAlignment: 0.55,
    prices: {
      trStandard: 500, // ~16,500 TL
      trPremium: 950, // ~31,000 TL
      intStandard: 2000,
      intPremium: 3500
    },
    hoursPerClient: {
      manual: 2.5,
      automated: 1.0, // 60 mins
      va: 0.4 // ~24 mins
    },
    churnRate: {
      manual: 0.18,
      automated: 0.10,
      va: 0.05
    }
  }
};

// Level Info mapping
const levels = {
  0: { name: "TEMEL - Lansman Öncesi Hazırlık", goal: "Şablonları hazırlayın (`automate-ops`) ve sonraki aya geçin (`next-month`)." },
  1: { name: "NİŞ SEÇİMİ - Dikey Düzey Belirleme", goal: "Bir niş seçin (`select-niche [niche-id]`) ve sonraki aya geçin." },
  2: { name: "HİZMET TANIMLAMA - Paket & Fiyatlandırma", goal: "Hizmet paketlerinizi tanımlayın (`automate-ops`) ve sonraki aya geçin." },
  3: { name: "MÜŞTERİ YAKALAMA - Outbound & Demo Görüşmeleri", goal: "Outbound yapın (`send-outbound`), demoları tamamlayın (`run-demo-call`) ve en az 1 müşteri kazanın." },
  4: { name: "OPERATIONS - İş Akışı & Otomasyon", goal: "n8n/Make ile operasyonel otomasyonu tamamlayın (`automate-ops`)." },
  5: { name: "DELIVERY & RETENTION - Hizmet Kalitesi", goal: "Müşterilerinizi koruyun ve en az 10 müşteriye ulaşın." },
  6: { name: "SCALE TO 30 CLIENTS - Büyüme & VA Alımı", goal: "Sanal asistan kiralayın (`hire-va`), 30 müşteri veya $40,000 MRR hedefine ulaşın." },
  7: { name: "30 MÜŞTERİ SONRASI - Final Tercih", goal: "Oyun bitti! Nihai stratejik yönünüzü seçin." }
};

if (window.GAME_CONTENT && window.GAME_CONTENT.levels) {
  window.GAME_CONTENT.levels.forEach(lvl => {
    levels[lvl.id] = {
      name: lvl.name,
      goal: lvl.objective
    };
  });
}

// Badge List
const BADGES = {
  'template_builder': { name: "Şablon Kurucu", desc: "İlk operasyonel şablon kütüphaneni oluşturdun." },
  'niche_master': { name: "Niş Ustası", desc: "Odaklanacağın sektörü başarıyla seçtin." },
  'first_client': { name: "İlk Kan", desc: "Ajansının ilk ödeme yapan müşterisini kazandın!" },
  'automation_wizard': { name: "Otomasyon Sihirbazı", desc: "n8n ve Make ile operasyonları sıfır dokunuşa indirdin." },
  'retention_pro': { name: "Tutundurma Uzmanı", desc: "Müşteri kaybını (churn) minimize etmeyi başardın." },
  'patron_mode': { name: "Patron Modu", desc: "Sanal asistan (VA) alarak operasyonları delege ettin." },
  'tycoon_status': { name: "AI TYCOON", desc: "Aylık $40,000 MRR hedefine ulaştın!" },
  'kurt_satıcı': { name: "Kurt Satıcı", desc: "Demo Call görüşmesini başarıyla tamamladın." }
};

const badgeMapping = {
  'template_builder': 'temel_hazir',
  'automation_wizard': 'otomasyon_sihirbazı',
  'kurt_satıcı': 'kurt_satıcı',
  'tycoon_status': 'saas_visionary'
};

if (window.GAME_CONTENT && window.GAME_CONTENT.badges) {
  window.GAME_CONTENT.badges.forEach(badge => {
    const mappedKey = Object.keys(badgeMapping).find(key => badgeMapping[key] === badge.id) || badge.id;
    if (BADGES[mappedKey]) {
      BADGES[mappedKey].name = badge.name;
      BADGES[mappedKey].desc = badge.description || badge.requirements;
    } else {
      BADGES[mappedKey] = {
        name: badge.name,
        desc: badge.description || badge.requirements
      };
    }
  });
}

// Fallback Dialogue Content (Tr & En)
const FALLBACK_DIALOGUES = {
  tr: {
    steps: [
      {
        text: "Müşteri: Merhaba, mesajınızı gördüm. Sosyal medya yönetimimizi AI ile nasıl yapacaksınız? Markamızın sesini bozmaz mı?",
        choices: [
          { text: "Size özel bir 'Brand Voice' AI Agent eğiteceğiz. Markanızın ses tonunu analiz edip birebir korurken haftada 2 post ve aylık raporlar sunacağız.", score: 10, response: "Müşteri: Marka sesini korumak bizim için çok kritik. Bu kulağa profesyonel geliyor. Peki onay ve kontrol süreci nasıl olacak?" },
          { text: "Her şeyi ChatGPT'ye yazdırıp sisteme yükleyeceğiz, çok hızlı ve ucuz olacağız.", score: 2, response: "Müşteri: Hm, ChatGPT'yi biz de kullanabiliyoruz zaten. Farkınız ne olacak anlayamadım?" },
          { text: "Manuel olarak devam edeceğiz ama yapay zeka ile görsel tasarlayacağız.", score: 5, response: "Müşteri: Anladım, ama AI ajansı olarak daha otomatik ve akıllı bir sistem beklerdik." }
        ]
      },
      {
        text: "Müşteri: Peki bizim onayımız olmadan paylaşım yapılacak mı? Yanlış bir şey paylaşılmasından çekiniyoruz.",
        choices: [
          { text: "Kesinlikle hayır. Üretilen tüm içerikler ve görseller önce onayınıza sunulur. Onay verdiğinizde n8n otomasyonumuz otomatik paylaşır.", score: 10, response: "Müşteri: Süper! Kontrolün bizde olması içimizi çok rahatlattı. Son olarak, fiyatınız nedir ve ya memnun kalmazsak?" },
          { text: "Sistem tam otomatik. AI kendisi üretip paylaşıyor. Algoritmaya güvenmelisiniz.", score: -5, response: "Müşteri: Bu bizim için çok riskli. Marka itibarımızı tamamen bir bota teslim edemeyiz." },
          { text: "Beğenmediğiniz paylaşımları sonradan sileriz, sıkıntı olmaz.", score: 3, response: "Müşteri: İnternette yayılmış bir hatayı sonradan silmek krizleri önlemez." }
        ]
      },
      {
        text: "Müşteri: Fiyat ve güvence konusunu netleştirelim. Risk almak istemiyoruz.",
        choices: [
          { text: "Aylık paket ücretimiz sabit. İlk ay için 'Koşulsuz Para İade Garantisi' sunuyoruz: Büyüme hedefimizi tutturamazsak ödemeyi iade ediyoruz.", score: 10, response: "Müşteri: Bu harika! Riski üstlenmeniz karar vermemizi çok kolaylaştırdı. Sözleşmeyi gönderebilirsiniz!" },
          { text: "Sabit fiyatımız var, garanti veya iade vermiyoruz.", score: 2, response: "Müşteri: Anlıyorum, o zaman bütçemizi başka kanallara ayırmayı tercih edebiliriz." },
          { text: "İlk ay tamamen ücretsiz çalışalım, sonra beğenirseniz ödeme yaparsınız.", score: 8, response: "Müşteri: Ücretsiz deneme iyi bir fırsat. Başlayalım bakalım." }
        ]
      }
    ]
  },
  en: {
    steps: [
      {
        text: "Prospect: Hi there, I saw your outbound pitch. How exactly do you manage our social media using AI without losing our brand voice?",
        choices: [
          { text: "We train a custom 'Brand Voice' AI Agent specific to your business. This replicates your exact tone while we deliver 8 optimized posts/month and monthly performance reviews.", score: 10, response: "Prospect: Replicating our brand voice makes sense. Automated reports are great. What does the onboarding process look like?" },
          { text: "We just run everything through ChatGPT. It's extremely fast and we'll spam posts daily.", score: 2, response: "Prospect: We can do that ourselves. We are looking for high-quality, tailored content, not spam." },
          { text: "We do it manually but we use Midjourney for images to speed up design.", score: 5, response: "Prospect: Okay, but how does the AI workflow actually save us time?" }
        ]
      },
      {
        text: "Prospect: Got it. Will we have control over the content before it goes live? We can't risk AI publishing something weird.",
        choices: [
          { text: "Absolutely. Nothing goes live without your explicit approval. We use a structured client portal (Notion/Buffer) where you review and approve drafts first.", score: 10, response: "Prospect: Perfect, that eliminates the risk. What is your pricing and do you offer any guarantees?" },
          { text: "It's fully automated. The AI generates and schedules directly. Trust the algorithm!", score: -5, response: "Prospect: That's a dealbreaker for us. We can't risk brand reputation on a fully autonomous AI." },
          { text: "If the AI posts something you don't like, just tell us and we'll delete it immediately.", score: 3, response: "Prospect: Deleting a post after it's live is too late if clients see it." }
        ]
      },
      {
        text: "Prospect: Let's talk numbers and guarantees. We need to justify the marketing spend.",
        choices: [
          { text: "It's a flat rate per month. We offer a 30-day money-back guarantee: if we don't increase your reach by X% in the first month, we refund you 100%.", score: 10, response: "Prospect: A money-back guarantee completely de-risks this for us. Let's send over the contract!" },
          { text: "Our rate is flat, and we don't do refunds. Quality has its price.", score: 2, response: "Prospect: We'll have to think about it. The initial risk is a bit high." },
          { text: "We can do the first month for free, and then bill you standard rates starting month two.", score: 8, response: "Prospect: A free trial sounds good. Let's set it up." }
        ]
      }
    ]
  }
};

// Terminal Manager for typewriter output
class TerminalManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.queue = [];
    this.isPrinting = false;
    this.speed = 10; // Typing speed in ms
  }

  print(text, type = 'system') {
    return new Promise((resolve) => {
      this.queue.push({ text, type, resolve });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isPrinting || this.queue.length === 0) return;
    this.isPrinting = true;

    const { text, type, resolve } = this.queue.shift();
    
    if (!this.container) {
      console.warn("Terminal container not found!");
      this.isPrinting = false;
      resolve();
      return;
    }

    // Play retro chime sound when starting to print success or error lines
    if (typeof audioManager !== 'undefined') {
      if (type === 'success' || type === 'success-msg') {
        audioManager.playSFX('success');
      } else if (type === 'error' || type === 'error-msg') {
        audioManager.playSFX('error');
      } else if (type === 'dialogue' || type === 'dialogue-msg') {
        audioManager.playSFX('click');
      }
    }

    const line = document.createElement('div');
    line.className = `log-line ${type}-msg`;
    if (type === 'input') {
      line.className = 'log-line';
    } else if (type === 'dialogue-option') {
      line.className = 'log-line dialogue-option-msg';
    }
    
    this.container.appendChild(line);

    // Auto-scroll as we print
    this.container.scrollTop = this.container.scrollHeight;

    // Typewriter effect character by character
    for (let i = 0; i < text.length; i++) {
      const char = text.charAt(i);
      line.textContent += char;
      this.container.scrollTop = this.container.scrollHeight;
      
      // Play retro mechanical keyboard click for letters, numbers, and common shell symbols
      if (typeof audioManager !== 'undefined' && /[a-zA-Z0-9_$#@\-]/.test(char)) {
        audioManager.playSFX('type');
      }
      
      await new Promise(r => setTimeout(r, this.speed));
    }

    // Add brief delay after completion
    await new Promise(r => setTimeout(r, 30));
    this.isPrinting = false;
    resolve();
    this.processQueue();
  }

  clear() {
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.queue = [];
    this.isPrinting = false;
  }
}

let term; // Global instance of TerminalManager

// Confetti Effect (Uses the UI Designer's `#confetti-canvas` element)
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const colors = ['#00FF66', '#00E5FF', '#FF007F', '#FFFF00', '#FF9F00', '#8A2BE2'];
  const particles = [];

  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height - height,
      r: Math.random() * 5 + 3,
      d: Math.random() * width,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.05 + 0.02,
      tiltAngle: 0,
      velocity: {
        x: Math.random() * 4 - 2,
        y: Math.random() * 4 + 4
      }
    });
  }

  let animationFrameId;
  const startTime = Date.now();

  function update() {
    ctx.clearRect(0, 0, width, height);
    let active = false;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += p.velocity.y;
      p.x += p.velocity.x;
      p.tilt = Math.sin(p.tiltAngle - i / 3) * 12;

      if (p.y <= height) {
        active = true;
      }

      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
      ctx.stroke();
    }

    if (active && Date.now() - startTime < 3000) {
      animationFrameId = requestAnimationFrame(update);
    } else {
      ctx.clearRect(0, 0, width, height);
      cancelAnimationFrame(animationFrameId);
    }
  }

  update();
}

// Badge UI Notification
function unlockBadge(badgeId) {
  if (state.badges.includes(badgeId)) return;
  
  state.badges.push(badgeId);
  const badgeInfo = BADGES[badgeId];
  if (!badgeInfo) return;

  // Render badge in UI list
  updateMiniBadgesUI();
  updateFullBadgesGrid();

  // Create toast notification
  const toast = document.createElement('div');
  toast.className = 'badge-toast';
  toast.innerHTML = `
    <div class="badge-icon">🏆</div>
    <div class="badge-info">
      <div class="badge-title">BAŞARI KAZANILDI!</div>
      <div class="badge-name">${badgeInfo.name}</div>
      <div class="badge-desc">${badgeInfo.desc}</div>
    </div>
  `;
  document.body.appendChild(toast);

  // Trigger sound effect or visually blink screen
  if (typeof audioManager !== 'undefined') {
    audioManager.playSFX('levelUp');
  }
  const consoleEl = document.querySelector('.terminal-panel');
  if (consoleEl) {
    consoleEl.classList.add('badge-flash');
    setTimeout(() => consoleEl.classList.remove('badge-flash'), 500);
  }

  // Animate toast
  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 500);
  }, 4000);

  term.print(`[SİSTEM] Başarı kilidi açıldı: ${badgeInfo.name} - ${badgeInfo.desc}`, 'success');
}

// Recalculate Monthly Recurring Revenue (MRR)
function recalculateMRR() {
  const currentPrices = state.currentNiche ? niches[state.currentNiche].prices : niches['local-service'].prices;
  state.mrr = 
    (state.clients.trStandard * currentPrices.trStandard) +
    (state.clients.trPremium * currentPrices.trPremium) +
    (state.clients.intStandard * currentPrices.intStandard) +
    (state.clients.intPremium * currentPrices.intPremium);

  // Check achievements unlock dynamically
  const totalTRClients = state.clients.trStandard + state.clients.trPremium;
  const totalINTClients = state.clients.intStandard + state.clients.intPremium;

  if (totalTRClients >= 3) {
    unlockBadge('yerel_fatih');
  }
  if (totalINTClients >= 10 && state.mrr >= 15000) {
    unlockBadge('global_oyuncu');
  }
}

// Calculate Weekly Hours
function calculateWorkingHours() {
  let baseHours = 10; // strategy, admin, and email management hours
  if (state.outboundSentThisMonth) {
    baseHours += 10; // Outbound campaigns take time
  }

  const totalClients = 
    state.clients.trStandard + 
    state.clients.trPremium + 
    state.clients.intStandard + 
    state.clients.intPremium;

  if (totalClients === 0) {
    state.workingHours = baseHours;
    return;
  }

  const currentNicheData = state.currentNiche ? niches[state.currentNiche] : niches['local-service'];
  let hoursPerClient = currentNicheData.hoursPerClient.manual;

  if (state.operationsAutomated) {
    hoursPerClient = currentNicheData.hoursPerClient.automated;
  }
  
  if (state.vaHired) {
    hoursPerClient = currentNicheData.hoursPerClient.va;
  }

  state.workingHours = Math.round(baseHours + (totalClients * hoursPerClient));
  if (state.workingHours > 70) state.workingHours = 70; // Cap workload at 70 hrs
}

// Get the corresponding Agency Title based on Level
function getAgencyTitle(level) {
  const titles = {
    0: "Pre-Launch Rookie",
    1: "Niche Explorer",
    2: "Offer Designer",
    3: "Outbound Specialist",
    4: "Automation Architect",
    5: "Retention Guru",
    6: "Scale Specialist",
    7: "AI Tycoon Legend"
  };
  return titles[level] || "AI Agency Builder";
}

// Get monthly expenses
function getMonthlyExpenses() {
  let softwareExpenses = 150; // standard baseline
  if (state.operationsAutomated) {
    softwareExpenses = 300; // expanded tools (Apollo, Lemlist, n8n, etc.)
  }
  if (state.vaHired) {
    softwareExpenses += 500; // VA salary
  }
  return softwareExpenses;
}

// Update the Dashboard UI elements
function updateUI() {
  const levelNumStr = state.level < 10 ? `0${state.level}` : `${state.level}`;
  
  // Left Panel bindings
  document.getElementById('agency-level').textContent = levelNumStr;
  document.getElementById('agency-title').textContent = getAgencyTitle(state.level);
  
  document.getElementById('mrr-usd').textContent = `$${state.mrr.toLocaleString()}`;
  document.getElementById('mrr-tl').textContent = `${(state.mrr * state.exchangeRate).toLocaleString()} ₺`;
  
  document.getElementById('cash-reserve').textContent = `$${state.cash.toLocaleString()}`;

  // Net Cash Flow update
  const expenses = getMonthlyExpenses();
  const netFlow = state.mrr - expenses;
  const burnRateEl = document.getElementById('cash-burn-rate');
  if (netFlow >= 0) {
    burnRateEl.textContent = `Net: +$${netFlow.toLocaleString()}/mo`;
    burnRateEl.style.color = '#00ff66';
  } else {
    burnRateEl.textContent = `Burn: -$${Math.abs(netFlow).toLocaleString()}/mo`;
    burnRateEl.style.color = '#ff0055';
  }

  document.getElementById('weekly-hours').textContent = `${state.workingHours}h`;
  
  // Weekly workload status coloring
  const hoursValEl = document.getElementById('weekly-hours');
  if (state.workingHours > 50) {
    hoursValEl.className = "metric-value text-glow-red";
  } else if (state.workingHours > 40) {
    hoursValEl.className = "metric-value text-glow-yellow";
  } else {
    hoursValEl.className = "metric-value text-glow-green";
  }

  // Burnout UI updates
  document.getElementById('burnout-percentage').textContent = `${state.burnout}%`;
  const burnoutBar = document.getElementById('burnout-bar');
  if (burnoutBar) {
    burnoutBar.style.width = `${state.burnout}%`;
    if (state.burnout > 75) {
      burnoutBar.style.backgroundColor = '#ff0055';
    } else if (state.burnout > 40) {
      burnoutBar.style.backgroundColor = '#ffaa00';
    } else {
      burnoutBar.style.backgroundColor = '#00ff66';
    }
  }

  // Client segments update
  document.getElementById('clients-tr').textContent = state.clients.trStandard + state.clients.trPremium;
  document.getElementById('clients-int-std').textContent = state.clients.intStandard;
  document.getElementById('clients-int-prem').textContent = state.clients.intPremium;

  const totalClients = 
    state.clients.trStandard + 
    state.clients.trPremium + 
    state.clients.intStandard + 
    state.clients.intPremium;
  
  // Update total clients if element exists, or just log
  const totalClientsLabel = document.getElementById('total-clients');
  if (totalClientsLabel) {
    totalClientsLabel.textContent = totalClients;
  }
}

// Update the mini achievement grid (4 slots)
function updateMiniBadgesUI() {
  const container = document.getElementById('badges-grid');
  if (!container) return;

  container.innerHTML = '';
  const earnedBadgeIds = state.badges;

  for (let i = 0; i < 4; i++) {
    const slot = document.createElement('div');
    if (i < earnedBadgeIds.length) {
      const badgeId = earnedBadgeIds[i];
      slot.className = 'badge-slot earned';
      slot.title = `${BADGES[badgeId].name}: ${BADGES[badgeId].desc}`;
      slot.innerHTML = '<i class="fa-solid fa-award text-glow-green"></i>';
    } else {
      slot.className = 'badge-slot empty';
      slot.title = 'Locked Achievement';
      slot.innerHTML = '<i class="fa-solid fa-lock"></i>';
    }
    container.appendChild(slot);
  }
}

// Update the full badges list grid in the achievements modal
function updateFullBadgesGrid() {
  const grid = document.getElementById('badges-full-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  Object.keys(BADGES).forEach(badgeId => {
    const isEarned = state.badges.includes(badgeId);
    const badgeEl = document.createElement('div');
    badgeEl.className = `badge-full-item ${isEarned ? 'earned' : 'locked'}`;
    badgeEl.style.display = 'flex';
    badgeEl.style.alignItems = 'center';
    badgeEl.style.padding = '12px';
    badgeEl.style.border = isEarned ? '1px solid #00ff66' : '1px solid #333';
    badgeEl.style.borderRadius = '4px';
    badgeEl.style.marginBottom = '10px';
    badgeEl.style.background = isEarned ? 'rgba(0, 30, 10, 0.5)' : 'rgba(10, 10, 10, 0.5)';
    
    badgeEl.innerHTML = `
      <div class="badge-full-icon" style="font-size: 24px; margin-right: 15px;">
        ${isEarned ? '🏆' : '🔒'}
      </div>
      <div class="badge-full-meta">
        <h4 class="badge-full-name" style="margin: 0; color: ${isEarned ? '#00ff66' : '#666'};">${BADGES[badgeId].name}</h4>
        <p class="badge-full-desc" style="margin: 3px 0 0 0; font-size: 12px; color: #888;">${BADGES[badgeId].desc}</p>
        <span class="badge-full-status" style="font-size: 10px; color: ${isEarned ? '#ffaa00' : '#444'}; font-weight: bold;">
          ${isEarned ? 'UNLOCKED' : 'LOCKED'}
        </span>
      </div>
    `;
    grid.appendChild(badgeEl);
  });
}

// Open Level Up Screen Overlay
function showLevelUpModal(lvl) {
  if (typeof audioManager !== 'undefined') {
    audioManager.playSFX('levelUp');
  }
  const modal = document.getElementById('level-up-modal');
  const modalLvlNum = document.getElementById('modal-level-num');
  const modalLvlTitle = document.getElementById('modal-level-title');
  const perksList = document.getElementById('unlocked-perks-list');

  if (!modal || !modalLvlNum || !modalLvlTitle || !perksList) return;

  const lvlNumString = lvl < 10 ? `0${lvl}` : `${lvl}`;
  modalLvlNum.textContent = lvlNumString;
  modalLvlTitle.textContent = levels[lvl].name;

  perksList.innerHTML = '';
  
  const levelPerks = {
    1: ["Sektör Odaklama: Niş seçimi aktif.", "Verimlilik Artışı: Belirli bir sektöre odaklanmak operasyonel karmaşayı önler."],
    2: ["Standart Paketler: TR ve INT paket yapıları aktif.", "Para İade Garantisi: Müşteri güveni kazanmak için hazır."],
    3: ["Outbound Mesajlaşma: LinkedIn & Cold Email kapıları açıldı.", "Demo Görüşmeleri: Bekleyen demolar ile görüşme yapabilirsiniz."],
    4: ["İş Akışı Otomasyonu: n8n/Make entegrasyonu aktif.", "Zaman Tasarrufu: Müşteri başına operasyonel süre 2 saatten 40 dakikaya düştü."],
    5: ["Müşteri Elde Tutma: Otomatik aylık raporlama ile churn azaltıldı.", "Ek Satış (Upsell): Müşterileri Premium pakete geçirme şansı aktif."],
    6: ["Sanal Asistan (VA): Part-time asistan kiralama aktif.", "Maksimum Kaldıraç: Müşteri başı iş yükü haftalık 15 dakikaya indi."],
    7: ["Nihai Hedef Ulaşıldı: $40K MRR ve 30 Müşteri başarıldı.", "Stratejik Karar: Sürdürülebilir Butik, Kurumsal Ölçek veya SaaS Pivot yollarından birini seçin."]
  };

  const perks = levelPerks[lvl] || ["Yeni seviye özellikleri aktif."];
  perks.forEach(perk => {
    const li = document.createElement('li');
    li.innerHTML = `<i class="fa-solid fa-circle-check text-glow-green"></i> ${perk}`;
    perksList.appendChild(li);
  });

  modal.classList.add('active');
}

// Game Commands Parser
async function parseCommand(rawInput) {
  const input = rawInput.trim();
  if (!input) return;

  // Log user command to terminal output
  await term.print(`guest@ai-agency:~$ ${input}`, 'input');

  // Handle Active Dialogues
  if (state.inDemoCall) {
    await handleDemoCallDialogue(input);
    return;
  }

  if (state.inEndDecision) {
    await handleEndGameDecision(input);
    return;
  }

  const parts = input.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (cmd) {
    case 'help':
      await showHelp();
      break;
    case 'status':
      await showStatus();
      break;
    case 'outbound-templates':
      await showTemplates();
      break;
    case 'select-niche':
      await selectNicheCommand(args);
      break;
    case 'automate-ops':
      await automateOpsCommand();
      break;
    case 'send-outbound':
      await sendOutboundCommand(args);
      break;
    case 'run-demo-call':
      await runDemoCallCommand(args);
      break;
    case 'hire-va':
      await hireVaCommand();
      break;
    case 'next-month':
      await nextMonthCommand();
      break;
    case 'clear':
      term.clear();
      break;
    default:
      await term.print(`Hata: Bilinmeyen komut "${cmd}". Kullanılabilir komutları görmek için "help" yazın.`, 'error');
  }

  recalculateMRR();
  calculateWorkingHours();
  updateUI();
}

async function showHelp() {
  const helpText = [
    "=== KULLANILABİLİR KOMUTLAR ===",
    "help                           : Bu yardım menüsünü görüntüler.",
    "status                         : Ajansın güncel durum detaylarını yazdırır.",
    "select-niche [niche-id]        : Odaklanılacak sektörü seçer (Level 1'de).",
    "                                 Seçenekler: local-service, ecommerce, b2b-saas",
    "automate-ops                   : Otomasyon/şablon kurar (Lvl 0: $100 | Lvl 2: $150 | Lvl 4: $300).",
    "send-outbound [tr|int]         : Kampanya başlatır. (Lvl 3+, Maliyet: tr=$50, int=$150, ikisi=$200).",
    "run-demo-call [tr|int]         : Bekleyen demo görüşmelerini başlatır (Lvl 3+, Maliyet: Ücretsiz).",
    "outbound-templates             : Başarılı ve başarısız outbound şablonlarını analiz eder.",
    "hire-va                        : Sanal asistan işe alır (Lvl 6, Maliyet: $500 kurulum, +$500/ay).",
    "next-month                     : Sonraki aya geçer. Gelir/giderleri işletir, seviye atlatır.",
    "clear                          : Terminal ekranını temizler."
  ];

  for (const line of helpText) {
    await term.print(line, 'system');
  }
}

async function showTemplates() {
  const src = (window.GAME_CONTENT && window.GAME_CONTENT.outboundTemplates) 
    ? window.GAME_CONTENT.outboundTemplates 
    : null;
  if (!src) {
    await term.print("Hata: Şablon içeriği yüklenemedi.", "error");
    return;
  }
  await term.print(`=== ${src.title} ===`, 'system');
  await term.print(src.description, 'system');
  for (const t of src.templates) {
    await term.print(`\n[Varyant: ${t.id}] - ${t.type} (${t.language})`, 'dialogue-option');
    await term.print(`Kanal: ${t.channel}`, 'system');
    await term.print(`Mesaj:\n${t.content}`, 'dialogue');
    await term.print(`Analiz: ${t.analysis}`, 'system');
  }
}

async function showStatus() {
  const currentPrices = state.currentNiche ? niches[state.currentNiche].prices : { trStandard: 0, trPremium: 0, intStandard: 0, intPremium: 0 };
  const expenses = getMonthlyExpenses();
  const statusLines = [
    `=== AJANS GÜNCEL DURUM RAPORU (Ay: ${state.month}) ===`,
    `Seviye          : Lvl ${state.level} - ${levels[state.level].name}`,
    `Hedef           : ${levels[state.level].goal}`,
    `Nakit Rezerv    : $${state.cash.toLocaleString()}`,
    `Aylık Gelir (MRR): $${state.mrr.toLocaleString()} (~${(state.mrr * state.exchangeRate).toLocaleString()} TL)`,
    `Yazılım/VA Gider: -$${expenses.toLocaleString()}/ay`,
    `Haftalık Çalışma: ${state.workingHours} saat (Burnout: ${state.burnout}%)`,
    `Seçilen Niş     : ${state.currentNiche ? niches[state.currentNiche].name : "Seçilmedi"}`,
    `Müşteriler      : TR Standart (${state.clients.trStandard} - Adet fiyatı: $${currentPrices.trStandard}), TR Premium (${state.clients.trPremium} - Adet fiyatı: $${currentPrices.trPremium})`,
    `                  INT Standart (${state.clients.intStandard} - Adet fiyatı: $${currentPrices.intStandard}), INT Premium (${state.clients.intPremium} - Adet fiyatı: $${currentPrices.intPremium})`,
    `Bekleyen Demolar: TR: ${state.demoQueue.tr} | INT: ${state.demoQueue.int}`,
    `Asistan Durumu  : ${state.vaHired ? "İşe Alındı (Maliyet: $500/ay)" : "Alınmadı"}`,
    `Otomasyon Durumu: ${state.operationsAutomated ? "Aktif (n8n/Make kurulu)" : "Kurulmadı"}`
  ];

  for (const line of statusLines) {
    await term.print(line, 'system');
  }
}

async function selectNicheCommand(args) {
  if (state.level !== 1) {
    await term.print("Hata: Sektör seçimi yalnızca Level 1 (Niş Seçimi) aşamasında yapılabilir.", "error");
    return;
  }

  if (args.length === 0) {
    await term.print("Lütfen bir sektör ID girin. Kullanım: select-niche [local-service | ecommerce | b2b-saas]", "error");
    return;
  }

  const selected = args[0].toLowerCase();
  if (!niches[selected]) {
    await term.print(`Hata: Geçersiz niş "${selected}". Seçenekler: local-service, ecommerce, b2b-saas`, "error");
    return;
  }

  state.currentNiche = selected;
  await term.print(`Başarılı: Odak sektörünüz "${niches[selected].name}" olarak ayarlandı.`, "success");
  await term.print(niches[selected].desc, "system");
  await term.print(`Lütfen sonraki aya geçmek için "next-month" komutunu çalıştırın.`, "system");
}

async function automateOpsCommand() {
  if (state.level === 0) {
    if (state.templatesCreated) {
      await term.print("Şablon kütüphaneniz ve pre-launch kontrol listeniz zaten hazır.", "system");
      return;
    }
    const cost = 100;
    if (state.cash < cost) {
      await term.print(`Hata: Gerekli bütçe ($${cost}) nakit rezervinizde bulunmuyor!`, "error");
      return;
    }
    state.cash -= cost;
    state.templatesCreated = true;
    await term.print("Başarılı: Lansman öncesi hazırlık şablonları oluşturuldu. Araçlar bağlandı ($100 harcandı).", "success");
    await term.print("Tebrikler: Google Docs/Notion üzerinde boş şablonlarınız hazır. Artık bir sonraki aya geçmeye hazırsınız (`next-month`).", "system");
    return;
  }

  if (state.level === 2) {
    if (state.serviceDefined) {
      await term.print("Hizmet paketleriniz ve 4-tier fiyatlandırma yapınız zaten tanımlandı.", "system");
      return;
    }
    const cost = 150;
    if (state.cash < cost) {
      await term.print(`Hata: Gerekli bütçe ($${cost}) nakit rezervinizde bulunmuyor!`, "error");
      return;
    }
    state.cash -= cost;
    state.serviceDefined = true;
    await term.print("Başarılı: Hizmet paketleri, fiyatlandırma ve para iade garantisi tanımlandı ($150 harcandı).", "success");
    await term.print("Artık outbound pazarlama başlatarak müşteri bulmaya hazırsınız! Bir sonraki aya geçebilirsiniz (`next-month`).", "system");
    return;
  }

  if (state.level === 4) {
    if (state.operationsAutomated) {
      await term.print("n8n/Make AI iş akışı otomasyonu zaten kurulu.", "system");
      return;
    }
    const cost = 300;
    if (state.cash < cost) {
      await term.print(`Hata: Gerekli bütçe ($${cost}) nakit rezervinizde bulunmuyor!`, "error");
      return;
    }
    state.cash -= cost;
    state.operationsAutomated = true;
    await term.print("Başarılı: n8n, Make ve OpenAI API entegrasyonu tamamlandı. Aylık rapor otomasyonu kuruldu ($300 harcandı).", "success");
    await term.print("Müşteri başına harcadığınız haftalık süre dramatik şekilde düştü! Bir sonraki aya geçebilirsiniz (`next-month`).", "system");
    return;
  }

  await term.print("Hata: `automate-ops` komutu şu anki seviyede kullanılamaz (Gerekli olduğu seviyeler: 0, 2, 4).", "error");
}

async function sendOutboundCommand(args) {
  if (state.level < 3) {
    await term.print("Hata: Outbound kampanyaları başlatmak için en az Level 3 (Müşteri Yakalama) aşamasında olmalısınız.", "error");
    return;
  }

  if (state.outboundSentThisMonth) {
    await term.print("Hata: Bu ay zaten bir outbound kampanyası yürüttünüz. Yeni kampanya için sonraki aya geçmelisiniz.", "error");
    return;
  }

  let type = 'both';
  if (args.length > 0) {
    const arg = args[0].toLowerCase();
    if (arg === 'tr' || arg === 'int') {
      type = arg;
    }
  }

  let cost = 200; // default cost for both
  if (type === 'tr') cost = 50;
  if (type === 'int') cost = 150;

  if (state.cash < cost) {
    await term.print(`Hata: Gerekli reklam/veri bütçesi ($${cost}) nakit rezervinizde bulunmuyor.`, "error");
    return;
  }

  if (typeof audioManager !== 'undefined') {
    audioManager.playSFX('outbound');
  }
  state.cash -= cost;
  state.outboundSentThisMonth = true;

  let trDemos = 0;
  let intDemos = 0;

  if (type === 'tr' || type === 'both') {
    trDemos = Math.floor(Math.random() * 3) + 1; // 1-3 demos
  }
  if (type === 'int' || type === 'both') {
    intDemos = Math.floor(Math.random() * 2) + 1; // 1-2 demos
  }

  state.demoQueue.tr += trDemos;
  state.demoQueue.int += intDemos;

  await term.print(`[KAMPANYA] Outbound çalışması tamamlandı. Toplam $${cost} harcandı.`, "success");
  if (trDemos > 0) await term.print(`-> ${trDemos} yeni TR demo görüşmesi ayarlandı.`, "system");
  if (intDemos > 0) await term.print(`-> ${intDemos} yeni INT demo görüşmesi ayarlandı.`, "system");
  await term.print(`Görüşmeleri başlatmak için "run-demo-call" komutunu çalıştırın.`, "system");
}

async function runDemoCallCommand(args) {
  if (state.level < 3) {
    await term.print("Hata: Demo görüşmesi yapmak için en az Level 3 (Müşteri Yakalama) aşamasında olmalısınız.", "error");
    return;
  }

  if (state.demoQueue.tr === 0 && state.demoQueue.int === 0) {
    await term.print("Hata: Bekleyen demo görüşmeniz bulunmamaktadır. Önce `send-outbound` ile kampanya yürütün.", "error");
    return;
  }

  let choice = 'int'; // default priority
  if (args.length > 0) {
    const arg = args[0].toLowerCase();
    if (arg === 'tr' || arg === 'int') {
      choice = arg;
    }
  }

  // Fallback checks
  if (choice === 'tr' && state.demoQueue.tr === 0) {
    choice = 'int';
  }
  if (choice === 'int' && state.demoQueue.int === 0) {
    choice = 'tr';
  }

  // Determine client type to acquire
  let clientType;
  if (choice === 'tr') {
    if (state.level >= 6 && Math.random() < 0.3) {
      clientType = 'trPremium';
    } else {
      clientType = 'trStandard';
    }
    await term.print("=== TÜRK MÜŞTERİ DEMO GÖRÜŞMESİ BAŞLIYOR ===", "system");
    startDemoCall(clientType, 'tr');
  } else {
    if (state.level >= 6 && Math.random() < 0.3) {
      clientType = 'intPremium';
    } else {
      clientType = 'intStandard';
    }
    await term.print("=== INTERNATIONAL CLIENT DEMO CALL BEGINS ===", "system");
    startDemoCall(clientType, 'en');
  }
}

async function hireVaCommand() {
  if (state.level < 6) {
    await term.print("Hata: Sanal asistan (VA) desteği ancak Level 6 (Scale) aşamasında kiralanabilir.", "error");
    return;
  }

  if (state.vaHired) {
    await term.print("Zaten aktif bir sanal asistanınız (VA) bulunmaktadır.", "system");
    return;
  }

  const cost = 500; // First month setup/fee
  if (state.cash < cost) {
    await term.print(`Hata: VA kiralama başlangıç maliyeti ($${cost}) nakit rezervinizde yok.`, "error");
    return;
  }

  state.cash -= cost;
  state.vaHired = true;
  await term.print("Başarılı: Filipinler/Latin Amerika kökenli part-time VA işe alındı ($500 harcandı).", "success");
  await term.print("VA; zaman planlama, veri toplama ve Canva taslaklarını devralarak müşteri başına haftalık sürenizi 15 dakikaya indirdi!", "system");
  unlockBadge('patron_mode');
}

// Next Month Command - Core progression and financial calculations
async function nextMonthCommand() {
  // 1. Level transition checks
  if (state.level === 0) {
    if (!state.templatesCreated) {
      await term.print("Level 1'e geçiş başarısız. Önce `automate-ops` ile şablonlarınızı hazırlayın.", "error");
      return;
    }
    state.level = 1;
    await term.print("Tebrikler! Level 1: NİŞ SEÇİMİ aşamasına geçtiniz.", "success");
    await term.print("Ajansınızın sürdürülebilirliği için bir odak sektörü (niş) seçin. Komut: `select-niche [local-service|ecommerce|b2b-saas]`", "system");
    triggerConfetti();
    showLevelUpModal(1);
    unlockBadge('template_builder');
    return;
  }

  if (state.level === 1) {
    if (!state.currentNiche) {
      await term.print("Level 2'ye geçiş başarısız. Önce `select-niche` ile bir odak sektörü seçmelisiniz.", "error");
      return;
    }
    state.level = 2;
    await term.print("Tebrikler! Level 2: HİZMET TANIMLAMA aşamasına geçtiniz.", "success");
    await term.print("Standart paketlerinizi tanımlamak ve fiyatlandırmak için `automate-ops` komutunu çalıştırın.", "system");
    triggerConfetti();
    showLevelUpModal(2);
    unlockBadge('niche_master');
    return;
  }

  if (state.level === 2) {
    if (!state.serviceDefined) {
      await term.print("Level 3'e geçiş başarısız. Önce `automate-ops` ile hizmet paketlerini tanımlamalısınız.", "error");
      return;
    }
    state.level = 3;
    await term.print("Tebrikler! Level 3: MÜŞTERİ YAKALAMA (Outbound) aşamasına geçtiniz.", "success");
    await term.print("Müşteri kazanmak için outbound reklam başlatın (`send-outbound`) ve demoları tamamlayın (`run-demo-call`).", "system");
    await term.print("Bir sonraki seviyeye geçmek için en az 1 müşteriye sahip olmalısınız.", "system");
    triggerConfetti();
    showLevelUpModal(3);
    return;
  }

  const totalClients = 
    state.clients.trStandard + 
    state.clients.trPremium + 
    state.clients.intStandard + 
    state.clients.intPremium;

  if (state.level === 3) {
    if (totalClients >= 1) {
      state.level = 4;
      await term.print("Tebrikler! Level 4: OPERATIONS aşamasına geçtiniz.", "success");
      await term.print("Giderek artan müşteri iş yükünü hafifletmek için operasyonları otomatize edin (`automate-ops`).", "system");
      triggerConfetti();
      showLevelUpModal(4);
      unlockBadge('first_client');
    } else {
      await term.print("Bilgi: Level 4'e geçmek için en az 1 müşteri kazanmış olmalısınız. Outbound yapın ve demoları tamamlayın.", "system");
    }
  }

  else if (state.level === 4) {
    if (state.operationsAutomated) {
      state.level = 5;
      await term.print("Tebrikler! Level 5: DELIVERY & RETENTION aşamasına geçtiniz.", "success");
      await term.print("Müşteri elde tutma (retention) ve ek satış (upsell) süreçleriniz aktif.", "system");
      triggerConfetti();
      showLevelUpModal(5);
      unlockBadge('automation_wizard');
    } else {
      await term.print("Bilgi: Level 5'e geçmek için operasyonel otomasyonu kurmalısınız. `automate-ops` komutunu çalıştırın.", "system");
    }
  }

  else if (state.level === 5) {
    if (totalClients >= 10) {
      state.level = 6;
      await term.print("Tebrikler! Level 6: SCALE TO 30 CLIENTS aşamasına geçtiniz.", "success");
      await term.print("30 müşteri hedefine hızla yaklaşıyorsunuz. Aşırı iş yükünden kaçınmak için `hire-va` ile asistan işe alabilirsiniz.", "system");
      triggerConfetti();
      showLevelUpModal(6);
    } else {
      await term.print(`Bilgi: Level 6'ya geçebilmek için en az 10 müşteriye ulaşmalısınız. Güncel müşteri: ${totalClients}/10`, "system");
    }
  }

  else if (state.level === 6) {
    if (state.mrr >= 40000 || totalClients >= 30) {
      state.level = 7;
      state.inEndDecision = true;
      await term.print("=== TEBRİKLER! AJANS DEVİ OLDUNUZ! ===", "success");
      await term.print("Aylık $40,000 MRR hedefine ulaştınız ve ajansınızı başarıyla ölçeklediniz!", "success");
      await term.print("Şimdi ajansın geleceği için nihai stratejik kararı vermelisiniz:", "system");
      await term.print("Seçenekler:", "system");
      await term.print("- sustain : Butik yapıyı koru, düşük risk, yüksek hayat kalitesi (Solo + 1-2 VA).", "dialogue-option");
      await term.print("- team    : Ekip kurup büyüt, ajansı kurumsallaştır ($80K-$150K MRR hedefi).", "dialogue-option");
      await term.print("- saas    : Hizmeti yazılıma dönüştür (SaaS pivot, yüksek çarpanlı exit hedefi).", "dialogue-option");
      await term.print("Lütfen kararınızı yazın (sustain / team / saas):", "input");
      
      triggerConfetti();
      showLevelUpModal(7);
      unlockBadge('tycoon_status');
      return;
    } else {
      await term.print(`Hedef henüz tamamlanmadı. Level 7 için $40,000 MRR veya 30 müşteri gerekiyor. Güncel MRR: $${state.mrr.toLocaleString()}, Müşteri: ${totalClients}`, "system");
    }
  }

  // Process Month Transition logic (Financials, Churn, Burnout)
  await term.print(`\n=== AY ${state.month} ÖZETİ VE RAPORU ===`, "system");

  // Cash Inflow
  state.cash += state.mrr;
  await term.print(`+ Gelir (MRR): +$${state.mrr.toLocaleString()}`, "success");

  // Expenses Calculation
  const expenses = getMonthlyExpenses();
  state.cash -= expenses;
  await term.print(`- Giderler (Yazılım/VA): -$${expenses.toLocaleString()}`, "error");
  await term.print(`Net Nakit Bakiye: $${state.cash.toLocaleString()}`, "system");

  // Retention & Churn processing (Level 5+)
  if (state.level >= 5 && totalClients > 0) {
    const currentNicheData = niches[state.currentNiche];
    let churnProb = currentNicheData.churnRate.manual;
    if (state.operationsAutomated) churnProb = currentNicheData.churnRate.automated;
    if (state.vaHired) churnProb = currentNicheData.churnRate.va;

    let lostClientsCount = 0;
    
    // Check churn for each client category
    ['trStandard', 'trPremium', 'intStandard', 'intPremium'].forEach(type => {
      const count = state.clients[type];
      for (let i = 0; i < count; i++) {
        if (Math.random() < churnProb) {
          state.clients[type]--;
          lostClientsCount++;
        }
      }
    });

    if (lostClientsCount > 0) {
      await term.print(`- Churn Raporu: Bu ay ${lostClientsCount} müşteri ajansınızdan ayrıldı.`, "error");
      recalculateMRR();
    } else {
      await term.print(`+ Churn Raporu: Mükemmel hizmet kalitesi! Bu ay hiç müşteri kaybetmediniz.`, "success");
      unlockBadge('retention_pro');
    }

    // Upsell logic (Level 5+) - 10% chance to upgrade Standard to Premium
    if (state.clients.trStandard > 0 && Math.random() < 0.10) {
      state.clients.trStandard--;
      state.clients.trPremium++;
      await term.print("[UPSELL] Harika! Bir yerel (TR) standart müşterinizi Premium pakete yükselttiniz!", "success");
    }
    if (state.clients.intStandard > 0 && Math.random() < 0.10) {
      state.clients.intStandard--;
      state.clients.intPremium++;
      await term.print("[UPSELL] Muhteşem! Bir uluslararası (INT) standart müşterinizi Premium pakete yükselttiniz!", "success");
    }
    recalculateMRR();
  }

  // Burnout and Hours recalculation
  calculateWorkingHours();
  
  if (state.workingHours > 40) {
    const addedBurnout = Math.round((state.workingHours - 40) * 1.5);
    state.burnout += addedBurnout;
    await term.print(`[DİKKAT] Aşırı çalıştınız! Haftalık ${state.workingHours} saat mesai, burnout seviyenizi %${addedBurnout} artırdı.`, "error");
  } else {
    const reducedBurnout = Math.round((40 - state.workingHours) * 0.5);
    state.burnout = Math.max(0, state.burnout - reducedBurnout);
    await term.print(`[SAĞLIK] Çalışma saatleriniz dengeli (${state.workingHours} sa/hafta). Burnout seviyeniz %${reducedBurnout} azaldı.`, "success");
  }

  // Check Game Over conditions
  if (state.burnout >= 100) {
    await term.print("\n=== BURNOUT %100: TÜKENDİNİZ! ===", "error");
    await term.print("Aşırı çalışma ve stres yüzünden hastanelik oldunuz ve ajans faaliyetlerini durdurmak zorunda kaldınız.", "error");
    await term.print("OYUN BİTTİ (KAYBETTİNİZ). Yeniden oynamak için sayfayı yenileyin.", "error");
    state.gameCompleted = true;
    disableInput();
    return;
  }

  if (state.cash < 0) {
    await term.print("\n=== İFLAS ETTİNİZ! ===", "error");
    await term.print("Banka hesabınızdaki nakit tükendi ve operasyon maliyetlerini karşılayamadınız.", "error");
    await term.print("OYUN BİTTİ (KAYBETTİNİZ). Yeniden oynamak için sayfayı yenileyin.", "error");
    state.gameCompleted = true;
    disableInput();
    return;
  }

  // Reset monthly single action limits
  state.outboundSentThisMonth = false;
  state.month++;

  await term.print(`Yeni Ay (Ay ${state.month}) başladı. Yol haritasındaki adımları takip etmeye devam edin!`, "system");
  recalculateMRR();
  calculateWorkingHours();
  updateUI();
}

// Interactive Demo Call dialogues loop
function startDemoCall(clientType, lang) {
  state.inDemoCall = true;
  state.demoCallScore = 0;
  state.demoCallClientType = clientType;

  const dialogueSource = (window.GAME_CONTENT && window.GAME_CONTENT.demoCallDialog) 
    ? window.GAME_CONTENT.demoCallDialog 
    : null;

  if (dialogueSource && dialogueSource.nodes && dialogueSource.nodes['greeting']) {
    state.demoCallStep = 'greeting';
  } else {
    state.demoCallStep = 0;
  }

  // Render the first step of dialogue
  renderDemoCallStep();
}

function renderDemoCallStep() {
  const lang = state.demoCallClientType.startsWith('tr') ? 'tr' : 'en';
  const dialogueSource = (window.GAME_CONTENT && window.GAME_CONTENT.demoCallDialog) 
    ? window.GAME_CONTENT.demoCallDialog 
    : null;

  // Use graph dialogue if available
  if (dialogueSource && dialogueSource.nodes && dialogueSource.nodes[state.demoCallStep]) {
    const currentNode = dialogueSource.nodes[state.demoCallStep];
    term.print(currentNode.customerStatement, 'dialogue');
    currentNode.choices.forEach((choice, index) => {
      term.print(`${index + 1}) ${choice.text}`, 'dialogue-option');
    });
    term.print("Seçiminiz (1-3 yazın veya çıkmak için 'iptal'):", "system");
  } else {
    // Fall back to linear FALLBACK_DIALOGUES
    const currentList = FALLBACK_DIALOGUES[lang];
    const step = currentList.steps[state.demoCallStep];
    term.print(step.text, 'dialogue');
    step.choices.forEach((choice, index) => {
      term.print(`${index + 1}) ${choice.text}`, 'dialogue-option');
    });
    term.print("Seçiminiz (1-3 yazın veya çıkmak için 'iptal'):", "system");
  }
}

async function handleDemoCallDialogue(input) {
  const cleanInput = input.trim();
  const lang = state.demoCallClientType.startsWith('tr') ? 'tr' : 'en';

  if (cleanInput.toLowerCase() === 'iptal') {
    await term.print("Görüşme iptal edildi. Demo sırasında müşteri masadan kalktı.", "error");
    if (state.demoCallClientType.startsWith('tr')) {
      state.demoQueue.tr = Math.max(0, state.demoQueue.tr - 1);
    } else {
      state.demoQueue.int = Math.max(0, state.demoQueue.int - 1);
    }
    state.inDemoCall = false;
    updateUI();
    return;
  }

  const choiceIndex = parseInt(cleanInput) - 1;
  if (isNaN(choiceIndex) || choiceIndex < 0 || choiceIndex > 2) {
    await term.print("Geçersiz seçim! Lütfen 1, 2 veya 3 yazın.", "error");
    return;
  }

  const dialogueSource = (window.GAME_CONTENT && window.GAME_CONTENT.demoCallDialog) 
    ? window.GAME_CONTENT.demoCallDialog 
    : null;

  if (dialogueSource && dialogueSource.nodes && dialogueSource.nodes[state.demoCallStep]) {
    const currentNode = dialogueSource.nodes[state.demoCallStep];
    const choice = currentNode.choices[choiceIndex];

    state.demoCallScore += choice.score;
    await term.print(`> ${choice.text}`, 'input');
    
    if (choice.feedback) {
      await term.print(`[GERİ BİLDİRİM] ${choice.feedback}`, 'system');
    }

    const nextNodeKey = choice.nextNode;
    const nextNode = dialogueSource.nodes[nextNodeKey];

    if (nextNode && nextNode.isEnd) {
      state.inDemoCall = false;
      await term.print(`\n${nextNode.message}`, nextNode.success ? 'success' : 'error');

      if (nextNode.success) {
        state.clients[state.demoCallClientType]++;
        const prices = state.currentNiche ? niches[state.currentNiche].prices : niches['local-service'].prices;
        const gainedRevenue = prices[state.demoCallClientType];
        await term.print(`Yeni Müşteri Edinildi! Aylık Gelir: +$${gainedRevenue.toLocaleString()} eklendi.`, "success");
        if (typeof audioManager !== 'undefined') {
          audioManager.playSFX('dealClose');
        }
        triggerConfetti();
        
        const totalClients = 
          state.clients.trStandard + 
          state.clients.trPremium + 
          state.clients.intStandard + 
          state.clients.intPremium;
        if (totalClients === 1) {
          unlockBadge('first_client');
        }
        if (nextNodeKey === 'success_node') {
          unlockBadge('kurt_satıcı');
        }
      }

      // Decrement queue
      if (state.demoCallClientType.startsWith('tr')) {
        state.demoQueue.tr = Math.max(0, state.demoQueue.tr - 1);
      } else {
        state.demoQueue.int = Math.max(0, state.demoQueue.int - 1);
      }

      recalculateMRR();
      calculateWorkingHours();
      updateUI();
    } else {
      state.demoCallStep = nextNodeKey;
      renderDemoCallStep();
    }
  } else {
    // Linear fallback processing
    const currentList = FALLBACK_DIALOGUES[lang];
    const step = currentList.steps[state.demoCallStep];
    const choice = step.choices[choiceIndex];

    state.demoCallScore += choice.score;
    await term.print(`> ${choice.text}`, 'input');
    await term.print(choice.response, 'dialogue');

    state.demoCallStep++;

    if (state.demoCallStep < currentList.steps.length) {
      renderDemoCallStep();
    } else {
      state.inDemoCall = false;
      if (state.demoCallScore >= 20) {
        state.clients[state.demoCallClientType]++;
        await term.print("\n[BAŞARILI] Harika görüşme! Müşteri teklifimizi onayladı.", "success");
        const prices = state.currentNiche ? niches[state.currentNiche].prices : niches['local-service'].prices;
        const gainedRevenue = prices[state.demoCallClientType];
        await term.print(`Yeni Müşteri Edinildi! Aylık Gelir: +$${gainedRevenue.toLocaleString()} eklendi.`, "success");
        if (typeof audioManager !== 'undefined') {
          audioManager.playSFX('dealClose');
        }
        triggerConfetti();
        
        const totalClients = 
          state.clients.trStandard + 
          state.clients.trPremium + 
          state.clients.intStandard + 
          state.clients.intPremium;
        if (totalClients === 1) {
          unlockBadge('first_client');
        }
        if (state.demoCallScore >= 30) {
          unlockBadge('kurt_satıcı');
        }
      } else {
        await term.print("\n[BAŞARISIZ] Görüşme olumsuz sonuçlandı.", "error");
      }

      if (state.demoCallClientType.startsWith('tr')) {
        state.demoQueue.tr = Math.max(0, state.demoQueue.tr - 1);
      } else {
        state.demoQueue.int = Math.max(0, state.demoQueue.int - 1);
      }
      recalculateMRR();
      calculateWorkingHours();
      updateUI();
    }
  }
}

// Handle Level 7 End Game decisions
async function handleEndGameDecision(input) {
  const decision = input.trim().toLowerCase();
  if (decision === 'sustain') {
    await term.print("\n=== YOL 1 SEÇİLDİ: SÜRDÜRÜLEBİLİR BUTİK MODEL ===", "success");
    await term.print("Ajansınızı 30 müşteride sabitlediniz. Birkaç part-time asistan (VA) ile operasyonu tamamen delege ettiniz.", "system");
    await term.print("Haftada sadece 10 saat çalışarak aylık $40,000 MRR net gelir elde ediyorsunuz. Yüksek hayat kalitesi ve finansal özgürlük!", "system");
    await term.print("TEBRİKLER! OYUNU BAŞARIYLA TAMAMLADINIZ.", "success");
    state.gameCompleted = true;
    state.inEndDecision = false;
    disableInput();
  } else if (decision === 'team') {
    await term.print("\n=== YOL 2 SEÇİLDİ: KURUMSAL AJANS BÜYÜMESİ ===", "success");
    await term.print("Yeni tam zamanlı çalışanlar alarak operasyonlarınızı büyüttünüz. 60-80 müşteriye doğru yola çıktınız.", "system");
    await term.print("Aylık cironuz $100,000 cıvarına ulaştı! Artık bir yönetici gibi çalışıyorsunuz, ancak personel yönetimi ve yüksek maaş yükümlülükleri yeni zorluklarınız.", "system");
    await term.print("TEBRİKLER! OYUNU BAŞARIYLA TAMAMLADINIZ.", "success");
    state.gameCompleted = true;
    state.inEndDecision = false;
    disableInput();
  } else if (decision === 'saas') {
    await term.print("\n=== YOL 3 SEÇİLDİ: SAAS PİVOT (YAZILIM DÖNÜŞÜMÜ) ===", "success");
    await term.print("Elinizdeki 30 müşterinin verisini ve sektör bilgisini kullanarak hizmeti 'AI Social Manager' adında bir yazılıma dönüştürdünüz.", "system");
    await term.print("Ajans gelirlerini yazılımı fonlamak için kullandınız. 18 ay sonra yazılımınız 500 aboneye ulaştı ve yüksek çarpanlı bir exit teklifi aldınız!", "system");
    await term.print("TEBRİKLER! OYUNU BAŞARIYLA TAMAMLADINIZ.", "success");
    state.gameCompleted = true;
    state.inEndDecision = false;
    disableInput();
  } else {
    await term.print("Geçersiz karar! Lütfen sustain, team ya da saas yazın.", "error");
  }
}

function disableInput() {
  const inputEl = document.getElementById('terminal-input');
  if (inputEl) {
    inputEl.disabled = true;
    inputEl.placeholder = "Oyun sonlandı.";
  }
}

// Initial Game Setup
window.addEventListener('DOMContentLoaded', () => {
  // Initialize Terminal
  term = new TerminalManager('terminal-output');

  // Initialize AudioManager Visualizer and Button Controllers
  if (typeof audioManager !== 'undefined') {
    audioManager.setVisualizer('audio-viz');

    // BGM Toggle button logic
    const toggleMusicBtn = document.getElementById('toggle-music-btn');
    if (toggleMusicBtn) {
      toggleMusicBtn.addEventListener('click', () => {
        audioManager.resume();
        audioManager.musicEnabled = !audioManager.musicEnabled;
        if (audioManager.musicEnabled) {
          toggleMusicBtn.innerHTML = '<i class="fa-solid fa-music"></i> BGM_ON()';
          toggleMusicBtn.style.color = 'var(--neon-green)';
          toggleMusicBtn.style.textShadow = 'var(--glow-green)';
          audioManager.startMusic();
        } else {
          toggleMusicBtn.innerHTML = '<i class="fa-solid fa-music"></i> BGM_OFF()';
          toggleMusicBtn.style.color = 'var(--neon-blue)';
          toggleMusicBtn.style.textShadow = 'none';
          audioManager.stopMusic();
        }
        audioManager.playSFX('click');
      });
    }

    // SFX Toggle button logic
    const toggleSfxBtn = document.getElementById('toggle-sfx-btn');
    if (toggleSfxBtn) {
      toggleSfxBtn.addEventListener('click', () => {
        audioManager.resume();
        audioManager.sfxEnabled = !audioManager.sfxEnabled;
        if (audioManager.sfxEnabled) {
          toggleSfxBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> SFX_ON()';
          toggleSfxBtn.style.color = 'var(--neon-green)';
          toggleSfxBtn.style.textShadow = 'var(--glow-green)';
        } else {
          toggleSfxBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> SFX_OFF()';
          toggleSfxBtn.style.color = 'var(--neon-blue)';
          toggleSfxBtn.style.textShadow = 'none';
        }
        audioManager.playSFX('click');
      });
    }

    // Resume audio context on any user click or key press to bypass browser autoplay protections
    const resumeAudio = () => {
      audioManager.resume();
      document.removeEventListener('click', resumeAudio);
      document.removeEventListener('keydown', resumeAudio);
    };
    document.addEventListener('click', resumeAudio);
    document.addEventListener('keydown', resumeAudio);
  }

  // Inject Badge notification styles dynamically if not present
  const style = document.createElement('style');
  style.textContent = `
    .badge-toast {
      position: fixed;
      top: -100px;
      right: 20px;
      background: rgba(0, 20, 10, 0.95);
      border: 2px solid #00ff66;
      border-radius: 5px;
      box-shadow: 0 0 20px rgba(0, 255, 102, 0.4);
      color: #fff;
      display: flex;
      padding: 15px;
      width: 320px;
      z-index: 10000;
      transition: top 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      font-family: 'Fira Code', monospace;
    }
    .badge-toast.show {
      top: 20px;
    }
    .badge-icon {
      font-size: 32px;
      margin-right: 15px;
      display: flex;
      align-items: center;
    }
    .badge-title {
      font-size: 11px;
      color: #ffaa00;
      font-weight: bold;
      letter-spacing: 1px;
    }
    .badge-name {
      font-size: 16px;
      color: #00ff66;
      font-weight: bold;
      margin: 3px 0;
    }
    .badge-desc {
      font-size: 12px;
      color: #88c8a0;
    }
    .badge-flash {
      animation: console-blink 0.5s;
    }
    @keyframes console-blink {
      0% { box-shadow: 0 0 10px rgba(0,255,102,0.3); }
      50% { box-shadow: 0 0 30px rgba(0,255,102,0.9); }
      100% { box-shadow: 0 0 10px rgba(0,255,102,0.3); }
    }
    .log-line.system-msg { color: #00e5ff; }
    .log-line.success-msg { color: #00ff66; }
    .log-line.error-msg { color: #ff0055; }
    .log-line.dialogue-msg { color: #ffff00; font-style: italic; }
    .log-line.dialogue-option-msg { color: #ffaa00; padding-left: 15px; }
  `;
  document.head.appendChild(style);

  // Command history variables
  const commandHistory = [];
  let historyIndex = -1;

  // Set up input events
  const inputEl = document.getElementById('terminal-input');
  if (inputEl) {
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = inputEl.value;
        if (val.trim()) {
          commandHistory.push(val);
          historyIndex = commandHistory.length;
        }
        inputEl.value = '';
        parseCommand(val);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          inputEl.value = commandHistory[historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          inputEl.value = commandHistory[historyIndex];
        } else {
          historyIndex = commandHistory.length;
          inputEl.value = '';
        }
      }
    });
  }

  // Click terminal to focus input
  const terminalBody = document.getElementById('terminal-body');
  if (terminalBody && inputEl) {
    terminalBody.addEventListener('click', () => {
      inputEl.focus();
    });
  }

  // Modals event binding
  const levelUpCloseBtn = document.getElementById('level-up-close-btn');
  if (levelUpCloseBtn) {
    levelUpCloseBtn.addEventListener('click', () => {
      const modal = document.getElementById('level-up-modal');
      if (modal) modal.classList.remove('active');
    });
  }

  const viewAllBadgesBtn = document.getElementById('view-all-badges-btn');
  if (viewAllBadgesBtn) {
    viewAllBadgesBtn.addEventListener('click', () => {
      const modal = document.getElementById('badges-modal');
      if (modal) {
        updateFullBadgesGrid();
        modal.classList.add('active');
      }
    });
  }

  const badgesModalClose = document.getElementById('badges-modal-close');
  if (badgesModalClose) {
    badgesModalClose.addEventListener('click', () => {
      const modal = document.getElementById('badges-modal');
      if (modal) modal.classList.remove('active');
    });
  }

  // Ticking Session Time Clock
  let secondsElapsed = 0;
  setInterval(() => {
    secondsElapsed++;
    const hrs = String(Math.floor(secondsElapsed / 3600)).padStart(2, '0');
    const mins = String(Math.floor((secondsElapsed % 3600) / 60)).padStart(2, '0');
    const secs = String(secondsElapsed % 60).padStart(2, '0');
    const timeEl = document.getElementById('session-time');
    if (timeEl) {
      timeEl.textContent = `${hrs}:${mins}:${secs}`;
    }
  }, 1000);

  // CRT Toggle button listener
  const crtBtn = document.getElementById('toggle-crt-btn');
  if (crtBtn) {
    crtBtn.addEventListener('click', () => {
      document.body.classList.toggle('crt-effects');
      crtBtn.textContent = document.body.classList.contains('crt-effects') ? 'CRT_OFF()' : 'CRT_ON()';
    });
  }

  // Welcome message typewriter print
  term.print("=== AI AGENCY TYCOON SIMULATOR ===", "system");
  term.print("Bu simülasyon, aylık $40,000 MRR veya 30 aktif müşteriye ulaşma hedefini temel alır.", "system");
  term.print("KAZANMA KOŞULU: $40K MRR veya 30 müşteri elde edip Level 7 nihai stratejinizi seçmek.", "success");
  term.print("KAYBETME KOŞULLARI: Nakit rezervinizin sıfırın altına düşmesi ($0) veya Burnout oranınızın %100'e ulaşması.", "error");
  term.print("--------------------------------------------------------------------------------", "system");
  term.print("Temel komutlar için 'help', mevcut durum raporu için 'status' yazın.", "system");
  term.print("Level 0: TEMEL aşamasındasınız. Başlamak için 'automate-ops' komutuyla şablonlarınızı hazırlayın.", "system");

  // Initial UI renders
  recalculateMRR();
  calculateWorkingHours();
  updateUI();
  updateMiniBadgesUI();
});
