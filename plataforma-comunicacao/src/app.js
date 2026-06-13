// ══════════════════════════════════════════════════════════════
// CONFIG FIREBASE
// ══════════════════════════════════════════════════════════════
// ──────────────────────────────────────────────────────────────
// 🔐 CONFIGURAÇÃO DO FIREBASE
// Substitua os valores abaixo pelas suas credenciais do Firebase.
// Acesse: https://console.firebase.google.com → Configurações do Projeto → Seus apps
// ──────────────────────────────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey:            "SUA_API_KEY",
  authDomain:        "SEU_PROJECT_ID.firebaseapp.com",
  databaseURL:       "https://SEU_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId:         "SEU_PROJECT_ID",
  storageBucket:     "SEU_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId:             "SEU_APP_ID"
};

// ══════════════════════════════════════════════════════════════
// DEFAULT CONFIG VALUES
// ══════════════════════════════════════════════════════════════
const DEFAULT_SUBJECTS = [
  { name: 'Matemática',            icon: '📐' },
  { name: 'Física',                icon: '⚛️' },
  { name: 'Química',               icon: '🧪' },
  { name: 'Biologia',              icon: '🧬' },
  { name: 'História',              icon: '📜' },
  { name: 'Geografia',             icon: '🌎' },
  { name: 'Português',             icon: '📖' },
  { name: 'Literatura',            icon: '📝' },
  { name: 'Inglês',                icon: '🇬🇧' },
  { name: 'Filosofia',             icon: '🤔' },
  { name: 'Sociologia',            icon: '👥' },
  { name: 'Programação',           icon: '💻' },
  { name: 'Redes',                 icon: '🌐' },
  { name: 'Banco de Dados',        icon: '🗄️' },
  { name: 'Sistemas Operacionais', icon: '🖥️' },
  { name: 'Eletrônica',            icon: '⚡' },
  { name: 'Administração',         icon: '📊' },
  { name: 'Outro',                 icon: '📌' },
];

const DEFAULT_BLOCKED_WORDS = ['fdp','vsf','pqp','krl','imbecil','cretino'];

const BADGE_CHECKS = {
  first_post:   u => u && (u.postCount||0)   >= 1,
  writer:       u => u && (u.postCount||0)   >= 10,
  popular:      u => u && (u.totalLikesRcv||0) >= 100,
  messenger:    u => u && (u.msgCount||0)    >= 50,
  super_msg:    u => u && (u.msgCount||0)    >= 1000,
  veteran:      u => u && (Date.now()-(u.created||0)) > 30*864e5,
  collaborator: u => u && (u.commentCount||0) >= 20,
  early_bird:   u => u && (u.memberNumber||999) <= 10,
};

const DEFAULT_BADGES = [
  { id:'first_post',   icon:'🌱', name:'Primeiro Post',    desc:'Publicou o primeiro post'       },
  { id:'writer',       icon:'📝', name:'Escritor',         desc:'10 posts publicados'             },
  { id:'popular',      icon:'❤️', name:'Popular',          desc:'100 curtidas recebidas'          },
  { id:'messenger',    icon:'💬', name:'Mensageiro',       desc:'50 mensagens enviadas'           },
  { id:'super_msg',    icon:'📡', name:'Super Mensageiro', desc:'1000 mensagens enviadas'         },
  { id:'veteran',      icon:'🎓', name:'Veterano',         desc:'Membro há mais de 30 dias'      },
  { id:'collaborator', icon:'🤝', name:'Colaborador',      desc:'Comentou em 20 posts'           },
  { id:'early_bird',   icon:'🌅', name:'Pioneiro',         desc:'Um dos primeiros 10 membros'    },
];

const DEFAULT_CAMPUSES = [
  'João Pessoa','Campina Grande','Cabedelo','Cajazeiras','Guarabira',
  'Monteiro','Patos','Picuí','Princesa Isabel','Sousa','Itaporanga',
  'Esperança','Catolé do Rocha','Santa Rita','Areia'
];

const DEFAULT_COURSES = [
  {group:'Edificações', name:'Edificações (Matutino)'},
  {group:'Edificações', name:'Edificações (Vespertino)'},
  {group:'Edificações', name:'Edificações Superior'},
  {group:'Informática', name:'Informática para Internet (Matutino)'},
  {group:'Informática', name:'Informática para Internet (Vespertino)'},
  {group:'Informática', name:'Redes de Computadores'},
  {group:'Outros',      name:'Administração'},
  {group:'Outros',      name:'Agropecuária'},
  {group:'Outros',      name:'Outro'},
];

// Domínios de e-mail institucionais (IFPB e similares)
const INSTITUTIONAL_EMAIL_DOMAINS = [
  '@ifpb.edu.br','@ifce.edu.br','@ifpe.edu.br','@ifba.edu.br',
  '@ifsc.edu.br','@ifs.edu.br','@ifmt.edu.br','@ifrn.edu.br',
  '@ifal.edu.br','@ifam.edu.br','@ifap.edu.br','@ifma.edu.br',
  '@ifmg.edu.br','@ifms.edu.br','@ifpa.edu.br','@ifpi.edu.br',
  '@ifrr.edu.br','@ifro.edu.br','@ifrs.edu.br','@ifsp.edu.br',
  '@ifto.edu.br','@if','@edu.br'
];

// ── CONFIG GLOBAL ──
let CONFIG = {
  subjects:     DEFAULT_SUBJECTS,
  blockedWords: DEFAULT_BLOCKED_WORDS,
  badges:       DEFAULT_BADGES,
  campuses:     DEFAULT_CAMPUSES,
  courses:      DEFAULT_COURSES,
};

function getBadgeDefs() {
  return CONFIG.badges.map(b => ({
    ...b,
    check: BADGE_CHECKS[b.id] || (() => false),
  }));
}

const GROUP_EMOJIS = ['👥','📚','🎓','🏫','💡','🔬','🎨','⚽','🎮','🎵','🏆','🌱','💻','📐','🔧'];

// ══════════════════════════════════════════════════════════════
// GLOBALS
// ══════════════════════════════════════════════════════════════
let CU = null, imgData = null, chatWith = null, DB = null, AUTH = null;
let feedListener = null, currentFeedTab = 'all', currentExploreFilter = 'all';
let currentChatTab = 'dm', pendingRegData = null, resetPwdStep = 1, resetPwdEmail = '';
let handleTimeout = null, emailCheckTimeout = null;
let groupChatWith = null, groupMsgListener = null, currentGroupId = null;
let selectedGroupMembers = [], selectedGroupEmoji = '👥';
let selectedGroupPhoto = null, editGroupPhotoData = null;
let newProfilePhotoData = null, newProfileBgData = null, removeBgFlag = false;
let usersCache = {};
let currentAdminTab = 'db', currentAdminConfigSection = 'subjects';
let adminRoleTargetUid = null;
// Filtro de período para abas popular/relevante
let currentPeriodFilter = 'all';

const pageCache = {feed:false, explore:false, profile:false, chat:false, notices:false, resumos:false, schedules:false, labs:false};

let currentSubject   = null;
let resumoImgData    = null;
let resumoFilterType = 'all';
let resumoListener   = null;

// ══════════════════════════════════════════════════════════════
// LOADING BAR — feedback visual de requisições
// ══════════════════════════════════════════════════════════════
let _loadingCount = 0;
let _loadingTimer = null;
let _loadingWatchdog = null;

/** Inicia a barra de progresso */
function loadingStart() {
  _loadingCount++;
  const bar = document.getElementById('loading-bar');
  if (!bar) return;
  clearTimeout(_loadingTimer);
  // Watchdog: force-finaliza após 8s para evitar travamento permanente
  clearTimeout(_loadingWatchdog);
  _loadingWatchdog = setTimeout(() => {
    _loadingCount = 0;
    _forceHideBar();
  }, 8000);
  bar.style.transition = 'none';
  bar.style.width = '0';
  bar.style.opacity = '';
  bar.classList.add('active');
  requestAnimationFrame(() => { bar.style.transition = 'width 1.2s ease'; bar.style.width = '85%'; });
}

function _forceHideBar() {
  const bar = document.getElementById('loading-bar');
  if (!bar) return;
  clearTimeout(_loadingTimer);
  clearTimeout(_loadingWatchdog);
  bar.style.transition = 'width .2s ease';
  bar.style.width = '100%';
  _loadingTimer = setTimeout(() => {
    bar.style.opacity = '0';
    setTimeout(() => { bar.style.width = '0'; bar.classList.remove('active'); bar.style.opacity = ''; }, 400);
  }, 200);
}

/** Finaliza a barra de progresso */
function loadingDone() {
  _loadingCount = Math.max(0, _loadingCount - 1);
  if (_loadingCount > 0) return;
  clearTimeout(_loadingWatchdog);
  _forceHideBar();
}

/**
 * Wrapper de DB.ref(...).once('value') com loading bar automático.
 * Uso: const snap = await dbGet('users/uid');
 */
async function dbGet(path) {
  loadingStart();
  try { return await DB.ref(path).once('value'); }
  finally { loadingDone(); }
}

// ══════════════════════════════════════════════════════════════
// SECURITY: PASSWORD HASHING
// ══════════════════════════════════════════════════════════════
async function hashPassword(pwd) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(pwd));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

// ══════════════════════════════════════════════════════════════
// FIREBASE INIT
// ══════════════════════════════════════════════════════════════
function loadScript(src){ return new Promise(r=>{ const s=document.createElement('script'); s.src=src; s.onload=r; document.head.appendChild(s); }); }

async function initFB(){
  await loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
  await loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js');
  await loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js');
  firebase.initializeApp(FIREBASE_CONFIG);
  DB   = firebase.database();
  AUTH = firebase.auth();
  AUTH.languageCode = 'pt-BR';
  await loadConfig();
}

async function ensureRolesAuth(){
  if(!CU || CU.role !== 'admin') return;
  try {
    const snap = await dbGet('rolesAuth');
    if(!snap.val()){
      // 🔐 Defina aqui as senhas iniciais de professor e admin.
      // Estas senhas serão gravadas (com hash) no Firebase na primeira execução como admin.
      // Após subir, troque-as diretamente no Firebase Console em: rolesAuth → p / a
      const ph = await hashPassword('SENHA_INICIAL_PROFESSOR');
      const ah = await hashPassword('SENHA_INICIAL_ADMIN');
      await DB.ref('rolesAuth').set({ p: ph, a: ah });
      toast('⚠️ Códigos de cargo inicializados com senhas padrão. Troque-os no Firebase Console!');
    }
  } catch(e) { console.error('ensureRolesAuth error:', e.message); }
}

// ══════════════════════════════════════════════════════════════
// CONFIG
// ══════════════════════════════════════════════════════════════
async function loadConfig(){
  try {
    const snap = await dbGet('config');
    const cfg = snap.val();
    if(cfg){
      if(cfg.subjects     && cfg.subjects.length)     CONFIG.subjects     = cfg.subjects;
      if(cfg.blockedWords && cfg.blockedWords.length)  CONFIG.blockedWords = cfg.blockedWords;
      if(cfg.campuses     && cfg.campuses.length)      CONFIG.campuses     = cfg.campuses;
      if(cfg.courses      && cfg.courses.length)       CONFIG.courses      = cfg.courses;
      if(cfg.badges       && cfg.badges.length)        CONFIG.badges       = cfg.badges;
    } else if(AUTH.currentUser) {
      await DB.ref('config').set({
        subjects: DEFAULT_SUBJECTS, blockedWords: DEFAULT_BLOCKED_WORDS,
        campuses: DEFAULT_CAMPUSES, courses: DEFAULT_COURSES, badges: DEFAULT_BADGES,
      });
    }
  } catch(e){ console.warn('loadConfig: usando defaults locais.', e.message); }
  populateCampusSelects();
  populateCourseSelects();
}

async function saveConfigSection(key, value){
  if(!CU || CU.role !== 'admin'){ toast('⛔ Sem permissão.'); return; }
  CONFIG[key] = value;
  await DB.ref('config/' + key).set(value);
  if(key === 'campuses') populateCampusSelects();
  if(key === 'courses')  populateCourseSelects();
}

function populateCampusSelects(){
  const opts = ['<option value="">Selecione seu campus...</option>',
    ...CONFIG.campuses.map(c => `<option>${escH(c)}</option>`)].join('');
  ['rcampus','ep-campus'].forEach(id => {
    const el = document.getElementById(id);
    if(el){ const v = el.value; el.innerHTML = opts; el.value = v; }
  });
}

function populateCourseSelects(){
  const groups = {};
  CONFIG.courses.forEach(c => {
    if(!groups[c.group]) groups[c.group] = [];
    groups[c.group].push(c.name);
  });
  const opts = ['<option value="">Selecione seu curso...</option>',
    ...Object.entries(groups).map(([g, names]) =>
      `<optgroup label="${escH(g)}">${names.map(n => `<option>${escH(n)}</option>`).join('')}</optgroup>`)
  ].join('');
  ['rc','ep-course'].forEach(id => {
    const el = document.getElementById(id);
    if(el){ const v = el.value; el.innerHTML = opts; el.value = v; }
  });
}

// ══════════════════════════════════════════════════════════════
// USERS CACHE
// ══════════════════════════════════════════════════════════════
async function loadUsersCache(){
  const snap = await dbGet('users');
  usersCache = {};
  snap.forEach(c => { const u = c.val(); usersCache[u.uid] = u; });
}

function getPhoto(uid, fallbackPhoto){
  const cached = usersCache[uid];
  if(cached && cached.photo) return cached.photo;
  return fallbackPhoto || '';
}

// ══════════════════════════════════════════════════════════════
// FIREBASE SNAPSHOT HELPERS
// ══════════════════════════════════════════════════════════════
function snapshotToArray(snapshot){
  const result = [];
  snapshot.forEach(child => { result.push(child.val()); });
  return result;
}
function snapshotToArrayDesc(snapshot){ return snapshotToArray(snapshot).reverse(); }

// ══════════════════════════════════════════════════════════════
// MODULE: AUTH
// ══════════════════════════════════════════════════════════════
function stab(t){
  document.querySelectorAll('.tab').forEach((x,i)=>x.classList.toggle('on',(t==='login'&&i===0)||(t==='reg'&&i===1)));
  document.getElementById('lf').style.display  = t==='login' ? '' : 'none';
  document.getElementById('rf').style.display  = t==='reg'   ? '' : 'none';
  document.getElementById('rpf').style.display = t==='reset' ? '' : 'none';
  document.getElementById('atitle').textContent = t==='login'?'Bem-vindo de volta 👋':t==='reset'?'Recuperar senha 🔑':'Crie sua conta 🎓';
  document.getElementById('asub').textContent   = t==='login'?'Entre na sua conta para continuar':t==='reset'?'Informe seu e-mail cadastrado':'Junte-se à comunidade IFConnect';
}

function showResetPwd(){
  stab('reset');
  document.getElementById('rpe').value = '';
  document.getElementById('rp-btn').style.display = 'block';
  document.getElementById('rp-btn').textContent   = 'Enviar link de recuperação';
  document.getElementById('rp-code-box').style.display = 'none';
  document.getElementById('rp-code-box').innerHTML = '';
  hi('rperr');
}

function onRoleChange(){
  const role = document.getElementById('rrole').value;
  const box  = document.getElementById('role-code-box');
  box.style.display = (role==='professor'||role==='admin') ? 'block' : 'none';
  document.getElementById('role-code-label').textContent = role==='professor'?'🔐 Código de Professor':'🔐 Código de Admin';
  document.getElementById('rrcode').value = '';
}

async function validateRoleCode(input, role) {
  if (!input || !role) return false;
  const keyMap = { professor: 'p', admin: 'a' };
  const firebaseKey = keyMap[role];
  if (!firebaseKey) return false;
  const hashedInput = await hashPassword(input);
  try {
    const snap = await dbGet(`rolesAuth/${firebaseKey}`);
    const officialHash = snap.val();
    if (!officialHash) return false;
    return hashedInput === officialHash;
  } catch (e) { console.error('Erro ao validar código:', e); return false; }
}

// ── Verificação de email institucional ──────────────────────
/**
 * Detecta se o email digitado parece ser institucional (domínio @if...).
 * Exibe aviso mas NÃO bloqueia o cadastro — apenas alerta.
 */
function isInstitutionalEmail(email) {
  if (!email || !email.includes('@')) return false;
  const lower = email.toLowerCase();
  return INSTITUTIONAL_EMAIL_DOMAINS.some(d => lower.includes(d));
}

// ── Handle check ─────────────────────────────────────────────
let _handleAnon = null;

function checkHandle(){
  clearTimeout(handleTimeout);
  const h = document.getElementById('rh').value.trim().toLowerCase().replace(/[^a-z0-9_]/g,'');
  document.getElementById('rh').value = h;
  const el = document.getElementById('hcheck');
  if(!h){ el.textContent=''; return; }

  if(AUTH && AUTH.currentUser && !AUTH.currentUser.isAnonymous){
    el.textContent='⏳ Verificando...'; el.className='handle-check';
    handleTimeout = setTimeout(async()=>{
      try{
        const snap = await DB.ref('users').orderByChild('handle').equalTo(h).once('value');
        if(snap.val()){ el.textContent='❌ @'+h+' já em uso';    el.className='handle-check handle-err'; }
        else           { el.textContent='✅ @'+h+' disponível'; el.className='handle-check handle-ok';  }
      }catch(e){ el.textContent=''; }
    }, 600);
    return;
  }

  if(h.length < 3){ el.textContent=''; return; }
  el.textContent='⏳ Verificando...'; el.className='handle-check';
  handleTimeout = setTimeout(()=> _checkHandleAnon(h, el), 700);
}

async function _checkHandleAnon(handle, displayEl){
  // Cancela qualquer anônimo anterior
  if(_handleAnon){
    const prev = _handleAnon; _handleAnon = null;
    try{ await prev.delete(); }catch(_){} 
  }
  let anonRef = null;
  try{
    const cred = await AUTH.signInAnonymously();
    anonRef = cred.user;
    _handleAnon = anonRef;
    const snap = await DB.ref('users').orderByChild('handle').equalTo(handle).once('value');
    if(snap.val()){ displayEl.textContent='❌ @'+handle+' já em uso';    displayEl.className='handle-check handle-err'; }
    else           { displayEl.textContent='✅ @'+handle+' disponível'; displayEl.className='handle-check handle-ok';  }
  }catch(e){ displayEl.textContent=''; }
  finally{
    // Sempre deleta o anônimo, independente de erro
    const toDelete = anonRef;
    _handleAnon = null;
    if(toDelete){
      try{ await toDelete.delete(); }catch(_){}
    }
  }
}

// ── E-mail check ─────────────────────────────────────────────
function checkEmail(){
  clearTimeout(emailCheckTimeout);
  const email = document.getElementById('re').value.trim().toLowerCase();
  const el    = document.getElementById('echeck');
  const warnEl = document.getElementById('inst-email-warn');

  // Aviso de email institucional
  if(warnEl){
    warnEl.classList.toggle('visible', isInstitutionalEmail(email));
  }

  if(!el) return;
  if(!email || !email.includes('@') || !email.includes('.')){ el.textContent=''; return; }
  el.textContent='⏳ Verificando...'; el.className='handle-check';
  emailCheckTimeout = setTimeout(async()=>{
    try{
      // Consulta direta ao nó de usuários — evita false-positive do fetchSignInMethods
      const snap = await DB.ref('users').orderByChild('email').equalTo(email).once('value');
      if(snap.val()){
        el.textContent='❌ E-mail já cadastrado.';
        el.className='handle-check handle-err';
      } else {
        el.textContent='✅ E-mail disponível';
        el.className='handle-check handle-ok';
      }
    }catch(e){
      // Se não tiver permissão para consultar, tenta via Auth
      try {
        const methods = await AUTH.fetchSignInMethodsForEmail(email);
        if(methods && methods.length > 0){
          el.textContent='❌ E-mail já cadastrado.';
          el.className='handle-check handle-err';
        } else {
          el.textContent='✅ E-mail disponível';
          el.className='handle-check handle-ok';
        }
      } catch(e2) {
        if(e2.code==='auth/invalid-email'){
          el.textContent='❌ E-mail inválido.';
          el.className='handle-check handle-err';
        } else { el.textContent=''; }
      }
    }
  }, 700);
}

async function checkHandleEdit(){
  const h = document.getElementById('ep-handle').value.trim().toLowerCase().replace(/[^a-z0-9_]/g,'');
  document.getElementById('ep-handle').value = h;
  const el = document.getElementById('hcheck-edit');
  if(!h||h===CU.handle){el.textContent='';return;}
  const snap = await DB.ref('users').orderByChild('handle').equalTo(h).once('value');
  if(snap.val()){el.textContent='❌ Já em uso';el.className='handle-check handle-err';}
  else{el.textContent='✅ Disponível';el.className='handle-check handle-ok';}
}

async function doLogin(){
  let login = gv('le').trim().toLowerCase();
  const pass = gv('lp');
  hi('lerr');

  try{
    let email = login;

    if(login.startsWith('@') || !login.includes('@')){
      const handle = login.replace(/^@/,'');
      let anonUser = null;
      let foundEmail = '';
      try {
        const anonCred = await AUTH.signInAnonymously();
        anonUser = anonCred.user;
        const snap = await DB.ref('users').orderByChild('handle').equalTo(handle).once('value');
        if(snap.val()) foundEmail = Object.values(snap.val())[0].email;
      } finally {
        // Deleta (não apenas desloga) o anônimo para não poluir o Auth
        if(anonUser){ try{ await anonUser.delete(); }catch(_){ try{ await AUTH.signOut(); }catch(_){} } }
      }
      if(!foundEmail){ sh('lerr'); return; }
      email = foundEmail;
    }

    const cred = await AUTH.signInWithEmailAndPassword(email, pass);

    if(!cred.user.emailVerified){
      const snap = await dbGet('users/'+cred.user.uid);
      if(snap.val()){ showVerifyScreen(snap.val()); }
      else { toast('Verifique seu email antes de entrar. Cheque também a pasta spam.'); await AUTH.signOut(); }
      return;
    }

    const snap = await dbGet('users/'+cred.user.uid);
    if(!snap.val()){ sh('lerr'); return; }

    await DB.ref('users/'+cred.user.uid+'/emailVerified').set(true);
    startApp(snap.val());

  }catch(e){
    if(e.code && e.code.startsWith('auth/')){ sh('lerr'); }
    else { toast('Erro de conexão: '+e.message); }
  }
}

async function doReg(){
  clearTimeout(handleTimeout);
  clearTimeout(emailCheckTimeout);
  if(_handleAnon){
    const prev = _handleAnon; _handleAnon = null;
    try{ await prev.delete(); }catch(_){}
  }

  const name   = gv('rn').trim();
  const handle = gv('rh').trim().toLowerCase().replace(/[^a-z0-9_]/g,'');
  const email  = gv('re').trim().toLowerCase();
  const campus = gv('rcampus');
  const course = gv('rc');
  const role   = gv('rrole');
  const code   = gv('rrcode');
  const pass   = gv('rp');
  const err    = document.getElementById('rerr');

  if(!name||!handle||!email||!campus||!pass||pass.length<6){
    err.textContent='Preencha todos os campos obrigatórios (senha mín. 6 chars).';sh('rerr');return;
  }
  if((role==='professor'||role==='admin')&&!code){
    err.textContent='Insira o código de autorização para este cargo.';sh('rerr');return;
  }

  // Validação de domínio permitido (configurado pelo admin)
  await loadAllowedDomains();
  const domainOk = await isEmailDomainAllowed(email);
  if (!domainOk && _allowedDomains.length) {
    err.textContent = `❌ E-mail "${email}" não é de um domínio permitido. Use um e-mail institucional do IFPB.`;
    sh('rerr'); return;
  }

  // Aviso (não bloqueio) para email institucional
  if(isInstitutionalEmail(email)){
    const continuar = confirm(
      '⚠️ E-mail institucional detectado!\n\n' +
      'E-mails @if... frequentemente NÃO recebem e-mails de verificação ou os movem para spam, ' +
      'podendo impedir a conclusão do cadastro.\n\n' +
      'Recomendamos usar um e-mail pessoal (Gmail, Hotmail, etc.).\n\n' +
      'Deseja continuar mesmo assim?'
    );
    if(!continuar) return;
  }

  // Pré-checagem via anon sign-in
  let preCheckOk = false;
  let anonRegUser = null;
  try{
    const anonCred = await AUTH.signInAnonymously();
    anonRegUser = anonCred.user;
    try{
      const hs = await DB.ref('users').orderByChild('handle').equalTo(handle).once('value');
      if(hs.val()){
        err.textContent='❌ @'+handle+' já está em uso. Escolha outro nome de usuário.';
        sh('rerr'); return;
      }
      if(role==='professor'||role==='admin'){
        const valid = await validateRoleCode(code, role);
        if(!valid){ err.textContent='Código de autorização incorreto.'; sh('rerr'); return; }
      }
      preCheckOk = true;
    }finally{
      // Sempre deleta o anônimo — nunca apenas signOut
      try{ await anonRegUser.delete(); }catch(_){ try{ await AUTH.signOut(); }catch(_){} }
      anonRegUser = null;
    }
  }catch(e){
    if(anonRegUser){ try{ await anonRegUser.delete(); }catch(_){ try{ await AUTH.signOut(); }catch(_){} } }
    if(!preCheckOk){
      err.textContent='Erro na verificação: ' + (e.message || 'Tente novamente.');
      sh('rerr'); return;
    }
  }

  let cred = null;
  try{
    cred = await AUTH.createUserWithEmailAndPassword(email, pass);
  }catch(e){
    if(e.code==='auth/email-already-in-use') err.textContent='❌ Este e-mail já possui uma conta cadastrada.';
    else if(e.code==='auth/weak-password')   err.textContent='Senha fraca. Use ao menos 6 caracteres.';
    else if(e.code==='auth/invalid-email')   err.textContent='E-mail inválido.';
    else err.textContent='Erro ao criar conta: '+(e.message||'');
    sh('rerr'); return;
  }

  const uid = cred.user.uid;
  try{
    await cred.user.sendEmailVerification();
    const u = {
      uid, name, handle, email, course, campus, role,
      bio:'', photo:'', profileBg:'', bannerColor: colorFromRole(role),
      created: Date.now(), emailVerified: false,
      memberNumber: Date.now(), postCount:0, msgCount:0, commentCount:0
    };
    hi('rerr');
    showVerifyScreen(u);
  }catch(e){
    try{ await cred.user.delete(); }catch(_){}
    err.textContent='Erro ao configurar conta: '+(e.message||'');
    sh('rerr');
  }
}

function colorFromRole(role){ return role==='admin'?'#C8102E':role==='professor'?'#F59E0B':'#00A859'; }

// ── Persistência do registro ──────────────────────────────────
const PENDING_REG_KEY = 'ifc_pending_reg';
function _savePendingReg(u){ try{ sessionStorage.setItem(PENDING_REG_KEY, JSON.stringify(u)); }catch(_){} }
function _loadPendingReg(){ try{ const s=sessionStorage.getItem(PENDING_REG_KEY); return s?JSON.parse(s):null; }catch(_){ return null; } }
function _clearPendingReg(){ try{ sessionStorage.removeItem(PENDING_REG_KEY); }catch(_){} }

function showVerifyScreen(u){
  pendingRegData = u;
  _savePendingReg(u);
  document.getElementById('verify-email-show').textContent = u.email;
  document.getElementById('auth').style.display   = 'none';
  document.getElementById('app').style.display    = 'none';
  document.getElementById('splash').style.display = 'none';
  document.getElementById('verify-screen').style.display = 'flex';
}

async function doVerify(){
  const user = AUTH.currentUser;
  if(!user){
    document.getElementById('verify-screen').style.display = 'none';
    document.getElementById('auth').style.display = 'flex';
    stab('login'); return;
  }
  await user.reload();
  if(user.emailVerified){
    const existing = await dbGet('users/'+user.uid);
    if(existing.val()){
      await DB.ref('users/'+user.uid+'/emailVerified').set(true);
      _clearPendingReg();
      document.getElementById('verify-screen').style.display = 'none';
      startApp(existing.val());
    } else {
      if(!pendingRegData) pendingRegData = _loadPendingReg();
      if(pendingRegData){
        const u = { ...pendingRegData, emailVerified: true };
        await DB.ref('users/'+user.uid).set(u);
        pendingRegData = null;
        _clearPendingReg();
        document.getElementById('verify-screen').style.display = 'none';
        startApp(u);
      } else {
        toast('Sessão expirada. Se sua conta foi criada, faça login.');
        await AUTH.signOut();
        document.getElementById('verify-screen').style.display = 'none';
        document.getElementById('auth').style.display = 'flex';
        stab('login');
      }
    }
  } else {
    const verr = document.getElementById('verr');
    verr.textContent = 'Email ainda não verificado. Clique no link que enviamos e tente novamente.';
    verr.style.display = 'block';
  }
}

async function resendCode(){
  const user = AUTH.currentUser;
  if(!user){ toast('Sessão expirada. Faça login novamente.'); return; }
  try{ await user.sendEmailVerification(); toast('📧 Link de verificação reenviado!'); }
  catch(e){ toast('Aguarde alguns minutos antes de reenviar.'); }
}

async function doResetStep(){
  const email = document.getElementById('rpe').value.trim().toLowerCase();
  if(!email){ toast('Digite um e-mail.'); return; }
  try{
    await AUTH.sendPasswordResetEmail(email);
    hi('rperr');
    document.getElementById('rp-code-box').style.display = 'block';
    document.getElementById('rp-code-box').innerHTML = `
      <div style="text-align:center;padding:16px;background:var(--s2);border-radius:var(--rs)">
        <div style="font-size:36px;margin-bottom:8px">📧</div>
        <div style="font-weight:600;margin-bottom:6px">Link enviado!</div>
        <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:10px 12px;margin-bottom:10px;font-size:13px;color:#856404;text-align:left">
          ⚠️ <strong>VERIFIQUE A PASTA SPAM / LIXO ELETRÔNICO!</strong><br>
          Emails do IFConnect <strong>quase sempre são filtrados como spam</strong>.
        </div>
        <div style="font-size:13px;color:var(--t2);line-height:1.6">
          Se <strong>${escH(email)}</strong> estiver cadastrado, o link chegará em breve.
        </div>
      </div>`;
    document.getElementById('rp-btn').style.display = 'none';
  }catch(e){
    if(e.code==='auth/too-many-requests'){ toast('Muitas tentativas. Aguarde alguns minutos.'); }
    else {
      document.getElementById('rp-code-box').style.display = 'block';
      document.getElementById('rp-code-box').innerHTML = `
        <div style="text-align:center;padding:16px;background:var(--s2);border-radius:var(--rs)">
          <div style="font-size:36px;margin-bottom:8px">📧</div>
          <div style="font-size:13px;color:var(--t2)">Se <strong>${escH(email)}</strong> estiver cadastrado, um link de redefinição será enviado. Verifique o spam.</div>
        </div>`;
      document.getElementById('rp-btn').style.display = 'none';
    }
  }
}

// ══════════════════════════════════════════════════════════════
// MODULE: LOGIN COM GOOGLE
// ══════════════════════════════════════════════════════════════
async function doGoogleLogin() {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result   = await AUTH.signInWithPopup(provider);
    const fbUser   = result.user;

    const snap = await dbGet('users/' + fbUser.uid);
    if (snap.val()) {
      const u = snap.val();
      const statusSnap = await dbGet('users/' + fbUser.uid + '/status');
      const statusData = statusSnap.val();
      if (statusData) {
        if (statusData.type === 'banned') { showBanScreen('banned', u, statusData); return; }
        if (statusData.type === 'timeout' && statusData.until > Date.now()) { showBanScreen('timeout', u, statusData); return; }
      }
      startApp(u);
    } else {
      _googlePendingUser = {
        uid:   fbUser.uid,
        name:  fbUser.displayName || '',
        email: fbUser.email       || '',
        photo: fbUser.photoURL    || '',
      };
      _openGoogleProfileModal();
    }
  } catch (e) {
    if (e.code === 'auth/popup-closed-by-user') return;
    toast('Erro ao entrar com Google: ' + (e.message || e.code));
  }
}

let _googlePendingUser = null;
let _gHandleTimeout    = null;

function _openGoogleProfileModal() {
  const campusEl = document.getElementById('g-campus');
  const courseEl = document.getElementById('g-course');
  if (campusEl) {
    campusEl.innerHTML = '<option value="">Selecione seu campus...</option>' +
      CONFIG.campuses.map(c => `<option>${escH(c)}</option>`).join('');
  }
  if (courseEl) {
    const groups = {};
    CONFIG.courses.forEach(c => { if (!groups[c.group]) groups[c.group] = []; groups[c.group].push(c.name); });
    courseEl.innerHTML = '<option value="">Selecione seu curso...</option>' +
      Object.entries(groups).map(([g, names]) =>
        `<optgroup label="${escH(g)}">${names.map(n => `<option>${escH(n)}</option>`).join('')}</optgroup>`
      ).join('');
  }
  const handleEl = document.getElementById('g-handle');
  if (handleEl && _googlePendingUser) {
    const suggested = (_googlePendingUser.name || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_]/g, '').slice(0, 20);
    handleEl.value = suggested;
    checkHandleGoogle();
  }
  const errEl = document.getElementById('g-err');
  if (errEl) { errEl.textContent = ''; errEl.style.display = 'none'; }
  document.getElementById('google-profile-modal').style.display = 'flex';
}

function checkHandleGoogle() {
  clearTimeout(_gHandleTimeout);
  const h  = document.getElementById('g-handle').value.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
  document.getElementById('g-handle').value = h;
  const el = document.getElementById('g-hcheck');
  if (!h || h.length < 3) { el.textContent = ''; return; }
  el.textContent = '⏳ Verificando...'; el.className = 'handle-check';
  _gHandleTimeout = setTimeout(async () => {
    try {
      const snap = await DB.ref('users').orderByChild('handle').equalTo(h).once('value');
      if (snap.val()) { el.textContent = '❌ @' + h + ' já em uso';    el.className = 'handle-check handle-err'; }
      else            { el.textContent = '✅ @' + h + ' disponível'; el.className = 'handle-check handle-ok'; }
    } catch (_) { el.textContent = ''; }
  }, 600);
}

function onGoogleRoleChange() {
  const role = document.getElementById('g-role').value;
  const box  = document.getElementById('g-role-code-box');
  box.style.display = (role === 'professor' || role === 'admin') ? 'block' : 'none';
  document.getElementById('g-role-code-label').textContent = role === 'professor' ? '🔐 Código de Professor' : '🔐 Código de Admin';
  document.getElementById('g-rcode').value = '';
}

async function saveGoogleProfile() {
  const handle = (document.getElementById('g-handle').value || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
  const campus = document.getElementById('g-campus').value;
  const course = document.getElementById('g-course').value || '';
  const role   = document.getElementById('g-role').value;
  const code   = (document.getElementById('g-rcode').value || '').trim();
  const errEl  = document.getElementById('g-err');
  const showErr = msg => { errEl.textContent = msg; errEl.style.display = 'block'; };

  if (!handle || handle.length < 3)  { showErr('Escolha um @usuário com pelo menos 3 caracteres.'); return; }
  if (!campus)                        { showErr('Selecione seu campus.'); return; }
  if ((role === 'professor' || role === 'admin') && !code) { showErr('Insira o código de autorização para este cargo.'); return; }

  if (role === 'professor' || role === 'admin') {
    const valid = await validateRoleCode(code, role);
    if (!valid) { showErr('Código de autorização incorreto.'); return; }
  }

  const hSnap = await DB.ref('users').orderByChild('handle').equalTo(handle).once('value');
  if (hSnap.val()) { showErr('❌ @' + handle + ' já está em uso. Escolha outro.'); return; }

  if (!_googlePendingUser) { toast('Sessão expirada. Tente novamente.'); return; }

  const u = {
    uid: _googlePendingUser.uid, name: _googlePendingUser.name,
    handle, email: _googlePendingUser.email, photo: _googlePendingUser.photo,
    profileBg: '', bannerColor: colorFromRole(role),
    campus, course, role, bio: '', created: Date.now(),
    emailVerified: true, memberNumber: Date.now(),
    postCount: 0, msgCount: 0, commentCount: 0,
  };

  try {
    await DB.ref('users/' + u.uid).set(u);
    document.getElementById('google-profile-modal').style.display = 'none';
    _googlePendingUser = null;
    startApp(u);
  } catch (e) { showErr('Erro ao salvar perfil: ' + e.message); }
}

function checkSession(){
  return new Promise(resolve => {
    const unsubscribe = AUTH.onAuthStateChanged(async (user) => {
      unsubscribe();
      if(user){
        try{
          const snap = await dbGet('users/'+user.uid);
          if(snap.val()){
            const u = snap.val();
            if(!user.emailVerified){
              pendingRegData = u; _savePendingReg(u);
              document.getElementById('splash').style.display = 'none';
              showVerifyScreen(u); resolve(true);
            } else {
              _clearPendingReg();
              await startApp(u); resolve(true);
            }
          } else {
            if(!pendingRegData) pendingRegData = _loadPendingReg();
            if(!user.emailVerified){
              document.getElementById('splash').style.display = 'none';
              if(!pendingRegData){
                toast('Sessão de cadastro expirada. Por favor, crie sua conta novamente.');
                await AUTH.signOut(); resolve(false);
              } else { showVerifyScreen(pendingRegData); resolve(true); }
            } else {
              document.getElementById('splash').style.display = 'none';
              if(pendingRegData){ showVerifyScreen(pendingRegData); resolve(true); }
              else { _clearPendingReg(); await AUTH.signOut(); resolve(false); }
            }
          }
        }catch(e){
          console.error('checkSession DB error:', e.message);
          document.getElementById('splash').style.display = 'none';
          document.getElementById('auth').style.display = 'flex';
          resolve(false);
        }
      } else { resolve(false); }
    });
  });
}

function doLogout(){
  try { setOnlineStatus(false); } catch(_) {}
  AUTH.signOut();
  CU = null; usersCache = {};
  _clearPendingReg(); pendingRegData = null;
  clearTimeout(handleTimeout); clearTimeout(emailCheckTimeout);
  _handleAnon = null;
  Object.keys(pageCache).forEach(k => pageCache[k]=false);
  if(feedListener)    { feedListener();     feedListener     = null; }
  if(_dmListener)     { _dmListener();      _dmListener      = null; }
  if(groupMsgListener){ groupMsgListener(); groupMsgListener = null; }
  if(resumoListener)  { resumoListener();   resumoListener   = null; }
  if(_unreadListener) { _unreadListener();  _unreadListener  = null; }
  currentGroupId = null; currentSubject = null; resumoImgData = null; resumoFilterType = 'all';
  document.getElementById('app').style.display  = 'none';
  document.getElementById('auth').style.display = 'flex';
  stab('login');
}

// ══════════════════════════════════════════════════════════════
// MODULE: ROLE PERMISSIONS
// ══════════════════════════════════════════════════════════════
function applyRolePermissions(){ handleRolePermissions(CU.role); }

function handleRolePermissions(role){
  const isAdmin = role==='admin';
  const modNav       = document.getElementById('bn-moderation');
  const adminDbNav   = document.getElementById('bn-admin-db');
  const noticesComposer = document.getElementById('notices-composer');
  if(modNav)          modNav.style.display    = isAdmin ? 'flex' : 'none';
  if(adminDbNav)      adminDbNav.style.display= isAdmin ? 'flex' : 'none';
  if(noticesComposer) noticesComposer.style.display = (role==='professor'||isAdmin)?'block':'none';
  // Painel admin de horários
  const schAdmin = document.getElementById('schedules-admin-panel');
  if(schAdmin) schAdmin.style.display = isAdmin ? 'block' : 'none';
}

function getRoleBadgeHTML(role){
  const map = {aluno:'👤 Aluno',professor:'🎓 Professor',admin:'🛡️ Admin'};
  const cls = {aluno:'badge-aluno',professor:'badge-professor',admin:'badge-admin'};
  return `<span class="role-badge ${cls[role]||'badge-aluno'}">${map[role]||'Aluno'}</span>`;
}

// ══════════════════════════════════════════════════════════════
// MODULE: CHANGE ROLE (own)
// ══════════════════════════════════════════════════════════════
function openRoleChangeModal(){
  document.getElementById('rc-new-role').value = CU.role;
  document.getElementById('rc-password').value = '';
  document.getElementById('rc-code').value     = '';
  document.getElementById('rc-code-box').style.display = 'none';
  hi('rc-err');
  openModal('role-change-modal');
}

function onNewRoleChange(){
  const role = document.getElementById('rc-new-role').value;
  const box  = document.getElementById('rc-code-box');
  box.style.display = (role==='professor'||role==='admin') ? 'block' : 'none';
  document.getElementById('rc-code-label').textContent =
    role==='professor' ? '🔐 Código de Professor' : '🔐 Código de Admin';
}

async function saveRoleChange(){
  const newRole = document.getElementById('rc-new-role').value;
  const pass    = document.getElementById('rc-password').value;
  const code    = document.getElementById('rc-code').value;
  const errEl   = document.getElementById('rc-err');

  if(newRole === CU.role){ errEl.textContent='Você já possui este cargo.'; sh('rc-err'); return; }
  if(!pass){ errEl.textContent='Digite sua senha atual.'; sh('rc-err'); return; }

  try{
    const credential = firebase.auth.EmailAuthProvider.credential(CU.email, pass);
    await AUTH.currentUser.reauthenticateWithCredential(credential);
  }catch(e){ errEl.textContent='Senha incorreta.'; sh('rc-err'); return; }

  if(newRole==='professor'||newRole==='admin'){
    if(!code){ errEl.textContent='Código de autorização obrigatório.'; sh('rc-err'); return; }
    const valid = await validateRoleCode(code, newRole);
    if(!valid){ errEl.textContent='Código de autorização incorreto.'; sh('rc-err'); return; }
  }

  await DB.ref('users/'+CU.uid+'/role').set(newRole);
  CU.role = newRole;
  usersCache[CU.uid] = {...CU};
  closeModal('role-change-modal');
  applyRolePermissions();
  renderProfile();
  toast('Cargo alterado para '+newRole+' ✅');
}

// ══════════════════════════════════════════════════════════════
// MODULE: ADMIN CHANGE OTHER USER'S ROLE
// ══════════════════════════════════════════════════════════════
function openAdminRoleModal(uid){
  if(CU.role!=='admin'){ toast('⛔ Apenas admins.'); return; }
  adminRoleTargetUid = uid;
  const u = usersCache[uid];
  document.getElementById('admin-role-user-info').innerHTML = u
    ? `<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;padding:10px;background:var(--s2);border-radius:var(--rs)">
         <div class="pav" style="width:36px;height:36px">${u.photo?`<img src="${imgSrc(u.photo)}" alt="">`:ini(u.name)}</div>
         <div><div style="font-weight:600">${escH(u.name)}</div><div style="font-size:12px;color:var(--t3)">@${escH(u.handle)} · Cargo atual: ${getRoleBadgeHTML(u.role||'aluno')}</div></div>
       </div>` : '';
  document.getElementById('admin-role-select').value = u ? (u.role||'aluno') : 'aluno';
  hi('admin-role-err');
  openModal('admin-role-modal');
}

async function confirmAdminRoleChange(){
  if(CU.role!=='admin'||!adminRoleTargetUid){ toast('⛔ Sem permissão.'); return; }
  const newRole = document.getElementById('admin-role-select').value;
  const targetUid = adminRoleTargetUid;
  const u = usersCache[targetUid];
  if(u && u.role === newRole){ document.getElementById('admin-role-err').textContent='Usuário já possui este cargo.'; sh('admin-role-err'); return; }
  await DB.ref('users/'+targetUid+'/role').set(newRole);
  if(usersCache[targetUid]) usersCache[targetUid].role = newRole;
  closeModal('admin-role-modal');
  adminRoleTargetUid = null;
  toast('Cargo atualizado ✅');
  renderAdminDb();
}

// ══════════════════════════════════════════════════════════════
// MODULE: THEME — detecção automática do sistema
// ══════════════════════════════════════════════════════════════

/**
 * Aplica o tema salvo ou detecta o preferido pelo sistema (prefers-color-scheme).
 * Ícones de sol/lua agora são SVG inline no HTML, controlados via CSS classes.
 */
function applyTheme(){
  let saved = localStorage.getItem('ifc_theme');
  // Se não há preferência salva, detecta pelo sistema
  if(!saved){
    saved = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', saved);
}

function togTheme(){
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('ifc_theme', next);
  document.documentElement.setAttribute('data-theme', next);
}

// Escuta mudanças do sistema (usuário muda o tema do SO)
if(window.matchMedia){
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    // Só aplica automático se o usuário não salvou preferência manual
    if(!localStorage.getItem('ifc_theme')){
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
}

// ══════════════════════════════════════════════════════════════
// MODULE: NAVIGATION
// ══════════════════════════════════════════════════════════════
function updAv(){
  const i = ini(CU.name);
  ['nav-av','cav','ncav'].forEach(id=>{
    const el = document.getElementById(id); if(!el) return;
    if(CU.photo){ el.innerHTML=`<img src="${CU.photo}" alt="">`; } else { el.textContent=i; }
  });
}

function go(p, force=false){
  document.querySelectorAll('.pg').forEach(x=>x.classList.remove('on'));
  document.querySelectorAll('.bn').forEach(x=>x.classList.remove('on'));
  document.getElementById('pg-'+p).classList.add('on');
  const b = document.getElementById('bn-'+p); if(b) b.classList.add('on');
  if(p==='feed')       { if(!pageCache.feed||force)    renderFeed(); }
  else if(p==='notices')    { if(!pageCache.notices||force) renderNotices(); }
  else if(p==='explore')    { if(!pageCache.explore||force) renderExplore(); }
  else if(p==='profile')    { if(!pageCache.profile||force) renderProfile(); }
  else if(p==='chat')       { renderChatList(); }
  else if(p==='resumos')    { renderResumos(); }
  else if(p==='schedules')  { renderSchedules(); }
  else if(p==='labs')       { renderLabs(); }
  else if(p==='admin-db')   { renderAdminDb(); }
  else if(p==='moderation') { renderModeration(); }
}

// ══════════════════════════════════════════════════════════════
// MODULE: UNREAD MESSAGES BADGE (contador de não lidos)
// ══════════════════════════════════════════════════════════════
let _unreadListener = null;

/**
 * Monitora em tempo real as mensagens não lidas do usuário
 * e atualiza os badges no nav e no bottom bar.
 */
function startUnreadBadgeListener(){
  if(_unreadListener){ _unreadListener(); _unreadListener = null; }
  const ref = DB.ref('messages');
  ref.on('value', snap => {
    let total = 0;
    snap.forEach(convSnap => {
      const key = convSnap.key;
      if(!key.includes(CU.uid)) return;
      convSnap.forEach(msgSnap => {
        const m = msgSnap.val();
        if(m && m.from !== CU.uid && !m.read) total++;
      });
    });
    // Atualiza badge do nav top
    const navBadge = document.getElementById('nav-chat-badge');
    const bnBadge  = document.getElementById('bn-chat-badge');
    if(total > 0){
      if(navBadge){ navBadge.textContent = total > 99 ? '99+' : total; navBadge.style.display = 'flex'; }
      if(bnBadge) { bnBadge.textContent  = total > 99 ? '99+' : total; bnBadge.style.display  = 'flex'; }
    } else {
      if(navBadge) navBadge.style.display = 'none';
      if(bnBadge)  bnBadge.style.display  = 'none';
    }
  });
  _unreadListener = () => ref.off('value');
}

// ══════════════════════════════════════════════════════════════
// MODULE: CONTENT MODERATION
// ══════════════════════════════════════════════════════════════
function checkContentFilter(text){ const lower=text.toLowerCase(); return CONFIG.blockedWords.some(w=>lower.includes(w)); }

async function sendToModeration(postData){
  await DB.ref('moderation/'+postData.id).set({...postData,status:'pending',reportedAt:Date.now()});
  toast('⚠️ Seu post foi enviado para moderação.');
}

/**
 * Renderiza o painel de mensagens bloqueadas para o admin.
 * Funcionalidades: aprovar, excluir definitivamente, ver perfil do autor, enviar aviso.
 */


/**
 * Envia um aviso como mensagem direta ao usuário que teve o conteúdo bloqueado.
 */






// ══════════════════════════════════════════════════════════════
// MODULE: POSTS / FEED
// ══════════════════════════════════════════════════════════════

/** Filtro de período para abas popular/relevante */
function setPeriodFilter(period, el){
  currentPeriodFilter = period;
  document.querySelectorAll('.period-btn').forEach(x=>x.classList.remove('on'));
  el.classList.add('on');
  renderFeed();
}

/**
 * Filtra posts pelo período selecionado (semanal, mensal, tudo).
 */
function filterByPeriod(posts){
  if(currentPeriodFilter === 'all') return posts;
  const now = Date.now();
  const ms = currentPeriodFilter === 'week' ? 7*86400*1000 : 30*86400*1000;
  return posts.filter(p => (now - (p.ts||0)) <= ms);
}

function setFeedTab(tab, el){
  currentFeedTab = tab;
  document.querySelectorAll('#feed-ftabs .ftab').forEach(x=>x.classList.remove('on'));
  el.classList.add('on');
  // Mostra/oculta filtro de período
  const pf = document.getElementById('period-filter');
  if(pf) pf.style.display = (tab==='popular'||tab==='relevant') ? 'flex' : 'none';
  renderFeed();
}


async function doPost(){
  const txt = gv('ptx').trim();
  if(!txt && !postImages.length){toast('Escreva algo ou adicione uma foto!');return;}
  const id = Date.now().toString(36)+Math.random().toString(36).slice(2,5);
  const postData = {id,uid:CU.uid,author:CU.name,handle:CU.handle,authorRole:CU.role||'aluno',
    campus:CU.campus||'',authorPhoto:CU.photo||'',text:txt,images:[...postImages], image:postImages[0]||'', ogPreview:ogPreviewData||null,
    likes:{},upvotes:{},comments:{},ts:Date.now()};
  if(checkContentFilter(txt)){ await sendToModeration(postData); document.getElementById('ptx').value=''; postImages=[]; renderPostImagePreview(); clearOgPreview(); return; }
  try{
    loadingStart();
    await DB.ref('posts/'+id).set(postData);
    loadingDone();
    document.getElementById('ptx').value=''; postImages=[]; renderPostImagePreview(); clearOgPreview();
    await DB.ref('users/'+CU.uid+'/postCount').transaction(v=>(v||0)+1);
    CU.postCount = (CU.postCount||0)+1;
    await checkAndAwardBadges();
    pageCache.profile = false;
    toast('Post publicado! 🎉');
  }catch(e){ loadingDone(); toast('Erro ao publicar. Imagem muito grande?');}
}

function skelCards(n=3){
  return Array(n).fill(`<div class="skel-card"><div style="display:flex;gap:10px;align-items:center;margin-bottom:12px"><div class="skel skel-avatar"></div><div style="flex:1"><div class="skel skel-line" style="width:60%"></div><div class="skel skel-line" style="width:40%"></div></div></div><div class="skel skel-line"></div><div class="skel skel-line" style="width:80%"></div></div>`).join('');
}

function renderFeed(){
  const c = document.getElementById('feed');
  if(!pageCache.feed) c.innerHTML = skelCards(3);
  if(feedListener){feedListener(); feedListener=null;}
  loadingStart();
  if(currentFeedTab==='following'){
    // Busca a lista de seguidos e filtra os posts deles
    DB.ref(`users/${CU.uid}/following`).once('value', followSnap => {
      const following = followSnap.val() ? Object.keys(followSnap.val()) : [];
      const ref = DB.ref('posts').orderByChild('ts').limitToLast(120);
      ref.on('value', snap => {
        loadingDone();
        let posts = snapshotToArrayDesc(snap).filter(p => following.includes(p.uid));
        if(!posts.length){
          c.innerHTML='<div class="es"><div class="ei">👥</div><div class="et">Nenhum post ainda</div><div style="font-size:13px;color:var(--t3)">Siga pessoas para ver os posts delas aqui.</div></div>';
          pageCache.feed=true; return;
        }
        c.innerHTML = posts.map(p=>postHTML(p)).join('');
        pageCache.feed = true;
      });
      feedListener = ()=>{ ref.off('value'); };
    });
    return;
  }
  const ref = DB.ref('posts').orderByChild('ts').limitToLast(80);
  ref.on('value', snap=>{
    loadingDone();
    let posts = snapshotToArrayDesc(snap);
    if(currentFeedTab==='hashtag' && currentHashtagFilter){
      const htag = currentHashtagFilter.toLowerCase();
      posts = posts.filter(p => p.text && p.text.toLowerCase().includes('#'+htag));
    }
    if(currentFeedTab==='campus')   posts = posts.filter(p=>p.campus===CU.campus);
    if(currentFeedTab==='popular'){
      posts = filterByPeriod(posts);
      posts = [...posts].sort((a,b)=>Object.keys(b.likes||{}).length-Object.keys(a.likes||{}).length);
    }
    if(currentFeedTab==='relevant'){
      posts = filterByPeriod(posts);
      posts = [...posts].sort((a,b)=>Object.keys(b.upvotes||{}).length-Object.keys(a.upvotes||{}).length);
    }
    if(!posts.length){c.innerHTML='<div class="es"><div class="ei">📝</div><div class="et">Nenhum post ainda</div><div style="font-size:13px;color:var(--t3)">Seja o primeiro!</div></div>';pageCache.feed=true;return;}
    c.innerHTML = posts.map(p=>postHTML(p)).join('');
    pageCache.feed = true;
  });
  feedListener = ()=>{ ref.off('value'); };
}

function imgSrc(src){ return src||''; }

function postHTML(p){
  const likes   = p.likes   ? Object.keys(p.likes)   : [];
  const upvotes = p.upvotes ? Object.keys(p.upvotes) : [];
  const liked   = likes.includes(CU.uid);
  const upvoted = upvotes.includes(CU.uid);
  const isBookmarked = !!(CU.savedPosts && CU.savedPosts[p.id]);
  const comments    = p.comments ? Object.values(p.comments).sort((a,b)=>(a.ts||0)-(b.ts||0)) : [];
  const canDelete   = p.uid===CU.uid || CU.role==='admin';
  const authorPhoto = getPhoto(p.uid, p.authorPhoto);
  const campusBadge = p.campus ? `<span class="campus-badge">🏫 ${escH(p.campus)}</span>` : '';
  const ch = comments.map(cm=>{
    const cmPhoto = getPhoto(cm.uid||'', cm.authorPhoto);
    const canDelCm = cm.uid===CU.uid || CU.role==='admin';
    const canEditCm = cm.uid===CU.uid;
    return`<div class="ci" id="cm-${p.id}-${cm.id}">
      <div class="cav">${cmPhoto?`<img src="${imgSrc(cmPhoto)}" alt="">`:ini(cm.author)}</div>
      <div class="cb" style="flex:1;min-width:0">
        <div class="cn">${escH(cm.author)} <span style="color:var(--t3);font-weight:400">@${escH(cm.handle)}</span> ${getRoleBadgeHTML(cm.authorRole||'aluno')}</div>
        <div class="ct">${escH(cm.text)}${cm.edited?'<span style="font-size:10px;color:var(--t3);margin-left:4px">(editado)</span>':''}</div>
        <div style="display:flex;gap:6px;margin-top:3px">
          ${canEditCm?`<button style="background:none;border:none;cursor:pointer;color:var(--t3);font-size:11px;padding:0" onclick="openEditComment('${p.id}','${cm.id}','${escH(cm.text).replace(/'/g,"\\'")}')">✏️ Editar</button>`:''}
          ${canDelCm?`<button style="background:none;border:none;cursor:pointer;color:var(--r);font-size:11px;padding:0" onclick="delComment('${p.id}','${cm.id}')">🗑 Excluir</button>`:''}
        </div>
      </div>
    </div>`;
  }).join('');
  // Carrossel de imagens (multi-foto)
  const imagesHTML = (p.images && p.images.length > 1)
    ? carouselHTML(p.images, p.id)
    : (p.image ? `<div class="pi"><img src="${imgSrc(p.image)}" loading="lazy" alt=""></div>` : '');
  return`<div class="pc">
    <div class="ph">
      <div class="pav" onclick="openOtherProfile('${p.uid}')">${authorPhoto?`<img src="${imgSrc(authorPhoto)}" alt="">`:ini(p.author)}</div>
      <div style="flex:1;min-width:0">
        <div class="pa" onclick="openOtherProfile('${p.uid}')">${escH(p.author)}</div>
        <div class="pm">@${escH(p.handle)} · ${ta(p.ts)}${campusBadge}</div>
        <div style="margin-top:2px">${getRoleBadgeHTML(p.authorRole||'aluno')}</div>
      </div>
      ${canDelete?`<button style="background:none;border:none;cursor:pointer;color:var(--t3);font-size:17px;padding:4px;flex-shrink:0" onclick="delPost('${p.id}')">🗑</button>`:''}
    </div>
    ${p.text?`<div class="pt">${processPostText(p.text)}</div>`:''}
    ${imagesHTML}
    <div class="pac">
      <button class="ab ${liked?'lkd':''}" onclick="doLike('${p.id}',${liked})">
        <svg viewBox="0 0 24 24" fill="${liked?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        ${likes.length}
      </button>
      <button class="ab ${upvoted?'uvd':''}" onclick="handleUpvote('${p.id}',${upvoted})" title="Relevante">
        <svg viewBox="0 0 24 24" fill="${upvoted?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
        ${upvotes.length}
      </button>
      <button class="ab" onclick="focC('${p.id}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        ${comments.length}
      </button>
      <button class="ab post-action-btn ${isBookmarked?'bkd':''}" onclick="toggleBookmark('${p.id}',${isBookmarked})" title="${isBookmarked?'Remover dos salvos':'Salvar post'}">
        <svg viewBox="0 0 24 24" fill="${isBookmarked?'currentColor':'none'}" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
      </button>
      ${p.image?`<button class="ab post-action-btn" onclick="downloadPostImage('${escH(p.image)}','${p.id}')" title="Salvar imagem">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      </button>`:''}
      ${p.uid!==CU.uid?`<button class="ab post-action-btn report-btn" onclick="openReportPost('${p.id}','${p.uid}')" title="Denunciar post">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
      </button>`:''}
    </div>
    <div class="cs">${ch}
      <div class="cir">
        <input class="cin" id="ci-${p.id}" placeholder="Comentar..." onkeydown="if(event.key==='Enter')addC('${p.id}')">
        <button class="csb" onclick="addC('${p.id}')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
      </div>
    </div>
  </div>`;
}

async function doLike(pid,liked){ const ref=DB.ref('posts/'+pid+'/likes/'+CU.uid); if(liked)await ref.remove();else await ref.set(true); }
async function handleUpvote(pid,upvoted){ const ref=DB.ref('posts/'+pid+'/upvotes/'+CU.uid); if(upvoted)await ref.remove();else await ref.set(true); }
async function addC(pid){
  const el=document.getElementById('ci-'+pid); const txt=el.value.trim(); if(!txt) return;
  // Filtro de palavras proibidas nos comentários
  if(checkContentFilter(txt)){
    toast('⚠️ Comentário bloqueado por conter linguagem inapropriada.');
    el.value=''; return;
  }
  el.value='';
  const cid=Date.now().toString(36)+Math.random().toString(36).slice(2,4);
  await DB.ref('posts/'+pid+'/comments/'+cid).set({id:cid,uid:CU.uid,author:CU.name,handle:CU.handle,authorRole:CU.role||'aluno',authorPhoto:CU.photo||'',text:txt,ts:Date.now()});
  // Atualiza contador de comentários no post e no usuário
  await DB.ref('posts/'+pid+'/commentCount').transaction(v=>(v||0)+1);
  await DB.ref('users/'+CU.uid+'/commentCount').transaction(v=>(v||0)+1);
  CU.commentCount=(CU.commentCount||0)+1; checkAndAwardBadges();
}
function focC(pid){ const el=document.getElementById('ci-'+pid); if(el) el.focus(); }
async function delPost(pid){
  if(!confirm('Excluir este post?')) return;
  await DB.ref('posts/'+pid).remove();
  await DB.ref('moderation/'+pid).remove();
  toast('Post excluído');
}

// ══════════════════════════════════════════════════════════════
// MODULE: NOTICES
// ══════════════════════════════════════════════════════════════
async function doNotice(){
  const txt=gv('ntx').trim(); if(!txt){toast('Escreva o aviso!');return;}
  if(CU.role!=='professor'&&CU.role!=='admin'){toast('Apenas professores e admins podem postar avisos.');return;}
  const id=Date.now().toString(36)+Math.random().toString(36).slice(2,5);
  await DB.ref('notices/'+id).set({id,uid:CU.uid,author:CU.name,handle:CU.handle,authorRole:CU.role,campus:CU.campus||'',text:txt,ts:Date.now()});
  document.getElementById('ntx').value=''; toast('Aviso publicado! 📢'); renderNotices();
}
function renderNotices(){
  const c=document.getElementById('notices-list');
  c.innerHTML='<div class="loading">⏳ Carregando avisos...</div>';
  loadingStart();
  DB.ref('notices').orderByChild('ts').limitToLast(40).once('value',snap=>{
    loadingDone();
    const notices=snapshotToArrayDesc(snap);
    if(!notices.length){c.innerHTML='<div class="es"><div class="ei">📢</div><div class="et">Nenhum aviso ainda</div></div>';pageCache.notices=true;return;}
    c.innerHTML=notices.map(n=>`
      <div class="notice-card">
        <div class="notice-header">
          ${getRoleBadgeHTML(n.authorRole)} <span>${escH(n.author)}</span>
          ${n.campus?`<span>🏫 ${escH(n.campus)}</span>`:''}
          <span style="margin-left:auto">${ta(n.ts)}</span>
          ${CU.role==='admin'?`<button style="background:none;border:none;color:#fff;cursor:pointer;font-size:13px;margin-left:6px" onclick="delNotice('${n.id}')">✕</button>`:''}
        </div>
        <div style="padding:13px 15px;font-size:14px;line-height:1.6">${escH(n.text)}</div>
      </div>`).join('');
    pageCache.notices=true;
  });
}
async function delNotice(nid){ if(!confirm('Remover aviso?'))return; await DB.ref('notices/'+nid).remove(); renderNotices(); }

// ══════════════════════════════════════════════════════════════
// MODULE: PROFILE (own)
// ══════════════════════════════════════════════════════════════
async function renderProfile(){
  loadingStart();
  const s=await DB.ref('users/'+CU.uid).once('value'); CU=s.val();
  loadingDone();
  usersCache[CU.uid]=CU;
  const el=document.getElementById('my-profile-card');
  el.innerHTML=buildProfileCardHTML(CU, true);
  const ps=await DB.ref('posts').orderByChild('uid').equalTo(CU.uid).once('value');
  const posts=snapshotToArrayDesc(ps);
  const totalLikes=posts.reduce((s,p)=>s+Object.keys(p.likes||{}).length,0);
  const spc=document.getElementById('spc'); if(spc) spc.textContent=posts.length;
  const slc=document.getElementById('slc'); if(slc) slc.textContent=totalLikes;
  renderBadgesForUser(CU,'badge-grid-profile');
  const earnedCount=getBadgeDefs().filter(b=>b.check(CU)).length;
  const sbdg=document.getElementById('sbdg'); if(sbdg) sbdg.textContent=earnedCount+'/'+getBadgeDefs().length;
  document.getElementById('myposts').innerHTML=posts.length?posts.map(p=>postHTML(p)).join(''):'<div class="es"><div class="ei">📸</div><div class="et">Nenhum post ainda</div></div>';
  handleRolePermissions(CU.role);
  pageCache.profile=true;
}

/**
 * Constrói o HTML do cartão de perfil.
 * Layout unificado para perfil próprio e de terceiros.
 * @param {object} u — dados do usuário
 * @param {boolean} isOwn — true se for o perfil do CU
 */
function buildProfileCardHTML(u, isOwn){
  // Banner: imagem de capa (profileBanner) ou cor sólida - sem tint esverdeado
  let bannerClass = 'pcv';
  let bannerContent = '<div class="pcvp"></div>';
  if(u.profileBanner){
    bannerClass = 'pcv has-banner';
    const fitMode = u.bannerFitMode === 'fill' ? 'fill' : 'cover';
    bannerContent = `<img src="${imgSrc(u.profileBanner)}" class="profile-banner" style="object-fit:${fitMode}" alt="">`;
    if(isOwn) bannerContent += `<button class="banner-edit-btn" onclick="document.getElementById('ep-banner-input').click()">🖼️ Trocar capa</button>`;
  } else if(u.bannerColor){
    bannerContent = `<div style="position:absolute;inset:0;background:${escH(u.bannerColor)};border-radius:inherit"></div>`;
    if(isOwn) bannerContent += `<button class="banner-edit-btn" onclick="document.getElementById('ep-banner-input').click()">🖼️ Adicionar capa</button>`;
  } else {
    // Sem imagem e sem cor: usa cor padrão baseada no cargo
    const defaultColor = colorFromRole(u.role || 'aluno');
    bannerContent = `<div style="position:absolute;inset:0;background:${escH(defaultColor)};border-radius:inherit"></div>`;
    if(isOwn) bannerContent += `<button class="banner-edit-btn" onclick="document.getElementById('ep-banner-input').click()">🖼️ Adicionar capa</button>`;
  }

  return `
    <div class="${bannerClass}">${bannerContent}</div>
    <div class="pir">
      <div class="pba" ${isOwn?`onclick="openModal('edit-profile-modal');populateEditForm()"`:''}>
        ${u.photo?`<img src="${imgSrc(u.photo)}" alt="">`:ini(u.name)}
      </div>
      <div style="flex:1;padding-top:32px;min-width:0">
        <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap">
          <div class="pn">${escH(u.name)}</div>${getRoleBadgeHTML(u.role||'aluno')}
        </div>
        <div class="ph2">@${escH(u.handle)}</div>
        ${u.bio?`<div class="pb">${escH(u.bio)}</div>`:''}
        ${u.campus?`<div class="info-row">🏫 ${escH(u.campus)}</div>`:''}
        ${u.course?`<div class="info-row">📚 ${escH(u.course)}</div>`:''}
      </div>
      <div style="display:flex;flex-direction:column;gap:5px;margin-top:32px;flex-shrink:0">
        ${isOwn
          ?`<button class="btn btn-o btn-s" onclick="openModal('edit-profile-modal');populateEditForm()">✏️ Editar</button>
            <button class="btn btn-o btn-s" onclick="openRoleChangeModal()" style="font-size:12px">🔄 Cargo</button>
            <button class="btn-r" onclick="doLogout()">Sair</button>`
          :`<button class="btn btn-s" onclick="openUChat('${u.uid}')">💬 Mensagem</button>
            <button class="btn btn-s btn-o" id="follow-btn-${u.uid}" onclick="toggleFollow('${u.uid}')">Seguir</button>`}
      </div>
    </div>
    <div class="pst">
      <div style="text-align:center"><div class="sn" id="spc">—</div><div class="sl">Posts</div></div>
      <div class="stat-div"></div>
      <div style="text-align:center"><div class="sn" id="slc">—</div><div class="sl">Curtidas</div></div>
      <div class="stat-div"></div>
      <div style="text-align:center"><div class="sn" id="sbdg">—</div><div class="sl">Badges</div></div>
      ${u.campus?`<div class="stat-div"></div><div style="text-align:center;min-width:0"><div class="sn" style="font-size:10px;color:var(--g);max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escH(u.campus)}</div><div class="sl">Campus</div></div>`:''}
    </div>
    <div id="badges-section" style="padding:4px 14px 12px;border-top:1px solid var(--bd)">
      <div style="font-size:11px;font-weight:600;color:var(--t3);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">Conquistas</div>
      <div class="badge-grid" id="badge-grid-profile"></div>
    </div>`;
}

function populateEditForm(){
  document.getElementById('ep-name').value        = CU.name||'';
  document.getElementById('ep-handle').value      = CU.handle||'';
  document.getElementById('ep-bio').value         = CU.bio||'';
  document.getElementById('ep-campus').value      = CU.campus||'';
  document.getElementById('ep-course').value      = CU.course||'';
  document.getElementById('ep-banner-color').value= CU.bannerColor||'#00A859';

  // Avatar preview
  const prev = document.getElementById('ep-avatar-preview');
  prev.innerHTML = CU.photo
    ? `<img src="${imgSrc(CU.photo)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%" alt="">`
    : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--g);color:#fff;font-size:20px;font-weight:700;border-radius:50%">${ini(CU.name)}</div>`;

  // Banner preview
  const bgImg = document.getElementById('ep-banner-preview-img');
  if(bgImg){
    if(CU.profileBanner){ bgImg.src = CU.profileBanner; bgImg.style.display = 'block'; }
    else { bgImg.src=''; bgImg.style.display='none'; }
  }

  newProfilePhotoData = null;
  newProfileBgData    = null;
  removeBgFlag        = false;
  document.getElementById('hcheck-edit').textContent='';

  // Atualiza preview do banner com a cor atual do usuário
  const colorFill   = document.getElementById('ep-banner-color-fill');
  const placeholder = document.getElementById('ep-banner-placeholder');
  const bgImgEl     = document.getElementById('ep-banner-preview-img');
  if (CU.profileBanner) {
    if (bgImgEl)     { bgImgEl.src = CU.profileBanner; bgImgEl.style.display = 'block'; }
    if (colorFill)   colorFill.style.display = 'none';
    if (placeholder) placeholder.style.display = 'none';
  } else if (CU.bannerColor) {
    if (bgImgEl)     { bgImgEl.src = ''; bgImgEl.style.display = 'none'; }
    if (colorFill)   { colorFill.style.background = CU.bannerColor; colorFill.style.display = 'block'; }
    if (placeholder) placeholder.style.display = 'none';
  } else {
    if (bgImgEl)     { bgImgEl.src = ''; bgImgEl.style.display = 'none'; }
    if (colorFill)   colorFill.style.display = 'none';
    if (placeholder) placeholder.style.display = 'flex';
  }
}

function previewProfilePhoto(e){
  const f=e.target.files[0]; if(!f) return;
  if(f.size>1.5*1024*1024){toast('Foto muito grande! Máximo 1.5MB.');return;}
  const r=new FileReader();
  r.onload=ev=>{
    const img=new Image();
    img.onload=()=>{
      const canvas=document.createElement('canvas');
      const S=200; canvas.width=S; canvas.height=S;
      const ctx=canvas.getContext('2d');
      const side=Math.min(img.width,img.height);
      ctx.drawImage(img,(img.width-side)/2,(img.height-side)/2,side,side,0,0,S,S);
      newProfilePhotoData=canvas.toDataURL('image/jpeg',0.85);
      document.getElementById('ep-avatar-preview').innerHTML=`<img src="${newProfilePhotoData}" style="width:100%;height:100%;object-fit:cover;border-radius:50%" alt="">`;
      // Extrai cor dominante para o banner
      const px=ctx.getImageData(0,0,S,S).data;
      let rv=0,gvv=0,bv=0,cnt=0;
      for(let i=0;i<px.length;i+=16){rv+=px[i];gvv+=px[i+1];bv+=px[i+2];cnt++;}
      const hex='#'+[Math.round(rv/cnt),Math.round(gvv/cnt),Math.round(bv/cnt)].map(x=>x.toString(16).padStart(2,'0')).join('');
      document.getElementById('ep-banner-color').value=hex;
      toast('Cor do banner extraída da foto! 🎨');
    }; img.src=ev.target.result;
  }; r.readAsDataURL(f);
}

/**
 * Preview do background do perfil (Steam-style).
 * Redimensiona para max 1200px de largura para economizar espaço.
 */
async function previewProfileBanner(e){
  const f = e.target.files[0]; if(!f) return;
  if(f.size > 10*1024*1024){ toast('Background muito grande! Máximo 10MB.'); return; }
  // Abre o modal de crop em vez de fazer upload direto
  const reader = new FileReader();
  reader.onload = ev => openBannerCropModal(ev.target.result, f);
  reader.readAsDataURL(f);
  e.target.value = '';
}

let _bannerCropFile = null;
let _cropperInstance = null;

function openBannerCropModal(dataUrl, originalFile) {
  _bannerCropFile = originalFile;
  const modal = document.getElementById('banner-crop-modal');
  const img   = document.getElementById('banner-crop-img');
  if (!modal || !img) return;

  // Destrói instância anterior
  if (_cropperInstance) { _cropperInstance.destroy(); _cropperInstance = null; }

  img.src = dataUrl;
  modal.style.display = 'flex';

  // Inicializa Cropper.js após o img carregar
  img.onload = () => {
    const fitFill = document.getElementById('banner-fit-fill');
    const isFill  = fitFill && fitFill.checked;
    _cropperInstance = new Cropper(img, {
      aspectRatio: isFill ? NaN : 3,   // 3:1 para cover, livre para fill
      viewMode: 1,
      dragMode: 'move',
      autoCropArea: 1,
      responsive: true,
      checkOrientation: false,
      guides: true,
      center: true,
      highlight: true,
      cropBoxMovable: true,
      cropBoxResizable: !isFill,
    });
  };
}

function closeBannerCropModal() {
  const modal = document.getElementById('banner-crop-modal');
  if (modal) modal.style.display = 'none';
  if (_cropperInstance) { _cropperInstance.destroy(); _cropperInstance = null; }
  _bannerCropFile = null;
}

async function applyBannerCrop() {
  if (!_cropperInstance) { closeBannerCropModal(); return; }
  toast('⏳ Processando e enviando...');
  loadingStart();
  try {
    const canvas = _cropperInstance.getCroppedCanvas({ maxWidth: 1200, maxHeight: 400, imageSmoothingQuality: 'high' });
    const blob   = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.9));
    const file   = new File([blob], 'banner.jpg', { type: 'image/jpeg' });
    const url    = await uploadToCloudinary(file);
    newProfileBgData = url;
    removeBgFlag     = false;
    const bgImg      = document.getElementById('ep-banner-preview-img');
    const colorFill  = document.getElementById('ep-banner-color-fill');
    const placeholder= document.getElementById('ep-banner-placeholder');
    if(bgImg)     { bgImg.src = url; bgImg.style.display = 'block'; bgImg.style.objectFit = _bannerFitMode === 'fill' ? 'fill' : 'cover'; }
    if(colorFill)  colorFill.style.display = 'none';
    if(placeholder) placeholder.style.display = 'none';
    closeBannerCropModal();
    toast('✅ Banner pronto!');
  } catch(err) { toast('Erro ao enviar: ' + err.message); }
  finally { loadingDone(); }
}

function removeProfileBanner(){
  newProfileBgData = null;
  removeBgFlag = true;
  const bgImg = document.getElementById('ep-banner-preview-img');
  if(bgImg){ bgImg.src=''; bgImg.style.display='none'; }
  const colorFill   = document.getElementById('ep-banner-color-fill');
  const placeholder = document.getElementById('ep-banner-placeholder');
  if(colorFill)   colorFill.style.display = 'none';
  if(placeholder) placeholder.style.display = 'flex';
  const bgInput = document.getElementById('ep-banner-input');
  if(bgInput) bgInput.value='';
  toast('Capa removida.');
}

let _bannerFitMode = 'cover';

function onBannerFitChange(mode) {
  _bannerFitMode = mode;
  const img = document.getElementById('ep-banner-preview-img');
  if (img) img.style.objectFit = mode === 'fill' ? 'fill' : 'cover';
}

async function saveProfile(){
  const name  = document.getElementById('ep-name').value.trim();
  const handle= document.getElementById('ep-handle').value.trim().toLowerCase().replace(/[^a-z0-9_]/g,'');
  const bio   = document.getElementById('ep-bio').value.trim();
  const campus= document.getElementById('ep-campus').value;
  const course= document.getElementById('ep-course').value;
  const bannerColor=document.getElementById('ep-banner-color').value;
  if(!name||!handle){toast('Nome e @usuário são obrigatórios.');return;}
  if(handle!==CU.handle){
    const snap=await DB.ref('users').orderByChild('handle').equalTo(handle).once('value');
    if(snap.val()){toast('@'+handle+' já está em uso!');return;}
  }
  const updates={name,handle,bio,campus,course,bannerColor,bannerFitMode:_bannerFitMode};
  // Se a foto nova é base64, faz upload para Cloudinary antes de salvar
  if(newProfilePhotoData && newProfilePhotoData.startsWith('data:')) {
    try {
      const blob = await (await fetch(newProfilePhotoData)).blob();
      const photoUrl = await uploadToCloudinary(new File([blob], 'avatar.jpg', {type:'image/jpeg'}));
      updates.photo = photoUrl;
    } catch(photoErr) { toast('Erro ao enviar foto: ' + photoErr.message); loadingDone(); return; }
  } else if(newProfilePhotoData) { updates.photo = newProfilePhotoData; }
  if(newProfileBgData)    updates.profileBanner=newProfileBgData;
  if(removeBgFlag)        updates.profileBanner='';
  loadingStart();
  await DB.ref('users/'+CU.uid).update(updates);
  loadingDone();
  Object.assign(CU, updates);
  usersCache[CU.uid]={...CU};
  closeModal('edit-profile-modal');
  updAv(); renderProfile();
  toast('Perfil atualizado ✅');
}

async function confirmDeleteAccount(){
  if(!confirm('Tem certeza? Esta ação é irreversível!'))return;
  if(!confirm('CONFIRMAÇÃO FINAL: Excluir conta e todos os dados?'))return;
  try{
    await deleteUserAccount(CU.uid);
    if(AUTH.currentUser) await AUTH.currentUser.delete();
    doLogout();
  }catch(e){
    if(e.code==='auth/requires-recent-login'){
      toast('Por segurança, faça logout e login novamente antes de excluir a conta.');
    } else { toast('Erro ao excluir conta: '+e.message); }
  }
}

/**
 * Remove todos os dados do usuário do banco (posts, perfil, mensagens).
 * Chamado tanto pelo próprio usuário quanto pelo admin.
 */
async function deleteUserAccount(uid){
  loadingStart();
  // Remove perfil
  await DB.ref('users/'+uid).remove();
  // Remove posts
  const ps=await DB.ref('posts').orderByChild('uid').equalTo(uid).once('value');
  const del={}; ps.forEach(c=>{ del['posts/'+c.key]=null; });
  if(Object.keys(del).length) await DB.ref().update(del);
  // Remove mensagens diretas
  const msSnap = await DB.ref('messages').once('value');
  const dmDel = {};
  msSnap.forEach(convSnap => {
    if(convSnap.key.includes(uid)) dmDel['messages/'+convSnap.key] = null;
  });
  if(Object.keys(dmDel).length) await DB.ref().update(dmDel);
  loadingDone();
  delete usersCache[uid];
  toast('Conta excluída.');
}

// ══════════════════════════════════════════════════════════════
// MODULE: OTHER USER PROFILE
// Layout unificado — usa buildProfileCardHTML com isOwn=false
// ══════════════════════════════════════════════════════════════
async function openOtherProfile(uid){
  if(uid===CU.uid){go('profile');return;}
  loadingStart();
  const snap=await DB.ref('users/'+uid).once('value');
  const u=snap.val(); if(!u){ loadingDone(); return; }
  usersCache[uid]=u;
  const ps=await DB.ref('posts').orderByChild('uid').equalTo(uid).once('value');
  loadingDone();
  const posts=snapshotToArrayDesc(ps);
  const totalLikes=posts.reduce((s,p)=>s+Object.keys(p.likes||{}).length,0);

  // Atualiza o nome no header do topo
  const headerName = document.getElementById('opw-header-name');
  if(headerName) headerName.textContent = u.name || 'Perfil';

  // Usa buildProfileCardHTML para layout unificado (isOwn=false)
  const profileCard = buildProfileCardHTML(u, false);

  // Layout idêntico ao pg-profile: phc card + abas + posts
  document.getElementById('other-profile-content').innerHTML=`
    <div class="phc" id="my-profile-card">
      ${profileCard}
      ${CU.role==='admin'?`
      <div style="padding:8px 18px 12px;display:flex;gap:8px;flex-wrap:wrap;border-top:1px solid var(--bd)">
        <button class="btn btn-s" style="background:var(--gold);border-color:var(--gold)" onclick="openAdminRoleModal('${u.uid}')">🔄 Cargo</button>
        <button class="btn-r" onclick="adminDeleteUser('${u.uid}')">🗑 Excluir</button>
      </div>`:''}
    </div>
    <!-- Abas idênticas ao perfil próprio -->
    <div class="ftabs" style="margin-top:12px">
      <button class="ftab on" id="op-tab-posts" onclick="opSetTab('posts',this)">📝 Posts</button>
    </div>
    <!-- Posts -->
    <div id="op-posts">
      ${posts.length ? posts.map(p=>postHTML(p)).join('') : '<div class="es"><div class="ei">📸</div><div class="et">Nenhum post</div></div>'}
    </div>`;

  // Preenche stats e badges dentro do card renderizado
  const spcEl = document.getElementById('spc'); if(spcEl) spcEl.textContent = posts.length;
  const slcEl = document.getElementById('slc'); if(slcEl) slcEl.textContent = totalLikes;
  const sbdgEl= document.getElementById('sbdg'); if(sbdgEl) sbdgEl.textContent = getBadgeDefs().filter(b=>b.check(u)).length+'/'+getBadgeDefs().length;
  renderBadgesForUser(u, 'badge-grid-profile');

  // Atualiza estado do botão seguir
  const followBtn = document.getElementById('follow-btn-' + u.uid);
  if (followBtn) {
    DB.ref(`users/${CU.uid}/following/${u.uid}`).once('value', snap => {
      const isF = !!snap.val();
      followBtn.textContent = isF ? '✓ Seguindo' : 'Seguir';
      followBtn.classList.toggle('following', isF);
    });
  }

  // Exibe o overlay como flex (coluna) e reseta scroll
  const opw = document.getElementById('opw');
  opw.style.display = 'flex';
  const scroll = document.getElementById('other-profile-content');
  if(scroll) scroll.scrollTop = 0;
}
function opSetTab(tab, el){
  document.querySelectorAll('#other-profile-content .ftab').forEach(x=>x.classList.remove('on'));
  el.classList.add('on');
}
function closeOtherProfile(){
  const opw = document.getElementById('opw');
  opw.style.display = 'none';
}
async function adminDeleteUser(uid){
  if(CU.role!=='admin')return;
  if(!confirm('Excluir este usuário e seus posts?'))return;
  await deleteUserAccount(uid); closeOtherProfile(); toast('Usuário excluído pelo admin.');
}

// ══════════════════════════════════════════════════════════════
// MODULE: EXPLORE
// ══════════════════════════════════════════════════════════════
function setExploreFilter(f, el){
  currentExploreFilter=f;
  document.querySelectorAll('#explore-ftabs .ftab').forEach(x=>x.classList.remove('on'));
  el.classList.add('on'); srch();
}
async function renderExplore(filter=''){
  const g=document.getElementById('ug');
  if(!pageCache.explore&&!filter) g.innerHTML=skelCards(4);
  if(!Object.keys(usersCache).length){ await loadUsersCache(); }
  const users=Object.values(usersCache).filter(u=>{
    if(u.uid===CU.uid) return false;
    if(currentExploreFilter==='campus'&&u.campus!==CU.campus) return false;
    if(currentExploreFilter==='professor'&&u.role!=='professor') return false;
    if(filter&&!u.name.toLowerCase().includes(filter)&&!u.handle.toLowerCase().includes(filter)) return false;
    return true;
  });
  if(!users.length){g.innerHTML='<div class="es" style="grid-column:1/-1"><div class="ei">🔎</div><div class="et">Nenhum usuário encontrado</div></div>';pageCache.explore=true;return;}
  pageCache.explore=true;
  g.innerHTML=users.map(u=>`
    <div class="uc">
      <div class="uca" onclick="openOtherProfile('${u.uid}')" style="cursor:pointer">${u.photo?`<img src="${imgSrc(u.photo)}" alt="">`:ini(u.name)}</div>
      <div class="ucn" onclick="openOtherProfile('${u.uid}')" style="cursor:pointer">${escH(u.name)}</div>
      <div class="uch">@${escH(u.handle)}</div>
      <div style="margin:4px 0">${getRoleBadgeHTML(u.role||'aluno')}</div>
      ${u.campus?`<div style="font-size:11px;color:var(--t3)">🏫 ${escH(u.campus)}</div>`:''}
      <button class="btn btn-s" style="margin-top:9px" onclick="openUChat('${u.uid}')">💬</button>
    </div>`).join('');
}
function srch(){ renderExplore(document.getElementById('si').value.toLowerCase().trim()); }

// ══════════════════════════════════════════════════════════════
// MODULE: DM CHAT
// ══════════════════════════════════════════════════════════════
function ck(a,b){ return [a,b].sort().join('_'); }

function setChatTab(tab, el){
  currentChatTab=tab;
  document.querySelectorAll('#chat-ftabs .ftab').forEach(x=>x.classList.remove('on'));
  el.classList.add('on');
  document.getElementById('chl').style.display          = tab==='dm'     ? '' : 'none';
  document.getElementById('groups-list').style.display  = tab==='groups' ? '' : 'none';
  document.getElementById('create-group-area').style.display = tab==='groups' ? '' : 'none';
  if(tab==='dm')     renderChatList();
  if(tab==='groups') renderGroupsList();
}

/**
 * Renderiza a lista de conversas DM.
 * Conversas com mensagens não lidas são fixadas no topo e destacadas.
 */
async function renderChatList(){
  document.getElementById('chl').style.display='';
  document.getElementById('groups-list').style.display='none';
  document.getElementById('create-group-area').style.display='none';
  if(!Object.keys(usersCache).length) await loadUsersCache();
  loadingStart();
  const msSnap=await DB.ref('messages').once('value');
  loadingDone();
  const convs=[];
  msSnap.forEach(ch=>{
    const key=ch.key; if(!key.includes(CU.uid)) return;
    const msgs=snapshotToArray(ch); if(!msgs.length) return;
    const parts=key.split('_'); const otherUid=parts.find(x=>x!==CU.uid);
    const other=usersCache[otherUid]; if(!other) return;
    const unread=msgs.filter(m=>m.from!==CU.uid&&!m.read).length;
    convs.push({user:other,msgs,last:msgs[msgs.length-1],unread});
  });
  // Conversas com não lidos vêm primeiro, depois ordena por timestamp
  convs.sort((a,b)=>{
    if(b.unread !== a.unread) return b.unread - a.unread;
    return b.last.ts - a.last.ts;
  });
  const l=document.getElementById('chl');
  if(!convs.length){l.innerHTML='<div class="es"><div class="ei">💬</div><div class="et">Sem conversas</div><div style="font-size:13px;color:var(--t3)">Vá em Explorar!</div></div>';return;}
  l.innerHTML=convs.map(cv=>{
    const u=cv.user;
    return`<div class="chi ${cv.unread?'has-unread':''}" onclick="openChat('${u.uid}')">
      <div class="chav">${u.photo?`<img src="${imgSrc(u.photo)}" alt="">`:ini(u.name)}</div>
      <div style="flex:1;min-width:0">
        <div class="chun">${escH(u.name)} ${getRoleBadgeHTML(u.role||'aluno')}</div>
        <div class="chup ${cv.unread?'font-weight:600':''}">${escH(cv.last.text)}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0">
        <span style="font-size:11px;color:var(--t3)">${ta(cv.last.ts)}</span>
        ${cv.unread?`<div class="chu">${cv.unread}</div>`:''}
      </div>
    </div>`;
  }).join('');
}

function openUChat(uid){ go('chat'); setTimeout(()=>openChat(uid),80); }

async function openChat(uid){
  let u=usersCache[uid];
  if(!u){ const s=await dbGet('users/'+uid); u=s.val(); if(!u) return; usersCache[uid]=u; }
  chatWith=u;
  document.getElementById('cwn').textContent=u.name;
  const cwav=document.getElementById('cwav');
  if(u.photo){ cwav.innerHTML=`<img src="${imgSrc(u.photo)}" alt="">`;} else { cwav.textContent=ini(u.name); }
  document.getElementById('cw-role-badge').innerHTML=getRoleBadgeHTML(u.role||'aluno');
  document.getElementById('cw').classList.add('on');
  const key=ck(CU.uid,uid);
  const ms=await DB.ref('messages/'+key).once('value');
  const updates={};
  ms.forEach(ch=>{ const m=ch.val(); if(m.from!==CU.uid&&!m.read) updates['messages/'+key+'/'+ch.key+'/read']=true; });
  if(Object.keys(updates).length) await DB.ref().update(updates);
  attachDmListener(key);
}

let _dmListener=null;
function attachDmListener(key){
  if(_dmListener){ _dmListener(); _dmListener=null; }
  const ref=DB.ref('messages/'+key).orderByChild('ts').limitToLast(200);
  ref.on('value', snap=>{
    const msgs=snapshotToArray(snap);
    msgs.sort((a,b)=>(a.ts||0)-(b.ts||0)); // ✅ ordena por timestamp crescente
    const container=document.getElementById('cms');
    if(!container) return;
    if(!msgs.length){
      container.innerHTML=`<div class="es"><div class="ei">👋</div><div class="et">Diga olá!</div><div style="font-size:13px;color:var(--t3)">Início da conversa com ${escH(chatWith?chatWith.name:'')}</div></div>`;
      return;
    }
    container.innerHTML=msgs.map(m=>`<div class="mb ${m.from===CU.uid?'mi':'mt'}">${escH(m.text)}<div class="mt2">${ta(m.ts)}</div></div>`).join('');
    container.scrollTop=container.scrollHeight;
  });
  _dmListener=()=>ref.off('value');
}

function closeChat(){
  if(_dmListener){ _dmListener(); _dmListener=null; }
  document.getElementById('cw').classList.remove('on');
  chatWith=null; renderChatList();
}

async function sndMsg(){
  const inp=document.getElementById('cmi');
  const txt=inp.value.trim();
  if(!txt||!chatWith) return;
  inp.value='';
  const key=ck(CU.uid,chatWith.uid);
  const mid=Date.now().toString(36)+Math.random().toString(36).slice(2,4);
  try{
    await DB.ref('messages/'+key+'/'+mid).set({id:mid,from:CU.uid,text:txt,ts:Date.now(),read:false});
    DB.ref('users/'+CU.uid+'/msgCount').transaction(v=>(v||0)+1).then(()=>{ CU.msgCount=(CU.msgCount||0)+1; checkAndAwardBadges(); });
  }catch(e){ toast('Erro ao enviar mensagem.'); }
}

// ══════════════════════════════════════════════════════════════
// MODULE: GROUP CHAT
// ══════════════════════════════════════════════════════════════
let groupMemberSearchTimeout=null;

function previewGroupPhoto(e){
  const f=e.target.files[0]; if(!f) return;
  if(f.size>2*1024*1024){toast('Imagem muito grande! Máximo 2MB.');return;}
  const r=new FileReader();
  r.onload=ev=>{
    const img=new Image();
    img.onload=()=>{
      const canvas=document.createElement('canvas');
      const S=200; canvas.width=S; canvas.height=S;
      const ctx=canvas.getContext('2d');
      const side=Math.min(img.width,img.height);
      ctx.drawImage(img,(img.width-side)/2,(img.height-side)/2,side,side,0,0,S,S);
      selectedGroupPhoto=canvas.toDataURL('image/jpeg',0.80);
      const prev=document.getElementById('group-photo-preview');
      prev.innerHTML=`<img src="${selectedGroupPhoto}" style="width:100%;height:100%;object-fit:cover" alt="">`;
    }; img.src=ev.target.result;
  }; r.readAsDataURL(f);
}
function clearGroupPhoto(){ selectedGroupPhoto=null; document.getElementById('group-photo-preview').innerHTML='👥'; document.getElementById('group-photo-input').value=''; }

function searchGroupMember(){
  clearTimeout(groupMemberSearchTimeout);
  const q=document.getElementById('gmember-input').value.toLowerCase().trim().replace(/^@/,'');
  if(!q){document.getElementById('gmember-results').innerHTML='';return;}
  groupMemberSearchTimeout=setTimeout(()=>{
    const results=Object.values(usersCache).filter(u=>
      u.uid!==CU.uid&&!selectedGroupMembers.find(m=>m.uid===u.uid)&&
      (u.name.toLowerCase().includes(q)||u.handle.includes(q))).slice(0,5);
    document.getElementById('gmember-results').innerHTML=results.map(u=>
      `<div style="display:flex;align-items:center;gap:8px;padding:7px;cursor:pointer;border-radius:8px;background:var(--s2);margin-bottom:4px" onclick="addGroupMember('${u.uid}','${escH(u.name)}','${escH(u.handle)}')">
        <div style="width:28px;height:28px;border-radius:50%;background:var(--g);color:#fff;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;overflow:hidden">${u.photo?`<img src="${imgSrc(u.photo)}" style="width:100%;height:100%;object-fit:cover">`:ini(u.name)}</div>
        <div><div style="font-size:13px;font-weight:600">${escH(u.name)}</div><div style="font-size:11px;color:var(--t3)">@${escH(u.handle)}</div></div>
      </div>`).join('');
  },300);
}
function addGroupMember(uid,name,handle){
  if(selectedGroupMembers.find(m=>m.uid===uid)) return;
  selectedGroupMembers.push({uid,name,handle});
  document.getElementById('gmember-input').value='';
  document.getElementById('gmember-results').innerHTML='';
  renderSelectedMembers();
}
function removeGroupMember(uid){ selectedGroupMembers=selectedGroupMembers.filter(m=>m.uid!==uid); renderSelectedMembers(); }
function renderSelectedMembers(){
  document.getElementById('gmembers-selected').innerHTML=selectedGroupMembers.map(m=>
    `<div style="display:flex;align-items:center;gap:5px;background:var(--gl);border:1px solid var(--g);border-radius:18px;padding:4px 10px;font-size:12px">
      ${escH(m.name)} <span style="cursor:pointer;color:var(--r);font-weight:700" onclick="removeGroupMember('${m.uid}')">✕</span>
    </div>`).join('');
}

async function createGroup(){
  const name=document.getElementById('gname').value.trim();
  if(!name){toast('Digite o nome do grupo.');return;}
  if(!selectedGroupMembers.length){toast('Adicione pelo menos 1 membro.');return;}
  const gid=Date.now().toString(36)+Math.random().toString(36).slice(2,5);
  const members={[CU.uid]:true};
  selectedGroupMembers.forEach(m=>members[m.uid]=true);
  const groupData={id:gid,name,emoji:'👥',createdBy:CU.uid,members,createdAt:Date.now()};
  if(selectedGroupPhoto) groupData.photo=selectedGroupPhoto;
  await DB.ref('groups/'+gid).set(groupData);
  selectedGroupMembers=[]; selectedGroupEmoji='👥'; selectedGroupPhoto=null;
  document.getElementById('gname').value='';
  document.getElementById('gmembers-selected').innerHTML='';
  document.getElementById('group-photo-preview').innerHTML='👥';
  document.getElementById('group-photo-input').value='';
  closeModal('create-group-modal');
  toast('Grupo criado! 👥');
  setChatTab('groups',document.querySelectorAll('#chat-ftabs .ftab')[1]);
}

async function renderGroupsList(){
  const snap=await dbGet('groups');
  const groups=[]; snap.forEach(c=>{const g=c.val();if(g.members&&g.members[CU.uid])groups.push(g);});
  const el=document.getElementById('groups-list'); el.style.display='';
  if(!groups.length){el.innerHTML='<div class="es"><div class="ei">👥</div><div class="et">Sem grupos</div><div style="font-size:13px;color:var(--t3)">Crie um grupo!</div></div>';return;}
  const msSnap=await DB.ref('groupMessages').once('value');
  el.innerHTML=groups.map(g=>{
    const gsnap=msSnap.child(g.id); const gmsgs=snapshotToArray(gsnap);
    gmsgs.sort((a,b)=>a.ts-b.ts);
    const last=gmsgs.length?gmsgs[gmsgs.length-1]:null;
    const avatarHTML=g.photo?`<img src="${imgSrc(g.photo)}" alt="">`:(g.emoji||'👥');
    return`<div class="gc-item" onclick="openGroupChat('${g.id}')">
      <div class="gc-av">${avatarHTML}</div>
      <div style="flex:1;min-width:0">
        <div class="chun">${escH(g.name)}</div>
        <div class="chup">${last?escH(last.senderName)+': '+escH(last.text):'Nenhuma mensagem ainda'}</div>
      </div>
      ${last?`<span style="font-size:11px;color:var(--t3);flex-shrink:0">${ta(last.ts)}</span>`:''}
    </div>`;
  }).join('');
}

async function openGroupChat(gid){
  const snap=await dbGet('groups/'+gid);
  groupChatWith=snap.val(); if(!groupChatWith) return;
  currentGroupId=gid;
  document.getElementById('gcwn').textContent=groupChatWith.name;
  const gcwAv=document.getElementById('gcw-av');
  if(groupChatWith.photo){ gcwAv.innerHTML=`<img src="${imgSrc(groupChatWith.photo)}" style="width:100%;height:100%;object-fit:cover;border-radius:10px" alt="">`; }
  else { gcwAv.innerHTML=groupChatWith.emoji||'👥'; }
  const memberCount=Object.keys(groupChatWith.members||{}).length;
  document.getElementById('gcw-members').textContent=memberCount+' membro'+(memberCount!==1?'s':'')+' · toque para detalhes';
  document.getElementById('gcw').classList.add('on');
  if(groupMsgListener){ groupMsgListener(); groupMsgListener=null; }
  const ref=DB.ref('groupMessages/'+gid).orderByChild('ts').limitToLast(200);
  ref.on('value', groupSnap=>{
    const msgs=[]; groupSnap.forEach(msgChild=>{ msgs.push(msgChild.val()); });
    msgs.sort((a,b)=>(a.ts||0)-(b.ts||0)); // ✅ ordena por timestamp crescente
    const msgContainer=document.getElementById('gcms');
    if(!msgContainer) return;
    if(!msgs.length){ msgContainer.innerHTML=`<div class="es"><div class="ei">👋</div><div class="et">Início do grupo</div><div style="font-size:13px;color:var(--t3)">Seja o primeiro a falar!</div></div>`; return; }
    msgContainer.innerHTML=msgs.map(m=>`
      <div style="display:flex;flex-direction:column;align-self:${m.from===CU.uid?'flex-end':'flex-start'};max-width:75%">
        ${m.from!==CU.uid?`<div style="font-size:10px;color:var(--t3);margin-bottom:2px;padding-left:4px">${escH(m.senderName||'?')}</div>`:''}
        <div class="mb ${m.from===CU.uid?'mi':'mt'}">${escH(m.text)}<div class="mt2">${ta(m.ts)}</div></div>
      </div>`).join('');
    msgContainer.scrollTop=msgContainer.scrollHeight;
  });
  groupMsgListener=()=>ref.off('value');
}

function closeGroupChat(){
  if(groupMsgListener){ groupMsgListener(); groupMsgListener=null; }
  document.getElementById('gcw').classList.remove('on');
  groupChatWith=null; currentGroupId=null; renderGroupsList();
}

async function sndGroupMsg(){
  const inp=document.getElementById('gcmi');
  const txt=inp.value.trim();
  if(!txt) return;
  if(!currentGroupId){ toast('Erro: grupo não identificado.'); return; }
  inp.value=''; inp.focus();
  const gid=currentGroupId;
  try{
    await DB.ref('groupMessages/'+gid).push({from:CU.uid,senderName:CU.name,text:txt,ts:Date.now()});
    await DB.ref('users/'+CU.uid+'/msgCount').transaction(v=>(v||0)+1);
    CU.msgCount=(CU.msgCount||0)+1; checkAndAwardBadges();
  }catch(e){ toast('Erro ao enviar mensagem.'); }
}

// ══════════════════════════════════════════════════════════════
// MODULE: BADGES
// ══════════════════════════════════════════════════════════════
function renderBadgesForUser(u, containerId){
  const el=document.getElementById(containerId); if(!el) return;
  el.innerHTML=getBadgeDefs().map(b=>{
    const earned=b.check(u);
    return`<div class="bdg ${earned?'earned':''}" title="${b.desc}">
      <div class="bdg-icon">${b.icon}</div>
      <div class="bdg-name">${b.name}</div>
    </div>`;
  }).join('');
}

async function checkAndAwardBadges(){
  try {
    // Re-fetch do usuário para ter contadores atualizados (evita cache stale)
    const snap = await DB.ref('users/' + CU.uid).once('value');
    const freshUser = snap.val();
    if (!freshUser) return;
    Object.assign(CU, freshUser);
    usersCache[CU.uid] = { ...CU };

    const defs = getBadgeDefs();
    const newBadges = defs.filter(b => b.check(CU) && !(CU.badges || {})[b.id]);
    for(const b of newBadges){
      await DB.ref('users/' + CU.uid + '/badges/' + b.id).set(true);
      if(!CU.badges) CU.badges = {};
      CU.badges[b.id] = true;
      toast('🏅 Badge conquistada: ' + b.name + '!');
      await new Promise(r => setTimeout(r, 1500));
    }
  } catch(e) { console.warn('checkAndAwardBadges error:', e.message); }
}

// ══════════════════════════════════════════════════════════════
// MODULE: GROUP DETAIL
// ══════════════════════════════════════════════════════════════
async function openGroupDetail(){
  if(!groupChatWith) return;
  const g=groupChatWith;
  const isCreator=g.createdBy===CU.uid||CU.role==='admin';
  document.getElementById('gd-edit-btn').style.display=isCreator?'block':'none';

  // Seção de adicionar membro (apenas para criador/admin)
  const addSection = document.getElementById('gd-add-member-section');
  if(addSection) addSection.style.display = isCreator ? 'block' : 'none';

  const memberUids=Object.keys(g.members||{});
  const memberItems=memberUids.map(uid=>{
    const u=usersCache[uid];
    if(!u) return`<div class="gd-member"><div class="gd-mav">?</div><div><div style="font-size:14px;font-weight:600">Carregando...</div></div></div>`;
    const isOwner=uid===g.createdBy;
    return`<div class="gd-member">
      <div class="gd-mav">${u.photo?`<img src="${imgSrc(u.photo)}" alt="">`:ini(u.name)}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:14px;font-weight:600">${escH(u.name)} ${isOwner?'<span style="font-size:10px;color:var(--g)">👑 Admin</span>':''}</div>
        <div style="font-size:12px;color:var(--t3)">@${escH(u.handle)} · ${getRoleBadgeHTML(u.role||'aluno')}</div>
      </div>
      ${isCreator&&uid!==CU.uid?`<button class="btn-r" onclick="removeMemberFromGroup('${uid}')" style="font-size:11px;padding:4px 8px">Remover</button>`:''}
    </div>`;
  }).join('');
  const avatarHTML=g.photo?`<img src="${imgSrc(g.photo)}" style="width:100%;height:100%;object-fit:cover;border-radius:16px" alt="">`:`<div style="font-size:40px">${g.emoji||'👥'}</div>`;
  document.getElementById('group-detail-content').innerHTML=`
    <div style="text-align:center;margin-bottom:20px">
      <div style="width:80px;height:80px;border-radius:16px;background:var(--purple);color:#fff;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;overflow:hidden;border:3px solid var(--bd)">${avatarHTML}</div>
      <div style="font-family:'Syne',sans-serif;font-size:20px;font-weight:800">${escH(g.name)}</div>
      ${g.description?`<div style="font-size:13px;color:var(--t2);margin-top:4px">${escH(g.description)}</div>`:''}
      <div style="font-size:12px;color:var(--t3);margin-top:6px">${memberUids.length} membro${memberUids.length!==1?'s':''}</div>
    </div>
    <div style="font-size:12px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Membros</div>
    ${memberItems}`;
  document.getElementById('group-detail-overlay').classList.add('on');
}
function closeGroupDetail(){ document.getElementById('group-detail-overlay').classList.remove('on'); }

/**
 * Busca membros para adicionar a um grupo existente (na tela de detalhes).
 */
let _addMemberTimeout = null;
function searchAddGroupMember(){
  clearTimeout(_addMemberTimeout);
  const q = document.getElementById('gd-member-search').value.toLowerCase().trim().replace(/^@/,'');
  if(!q){ document.getElementById('gd-member-results').innerHTML=''; return; }
  _addMemberTimeout = setTimeout(()=>{
    const currentMembers = groupChatWith?.members || {};
    const results = Object.values(usersCache).filter(u=>
      u.uid !== CU.uid &&
      !currentMembers[u.uid] &&
      (u.name.toLowerCase().includes(q) || u.handle.includes(q))
    ).slice(0,5);
    document.getElementById('gd-member-results').innerHTML = results.map(u=>
      `<div style="display:flex;align-items:center;gap:8px;padding:7px;cursor:pointer;border-radius:8px;background:var(--s2);margin-bottom:4px" onclick="addMemberToExistingGroup('${u.uid}','${escH(u.name)}')">
        <div style="width:28px;height:28px;border-radius:50%;background:var(--g);color:#fff;display:flex;align-items:center;justify-content:center;font-size:10px;overflow:hidden">${u.photo?`<img src="${imgSrc(u.photo)}" style="width:100%;height:100%;object-fit:cover">`:ini(u.name)}</div>
        <div><div style="font-size:13px;font-weight:600">${escH(u.name)}</div><div style="font-size:11px;color:var(--t3)">@${escH(u.handle)}</div></div>
        <span style="margin-left:auto;font-size:12px;color:var(--g);font-weight:600">+ Adicionar</span>
      </div>`
    ).join('');
  }, 300);
}

/**
 * Adiciona um membro a um grupo já existente (sem precisar recriar o grupo).
 */
async function addMemberToExistingGroup(uid, name){
  if(!currentGroupId || !groupChatWith) return;
  await DB.ref('groups/'+currentGroupId+'/members/'+uid).set(true);
  if(!groupChatWith.members) groupChatWith.members = {};
  groupChatWith.members[uid] = true;
  document.getElementById('gd-member-search').value = '';
  document.getElementById('gd-member-results').innerHTML = '';
  toast(`${escH(name)} adicionado ao grupo ✅`);
  openGroupDetail(); // Recarrega a lista de membros
}

function previewEditGroupPhoto(e){
  const f=e.target.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=ev=>{
    const img=new Image();
    img.onload=()=>{
      const canvas=document.createElement('canvas'); const S=200;
      canvas.width=S; canvas.height=S;
      const ctx=canvas.getContext('2d');
      const side=Math.min(img.width,img.height);
      ctx.drawImage(img,(img.width-side)/2,(img.height-side)/2,side,side,0,0,S,S);
      editGroupPhotoData=canvas.toDataURL('image/jpeg',0.80);
      document.getElementById('eg-photo-preview').innerHTML=`<img src="${editGroupPhotoData}" style="width:100%;height:100%;object-fit:cover;border-radius:10px" alt="">`;
    }; img.src=ev.target.result;
  }; r.readAsDataURL(f);
}

async function saveGroupEdit(){
  if(!groupChatWith||!currentGroupId) return;
  const name=document.getElementById('eg-name').value.trim();
  const desc=document.getElementById('eg-desc').value.trim();
  if(!name){toast('Nome do grupo é obrigatório.');return;}
  const updates={name,description:desc};
  if(editGroupPhotoData) updates.photo=editGroupPhotoData;
  await DB.ref('groups/'+currentGroupId).update(updates);
  Object.assign(groupChatWith,updates);
  document.getElementById('gcwn').textContent=name;
  if(editGroupPhotoData){
    const gcwAv=document.getElementById('gcw-av');
    gcwAv.innerHTML=`<img src="${imgSrc(editGroupPhotoData)}" style="width:100%;height:100%;object-fit:cover;border-radius:10px" alt="">`;
  }
  editGroupPhotoData=null;
  closeModal('edit-group-modal'); openGroupDetail();
  toast('Grupo atualizado ✅');
}

function populateEditGroupModal(){
  if(!groupChatWith) return;
  document.getElementById('eg-name').value=groupChatWith.name||'';
  document.getElementById('eg-desc').value=groupChatWith.description||'';
  const prev=document.getElementById('eg-photo-preview');
  prev.innerHTML=groupChatWith.photo?`<img src="${imgSrc(groupChatWith.photo)}" style="width:100%;height:100%;object-fit:cover;border-radius:10px" alt="">`:(groupChatWith.emoji||'👥');
  editGroupPhotoData=null;
}

async function removeMemberFromGroup(uid){
  if(!currentGroupId||!groupChatWith) return;
  if(!confirm('Remover este membro do grupo?')) return;
  await DB.ref('groups/'+currentGroupId+'/members/'+uid).remove();
  delete groupChatWith.members[uid];
  openGroupDetail(); toast('Membro removido.');
}

async function leaveGroup(){
  if(!currentGroupId) return;
  if(!confirm('Sair deste grupo?')) return;
  await DB.ref('groups/'+currentGroupId+'/members/'+CU.uid).remove();
  closeGroupDetail(); closeGroupChat(); toast('Você saiu do grupo.');
}

// ══════════════════════════════════════════════════════════════
// MODULE: RESUMOS
// ══════════════════════════════════════════════════════════════
function getSubjectIcon(subjectName){
  const found=CONFIG.subjects.find(s=>s.name===subjectName);
  return found?found.icon:'📌';
}

function renderResumos(){
  if(resumoListener){ resumoListener(); resumoListener=null; }
  currentSubject=null; resumoFilterType='all';
  // Garante que o container de PDF não bloqueie o layout
  const pdfSection = document.getElementById('horario-pdf-section');
  if (pdfSection) pdfSection.style.display = 'none';
  const container=document.getElementById('resumos-content');
  if (!container) return;
  container.style.display = 'block';
  container.innerHTML=`
    <div class="ptitle">📚 Resumos</div>
    <p style="color:var(--t2);font-size:14px;margin-bottom:16px">Selecione uma matéria para ver os resumos compartilhados</p>
    <div class="subject-grid">
      ${CONFIG.subjects.map(s=>`
        <div class="subject-card" onclick="selectSubject('${escH(s.name)}')">
          <div class="subject-icon">${s.icon}</div>
          <div class="subject-name">${escH(s.name)}</div>
        </div>`).join('')}
    </div>`;
  pageCache.resumos=true;
}

function selectSubject(subjectName){
  currentSubject=subjectName;
  const icon=getSubjectIcon(subjectName);
  const container=document.getElementById('resumos-content');
  if (!container) return;
  container.style.display = 'block';
  container.innerHTML=`
    <div class="resumo-header">
      <button class="cbk" onclick="renderResumos()" title="Voltar">←</button>
      <div>
        <div class="ptitle" style="margin-bottom:0">${icon} ${escH(subjectName)}</div>
        <div style="font-size:12px;color:var(--t3)">Resumos da comunidade</div>
      </div>
    </div>
    <div class="cp" id="resumo-composer">
      <div class="cp-top">
        <div class="pav" id="resumo-cav">${CU.photo?`<img src="${imgSrc(CU.photo)}" alt="">`:ini(CU.name)}</div>
        <textarea class="pta" id="resumo-text" placeholder="Compartilhe seu resumo de ${escH(subjectName)}..."></textarea>
      </div>
      <div id="resumo-img-preview" class="ppi" style="display:none">
        <img id="resumo-img-el" src="" alt="Preview do resumo">
        <button class="rim" onclick="removeResumoImg()" title="Remover imagem">✕</button>
      </div>
      <div class="cp-bot">
        <label class="tb" for="resumo-img-input" style="cursor:pointer">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          Imagem <input type="file" id="resumo-img-input" accept="image/*" style="display:none" onchange="handleResumoImg(event)">
        </label>
        <button class="btn btn-s" onclick="publishResumo()">Publicar</button>
      </div>
    </div>
    <div class="ftabs" id="resumo-filter-tabs">
      <button class="ftab on"  onclick="setResumoFilter('all',   this)">Todos</button>
      <button class="ftab"     onclick="setResumoFilter('text',  this)">📝 Só texto</button>
      <button class="ftab"     onclick="setResumoFilter('image', this)">🖼️ Só imagem</button>
      <button class="ftab"     onclick="setResumoFilter('both',  this)">📄 Texto + Imagem</button>
    </div>
    <div id="resumo-feed">${skelCards(3)}</div>`;
  startResumoFeedListener();
}

function handleResumoImg(e){
  const file=e.target.files[0]; if(!file) return;
  if(file.size>2*1024*1024){toast('Imagem muito grande! Máximo 2 MB.');return;}
  const reader=new FileReader();
  reader.onload=ev=>{
    const img=new Image();
    img.onload=()=>{
      const MAX=800; let w=img.width, h=img.height;
      if(w>MAX){h=Math.round(h*MAX/w);w=MAX;}
      const canvas=document.createElement('canvas');
      canvas.width=w; canvas.height=h;
      canvas.getContext('2d').drawImage(img,0,0,w,h);
      resumoImgData=canvas.toDataURL('image/jpeg',0.75);
      document.getElementById('resumo-img-el').src=resumoImgData;
      document.getElementById('resumo-img-preview').style.display='block';
    }; img.src=ev.target.result;
  }; reader.readAsDataURL(file);
}
function removeResumoImg(){
  resumoImgData=null;
  document.getElementById('resumo-img-preview').style.display='none';
  document.getElementById('resumo-img-el').src='';
  document.getElementById('resumo-img-input').value='';
}

async function publishResumo(){
  const text=document.getElementById('resumo-text').value.trim();
  if(!text&&!resumoImgData){toast('Adicione texto ou imagem ao resumo!');return;}
  if(!currentSubject){toast('Selecione uma matéria primeiro.');return;}
  const id=Date.now().toString(36)+Math.random().toString(36).slice(2,5);
  const payload={id,uid:CU.uid,author:CU.name,handle:CU.handle,authorRole:CU.role||'aluno',
    authorPhoto:CU.photo||'',subject:currentSubject,text:text||'',image:resumoImgData||'',likes:{},ts:Date.now()};
  try{
    await DB.ref('resumos/'+id).set(payload);
    document.getElementById('resumo-text').value=''; removeResumoImg();
    await DB.ref('users/'+CU.uid+'/postCount').transaction(v=>(v||0)+1);
    CU.postCount=(CU.postCount||0)+1; checkAndAwardBadges();
    pageCache.profile=false; toast('Resumo publicado! 📚');
  }catch(err){ toast('Erro ao publicar. Imagem muito grande?'); }
}

function startResumoFeedListener(){
  if(resumoListener){ resumoListener(); resumoListener=null; }
  const feedEl=document.getElementById('resumo-feed');
  if(!feedEl||!currentSubject) return;
  const ref=DB.ref('resumos').orderByChild('subject').equalTo(currentSubject);
  ref.on('value', snapshot=>{
    const all=snapshotToArrayDesc(snapshot);
    const filtered=applyResumoFilter(all,resumoFilterType);
    const feedContainer=document.getElementById('resumo-feed');
    if(!feedContainer) return;
    if(!filtered.length){
      feedContainer.innerHTML=`<div class="es"><div class="ei">📭</div><div class="et">Nenhum resumo ainda</div><div style="font-size:13px;color:var(--t3)">Seja o primeiro a compartilhar!</div></div>`;
      return;
    }
    feedContainer.innerHTML=filtered.map(r=>buildResumoCardHTML(r)).join('');
  });
  resumoListener=()=>ref.off('value');
}

function setResumoFilter(type, el){
  resumoFilterType=type;
  document.querySelectorAll('#resumo-filter-tabs .ftab').forEach(x=>x.classList.remove('on'));
  el.classList.add('on'); startResumoFeedListener();
}

function applyResumoFilter(resumos, filterType){
  switch(filterType){
    case 'text':  return resumos.filter(r=>  r.text && !r.image);
    case 'image': return resumos.filter(r=> !r.text &&  r.image);
    case 'both':  return resumos.filter(r=>  r.text &&  r.image);
    default:      return resumos;
  }
}

function buildResumoCardHTML(r){
  const likeUids=r.likes?Object.keys(r.likes):[];
  const isLiked=likeUids.includes(CU.uid);
  const authorPhoto=getPhoto(r.uid,r.authorPhoto);
  const canDelete=r.uid===CU.uid||CU.role==='admin';
  const subjectTag=`<span class="resumo-subject-tag">${getSubjectIcon(r.subject)} ${escH(r.subject)}</span>`;
  return`<div class="pc">
    <div class="ph">
      <div class="pav" onclick="openOtherProfile('${r.uid}')">${authorPhoto?`<img src="${imgSrc(authorPhoto)}" alt="">`:ini(r.author)}</div>
      <div style="flex:1;min-width:0">
        <div class="pa" onclick="openOtherProfile('${r.uid}')">${escH(r.author)}</div>
        <div class="pm">@${escH(r.handle)} · ${ta(r.ts)} ${subjectTag}</div>
        <div style="margin-top:2px">${getRoleBadgeHTML(r.authorRole||'aluno')}</div>
      </div>
      ${canDelete?`<button style="background:none;border:none;cursor:pointer;color:var(--t3);font-size:17px;padding:4px;flex-shrink:0" onclick="deleteResumo('${r.id}')">🗑</button>`:''}
    </div>
    ${r.text?`<div class="pt">${escH(r.text)}</div>`:''}
    ${r.image?`<div class="pi"><img src="${imgSrc(r.image)}" loading="lazy" alt="Resumo de ${escH(r.subject)}"></div>`:''}
    <div class="pac">
      <button class="ab ${isLiked?'lkd':''}" onclick="toggleResumoLike('${r.id}',${isLiked})">
        <svg viewBox="0 0 24 24" fill="${isLiked?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        ${likeUids.length}
      </button>
      ${r.image?`<button class="ab post-action-btn" onclick="downloadPostImage('${escH(r.image)}','${r.id}')" title="Baixar imagem">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Baixar
      </button>`:''}
    </div>
  </div>`;
}

async function toggleResumoLike(resumoId, currentlyLiked){
  const ref=DB.ref('resumos/'+resumoId+'/likes/'+CU.uid);
  if(currentlyLiked) await ref.remove(); else await ref.set(true);
}
async function deleteResumo(resumoId){
  if(!confirm('Excluir este resumo?')) return;
  await DB.ref('resumos/'+resumoId).remove(); toast('Resumo excluído.');
}

// ══════════════════════════════════════════════════════════════
// MODULE: ADMIN PANEL
// ══════════════════════════════════════════════════════════════

function requireAdmin(){
  if(!CU||CU.role!=='admin'){ toast('⛔ Acesso negado: apenas admins.'); return false; }
  return true;
}

async function renderAdminDb(){
  if(!requireAdmin()) return;
  await ensureRolesAuth();
  currentAdminTab='db';
  document.getElementById('admin-db-content').innerHTML=`
    <div class="ptitle">🛡️ Painel Admin</div>
    <div class="ftabs" id="admin-main-tabs" style="margin-bottom:16px">
      <button class="ftab on"  onclick="setAdminTab('db',     this)">🗄️ Banco</button>
      <button class="ftab"     onclick="setAdminTab('users',  this)">👥 Usuários</button>
      <button class="ftab"     onclick="setAdminTab('config', this)">⚙️ Config</button>
    </div>
    <div id="admin-tab-content"></div>`;
  renderAdminDbContent();
}

function setAdminTab(tab, el){
  currentAdminTab=tab;
  document.querySelectorAll('#admin-main-tabs .ftab').forEach(x=>x.classList.remove('on'));
  el.classList.add('on');
  if(tab==='db')     renderAdminDbContent();
  if(tab==='users')  renderAdminUsers();
  if(tab==='config') renderAdminConfig();
}

async function renderAdminDbContent(){
  const snap=await dbGet('users');
  const allUsers=snapshotToArray(snap);
  const nonAdminCount=allUsers.filter(u=>u.role!=='admin').length;
  document.getElementById('admin-tab-content').innerHTML=`
    <div class="warn-box">⚠️ As ações abaixo são <strong>irreversíveis</strong>.</div>
    <div class="admin-db-card">
      <div class="admin-db-card-title">💬 Mensagens</div>
      <div class="admin-db-card-desc">Apaga todas as mensagens diretas e de grupo.</div>
      <button class="btn btn-r btn-s" style="margin-top:10px" onclick="adminDeleteAllMessages()">🗑 Apagar todas as mensagens</button>
    </div>
    <div class="admin-db-card">
      <div class="admin-db-card-title">👥 Usuários não-admin (${nonAdminCount})</div>
      <div class="admin-db-card-desc">Deleta alunos e professores, incluindo seus posts.</div>
      <button class="btn btn-r btn-s" style="margin-top:10px" onclick="adminDeleteNonAdminUsers()">🗑 Deletar usuários não-admin</button>
    </div>`;
}

/**
 * Painel de usuários com busca em tempo real e filtro por cargo.
 */
async function renderAdminUsers(){
  document.getElementById('admin-tab-content').innerHTML=`
    <div style="margin-bottom:14px">
      <div class="sb" style="margin-bottom:10px">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Buscar por nome, @usuário, email ou campus..." id="admin-user-search" oninput="filterAdminUsers()" style="flex:1;border:none;background:transparent;outline:none;font-size:14px;color:var(--t1)">
      </div>
      <div class="ftabs" id="admin-role-filter" style="flex-wrap:wrap;gap:4px;margin-bottom:10px">
        <button class="ftab on" onclick="setAdminRoleFilter('all',this)">Todos</button>
        <button class="ftab" onclick="setAdminRoleFilter('aluno',this)">👤 Alunos</button>
        <button class="ftab" onclick="setAdminRoleFilter('professor',this)">🎓 Professores</button>
        <button class="ftab" onclick="setAdminRoleFilter('admin',this)">🛡️ Admins</button>
      </div>
      <div style="font-size:13px;color:var(--t2)" id="admin-user-count">⏳ Carregando...</div>
    </div>
    <div id="admin-users-list"><div class="loading">⏳ Carregando usuários...</div></div>`;
  if(!Object.keys(usersCache).length) await loadUsersCache();
  window._adminUsersAll = Object.values(usersCache).sort((a,b)=>(a.name||'').localeCompare(b.name||''));
  window._adminRoleFilter = 'all';
  filterAdminUsers();
}

function setAdminRoleFilter(role, el){
  window._adminRoleFilter = role;
  document.querySelectorAll('#admin-role-filter .ftab').forEach(x=>x.classList.remove('on'));
  el.classList.add('on');
  filterAdminUsers();
}

function filterAdminUsers(){
  const query  = (document.getElementById('admin-user-search')?.value||'').toLowerCase().trim();
  const roleF  = window._adminRoleFilter || 'all';
  const all    = window._adminUsersAll || [];
  const filtered = all.filter(u=>{
    if(roleF !== 'all' && u.role !== roleF) return false;
    if(query){
      const hay = [u.name,u.handle,u.email,u.campus].map(x=>(x||'').toLowerCase()).join(' ');
      if(!hay.includes(query)) return false;
    }
    return true;
  });
  const listEl  = document.getElementById('admin-users-list');
  const countEl = document.getElementById('admin-user-count');
  if(countEl) countEl.textContent=`${filtered.length} de ${all.length} usuário(s)`;
  if(!filtered.length){
    listEl.innerHTML='<div class="es"><div class="ei">🔎</div><div class="et">Nenhum usuário encontrado</div></div>';
    return;
  }
  listEl.innerHTML=filtered.map(u=>`
    <div style="background:var(--su);border:1px solid var(--bd);border-radius:var(--ra);padding:12px;margin-bottom:8px;display:flex;align-items:center;gap:10px;box-shadow:var(--sh)">
      <div class="pav" style="width:36px;height:36px;flex-shrink:0">${u.photo?`<img src="${imgSrc(u.photo)}" alt="">`:ini(u.name)}</div>
      <div style="flex:1;min-width:0">
        <div style="font-weight:600;font-size:14px">${escH(u.name)}</div>
        <div style="font-size:11px;color:var(--t3)">@${escH(u.handle)} · ${escH(u.campus||'—')}</div>
        <div style="font-size:11px;color:var(--t3)">${escH(u.email||'')}</div>
        <div style="margin-top:3px">${getRoleBadgeHTML(u.role||'aluno')}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0">
        <button class="btn btn-s" style="font-size:11px" onclick="openOtherProfile('${u.uid}')">👁 Perfil</button>
        <button class="btn btn-s" style="background:var(--gold);border:none;font-size:11px" onclick="openAdminRoleModal('${u.uid}')">🔄 Cargo</button>
        ${u.uid!==CU.uid?`<button class="btn btn-s" style="background:var(--r);border:none;color:#fff;font-size:11px" onclick="openPunishFromAdmin('${u.uid}','${escH(u.name).replace(/'/g,"\\'")}')">⚖️ Punir</button>`:''}
        ${u.uid!==CU.uid?`<button class="btn-r" style="font-size:11px;padding:4px 8px" onclick="adminDeleteUser('${u.uid}')">🗑</button>`:''}
      </div>
    </div>`).join('');
}

// ── ADMIN CONFIG ──────────────────────────────────────────────
function renderAdminConfig(){
  document.getElementById('admin-tab-content').innerHTML=`
    <div class="ftabs" id="admin-cfg-tabs" style="flex-wrap:wrap;margin-bottom:14px">
      <button class="ftab on"  onclick="setAdminCfgSection('subjects',      this)">📚 Matérias</button>
      <button class="ftab"     onclick="setAdminCfgSection('blockedWords',  this)">🚫 Palavras</button>
      <button class="ftab"     onclick="setAdminCfgSection('badges',        this)">🏅 Badges</button>
      <button class="ftab"     onclick="setAdminCfgSection('campuses',      this)">🏫 Campi</button>
      <button class="ftab"     onclick="setAdminCfgSection('courses',       this)">📖 Cursos</button>
      <button class="ftab"     onclick="setAdminCfgSection('allowedDomains',this)">📧 E-mails</button>
    </div>
    <div id="admin-cfg-content"></div>`;
  renderAdminCfgSubjects();
}

function setAdminCfgSection(section, el){
  currentAdminConfigSection=section;
  document.querySelectorAll('#admin-cfg-tabs .ftab').forEach(x=>x.classList.remove('on'));
  el.classList.add('on');
  if(section==='subjects')      renderAdminCfgSubjects();
  if(section==='blockedWords')  renderAdminCfgBlockedWords();
  if(section==='badges')        renderAdminCfgBadges();
  if(section==='campuses')      renderAdminCfgCampuses();
  if(section==='courses')       renderAdminCfgCourses();
  if(section==='allowedDomains')renderAdminCfgAllowedDomains();
}

// ── Matérias ──
function renderAdminCfgSubjects(){
  const el=document.getElementById('admin-cfg-content');
  el.innerHTML=`
    <div>
      <div style="font-size:13px;color:var(--t2);margin-bottom:12px">Matérias exibidas na aba Resumos.</div>
      <div id="cfg-subjects-list">
        ${CONFIG.subjects.map((s,i)=>`
          <div class="cfg-item" id="cfg-subj-${i}">
            <span style="font-size:20px">${s.icon}</span>
            <div style="flex:1;display:flex;gap:6px">
              <input class="fi" style="width:60px;padding:6px 8px;font-size:13px" value="${escH(s.icon)}" id="cfg-subj-icon-${i}" placeholder="📌" maxlength="4">
              <input class="fi" style="padding:6px 10px;font-size:13px" value="${escH(s.name)}" id="cfg-subj-name-${i}" placeholder="Nome">
            </div>
            <button class="btn-r" style="font-size:12px;padding:4px 8px;flex-shrink:0" onclick="removeSubject(${i})">✕</button>
          </div>`).join('')}
      </div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <input class="fi" style="padding:8px 12px;font-size:13px;width:60px" id="new-subj-icon" placeholder="📌" maxlength="4">
        <input class="fi" style="padding:8px 12px;font-size:13px" id="new-subj-name" placeholder="Nome da nova matéria">
        <button class="btn btn-s" onclick="addSubject()">+ Adicionar</button>
      </div>
      <button class="btn" style="margin-top:12px" onclick="saveSubjects()">💾 Salvar Matérias</button>
    </div>`;
}

function addSubject(){
  const icon=document.getElementById('new-subj-icon').value.trim()||'📌';
  const name=document.getElementById('new-subj-name').value.trim();
  if(!name){toast('Digite o nome da matéria.');return;}
  CONFIG.subjects.push({icon,name});
  document.getElementById('new-subj-icon').value='';
  document.getElementById('new-subj-name').value='';
  renderAdminCfgSubjects();
}
function removeSubject(i){ CONFIG.subjects.splice(i,1); renderAdminCfgSubjects(); }
async function saveSubjects(){
  const updated=[];
  document.querySelectorAll('#cfg-subjects-list .cfg-item').forEach((el,i)=>{
    const icon=document.getElementById('cfg-subj-icon-'+i)?.value.trim()||'📌';
    const name=document.getElementById('cfg-subj-name-'+i)?.value.trim();
    if(name) updated.push({icon,name});
  });
  await saveConfigSection('subjects', updated);
  toast('✅ Matérias salvas!'); renderAdminCfgSubjects();
}

// ── Palavras Bloqueadas ──
function renderAdminCfgBlockedWords(){
  const el=document.getElementById('admin-cfg-content');
  el.innerHTML=`
    <div>
      <div style="font-size:13px;color:var(--t2);margin-bottom:12px">Posts com estas palavras vão para moderação automaticamente.</div>
      <div id="cfg-words-list" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
        ${CONFIG.blockedWords.map((w,i)=>`
          <div style="display:flex;align-items:center;gap:5px;background:var(--gl);border:1px solid var(--g);border-radius:18px;padding:4px 10px;font-size:13px">
            ${escH(w)} <span style="cursor:pointer;color:var(--r);font-weight:700" onclick="removeBlockedWord(${i})">✕</span>
          </div>`).join('')}
      </div>
      <div style="display:flex;gap:8px;margin-bottom:12px">
        <input class="fi" style="padding:8px 12px;font-size:13px" id="new-word-input" placeholder="nova palavra" onkeydown="if(event.key==='Enter')addBlockedWord()">
        <button class="btn btn-s" onclick="addBlockedWord()">+ Adicionar</button>
      </div>
      <button class="btn" onclick="saveBlockedWords()">💾 Salvar Palavras</button>
    </div>`;
}
function addBlockedWord(){
  const w=document.getElementById('new-word-input').value.trim().toLowerCase();
  if(!w){toast('Digite uma palavra.');return;}
  if(CONFIG.blockedWords.includes(w)){toast('Palavra já está na lista.');return;}
  CONFIG.blockedWords.push(w);
  document.getElementById('new-word-input').value='';
  renderAdminCfgBlockedWords();
}
function removeBlockedWord(i){ CONFIG.blockedWords.splice(i,1); renderAdminCfgBlockedWords(); }
async function saveBlockedWords(){
  await saveConfigSection('blockedWords', CONFIG.blockedWords);
  toast('✅ Palavras bloqueadas salvas!');
}

// ── Badges ──
function renderAdminCfgBadges(){
  const el=document.getElementById('admin-cfg-content');
  el.innerHTML=`
    <div>
      <div style="font-size:13px;color:var(--t2);margin-bottom:12px">Edite ícone e nome das badges.</div>
      ${CONFIG.badges.map((b,i)=>`
        <div style="background:var(--su);border:1px solid var(--bd);border-radius:var(--rs);padding:10px 12px;margin-bottom:8px;display:flex;align-items:center;gap:10px">
          <input class="fi" id="badge-icon-${i}" value="${escH(b.icon)}" style="width:56px;text-align:center;font-size:18px;padding:6px" maxlength="4">
          <div style="flex:1">
            <input class="fi" id="badge-name-${i}" value="${escH(b.name)}" style="padding:6px 10px;font-size:13px;margin-bottom:4px" placeholder="Nome da badge">
            <div style="font-size:11px;color:var(--t3)">${escH(b.desc)}</div>
          </div>
        </div>`).join('')}
      <button class="btn" style="margin-top:4px" onclick="saveBadges()">💾 Salvar Badges</button>
    </div>`;
}
async function saveBadges(){
  const updated=CONFIG.badges.map((b,i)=>({
    id:    b.id,
    icon:  document.getElementById('badge-icon-'+i)?.value.trim()||b.icon,
    name:  document.getElementById('badge-name-'+i)?.value.trim()||b.name,
    desc:  b.desc,
  }));
  await saveConfigSection('badges', updated);
  toast('✅ Badges salvas!');
}

// ── Campi ──
function renderAdminCfgCampuses(){
  const el=document.getElementById('admin-cfg-content');
  el.innerHTML=`
    <div>
      <div style="font-size:13px;color:var(--t2);margin-bottom:12px">Campi disponíveis para seleção.</div>
      <div id="cfg-campus-list" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
        ${CONFIG.campuses.map((c,i)=>`
          <div style="display:flex;align-items:center;gap:5px;background:var(--s2);border:1px solid var(--bd);border-radius:18px;padding:4px 10px;font-size:13px">
            🏫 ${escH(c)} <span style="cursor:pointer;color:var(--r);font-weight:700" onclick="removeCampus(${i})">✕</span>
          </div>`).join('')}
      </div>
      <div style="display:flex;gap:8px;margin-bottom:12px">
        <input class="fi" style="padding:8px 12px;font-size:13px" id="new-campus-input" placeholder="Nome do campus" onkeydown="if(event.key==='Enter')addCampus()">
        <button class="btn btn-s" onclick="addCampus()">+ Adicionar</button>
      </div>
      <button class="btn" onclick="saveCampuses()">💾 Salvar Campi</button>
    </div>`;
}
function addCampus(){
  const c=document.getElementById('new-campus-input').value.trim();
  if(!c){toast('Digite o nome do campus.');return;}
  if(CONFIG.campuses.includes(c)){toast('Campus já existe.');return;}
  CONFIG.campuses.push(c);
  document.getElementById('new-campus-input').value='';
  renderAdminCfgCampuses();
}
function removeCampus(i){ CONFIG.campuses.splice(i,1); renderAdminCfgCampuses(); }
async function saveCampuses(){ await saveConfigSection('campuses', CONFIG.campuses); toast('✅ Campi salvos!'); }

// ── Cursos (com suporte a adicionar curso em grupo existente) ──
function renderAdminCfgCourses(){
  const groups=[...new Set(CONFIG.courses.map(c=>c.group))];
  const el=document.getElementById('admin-cfg-content');
  el.innerHTML=`
    <div>
      <div style="font-size:13px;color:var(--t2);margin-bottom:12px">Cursos organizados por grupo. Você pode adicionar cursos a grupos existentes.</div>
      ${groups.map(g=>`
        <div style="margin-bottom:14px;padding:10px;background:var(--s2);border-radius:var(--rs);border:1px solid var(--bd)">
          <div style="font-size:12px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">📖 ${escH(g)}</div>
          ${CONFIG.courses.filter(c=>c.group===g).map((c)=>{
            const globalIdx=CONFIG.courses.findIndex(x=>x.group===c.group&&x.name===c.name);
            return`<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
              <span style="font-size:13px;flex:1">${escH(c.name)}</span>
              <button class="btn-r" style="font-size:11px;padding:3px 8px" onclick="removeCourse(${globalIdx})">✕</button>
            </div>`;
          }).join('')}
          <!-- Adicionar curso a grupo existente -->
          <div class="group-course-add">
            <div style="font-size:11px;color:var(--t3);margin-bottom:4px">Adicionar curso a este grupo:</div>
            <div style="display:flex;gap:6px">
              <input class="fi" id="add-course-${escH(g)}" placeholder="Nome do novo curso" style="padding:6px 10px;font-size:12px" onkeydown="if(event.key==='Enter')addCourseToGroup('${escH(g)}')">
              <button class="btn btn-s" style="font-size:12px" onclick="addCourseToGroup('${escH(g)}')">+</button>
            </div>
          </div>
        </div>`).join('')}
      <div style="background:var(--s2);border-radius:var(--rs);padding:12px;margin-top:8px;border:1px solid var(--bd)">
        <div style="font-size:12px;font-weight:600;color:var(--t2);margin-bottom:8px">➕ Criar novo grupo e curso</div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <input class="fi" id="new-course-group" list="course-groups-dl" placeholder="Novo grupo (ex: Agronomia)" style="padding:8px 12px;font-size:13px">
          <datalist id="course-groups-dl">${groups.map(g=>`<option value="${escH(g)}">`).join('')}</datalist>
          <input class="fi" id="new-course-name" placeholder="Nome do curso" style="padding:8px 12px;font-size:13px" onkeydown="if(event.key==='Enter')addCourse()">
          <button class="btn btn-s" onclick="addCourse()">+ Adicionar Curso</button>
        </div>
      </div>
      <button class="btn" style="margin-top:12px" onclick="saveCourses()">💾 Salvar Cursos</button>
    </div>`;
}

/**
 * Adiciona um curso a um grupo já existente, diretamente na lista do grupo.
 */
function addCourseToGroup(group){
  const inputId = 'add-course-' + group;
  const nameInput = document.getElementById(inputId);
  if(!nameInput) return;
  const name = nameInput.value.trim();
  if(!name){ toast('Digite o nome do curso.'); return; }
  if(CONFIG.courses.find(c=>c.group===group&&c.name===name)){ toast('Curso já existe neste grupo.'); return; }
  CONFIG.courses.push({group, name});
  nameInput.value='';
  renderAdminCfgCourses();
}

function addCourse(){
  const group=document.getElementById('new-course-group').value.trim();
  const name =document.getElementById('new-course-name').value.trim();
  if(!group||!name){toast('Preencha grupo e nome do curso.');return;}
  if(CONFIG.courses.find(c=>c.group===group&&c.name===name)){toast('Curso já existe neste grupo.');return;}
  CONFIG.courses.push({group,name});
  document.getElementById('new-course-name').value='';
  renderAdminCfgCourses();
}
function removeCourse(i){ CONFIG.courses.splice(i,1); renderAdminCfgCourses(); }
async function saveCourses(){ await saveConfigSection('courses', CONFIG.courses); toast('✅ Cursos salvos!'); }

// ── Admin DB Actions ──
async function adminDeleteAllMessages(){
  if(!requireAdmin()) return;
  if(!confirm('Apagar TODAS as mensagens diretas e de grupo?')) return;
  if(!confirm('CONFIRMAÇÃO FINAL: esta ação não pode ser desfeita.')) return;
  try{
    loadingStart();
    await DB.ref().update({messages:null,groupMessages:null});
    loadingDone();
    toast('✅ Todas as mensagens foram apagadas.'); renderAdminDbContent();
  }catch(e){ loadingDone(); toast('Erro: '+e.message); }
}

async function adminDeleteNonAdminUsers(){
  if(!requireAdmin()) return;
  if(!confirm('Deletar TODOS os usuários não-admin e seus posts?')) return;
  if(!confirm('CONFIRMAÇÃO FINAL: esta ação não pode ser desfeita.')) return;
  try{
    loadingStart();
    const usersSnap=await DB.ref('users').once('value');
    const batch={};
    usersSnap.forEach(child=>{ const u=child.val(); if(u.role!=='admin') batch['users/'+u.uid]=null; });
    const postsSnap=await DB.ref('posts').once('value');
    postsSnap.forEach(child=>{ const p=child.val(); const owner=usersSnap.child(p.uid).val(); if(owner&&owner.role!=='admin') batch['posts/'+p.id]=null; });
    const count=Object.keys(batch).filter(k=>k.startsWith('users/')).length;
    await DB.ref().update(batch);
    loadingDone();
    await loadUsersCache();
    toast(`✅ ${count} usuário(s) deletados.`); renderAdminDbContent();
  }catch(e){ loadingDone(); toast('Erro: '+e.message); }
}

// ══════════════════════════════════════════════════════════════
// MODULE: UTILS
// ══════════════════════════════════════════════════════════════

/** Obtém valor de um input */
function gv(id){ const e=document.getElementById(id); return e?e.value:''; }

/** Esconde elemento */
function hi(id){ const e=document.getElementById(id); if(e)e.style.display='none'; }

/** Mostra elemento */
function sh(id){ const e=document.getElementById(id); if(e)e.style.display='block'; }

/** Gera iniciais para avatar (ex: "João Silva" -> "JS") */
function ini(n){ return String(n||'').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()||'?'; }

/** Formata timestamp para tempo relativo (ex: 5m, 2h, 1d) */
function ta(ts){ 
  const s=Math.floor((Date.now()-ts)/1000); 
  if(s<60)return'agora'; 
  if(s<3600)return Math.floor(s/60)+'m'; 
  if(s<86400)return Math.floor(s/3600)+'h'; 
  return Math.floor(s/86400)+'d'; 
}

/** Escapa HTML para evitar XSS */
function escH(s){ 
  return String(s||'')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/\"/g,'&quot;'); 
}

/** Exibe mensagem flutuante temporária */
function toast(msg){ 
  const t = document.getElementById('toast'); 
  if(!t) return;
  t.textContent = msg; 
  t.classList.add('on'); 
  setTimeout(() => t.classList.remove('on'), 2800); 
}

/** Abre um modal pelo ID */
function openModal(id){ 
  const m = document.getElementById(id);
  if(m) m.classList.add('on'); 
}

/** Fecha um modal pelo ID */
function closeModal(id){ 
  const m = document.getElementById(id);
  if(m) m.classList.remove('on'); 
}

/** Fecha modais ao clicar no fundo escuro */
document.querySelectorAll('.modal-bg').forEach(el => {
  el.addEventListener('click', e => {
    if(e.target === el) el.classList.remove('on');
  });
});

// ══════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════

(async () => {
  // Inicia barra de carregamento global
  loadingStart();
  
  try {
    // Inicializa o Firebase e carrega as configurações do banco
    await initFB();
    
    // Verifica se existe uma sessão ativa (Login automático)
    const sessionActive = await checkSession();
    
    // Se não houver sessão, aplica o tema e mostra a tela de login
    if (!sessionActive) {
      applyTheme();
      hi('splash');
      sh('auth');
      stab('login');
    }
  } catch (error) {
    console.error("Falha na inicialização do sistema:", error);
    toast("Erro ao conectar com o servidor. Verifique sua rede.");
  } finally {
    // Finaliza a barra de carregamento independentemente do resultado
    loadingDone();
  }
})();

async function startApp(u){
  if (!u.uid && AUTH.currentUser) u.uid = AUTH.currentUser.uid;

  // ── Verifica status de ban/timeout antes de entrar ──
  const banSnap = await dbGet('users/' + u.uid + '/status');
  const status  = banSnap.val();
  if (status === 'banned' || (status && status.type === 'banned')) { showBanScreen('banned', u, status || {}); return; }
  if (status && status.type === 'timeout') {
    if (Date.now() < status.until) { showBanScreen('timeout', u, status); return; }
    // Timeout expirado — limpa automaticamente
    await DB.ref('users/' + u.uid + '/status').remove();
  }

  CU = u;
  document.getElementById('splash').style.display        = 'none';
  document.getElementById('auth').style.display          = 'none';
  document.getElementById('verify-screen').style.display = 'none';
  document.getElementById('app').style.display           = 'block';
  const banScreen = document.getElementById('ban-screen');
  if (banScreen) banScreen.style.display = 'none';
  applyTheme();
  await loadUsersCache();
  updAv(); applyRolePermissions();
  loadUserSettings();
  go('feed');
  setTimeout(() => checkAndAwardBadges(), 3000);
  startUnreadBadgeListener();
  startNotifListener();
  setOnlineStatus(true);
}

// ═══════════════════════════════════════════════
// MÓDULOS NOVOS — IFConnect v3
// ═══════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════
// ██████████████  NOVOS MÓDULOS — IFConnect v3  ███████████████
// ══════════════════════════════════════════════════════════════

// ── CLOUDINARY CONFIG ──────────────────────────────────────────
const CLOUDINARY_CLOUD  = 'dkdi964ff';
const CLOUDINARY_PRESET = 'ifconnect_uploads';
const CLOUDINARY_URL    = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`;

/**
 * Faz upload de um File para o Cloudinary via fetch (sem SDK).
 * Substitui toda a lógica Base64 anterior.
 * @param {File|Blob} file
 * @returns {Promise<string>} URL pública segura (https)
 */
async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_PRESET);
  const res  = await fetch(CLOUDINARY_URL, { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Cloudinary upload failed: ' + res.status);
  const data = await res.json();
  return data.secure_url;
}

// ══════════════════════════════════════════════════════════════
// MODULE: IMAGE UPLOAD (multi-foto, até 4) — substitui imgUp()
// ══════════════════════════════════════════════════════════════

/** Array de URLs Cloudinary para o post atual */
let postImages = [];

/**
 * Handler para o <input type="file" multiple> do compositor.
 * Faz upload de até 4 imagens no Cloudinary e atualiza preview.
 */
async function imgUp(e) {
  const files = Array.from(e.target.files || []).slice(0, 4 - postImages.length);
  if (!files.length) return;
  if (postImages.length + files.length > 4) { toast('Máximo de 4 fotos por post.'); return; }
  toast('⏳ Enviando imagens...');
  loadingStart();
  try {
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) { toast('Imagem muito grande! Máximo 10MB.'); continue; }
      const url = await uploadToCloudinary(file);
      postImages.push(url);
    }
    renderPostImagePreview();
    toast(`✅ ${files.length} imagem(ns) enviada(s)!`);
  } catch (err) { toast('Erro ao enviar imagem: ' + err.message); }
  finally { loadingDone(); e.target.value = ''; }
}

/** Renderiza o grid de preview (thumbnails) no compositor de post */
function renderPostImagePreview() {
  const wrap = document.getElementById('ppi-carousel');
  if (!postImages.length) { if (wrap) { wrap.style.display = 'none'; wrap.innerHTML = ''; } return; }
  if (!wrap) return;
  wrap.style.display = 'block';
  wrap.innerHTML = `<div class="carousel-thumbs c${postImages.length}">${
    postImages.map((url, i) => `
      <div class="carousel-thumb">
        <img src="${url}" alt="Imagem ${i + 1}">
        <button class="carousel-thumb-rm" onclick="removePostImage(${i})" title="Remover">✕</button>
      </div>`).join('')
  }</div>`;
}

function removePostImage(index) {
  postImages.splice(index, 1);
  renderPostImagePreview();
  // Limpa o input para permitir re-selecionar o mesmo arquivo
  const inp = document.getElementById('iup');
  if (inp) inp.value = '';
}

// ══════════════════════════════════════════════════════════════
// MODULE: OPEN GRAPH LINK PREVIEW
// ══════════════════════════════════════════════════════════════

let ogPreviewData   = null;
let ogFetchTimeout  = null;

/** Detecta URL no textarea e dispara fetch OG com debounce de 1s */
function detectLinkInText(text) {
  clearTimeout(ogFetchTimeout);
  const match = text.match(/(https?:\/\/[^\s]+)/);
  if (!match) { clearOgPreview(); return; }
  ogFetchTimeout = setTimeout(() => fetchOgData(match[0]), 1000);
}

async function fetchOgData(url) {
  try {
    const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const res   = await fetch(proxy);
    const data  = await res.json();
    const doc   = new DOMParser().parseFromString(data.contents, 'text/html');
    const g     = (prop) =>
      doc.querySelector(`meta[property="${prop}"]`)?.content ||
      doc.querySelector(`meta[name="${prop}"]`)?.content || '';
    const title = g('og:title')       || doc.title || '';
    const desc  = g('og:description') || g('description') || '';
    const img   = g('og:image')       || '';
    if (!title) { clearOgPreview(); return; }
    ogPreviewData = { url, title, desc, img };
    renderOgPreview();
  } catch { clearOgPreview(); }
}

function renderOgPreview() {
  const el = document.getElementById('og-preview');
  if (!el || !ogPreviewData) return;
  el.style.display = 'flex';
  el.innerHTML = `
    ${ogPreviewData.img
      ? `<img class="og-card-img" src="${ogPreviewData.img}" alt="" onerror="this.style.display='none'">`
      : ''}
    <div class="og-card-body">
      <div class="og-card-title">${escH(ogPreviewData.title)}</div>
      ${ogPreviewData.desc ? `<div class="og-card-desc">${escH(ogPreviewData.desc)}</div>` : ''}
      <div class="og-card-url">${escH(ogPreviewData.url)}</div>
    </div>
    <button style="background:none;border:none;padding:8px;cursor:pointer;color:var(--t3);flex-shrink:0"
            onclick="clearOgPreview()" title="Remover preview">✕</button>`;
}

function clearOgPreview() {
  ogPreviewData = null;
  const el = document.getElementById('og-preview');
  if (el) { el.style.display = 'none'; el.innerHTML = ''; }
}

// ══════════════════════════════════════════════════════════════
// MODULE: CARROSSEL de imagens no feed
// ══════════════════════════════════════════════════════════════

/** Estado atual de cada carrossel no feed { carouselId → índice } */
const _carouselIndex = {};

/**
 * Gera o HTML do carrossel para exibição no feed.
 * Suporta 1 a 4 imagens. Com 1 imagem, exibe direto sem setas.
 */
function carouselHTML(images, postId) {
  if (!images || !images.length) return '';
  if (images.length === 1) {
    return `<div class="pi"><img src="${imgSrc(images[0])}" loading="lazy" alt=""></div>`;
  }
  const id = `carousel-${postId}`;
  return `
    <div class="post-carousel" id="${id}">
      <div class="post-carousel-track" id="${id}-track">
        ${images.map(url => `<img src="${imgSrc(url)}" loading="lazy" alt="">`).join('')}
      </div>
      <button class="carousel-nav prev" onclick="carouselPrev('${id}',${images.length})">‹</button>
      <button class="carousel-nav next" onclick="carouselNext('${id}',${images.length})">›</button>
      <div class="carousel-dots">
        ${images.map((_, i) =>
          `<button class="carousel-dot ${i === 0 ? 'on' : ''}" onclick="carouselGoTo('${id}',${i},${images.length})"></button>`
        ).join('')}
      </div>
    </div>`;
}

function carouselNext(id, total) {
  _carouselIndex[id] = ((_carouselIndex[id] || 0) + 1) % total;
  _applyCarousel(id, total);
}
function carouselPrev(id, total) {
  _carouselIndex[id] = ((_carouselIndex[id] || 0) - 1 + total) % total;
  _applyCarousel(id, total);
}
function carouselGoTo(id, i) {
  _carouselIndex[id] = i;
  _applyCarousel(id);
}
function _applyCarousel(id) {
  const track = document.getElementById(id + '-track');
  if (!track) return;
  const idx = _carouselIndex[id] || 0;
  track.style.transform = `translateX(-${idx * 100}%)`;
  document.querySelectorAll(`#${id} .carousel-dot`).forEach((dot, i) =>
    dot.classList.toggle('on', i === idx));
}

// ══════════════════════════════════════════════════════════════
// MODULE: PROCESS POST TEXT (Menções + Hashtags)
// ══════════════════════════════════════════════════════════════

/**
 * Converte @usuario e #hashtag em links clicáveis dentro do texto de um post.
 * O texto é primeiro escapado para evitar XSS.
 */
function processPostText(text) {
  let safe = escH(text);
  safe = safe.replace(/@([a-z0-9_]+)/gi,
    (_, h) => `<a class="mention" onclick="openProfileByHandle('${h}')" href="javascript:void(0)">@${h}</a>`);
  safe = safe.replace(/#([^\s#&<>]+)/g,
    (_, tag) => `<a class="hashtag" onclick="searchByHashtag('${escH(tag)}')" href="javascript:void(0)">#${tag}</a>`);
  return safe;
}

/** Abre o perfil de um usuário pelo @handle */
async function openProfileByHandle(handle) {
  try {
    const snap = await DB.ref('users').orderByChild('handle').equalTo(handle).once('value');
    if (!snap.val()) { toast('@' + handle + ' não encontrado.'); return; }
    const uid = Object.keys(snap.val())[0];
    openOtherProfile(uid);
  } catch { toast('Erro ao buscar perfil.'); }
}

/** Filtra o feed/explore pelo hashtag clicada */
function searchByHashtag(tag) {
  go('feed');
  // Activa aba virtual de hashtag no feed
  document.querySelectorAll('#feed-ftabs .ftab').forEach(x => x.classList.remove('on'));
  currentFeedTab = 'hashtag';
  currentHashtagFilter = tag;
  // Mostra o banner de filtro ativo
  let banner = document.getElementById('hashtag-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'hashtag-banner';
    banner.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--gl);border:1px solid var(--g);border-radius:var(--rs);margin-bottom:10px;font-size:13px;font-weight:600;color:var(--gd)';
    const feed = document.getElementById('feed');
    feed.parentNode.insertBefore(banner, feed);
  }
  banner.innerHTML = `<span style="font-size:16px">🏷️</span> Mostrando posts com <span style="color:var(--blue)">#${escH(tag)}</span> <button onclick="clearHashtagFilter()" style="margin-left:auto;background:none;border:1px solid var(--bd);border-radius:6px;padding:2px 8px;cursor:pointer;font-size:11px;color:var(--t2)">✕ Limpar</button>`;
  banner.style.display = 'flex';
  renderFeed();
}

let currentHashtagFilter = '';

function clearHashtagFilter() {
  currentHashtagFilter = '';
  currentFeedTab = 'all';
  const banner = document.getElementById('hashtag-banner');
  if (banner) banner.style.display = 'none';
  // Reativa aba "Todos"
  const allTab = document.querySelector('#feed-ftabs .ftab');
  if (allTab) { document.querySelectorAll('#feed-ftabs .ftab').forEach(x=>x.classList.remove('on')); allTab.classList.add('on'); }
  renderFeed();
}

// ══════════════════════════════════════════════════════════════
// MODULE: FOLLOW SYSTEM
// ══════════════════════════════════════════════════════════════

/** Alterna seguir/deixar de seguir um usuário */
async function toggleFollow(targetUid) {
  if (!CU || targetUid === CU.uid) return;
  const ref  = DB.ref(`users/${CU.uid}/following/${targetUid}`);
  const snap = await ref.once('value');
  if (snap.val()) {
    await ref.remove();
    await DB.ref(`users/${targetUid}/followers/${CU.uid}`).remove();
    toast('Você deixou de seguir.');
  } else {
    await ref.set(true);
    await DB.ref(`users/${targetUid}/followers/${CU.uid}`).set(true);
    sendNotification(targetUid, 'follow', `${CU.name} começou a te seguir.`);
    toast('✅ Seguindo!');
  }
  // Atualiza o botão na tela sem recarregar tudo
  const btn = document.getElementById('follow-btn-' + targetUid);
  if (btn) {
    const isNow = !snap.val();
    btn.textContent = isNow ? '✓ Seguindo' : 'Seguir';
    btn.classList.toggle('following', isNow);
  }
}

async function isFollowing(targetUid) {
  const snap = await dbGet(`users/${CU.uid}/following/${targetUid}`);
  return !!snap.val();
}

// ══════════════════════════════════════════════════════════════
// MODULE: BLOCK SYSTEM
// ══════════════════════════════════════════════════════════════

async function blockUser(targetUid) {
  if (!confirm('Bloquear este usuário? Seus posts e mensagens não aparecerão mais para você.')) return;
  await DB.ref(`users/${CU.uid}/blocked/${targetUid}`).set(true);
  if (!CU.blocked) CU.blocked = {};
  CU.blocked[targetUid] = true;
  closeOtherProfile();
  toast('Usuário bloqueado.');
  pageCache.feed = false; renderFeed();
}

async function unblockUser(targetUid) {
  await DB.ref(`users/${CU.uid}/blocked/${targetUid}`).remove();
  if (CU.blocked) delete CU.blocked[targetUid];
  toast('Usuário desbloqueado.');
}

function isBlocked(targetUid) { return !!(CU.blocked && CU.blocked[targetUid]); }

// ══════════════════════════════════════════════════════════════
// MODULE: REPORT USER (Denúncia 🚩)
// ══════════════════════════════════════════════════════════════

let reportTargetUid = null;

function openReportUser(uid) {
  reportTargetUid = uid;
  const u = usersCache[uid];
  const el = document.getElementById('report-user-target-info');
  if (el) {
    el.innerHTML = u ? `
      <div style="display:flex;align-items:center;gap:10px;padding:10px;background:var(--s2);border-radius:var(--rs)">
        <div style="width:36px;height:36px;border-radius:50%;overflow:hidden;background:var(--g);color:#fff;
                    display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0">
          ${u.photo ? `<img src="${imgSrc(u.photo)}" style="width:100%;height:100%;object-fit:cover" alt="">` : ini(u.name)}
        </div>
        <div>
          <div style="font-weight:600">${escH(u.name)}</div>
          <div style="font-size:12px;color:var(--t3)">@${escH(u.handle)}</div>
        </div>
      </div>` : '';
  }
  const reason = document.getElementById('report-reason');
  const detail = document.getElementById('report-detail');
  if (reason) reason.value = '';
  if (detail) detail.value = '';
  hi('report-err');
  openModal('report-user-modal');
}

async function submitUserReport() {
  const reason = document.getElementById('report-reason')?.value;
  const detail = document.getElementById('report-detail')?.value.trim() || '';
  const errEl  = document.getElementById('report-err');
  if (!reason) { errEl.textContent = 'Selecione o motivo da denúncia.'; sh('report-err'); return; }
  if (!reportTargetUid) { closeModal('report-user-modal'); return; }
  const u   = usersCache[reportTargetUid] || {};
  const rid = Date.now().toString(36) + Math.random().toString(36).slice(2, 4);
  try {
    await DB.ref('reports/users/' + rid).set({
      id: rid, targetUid: reportTargetUid,
      targetHandle: u.handle || '', targetName: u.name || '',
      reportedBy: CU.uid, reporterHandle: CU.handle,
      reason, detail, ts: Date.now(), status: 'pending'
    });
    closeModal('report-user-modal');
    reportTargetUid = null;
    toast('🚩 Denúncia enviada. A equipe irá analisar em breve.');
  } catch(e) {
    errEl.textContent = 'Erro ao enviar denúncia: ' + (e.message || 'Verifique as regras do Firebase.');
    sh('report-err');
  }
}

// ══════════════════════════════════════════════════════════════
// MODULE: EDIT POST & COMMENTS
// ══════════════════════════════════════════════════════════════

function openEditPost(pid, currentText) {
  document.getElementById('edit-post-id').value   = pid;
  document.getElementById('edit-post-text').value = currentText;
  openModal('edit-post-modal');
}

async function saveEditPost() {
  const pid     = document.getElementById('edit-post-id').value;
  const newText = document.getElementById('edit-post-text').value.trim();
  if (!newText) { toast('O post não pode ficar vazio.'); return; }
  await DB.ref('posts/' + pid).update({ text: newText, edited: true });
  closeModal('edit-post-modal');
  toast('Post atualizado ✅');
}

function openEditComment(pid, cid, currentText) {
  document.getElementById('edit-comment-pid').value  = pid;
  document.getElementById('edit-comment-cid').value  = cid;
  document.getElementById('edit-comment-text').value = currentText;
  openModal('edit-comment-modal');
}

async function saveEditComment() {
  const pid     = document.getElementById('edit-comment-pid').value;
  const cid     = document.getElementById('edit-comment-cid').value;
  const newText = document.getElementById('edit-comment-text').value.trim();
  if (!newText) { toast('Comentário não pode ficar vazio.'); return; }
  await DB.ref(`posts/${pid}/comments/${cid}`).update({ text: newText, edited: true });
  closeModal('edit-comment-modal');
  toast('Comentário atualizado ✅');
}

async function delComment(pid, cid) {
  if (!confirm('Excluir este comentário?')) return;
  await DB.ref(`posts/${pid}/comments/${cid}`).remove();
  // Decrementa contador de comentários no post
  await DB.ref('posts/'+pid+'/commentCount').transaction(v => Math.max(0,(v||0)-1));
  toast('Comentário excluído.');
}

/** Foca o input de comentário e insere @handle para reply */
function focReply(pid, _targetUid, targetHandle) {
  const el = document.getElementById('ci-' + pid);
  if (!el) return;
  el.value = `@${targetHandle} `;
  el.focus();
}

// ══════════════════════════════════════════════════════════════
// MODULE: BOOKMARKS (Posts Salvos)
// ══════════════════════════════════════════════════════════════

let currentProfileTab = 'posts';

async function toggleBookmark(pid, isBookmarked) {
  try {
    const userRef = DB.ref(`users/${CU.uid}/savedPosts/${pid}`);
    const postRef = DB.ref(`posts/${pid}/bookmarks/${CU.uid}`);
    if (isBookmarked) {
      await userRef.remove();
      await postRef.remove();
      if (CU.savedPosts) delete CU.savedPosts[pid];
      toast('🔖 Removido dos salvos.');
    } else {
      await userRef.set(true);
      await postRef.set(true);
      if (!CU.savedPosts) CU.savedPosts = {};
      CU.savedPosts[pid] = true;
      toast('🔖 Post salvo!');
    }
    if (currentProfileTab === 'bookmarks') renderBookmarks();
  } catch(err) { toast('Erro ao salvar: ' + err.message); }
}

function setProfileTab(tab, el) {
  currentProfileTab = tab;
  document.querySelectorAll('#pg-profile .ftab').forEach(x => x.classList.remove('on'));
  if (el) el.classList.add('on');
  const postsEl = document.getElementById('myposts');
  const bookEl  = document.getElementById('my-bookmarks');
  if (postsEl) postsEl.style.display = tab === 'posts'     ? '' : 'none';
  if (bookEl)  bookEl.style.display  = tab === 'bookmarks' ? '' : 'none';
  if (tab === 'bookmarks') renderBookmarks();
}

async function renderBookmarks() {
  const el = document.getElementById('my-bookmarks');
  if (!el) return;
  el.innerHTML = '<div class="loading">⏳ Carregando salvos...</div>';
  try {
    // Busca IDs salvos no perfil do usuário (mais eficiente)
    const savedSnap = await dbGet(`users/${CU.uid}/savedPosts`);
    const savedIds  = savedSnap.val() ? Object.keys(savedSnap.val()) : [];
    if (!savedIds.length) {
      el.innerHTML = '<div class="es"><div class="ei">🔖</div><div class="et">Nenhum post salvo ainda</div><div style="font-size:13px;color:var(--t3)">Toque em 🔖 em qualquer post para salvar</div></div>';
      return;
    }
    // Busca cada post salvo individualmente
    const postPromises = savedIds.map(id => dbGet('posts/' + id));
    const snaps = await Promise.all(postPromises);
    const posts = snaps.map(s => s.val()).filter(Boolean).sort((a,b) => (b.ts||0)-(a.ts||0));
    if (!posts.length) {
      el.innerHTML = '<div class="es"><div class="ei">🔖</div><div class="et">Posts salvos não encontrados</div></div>';
      return;
    }
    el.innerHTML = posts.map(p => postHTML(p)).join('');
  } catch(err) {
    el.innerHTML = '<div class="es"><div class="ei">⚠️</div><div class="et">Erro ao carregar salvos</div></div>';
  }
}

// ══════════════════════════════════════════════════════════════
// MODULE: NOTIFICATIONS (Sininho 🔔)
// ══════════════════════════════════════════════════════════════

let _notifListener = null;

/** Inicia listener em tempo real para notificações do usuário */
function startNotifListener() {
  if (_notifListener) { _notifListener(); _notifListener = null; }
  try {
    const ref = DB.ref('notifications/' + CU.uid).orderByChild('ts').limitToLast(50);
    ref.on('value', snap => {
      try {
        const notifs = snapshotToArrayDesc(snap);
        const unread = notifs.filter(n => !n.read).length;
        const badge  = document.getElementById('notif-badge');
        if (badge) {
          badge.textContent    = unread > 99 ? '99+' : unread;
          badge.style.display  = unread > 0 ? 'flex' : 'none';
        }
        if (document.getElementById('notif-panel')?.classList.contains('on')) {
          renderNotifList(notifs);
        }
      } catch(e) { console.warn('notifListener render error:', e); }
    }, err => {
      console.warn('notifListener permission error:', err.message);
    });
    _notifListener = () => ref.off('value');
  } catch(e) { console.warn('startNotifListener error:', e); }
}

function openNotifPanel() {
  document.getElementById('notif-panel').classList.add('on');
  loadNotifList();
}
function closeNotifPanel() { document.getElementById('notif-panel').classList.remove('on'); }

async function loadNotifList() {
  const el = document.getElementById('notif-list');
  if (el) el.innerHTML = '<div class="loading">⏳ Carregando...</div>';
  try {
    const snap   = await dbGet('notifications/' + CU.uid);
    const notifs = snapshotToArrayDesc(snap);
    renderNotifList(notifs);
  } catch(err) {
    if (el) el.innerHTML = '<div class="es"><div class="ei">⚠️</div><div class="et">Erro ao carregar notificações</div></div>';
  }
}

function renderNotifList(notifs) {
  const el = document.getElementById('notif-list');
  if (!el) return;
  if (!notifs.length) {
    el.innerHTML = '<div class="es"><div class="ei">🔔</div><div class="et">Nenhuma notificação</div></div>';
    return;
  }
  el.innerHTML = notifs.map(n => `
    <div class="notif-item ${n.read ? '' : 'unread'} ${n.fromAdmin ? 'admin-notif' : ''}"
         onclick="handleNotifClick('${n.id}','${n.relatedUid||''}')">
      <div class="notif-icon">${notifIcon(n.type)}</div>
      <div class="notif-body">
        <div class="notif-text">${escH(n.text || '')}</div>
        <div class="notif-time">${ta(n.ts)}</div>
      </div>
    </div>`).join('');
}

function notifIcon(type) {
  return { like:'❤️', comment:'💬', follow:'👤', mention:'@',
           admin:'🛡️', timeout:'⏰', ban:'🔨' }[type] || '🔔';
}

async function handleNotifClick(nid, relatedUid) {
  await DB.ref(`notifications/${CU.uid}/${nid}/read`).set(true);
  if (relatedUid) openOtherProfile(relatedUid);
  closeNotifPanel();
}

async function markAllNotifsRead() {
  const snap = await dbGet('notifications/' + CU.uid);
  const upd  = {};
  snap.forEach(c => { upd[`notifications/${CU.uid}/${c.key}/read`] = true; });
  if (Object.keys(upd).length) await DB.ref().update(upd);
  toast('✅ Notificações marcadas como lidas.');
  loadNotifList();
}

/**
 * Envia uma notificação para outro usuário no Firebase.
 * @param {string} targetUid
 * @param {string} type - 'like'|'comment'|'follow'|'mention'|'admin'|'timeout'|'ban'
 * @param {string} text
 * @param {object} extra - { relatedUid, relatedPostId, fromAdmin }
 */
async function sendNotification(targetUid, type, text, extra = {}) {
  if (!targetUid || targetUid === CU.uid) return;
  const nid = Date.now().toString(36) + Math.random().toString(36).slice(2, 4);
  await DB.ref(`notifications/${targetUid}/${nid}`).set({
    id: nid, type, text, ts: Date.now(), read: false,
    relatedUid:    extra.relatedUid    || CU.uid,
    relatedPostId: extra.relatedPostId || '',
    fromAdmin:     extra.fromAdmin     || false,
  });
}

// ══════════════════════════════════════════════════════════════
// MODULE: ONLINE STATUS + TYPING INDICATOR
// ══════════════════════════════════════════════════════════════

function setOnlineStatus(online) {
  if (!CU || !DB) return;
  const ref         = DB.ref(`users/${CU.uid}/online`);
  const lastSeenRef = DB.ref(`users/${CU.uid}/lastSeen`);
  if (online) {
    ref.set(true);
    ref.onDisconnect().remove();
    lastSeenRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
  } else {
    ref.remove();
    lastSeenRef.set(Date.now());
  }
}

/** Atualiza o sub-título do chat DM com o status online/visto-por-último */
function updateChatStatus(u) {
  const statusEl      = document.getElementById('cw-status');
  if (!statusEl) return;
  const mySettings    = CU.settings || {};
  const theirSettings = u.settings  || {};
  // Regra recíproca: só exibe se AMBOS tiverem a opção ativa
  if (mySettings.lastSeen !== false && theirSettings.lastSeen !== false) {
    if (u.online)        statusEl.textContent = '🟢 Online agora';
    else if (u.lastSeen) statusEl.textContent = `Visto por último ${ta(u.lastSeen)}`;
    else                 statusEl.textContent = '';
  } else { statusEl.textContent = ''; }
}

let _typingTimer = null;
let _typingRef   = null;

function handleDmTyping() {
  if (!chatWith) return;
  if (!_typingRef) _typingRef = DB.ref(`users/${CU.uid}/typing/${chatWith.uid}`);
  _typingRef.set(true);
  clearTimeout(_typingTimer);
  _typingTimer = setTimeout(() => { if (_typingRef) { _typingRef.remove(); _typingRef = null; } }, 3000);
}

function handleDmKeydown(e) { if (e.key === 'Enter') sndMsg(); }

// ══════════════════════════════════════════════════════════════
// MODULE: SETTINGS (Configurações de Privacidade)
// ══════════════════════════════════════════════════════════════

function loadUserSettings() {
  const s = CU.settings || {};
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };
  set('setting-last-seen',       s.lastSeen       !== false);
  set('setting-read-receipts',   s.readReceipts   !== false);
  set('setting-public-bookmarks', !!s.publicBookmarks);
}

async function saveSetting(key, value) {
  if (!CU) return;
  if (!CU.settings) CU.settings = {};
  CU.settings[key] = value;
  await DB.ref(`users/${CU.uid}/settings/${key}`).set(value);
  toast('✅ Configuração salva!');
}

// ══════════════════════════════════════════════════════════════
// MODULE: STEAM BACKGROUND LAYER (perfil)
// ══════════════════════════════════════════════════════════════

/**
 * Aplica o background Steam-style na camada fixa atrás do perfil.
 * O bg fica ATRÁS de todo o conteúdo, não dentro do banner do card.
 */
// applySteamBg removido - substituído pelo sistema de banner de perfil
function applySteamBg(bgUrl) { /* deprecated - usar profileBanner */ }

// ══════════════════════════════════════════════════════════════
// MODULE: MODERATION V2 — Denúncias de Usuários + Ban/Timeout
// ══════════════════════════════════════════════════════════════

let currentModTab    = 'posts';
let punishTargetUid  = null;

function setModTab(tab, el) {
  currentModTab = tab;
  document.querySelectorAll('#mod-tabs .ftab').forEach(x => x.classList.remove('on'));
  if (el) el.classList.add('on');
  const sections = { posts:'mod-posts-section', users:'mod-users-section', banned:'mod-banned-section' };
  Object.entries(sections).forEach(([t, id]) => {
    const sec = document.getElementById(id);
    if (sec) sec.style.display = t === tab ? '' : 'none';
  });
  if (tab === 'posts')  renderModerationPosts();
  if (tab === 'users')  renderUserReports();
  if (tab === 'banned') renderBannedUsers();
}

/** Mantém compatibilidade com a função renderModeration() original */
function renderModeration() {
  if (CU.role !== 'admin') {
    const el = document.getElementById('mod-list');
    if (el) el.innerHTML = '<div class="es"><div class="ei">🚫</div><div class="et">Acesso restrito</div></div>';
    return;
  }
  renderModerationPosts();
}

async function renderModerationPosts() {
  if (CU.role !== 'admin') return;
  const el = document.getElementById('mod-list');
  if (!el) return;
  el.innerHTML = '<div class="loading">⏳ Carregando...</div>';
  loadingStart();
  let snap, items;
  try {
    snap  = await DB.ref('moderation').orderByChild('status').equalTo('pending').once('value');
    items = snapshotToArray(snap);
  } catch(err) {
    loadingDone();
    el.innerHTML = '<div class="es"><div class="ei">⚠️</div><div class="et">Erro ao carregar moderação</div><div style="font-size:13px;color:var(--t3)">Verifique as regras do Firebase</div></div>';
    return;
  }
  loadingDone();
  if (!items.length) {
    el.innerHTML = '<div class="es"><div class="ei">✅</div><div class="et">Nenhum conteúdo pendente</div></div>';
    return;
  }
  const defaultWarn = () =>
    document.getElementById('mod-default-warn')?.value ||
    'Seu conteúdo foi bloqueado por violar as regras da comunidade IFConnect.';
  el.innerHTML = items.map(p => `
    <div class="mod-card" id="modcard-${p.id}">
      <div class="mod-user-info" onclick="openOtherProfile('${p.uid}')">
        <div class="pav" style="width:32px;height:32px;font-size:12px">
          ${p.authorPhoto ? `<img src="${imgSrc(p.authorPhoto)}" alt="">` : ini(p.author)}
        </div>
        <div>
          <div style="font-size:13px;font-weight:600">${escH(p.author)}</div>
          <div style="font-size:11px;color:var(--t3)">@${escH(p.handle)} · ${ta(p.reportedAt || p.ts)}</div>
        </div>
        <span style="margin-left:auto;font-size:11px;color:var(--g)">Ver perfil →</span>
      </div>
      <div style="font-size:14px;line-height:1.5;padding:4px 0">${escH(p.text)}</div>
      ${p.image ? `<img src="${p.image}" style="width:100%;max-height:200px;object-fit:cover;border-radius:8px;margin-top:8px" alt="">` : ''}
      <div class="mod-warn-section">
        <div style="font-size:11px;font-weight:600;color:var(--t3);margin-bottom:4px">✉️ Aviso ao usuário (editável):</div>
        <textarea id="warn-text-${p.id}">${escH(defaultWarn())}</textarea>
        <button class="btn btn-s" style="font-size:11px;background:var(--gold);border:none"
                onclick="sendWarnToUser('${p.uid}','${p.id}')">📨 Enviar aviso</button>
      </div>
      <div class="mod-actions">
        <button class="btn btn-s" onclick="approvePost('${p.id}')">✅ Aprovar</button>
        <button class="btn btn-s btn-r" onclick="rejectPost('${p.id}')">🗑 Excluir definitivamente</button>
      </div>
    </div>`).join('');
}

async function sendWarnToUser(targetUid, postId) {
  const warnText = document.getElementById('warn-text-' + postId)?.value?.trim();
  if (!warnText) { toast('Escreva o aviso antes de enviar.'); return; }
  const key = ck(CU.uid, targetUid);
  const mid = Date.now().toString(36) + Math.random().toString(36).slice(2, 4);
  await DB.ref(`messages/${key}/${mid}`).set({
    id: mid, from: CU.uid,
    text: '⚠️ [Aviso do Moderador]\n' + warnText,
    ts: Date.now(), read: false
  });
  await sendNotification(targetUid, 'admin', '[Aviso do Moderador]: ' + warnText.slice(0, 80), { fromAdmin: true });
  toast('✅ Aviso enviado!');
}

async function approvePost(pid) {
  const snap = await dbGet('moderation/' + pid);
  const p    = snap.val(); if (!p) return;
  const { status, reportedAt, ...postData } = p;
  await DB.ref('posts/' + pid).set({ ...postData, approved: true });
  await DB.ref('moderation/' + pid).remove();
  toast('Post aprovado ✅'); renderModerationPosts();
}

async function rejectPost(pid) {
  if (!confirm('Excluir definitivamente este post?')) return;
  // Busca dados do post antes de remover para oferecer punição
  const snap = await dbGet('moderation/' + pid);
  const p = snap.val();
  await DB.ref('moderation/' + pid).remove();
  toast('Post excluído.');
  // Oferece opção de punir o autor
  if (p && p.uid) {
    const punir = confirm(`Post excluído.\n\nDeseja também punir o autor "${p.author || p.handle}"?`);
    if (punir) openPunishFromAdmin(p.uid, p.author || p.handle);
  }
  renderModerationPosts();
}

// ── Denúncias de usuários ──────────────────────────────────────
async function renderUserReports() {
  const el = document.getElementById('mod-user-reports');
  if (!el) return;
  el.innerHTML = '<div class="loading">⏳ Carregando denúncias...</div>';
  loadingStart();
  let snap, reports;
  try {
    snap    = await DB.ref('reports/users').orderByChild('status').equalTo('pending').once('value');
    reports = snapshotToArray(snap);
  } catch(err) {
    loadingDone();
    el.innerHTML = '<div class="es"><div class="ei">⚠️</div><div class="et">Erro ao carregar denúncias</div><div style="font-size:13px;color:var(--t3)">Verifique as regras do Firebase</div></div>';
    return;
  }
  loadingDone();
  if (!reports.length) {
    el.innerHTML = '<div class="es"><div class="ei">✅</div><div class="et">Nenhuma denúncia pendente</div></div>';
    return;
  }
  el.innerHTML = reports.map(r => `
    <div class="mod-card user-report" id="report-card-${r.id}">
      <div style="padding:8px;background:var(--s2);border-radius:var(--rs);margin-bottom:10px">
        <div style="font-size:13px;font-weight:600">🚩 Usuário denunciado:
          <span style="color:var(--r)">${escH(r.targetName)} (@${escH(r.targetHandle)})</span>
        </div>
        <div style="font-size:11px;color:var(--t3)">
          Denunciado por @${escH(r.reporterHandle)} · ${ta(r.ts)}
        </div>
        <div style="font-size:12px;margin-top:4px">
          <strong>Motivo:</strong> ${escH(r.reason)}
          ${r.detail ? `— "${escH(r.detail)}"` : ''}
        </div>
      </div>
      <div class="mod-actions">
        <button class="btn btn-s" onclick="openPunishModal('${r.id}','${r.targetUid}','${escH(r.targetName)}')">
          ⚖️ Aplicar Punição
        </button>
        <button class="btn btn-o btn-s" onclick="openOtherProfile('${r.targetUid}')">👁 Ver perfil</button>
        <button class="btn btn-o btn-s" onclick="ignoreReport('${r.id}')">✅ Ignorar</button>
      </div>
    </div>`).join('');
}

function openPunishModal(reportId, targetUid, targetName) {
  punishTargetUid = targetUid;
  document.getElementById('punish-uid').value = targetUid;
  document.getElementById('punish-uid').dataset.reportId = reportId;
  const info = document.getElementById('punish-user-info');
  if (info) info.innerHTML = `
    <div style="padding:10px;background:var(--s2);border-radius:var(--rs);font-size:13px;margin-bottom:10px">
      Aplicar punição para: <strong>${escH(targetName)}</strong>
    </div>`;
  document.getElementById('punish-type').value = 'ignore';
  document.getElementById('punish-msg').value  = '';
  document.getElementById('punish-msg-box').style.display = 'none';
  hi('punish-err');
  openModal('punish-user-modal');
}

function onPunishTypeChange() {
  const type = document.getElementById('punish-type').value;
  document.getElementById('punish-msg-box').style.display = type === 'ignore' ? 'none' : '';
}

/** Abre o modal de punição direto da lista de usuários (sem reportId) */
function openPunishFromAdmin(targetUid, targetName) {
  openPunishModal('', targetUid, targetName);
}

async function applyPunishment() {
  const type      = document.getElementById('punish-type').value;
  const targetUid = document.getElementById('punish-uid').value;
  const reportId  = document.getElementById('punish-uid').dataset.reportId;
  const msg       = document.getElementById('punish-msg').value.trim();
  if (!targetUid) { closeModal('punish-user-modal'); return; }

  if (type === 'ignore') {
    if (reportId) await DB.ref('reports/users/' + reportId).update({ status: 'ignored' });
    closeModal('punish-user-modal');
    toast('✅ Denúncia ignorada.');
    renderUserReports(); return;
  }

  // Motivo padrão se vazio
  const finalMsg = msg || 'Violação dos termos da comunidade IFConnect.';

  if (type === 'ban') {
    await DB.ref('users/' + targetUid + '/status').set({
      type: 'banned', reason: finalMsg, bannedAt: Date.now(), bannedBy: CU.uid
    });
    await sendNotification(targetUid, 'ban',
      '🔨 Sua conta foi banida permanentemente. Motivo: ' + finalMsg,
      { fromAdmin: true });
    if (reportId) await DB.ref('reports/users/' + reportId).update({ status: 'resolved', punishment: 'ban' });
    toast('🔨 Usuário banido permanentemente.');
  } else {
    const hours = type === 'timeout_24h' ? 24 : 168;
    const until = Date.now() + hours * 3600 * 1000;
    await DB.ref('users/' + targetUid + '/status').set({ type: 'timeout', until, hours, reason: finalMsg });
    await sendNotification(targetUid, 'timeout',
      `⏰ Sua conta foi suspensa por ${hours} horas.\n\nMotivo: ${finalMsg}`,
      { fromAdmin: true });
    if (reportId) await DB.ref('reports/users/' + reportId).update({ status: 'resolved', punishment: type });
    toast(`⏰ Timeout de ${hours}h aplicado.`);
  }

  // Envia DM de moderação com o motivo
  const key = ck(CU.uid, targetUid);
  const mid = Date.now().toString(36) + Math.random().toString(36).slice(2, 4);
  await DB.ref('messages/' + key + '/' + mid).set({
    id: mid, from: CU.uid,
    text: '⚠️ [Decisão da Moderação]\n' + finalMsg + (type === 'ban'
      ? '\n\nSua conta foi banida permanentemente.'
      : '\n\nSua conta foi suspensa temporariamente.'),
    ts: Date.now(), read: false
  });

  if (usersCache[targetUid]) {
    usersCache[targetUid].status = type === 'ban'
      ? { type: 'banned', reason: finalMsg }
      : { type: 'timeout' };
  }
  closeModal('punish-user-modal');
  renderUserReports();
}

async function ignoreReport(reportId) {
  await DB.ref('reports/users/' + reportId).update({ status: 'ignored' });
  toast('Denúncia ignorada.'); renderUserReports();
}

async function unbanUser(uid) {
  await DB.ref('users/' + uid + '/status').remove();
  if (usersCache[uid]) delete usersCache[uid].status;
  await sendNotification(uid, 'admin', '✅ Sua conta foi reativada pela moderação.', { fromAdmin: true });
  toast('✅ Usuário desbanido.');
  renderBannedUsers(); filterAdminUsers();
}

async function removeTimeout(uid) {
  await DB.ref('users/' + uid + '/status').remove();
  if (usersCache[uid]) delete usersCache[uid].status;
  await sendNotification(uid, 'admin', '✅ Seu timeout foi removido pela moderação.', { fromAdmin: true });
  toast('✅ Timeout removido.');
  renderBannedUsers(); filterAdminUsers();
}

async function renderBannedUsers() {
  const el = document.getElementById('mod-banned-list');
  if (!el) return;
  el.innerHTML = '<div class="loading">⏳ Carregando...</div>';
  if (!Object.keys(usersCache).length) await loadUsersCache();
  const list = Object.values(usersCache).filter(u =>
    u.status === 'banned' || (u.status && (u.status.type === 'timeout' || u.status.type === 'banned')));
  if (!list.length) {
    el.innerHTML = '<div class="es"><div class="ei">✅</div><div class="et">Nenhum usuário banido ou em timeout</div></div>';
    return;
  }
  el.innerHTML = list.map(u => {
    const isBanned  = u.status === 'banned' || (u.status && u.status.type === 'banned');
    const isTimeout = u.status && u.status.type === 'timeout';
    const timeLabel = isBanned ? 'Ban permanente'
      : isTimeout ? `Timeout até ${new Date(u.status.until).toLocaleString('pt-BR')}` : '';
    return `
      <div style="background:var(--su);border:1.5px solid ${isBanned ? 'var(--r)' : 'var(--gold)'};
                  border-radius:var(--ra);padding:12px;margin-bottom:10px;
                  display:flex;align-items:center;gap:10px;box-shadow:var(--sh)">
        <div class="pav" style="width:36px;height:36px;flex-shrink:0">
          ${u.photo ? `<img src="${imgSrc(u.photo)}" alt="">` : ini(u.name)}
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:600">${escH(u.name)}</div>
          <div style="font-size:11px;color:var(--t3)">@${escH(u.handle)} · ${escH(u.email || '')}</div>
          <div style="font-size:11px;color:${isBanned ? 'var(--r)' : 'var(--gold)'};margin-top:3px">${timeLabel}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0">
          ${isBanned
            ? `<button class="btn btn-s btn-o" style="font-size:11px" onclick="unbanUser('${u.uid}')">🔓 Desbanir</button>`
            : `<button class="btn btn-s btn-o" style="font-size:11px" onclick="removeTimeout('${u.uid}')">🔓 Remover Timeout</button>`}
        </div>
      </div>`;
  }).join('');
}



// ══════════════════════════════════════════════════════════════
// MODULE: ALLOWED EMAIL DOMAINS (Admin Control)
// ══════════════════════════════════════════════════════════════
let _allowedDomains = []; // cache local

async function loadAllowedDomains() {
  try {
    const snap = await dbGet('config/allowedDomains');
    _allowedDomains = snap.val() ? Object.values(snap.val()) : [];
  } catch(e) { _allowedDomains = []; }
  return _allowedDomains;
}

/**
 * Verifica se o domínio do e-mail está na lista permitida.
 * Se a lista estiver vazia, permite qualquer domínio (sem restrição).
 */
async function isEmailDomainAllowed(email) {
  if (!email || !email.includes('@')) return false;
  const domains = _allowedDomains.length ? _allowedDomains : await loadAllowedDomains();
  if (!domains.length) return true; // sem restrição configurada
  const lower = email.toLowerCase();
  return domains.some(d => lower.endsWith(d.toLowerCase().trim()));
}

async function renderAdminCfgAllowedDomains() {
  const el = document.getElementById('admin-cfg-content');
  if (!el) return;
  el.innerHTML = '<div class="loading">⏳ Carregando...</div>';
  await loadAllowedDomains();
  el.innerHTML = `
    <div style="background:var(--s2);border-radius:var(--rs);padding:12px;margin-bottom:14px;font-size:13px;color:var(--t2);line-height:1.6">
      📧 <strong>Domínios de e-mail permitidos para cadastro.</strong><br>
      Se a lista estiver vazia, qualquer e-mail é aceito.<br>
      Exemplo: <code>@estudante.ifpb.edu.br</code> ou <code>@ifpb.edu.br</code>
    </div>
    <div id="allowed-domains-list" style="margin-bottom:12px">
      ${_allowedDomains.length
        ? _allowedDomains.map((d,i)=>`
          <div class="cfg-item">
            <span style="flex:1;font-size:13px;font-family:monospace">${escH(d)}</span>
            <button class="btn-r" style="font-size:11px;padding:3px 8px" onclick="removeAllowedDomain(${i})">✕ Remover</button>
          </div>`).join('')
        : '<div style="color:var(--t3);font-size:13px;padding:8px 0">Nenhum domínio na lista. Todos os e-mails são aceitos.</div>'
      }
    </div>
    <div style="display:flex;gap:8px;align-items:center">
      <input class="fi" id="new-domain-input" placeholder="@estudante.ifpb.edu.br" style="padding:8px 12px;font-size:13px">
      <button class="btn btn-s" onclick="addAllowedDomain()">+ Adicionar</button>
    </div>`;
}

async function addAllowedDomain() {
  const inp = document.getElementById('new-domain-input'); if (!inp) return;
  let domain = inp.value.trim().toLowerCase();
  if (!domain) { toast('Digite um domínio.'); return; }
  if (!domain.startsWith('@')) domain = '@' + domain;
  if (_allowedDomains.includes(domain)) { toast('Domínio já na lista.'); return; }
  _allowedDomains.push(domain);
  inp.value = '';
  try {
    await DB.ref('config/allowedDomains').set(_allowedDomains);
    toast('✅ Domínio adicionado!');
    renderAdminCfgAllowedDomains();
  } catch(err) { toast('Erro ao salvar: ' + err.message); }
}

async function removeAllowedDomain(index) {
  _allowedDomains.splice(index, 1);
  try {
    await DB.ref('config/allowedDomains').set(_allowedDomains.length ? _allowedDomains : null);
    toast('Domínio removido.');
    renderAdminCfgAllowedDomains();
  } catch(err) { toast('Erro ao remover: ' + err.message); }
}

// ══════════════════════════════════════════════════════════════
// MODULE: HORÁRIOS POR TURMA
// ══════════════════════════════════════════════════════════════
let _scheduleImgFile = null;

async function renderSchedules() {
  const isAdmin    = CU && CU.role === 'admin';
  const adminPanel = document.getElementById('schedules-admin-panel');
  const content    = document.getElementById('schedules-content');
  if (!content) return;

  if (isAdmin && adminPanel) {
    adminPanel.style.display = 'block';
    const turmaOptions = CONFIG.courses.map(c =>
      `<option value="${escH(c.name)}">${escH(c.name)}</option>`).join('');
    adminPanel.innerHTML = `
      <div class="cp" style="margin-bottom:14px">
        <div style="font-weight:700;font-size:15px;margin-bottom:12px">⚙️ Gerenciar Horários (Admin)</div>
        <div class="fg">
          <label class="fl">Turma</label>
          <select class="fi" id="sch-turma-select">
            <option value="">Selecione a turma...</option>
            ${turmaOptions}
          </select>
        </div>
        <div class="fg">
          <label class="fl">Texto do horário</label>
          <textarea class="fi" id="sch-text" placeholder="Ex: Segunda: Matemática 07h–08h40&#10;Terça: Física 07h–08h40..." style="height:110px;resize:vertical;font-family:monospace;font-size:12px"></textarea>
        </div>
        <div class="fg">
          <label class="fl">Imagem do horário (opcional — substitui o texto)</label>
          <label class="btn btn-o btn-s" style="cursor:pointer;display:inline-flex;align-items:center;gap:6px;width:auto">
            📷 Escolher imagem
            <input type="file" id="sch-img-input" accept="image/*" style="display:none" onchange="previewScheduleImg(event)">
          </label>
          <div id="sch-img-preview" style="margin-top:8px"></div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-s" onclick="saveSchedule()">💾 Salvar Horário</button>
          <button class="btn btn-o btn-s" onclick="_scheduleImgFile=null;document.getElementById('sch-img-preview').innerHTML='';if(document.getElementById('sch-img-input'))document.getElementById('sch-img-input').value=''">✕ Limpar imagem</button>
        </div>
      </div>`;
  }

  content.innerHTML = '<div class="loading">⏳ Carregando horários...</div>';
  loadingStart();
  const snap = await dbGet('schedules');
  loadingDone();
  const schedules = [];
  snap.forEach(c => schedules.push({ _key: c.key, ...c.val() }));

  if (!schedules.length) {
    content.innerHTML = `<div class="es"><div class="ei">🗓️</div><div class="et">Nenhum horário cadastrado</div>
      ${isAdmin ? '<div style="font-size:13px;color:var(--t3)">Use o painel acima para adicionar horários</div>' : ''}</div>`;
    return;
  }

  content.innerHTML = schedules.map(s => {
    const turma = escH(s.turmaId || s._key);
    const key   = escH(s._key);
    const dlBtn = s.imageUrl
      ? '<button class="btn btn-o btn-s" style="font-size:11px;padding:4px 10px" onclick="downloadSchedule(this)" data-url="' + escH(s.imageUrl) + '" data-nome="' + turma + '">⬇️ Baixar</button>'
      : '';
    const delBtn = isAdmin
      ? '<button class="btn-r" style="font-size:11px;padding:4px 9px" onclick="deleteSchedule(\'' + key + '\',\'' + turma + '\')">🗑 Remover</button>'
      : '';
    const imgHTML = s.imageUrl
      ? '<img src="' + escH(s.imageUrl) + '" style="width:100%;border-radius:8px;margin-bottom:8px;display:block" loading="lazy" alt="Horário ' + turma + '">'
      : '';
    const textHTML = s.text
      ? '<pre style="font-size:12px;color:var(--t2);white-space:pre-wrap;font-family:monospace;background:var(--s2);padding:10px;border-radius:8px;margin:0;line-height:1.6">' + escH(s.text) + '</pre>'
      : '';
    return '<div class="cp" style="margin-bottom:12px">'
      + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:8px">'
      + '<div style="font-weight:700;font-size:15px">📅 ' + turma + '</div>'
      + '<div style="display:flex;gap:6px;align-items:center">' + dlBtn + delBtn + '</div>'
      + '</div>'
      + imgHTML + textHTML
      + '<div style="font-size:11px;color:var(--t3);margin-top:8px">Atualizado: ' + ta(s.updatedAt || s.ts || 0) + '</div>'
      + '</div>';
  }).join('');
}

function previewScheduleImg(e) {
  const f = e.target.files[0]; if (!f) return;
  if (f.size > 5 * 1024 * 1024) { toast('Imagem muito grande! Máx 5MB.'); return; }
  _scheduleImgFile = f;
  const r = new FileReader();
  r.onload = ev => {
    const prev = document.getElementById('sch-img-preview');
    if (prev) prev.innerHTML = `<img src="${ev.target.result}" style="max-width:100%;max-height:160px;border-radius:8px;display:block" alt="">`;
  };
  r.readAsDataURL(f);
}

async function saveSchedule() {
  if (!CU || CU.role !== 'admin') { toast('⛔ Apenas admins.'); return; }
  const turmaId = document.getElementById('sch-turma-select')?.value?.trim();
  const text    = document.getElementById('sch-text')?.value?.trim() || '';
  if (!turmaId) { toast('Selecione a turma.'); return; }
  if (!text && !_scheduleImgFile) { toast('Adicione texto ou imagem do horário.'); return; }
  loadingStart();
  try {
    // Revalida o cargo no banco para evitar cache desatualizado
    const roleSnap = await DB.ref('users/' + CU.uid + '/role').once('value');
    if (roleSnap.val() !== 'admin') { toast('⛔ Permissão negada. Seu cargo não é admin.'); loadingDone(); return; }

    let imageUrl = '';
    if (_scheduleImgFile) {
      toast('⏳ Enviando imagem...');
      imageUrl = await uploadToCloudinary(_scheduleImgFile);
    }
    const key = turmaId.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
    await DB.ref('schedules/' + key).set({
      turmaId, text, imageUrl, updatedAt: Date.now(), by: CU.uid
    });
    _scheduleImgFile = null;
    const prev = document.getElementById('sch-img-preview');
    if (prev) prev.innerHTML = '';
    const schText = document.getElementById('sch-text');
    if (schText) schText.value = '';
    const schSel = document.getElementById('sch-turma-select');
    if (schSel) schSel.value = '';
    const schImg = document.getElementById('sch-img-input');
    if (schImg) schImg.value = '';
    toast('✅ Horário salvo com sucesso!');
    renderSchedules();
  } catch(err) {
    if (err.message && err.message.toLowerCase().includes('permission')) {
      toast('⛔ Permissão negada. Atualize as regras do Firebase: schedules → ".write": "auth != null && root.child(\'users\').child(auth.uid).child(\'role\').val() === \'admin\'"');
    } else {
      toast('Erro ao salvar: ' + err.message);
    }
  }
  finally { loadingDone(); }
}

async function deleteSchedule(key, turmaId) {
  if (!CU || CU.role !== 'admin') return;
  if (!confirm(`Remover o horário de "${turmaId || key}"?`)) return;
  await DB.ref('schedules/' + key).remove();
  toast('Horário removido.'); renderSchedules();
}

function downloadSchedule(btnOrUrl, turmaId) {
  let url, nome;
  if (typeof btnOrUrl === 'string') {
    url  = btnOrUrl;
    nome = turmaId || 'horario';
  } else {
    // called as downloadSchedule(this) from button
    url  = btnOrUrl.dataset.url  || '';
    nome = btnOrUrl.dataset.nome || 'horario';
  }
  if (!url) { toast('Sem imagem para baixar.'); return; }
  const dlUrl = url.includes('cloudinary.com')
    ? url.replace('/upload/', '/upload/fl_attachment/')
    : url;
  const safeName = nome.replace(/[^a-zA-Z0-9_\-]/g, '_');
  const ext = url.split('?')[0].split('.').pop().split('/').pop() || 'jpg';
  const a = document.createElement('a');
  a.href = dlUrl;
  a.download = 'horario_' + safeName + '.' + ext;
  a.target = '_blank'; a.rel = 'noopener';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  toast('⬇️ Download iniciado!');
}

// ══════════════════════════════════════════════════════════════
// MODULE: LABORATÓRIOS
// ══════════════════════════════════════════════════════════════
/*
  ⚠️  REGRAS FIREBASE NECESSÁRIAS:
  "labs":        { ".read": true, ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'" },
  "lab_usos":    { ".read": true, ".write": "auth != null" },
  "lab_sessoes": { ".read": true, ".write": "auth != null" },
  "lab_fila":    { ".read": true, ".write": "auth != null" }
*/

let _labImgFile        = null;
let _labRegImgFile     = null;
let _labTimerInterval  = null;
let _labTimerLabKey    = null;
let _labTimerSessaoKey = null;
let _labFilaLabKey     = null;
let _labFilaKey        = null;
let _labSessoesListener = null;
let _labFilaListener    = null;

function fmtCountdown(ms) {
  if (ms <= 0) return '00:00';
  const totalSec = Math.ceil(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
  return String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
}

function fmtHora(ts) {
  return new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function getActiveSessao(sessoesMap, labKey) {
  const now = Date.now();
  const labSessoes = sessoesMap[labKey] || {};
  for (const [key, s] of Object.entries(labSessoes)) {
    if (s && s.fim > now) return { key, ...s };
  }
  return null;
}

function getMinhaSessao(sessoesMap) {
  if (!CU) return null;
  const now = Date.now();
  for (const [labKey, labSessoes] of Object.entries(sessoesMap)) {
    for (const [sessaoKey, s] of Object.entries(labSessoes || {})) {
      if (s && s.uid === CU.uid && s.fim > now) return { labKey, sessaoKey, ...s };
    }
  }
  return null;
}

/* ── renderLabs ──────────────────────────────────────────────*/
async function renderLabs() {
  const isAdmin = CU && CU.role === 'admin';
  const adminPanel = document.getElementById('labs-admin-panel');
  const content    = document.getElementById('labs-content');
  if (!adminPanel || !content) return;

  adminPanel.style.display = 'block';
  adminPanel.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:14px">'
    + '<div style="font-family:\'Syne\',sans-serif;font-weight:800;font-size:20px">🔬 Laboratórios</div>'
    + '<div style="display:flex;gap:8px">'
    + (isAdmin ? '<button class="btn btn-s" onclick="openModal(\'add-lab-modal\')" style="display:flex;align-items:center;gap:5px"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Novo Lab</button>' : '')
    + '<button class="btn btn-o btn-s" onclick="openRegUsoModal()" style="display:flex;align-items:center;gap:5px"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Registrar Uso</button>'
    + '</div></div>';

  content.innerHTML = '<div class="loading">⏳ Carregando laboratórios...</div>';
  loadingStart();

  const [labsSnap, usosSnap, sessoesSnap] = await Promise.all([
    dbGet('labs'),
    dbGet('lab_usos'),
    dbGet('lab_sessoes'),
  ]);
  loadingDone();

  // Monta mapa de sessões: { labKey: { sessaoKey: {...} } }
  const sessoesMap = {};
  sessoesSnap.forEach(labSnap => {
    sessoesMap[labSnap.key] = {};
    labSnap.forEach(s => { sessoesMap[labSnap.key][s.key] = s.val(); });
  });

  const labs = [];
  labsSnap.forEach(c => labs.push({ _key: c.key, ...c.val() }));

  const usosPorLab = {};
  usosSnap.forEach(labUsoSnap => {
    const arr = [];
    labUsoSnap.forEach(u => arr.push({ _key: u.key, ...u.val() }));
    arr.sort((a, b) => (b.ts || 0) - (a.ts || 0));
    usosPorLab[labUsoSnap.key] = arr;
  });

  // Mapa de fila por lab
  const filaSnap = await dbGet('lab_fila');
  const filaPorLab = {};
  filaSnap.forEach(labFilaSnap => {
    const arr = [];
    labFilaSnap.forEach(f => arr.push({ _key: f.key, ...f.val() }));
    arr.sort((a, b) => (a.ts || 0) - (b.ts || 0));
    filaPorLab[labFilaSnap.key] = arr;
  });

  if (!labs.length) {
    content.innerHTML = '<div class="es"><div class="ei">🔬</div><div class="et">Nenhum laboratório cadastrado</div>'
      + (isAdmin ? '<div style="font-size:13px;color:var(--t3)">Clique em "+ Novo Lab" para adicionar</div>' : '')
      + '</div>';
    return;
  }

  // Ordena: ocupados primeiro, depois por uso recente
  labs.sort((a, b) => {
    const aAtivo = !!(getActiveSessao(sessoesMap, a._key));
    const bAtivo = !!(getActiveSessao(sessoesMap, b._key));
    if (aAtivo !== bAtivo) return bAtivo ? 1 : -1;
    const taa = usosPorLab[a._key]?.[0]?.ts || 0;
    const tbb = usosPorLab[b._key]?.[0]?.ts || 0;
    return tbb - taa;
  });

  content.innerHTML = labs.map(l => buildLabCard(l, usosPorLab[l._key] || [], sessoesMap, filaPorLab[l._key] || [], isAdmin)).join('');
  pageCache.labs = true;

  _startCardTimers(sessoesMap);
  _checkMinhasSessoes(sessoesMap);
}

/* ── _startCardTimers ─────────────────────────────────────── */
function _startCardTimers(sessoesMap) {
  if (window._cardTimerInterval) clearInterval(window._cardTimerInterval);
  window._cardTimerInterval = setInterval(() => {
    const now = Date.now();
    for (const [labKey, labSessoes] of Object.entries(sessoesMap)) {
      for (const [, s] of Object.entries(labSessoes || {})) {
        if (!s || s.fim <= now) continue;
        const remaining = s.fim - now;
        const total     = s.duracao * 60 * 1000;
        const pct       = Math.max(0, Math.min(100, (remaining / total) * 100));
        const barEl = document.getElementById('lab-bar-' + labKey);
        const txtEl = document.getElementById('lab-cdw-' + labKey);
        if (barEl) { barEl.style.width = pct + '%'; barEl.style.background = pct > 30 ? 'var(--g)' : pct > 10 ? '#f59e0b' : 'var(--r)'; }
        if (txtEl)  txtEl.textContent = fmtCountdown(remaining);
      }
    }
  }, 1000);
}

/* ── _checkMinhasSessoes ─ FAB flutuante ─────────────────── */
function _checkMinhasSessoes(sessoesMap) {
  const minha = getMinhaSessao(sessoesMap);
  let fab = document.getElementById('lab-timer-fab');
  if (minha) {
    _labTimerLabKey = minha.labKey; _labTimerSessaoKey = minha.sessaoKey;
    if (!fab) {
      fab = document.createElement('button');
      fab.id = 'lab-timer-fab';
      fab.style.cssText = 'position:fixed;bottom:70px;right:16px;z-index:200;background:var(--g);color:#fff;border:none;border-radius:50%;width:50px;height:50px;font-size:22px;cursor:pointer;box-shadow:0 4px 16px rgba(0,168,89,.4);display:flex;align-items:center;justify-content:center';
      fab.innerHTML = '⏱️'; fab.title = 'Meu uso ativo';
      fab.onclick = () => openLabTimerModal(minha.labKey, minha.nome || minha.labKey, minha);
      document.body.appendChild(fab);
    }
  } else {
    _labTimerLabKey = null; _labTimerSessaoKey = null;
    if (fab) fab.remove();
  }
}

/* ── buildLabCard ─────────────────────────────────────────── */
function buildLabCard(l, usos, sessoesMap, fila, isAdmin) {
  const nome   = escH(l.nome || l._key);
  const key    = l._key;
  const sessao = getActiveSessao(sessoesMap, key);
  const now    = Date.now();

  const imgHTML  = l.imageUrl ? '<img src="' + escH(l.imageUrl) + '" style="width:100%;border-radius:8px;margin-bottom:10px;display:block;max-height:180px;object-fit:cover" loading="lazy" alt="' + nome + '">' : '';
  const delBtn   = isAdmin ? '<button class="btn-r" style="font-size:11px;padding:3px 8px" onclick="deleteLab(\'' + escH(key) + '\',\'' + nome + '\')">🗑</button>' : '';
  const localHTML = l.local ? '<div class="info-row">📍 <span>' + escH(l.local) + '</span></div>' : '';
  const capHTML   = l.capacidade ? '<div class="info-row">👥 <span>Capacidade: <strong>' + escH(String(l.capacidade)) + '</strong></span></div>' : '';
  const descHTML  = l.desc ? '<div style="font-size:12px;color:var(--t2);margin-top:6px;line-height:1.5">' + escH(l.desc) + '</div>' : '';

  let statusHTML = '', actionBtn = '', timeBarHTML = '';
  const euNaFila = fila.findIndex(f => CU && f.uid === CU.uid);

  if (sessao) {
    const remaining   = sessao.fim - now;
    const total       = sessao.duracao * 60 * 1000;
    const pct         = Math.max(0, Math.min(100, (remaining / total) * 100));
    const encerrando  = remaining < 10 * 60 * 1000;
    const euSouODono  = CU && sessao.uid === CU.uid;
    const statusClass = encerrando ? 'encerrando' : 'ocupado';

    statusHTML = '<div class="lab-status-bar ' + statusClass + '">'
      + '<div class="lab-status-dot"></div>'
      + '<div style="flex:1">'
      + (euSouODono ? '🧑‍💻 <strong>Você está usando</strong> · saída às ' + fmtHora(sessao.fim)
                    : '🔴 <strong>Em uso</strong> por ' + escH(sessao.userName || 'alguém') + ' · saída às ' + fmtHora(sessao.fim))
      + '</div>'
      + (fila.length ? '<span class="lab-fila-badge">👥 ' + fila.length + ' na fila</span>' : '')
      + '</div>';

    timeBarHTML = '<div class="lab-time-bar-wrap"><div class="lab-time-bar-fill" id="lab-bar-' + key + '" style="width:' + pct + '%;background:' + (pct > 30 ? 'var(--g)' : pct > 10 ? '#f59e0b' : 'var(--r)') + '"></div></div>'
      + '<div style="text-align:right;font-size:10px;color:var(--t3);margin-bottom:4px">⏱️ <span id="lab-cdw-' + key + '">' + fmtCountdown(remaining) + '</span> restante</div>';

    if (euSouODono) {
      actionBtn = '<button class="btn btn-s" style="width:100%;margin-top:8px" onclick="openLabTimerModal(\'' + key + '\',\'' + nome + '\',null)">⏱️ Ver meu timer</button>';
    } else if (euNaFila >= 0) {
      actionBtn = '<button class="btn btn-o btn-s" style="width:100%;margin-top:8px;font-size:12px" onclick="openFilaModal(\'' + key + '\',\'' + nome + '\')">👁️ Ver fila (posição ' + (euNaFila + 1) + ')</button>';
    } else {
      actionBtn = '<button class="btn btn-o btn-s" style="width:100%;margin-top:8px;font-size:12px" onclick="entrarNaFila(\'' + key + '\',\'' + nome + '\')">⏳ Entrar na fila</button>';
    }
  } else {
    const lastUso = usos[0];
    statusHTML = '<div class="lab-status-bar livre"><div class="lab-status-dot"></div><div style="flex:1">🟢 <strong>Disponível</strong>' + (lastUso ? ' · último uso ' + ta(lastUso.ts) : '') + '</div></div>';
    actionBtn  = '<button class="btn btn-s" style="width:100%;margin-top:8px;font-size:12px" onclick="openRegUsoForLab(\'' + key + '\',\'' + nome + '\')">📝 Registrar meu uso</button>';
  }

  let usosHTML = '';
  if (usos.length) {
    usosHTML = '<div class="lab-usos-list"><div style="font-size:11px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Últimos registros</div>'
      + usos.slice(0, 3).map(u => {
          const foto = u.userPhoto ? '<img src="' + escH(u.userPhoto) + '" style="width:100%;height:100%;object-fit:cover;display:block" alt="">' : '<span style="font-size:9px;font-weight:700">' + ini(u.userName) + '</span>';
          return '<div class="lab-uso-item"><div class="lab-uso-av">' + foto + '</div>'
            + '<div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escH(u.userName || 'Usuário') + '</div>'
            + '<div style="font-size:11px;color:var(--t3)">' + escH(u.descricao || '') + (u.turma ? ' · ' + escH(u.turma) : '') + '</div></div>'
            + '<div style="font-size:10px;color:var(--t3);white-space:nowrap;flex-shrink:0">' + ta(u.ts) + '</div>'
            + (isAdmin ? '<button style="background:none;border:none;cursor:pointer;color:var(--r);font-size:12px;padding:0 2px;flex-shrink:0" onclick="deleteLabUso(\'' + escH(key) + '\',\'' + escH(u._key) + '\')">✕</button>' : '')
            + '</div>';
        }).join('')
      + (usos.length > 3 ? '<button class="btn btn-o btn-s" style="width:100%;margin-top:6px;font-size:11px" onclick="openAllUsos(\'' + escH(key) + '\',\'' + nome + '\')">Ver todos (' + usos.length + ')</button>' : '')
      + '</div>';
  }

  return '<div class="cp lab-card-item" style="margin-bottom:12px">' + imgHTML
    + '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:6px"><div style="font-weight:700;font-size:15px">🔬 ' + nome + '</div>' + delBtn + '</div>'
    + localHTML + capHTML + descHTML
    + '<div style="margin-top:8px">' + statusHTML + timeBarHTML + '</div>'
    + actionBtn + usosHTML + '</div>';
}

/* ── openRegUsoModal ─────────────────────────────────────── */
async function openRegUsoModal() {
  if (!CU) { toast('Faça login primeiro.'); return; }
  const snap = await dbGet('lab_sessoes');
  const sessoesMap = {};
  snap.forEach(labSnap => { sessoesMap[labSnap.key] = {}; labSnap.forEach(s => { sessoesMap[labSnap.key][s.key] = s.val(); }); });
  const minha = getMinhaSessao(sessoesMap);
  if (minha) { toast('⚠️ Você já tem um uso ativo! Encerre-o primeiro.'); openLabTimerModal(minha.labKey, minha.nome || minha.labKey, minha); return; }
  openModal('reg-uso-modal');
  populateRegUsoModal();
  const warn = document.getElementById('reg-uso-ocupado-warn');
  if (warn) warn.style.display = 'none';
}

/* ── openRegUsoForLab ─────────────────────────────────────── */
function openRegUsoForLab(labKey, labNome) {
  _preselectedLabKey = labKey; _preselectedLabNome = labNome;
  openRegUsoModal();
}

let _preselectedLabKey = '', _preselectedLabNome = '';

/* ── populateRegUsoModal ──────────────────────────────────── */
async function populateRegUsoModal() {
  const sel = document.getElementById('reg-uso-lab-select');
  if (!sel) return;
  sel.innerHTML = '<option value="">Carregando...</option>';
  const [labsSnap, sessoesSnap] = await Promise.all([dbGet('labs'), dbGet('lab_sessoes')]);
  const sessoesMap = {};
  sessoesSnap.forEach(labSnap => { sessoesMap[labSnap.key] = {}; labSnap.forEach(s => { sessoesMap[labSnap.key][s.key] = s.val(); }); });
  const opts = ['<option value="">Selecione o laboratório...</option>'];
  labsSnap.forEach(c => {
    const l = c.val(); const nome = escH(l.nome || c.key);
    const sess = getActiveSessao(sessoesMap, c.key);
    const label = sess ? nome + ' 🔴 Ocupado (saída ' + fmtHora(sess.fim) + ')' : nome + ' 🟢';
    opts.push('<option value="' + escH(c.key) + '"' + (c.key === _preselectedLabKey ? ' selected' : '') + '>' + label + '</option>');
  });
  sel.innerHTML = opts.join('');
  sel.onchange = () => {
    const labKey = sel.value;
    const warn   = document.getElementById('reg-uso-ocupado-warn');
    if (!labKey || !warn) return;
    const s = getActiveSessao(sessoesMap, labKey);
    if (s) { warn.style.display = 'block'; warn.innerHTML = '⚠️ <strong>Lab ocupado</strong> até ' + fmtHora(s.fim) + ' por ' + escH(s.userName || 'alguém') + '.<br>Você pode registrar mesmo assim, ou <strong>entrar na fila</strong>.'; }
    else   { warn.style.display = 'none'; }
  };
}

/* ── saveLabUso ───────────────────────────────────────────── */
async function saveLabUso() {
  if (!CU) { toast('Faça login primeiro.'); return; }
  const labKey  = document.getElementById('reg-uso-lab-select')?.value?.trim();
  const duracao = parseInt(document.getElementById('reg-uso-duracao')?.value || '0', 10);
  const desc    = document.getElementById('reg-uso-desc')?.value?.trim() || '';
  const turma   = document.getElementById('reg-uso-turma')?.value?.trim() || '';
  if (!labKey)  { toast('Selecione o laboratório.'); return; }
  if (!duracao) { toast('Selecione o tempo de uso.'); return; }
  if (!desc)    { toast('Descreva brevemente o uso.'); return; }
  loadingStart();
  try {
    const now = Date.now(); const fim = now + duracao * 60 * 1000;
    const usoKey = DB.ref('lab_usos/' + labKey).push().key;
    await DB.ref('lab_usos/' + labKey + '/' + usoKey).set({ uid: CU.uid, userName: CU.name || '', userPhoto: CU.photo || '', userHandle: CU.handle || '', turma: turma || CU.course || '', descricao: desc, duracao, ts: now });
    const sessaoKey = DB.ref('lab_sessoes/' + labKey).push().key;
    const labNomeSnap = await dbGet('labs/' + labKey);
    const labNome = labNomeSnap.val()?.nome || labKey;
    await DB.ref('lab_sessoes/' + labKey + '/' + sessaoKey).set({ uid: CU.uid, userName: CU.name || '', userPhoto: CU.photo || '', userHandle: CU.handle || '', turma: turma || CU.course || '', descricao: desc, duracao, inicio: now, fim, usoKey, nome: labNome });
    _labTimerLabKey = labKey; _labTimerSessaoKey = sessaoKey;
    toast('✅ Uso registrado! Timer iniciado.');
    closeModal('reg-uso-modal');
    ['reg-uso-desc','reg-uso-turma'].forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
    const dur = document.getElementById('reg-uso-duracao'); if(dur) dur.value = '';
    _preselectedLabKey = '';
    pageCache.labs = false; await renderLabs();
    openLabTimerModal(labKey, labNome, { uid: CU.uid, userName: CU.name, descricao: desc, duracao, inicio: now, fim, sessaoKey });
    _notificarFila(labKey, labNome, fim);
  } catch(err) {
    toast(err.message && err.message.toLowerCase().includes('permission') ? '⛔ Permissão negada. Verifique as regras do Firebase para lab_sessoes e lab_usos.' : 'Erro: ' + err.message);
  } finally { loadingDone(); }
}

async function _notificarFila(labKey, labNome, fim) {
  try {
    const filaSnap = await dbGet('lab_fila/' + labKey);
    filaSnap.forEach(f => { const item = f.val(); if (!item || !item.uid) return; const nKey = DB.ref('notifications/' + item.uid).push().key; DB.ref('notifications/' + item.uid + '/' + nKey).set({ type: 'lab_fila', labKey, labNome, msg: '🔬 ' + labNome + ' foi ocupado. Saída prevista: ' + fmtHora(fim), ts: Date.now(), read: false }); });
  } catch(_) {}
}

/* ── openLabTimerModal ────────────────────────────────────── */
async function openLabTimerModal(labKey, labNome, sessaoOverride) {
  let sessao = sessaoOverride;
  if (!sessao) {
    const snap = await dbGet('lab_sessoes/' + labKey);
    const sessoesMap = { [labKey]: {} };
    snap.forEach(s => { sessoesMap[labKey][s.key] = s.val(); });
    sessao = getActiveSessao(sessoesMap, labKey);
    if (!sessao) { toast('Nenhuma sessão ativa para este lab.'); return; }
  }
  _labTimerLabKey = labKey;
  _labTimerSessaoKey = sessao.sessaoKey || sessao.key || _labTimerSessaoKey;
  document.getElementById('lab-timer-nome').textContent = labNome;
  document.getElementById('lab-timer-desc').textContent = sessao.descricao || '';
  const fim = sessao.fim; const durMs = sessao.duracao * 60 * 1000; const arcLen = 326.7;
  if (_labTimerInterval) clearInterval(_labTimerInterval);
  function _tick() {
    const now = Date.now(); const rem = fim - now; const pct = Math.max(0, Math.min(1, rem / durMs));
    const disp = document.getElementById('lab-timer-display');
    const arc  = document.getElementById('lab-timer-arc');
    const saida = document.getElementById('lab-timer-saida');
    if (disp)  disp.textContent = fmtCountdown(rem);
    if (arc)  { arc.style.strokeDashoffset = String(arcLen * (1 - pct)); arc.style.stroke = pct > .3 ? 'var(--g)' : pct > .1 ? '#f59e0b' : 'var(--r)'; }
    if (saida) saida.textContent = '📅 Saída prevista: ' + fmtHora(fim);
    if (rem <= 0) {
      clearInterval(_labTimerInterval); _labTimerInterval = null;
      if (disp) disp.textContent = '00:00';
      toast('⏰ Tempo encerrado! Lembre-se de liberar o laboratório.');
      if (_labTimerLabKey && _labTimerSessaoKey) {
        DB.ref('lab_sessoes/' + _labTimerLabKey + '/' + _labTimerSessaoKey).remove().catch(() => {});
        _avancarFila(_labTimerLabKey);
        pageCache.labs = false; renderLabs(); closeModal('lab-timer-modal');
      }
    }
  }
  _tick(); _labTimerInterval = setInterval(_tick, 1000);
  _subscribeFilaNoTimer(labKey);
  openModal('lab-timer-modal');
}

function _subscribeFilaNoTimer(labKey) {
  if (_labFilaListener) { try { DB.ref('lab_fila/' + (_labFilaLabKey || '')).off('value', _labFilaListener); } catch(_) {} }
  _labFilaListener = DB.ref('lab_fila/' + labKey).on('value', snap => {
    const fila = []; snap.forEach(f => fila.push({ _key: f.key, ...f.val() }));
    fila.sort((a, b) => (a.ts || 0) - (b.ts || 0));
    const listEl = document.getElementById('lab-timer-fila-list');
    if (!listEl) return;
    if (!fila.length) { listEl.textContent = 'Ninguém na fila.'; return; }
    listEl.innerHTML = fila.map((f, i) => {
      const foto = f.userPhoto ? '<img src="' + escH(f.userPhoto) + '" style="width:100%;height:100%;object-fit:cover;display:block" alt="">' : '<span style="font-size:9px;font-weight:700">' + ini(f.userName || '?') + '</span>';
      return '<div class="lab-fila-item"><div class="lab-fila-num">' + (i+1) + '</div>'
        + '<div class="lab-uso-av" style="width:28px;height:28px">' + foto + '</div>'
        + '<div style="flex:1"><div style="font-size:12px;font-weight:600">' + escH(f.userName || 'Usuário') + '</div>'
        + (f.turma ? '<div style="font-size:11px;color:var(--t3)">' + escH(f.turma) + '</div>' : '') + '</div>'
        + '<div style="font-size:10px;color:var(--t3)">' + ta(f.ts) + '</div></div>';
    }).join('');
  });
}

async function sairDoLab() {
  if (!_labTimerLabKey || !_labTimerSessaoKey) return;
  if (!confirm('Encerrar o uso agora e liberar o laboratório?')) return;
  try {
    await DB.ref('lab_sessoes/' + _labTimerLabKey + '/' + _labTimerSessaoKey).remove();
    if (_labTimerInterval) { clearInterval(_labTimerInterval); _labTimerInterval = null; }
    toast('✅ Uso encerrado. Lab liberado!');
    _avancarFila(_labTimerLabKey);
    closeModal('lab-timer-modal');
    const fab = document.getElementById('lab-timer-fab'); if (fab) fab.remove();
    pageCache.labs = false; renderLabs();
  } catch(err) { toast('Erro: ' + err.message); }
}

async function entrarNaFila(labKey, labNome) {
  if (!CU) { toast('Faça login primeiro.'); return; }
  const snap = await dbGet('lab_fila/' + labKey);
  let jaEsta = false;
  snap.forEach(f => { if (f.val().uid === CU.uid) jaEsta = true; });
  if (jaEsta) { toast('Você já está na fila!'); openFilaModal(labKey, labNome); return; }
  const filaKey = DB.ref('lab_fila/' + labKey).push().key;
  await DB.ref('lab_fila/' + labKey + '/' + filaKey).set({ uid: CU.uid, userName: CU.name || '', userPhoto: CU.photo || '', userHandle: CU.handle || '', turma: CU.course || '', ts: Date.now() });
  _labFilaLabKey = labKey; _labFilaKey = filaKey;
  toast('✅ Você entrou na fila!');
  openFilaModal(labKey, labNome);
  pageCache.labs = false; renderLabs();
}

async function openFilaModal(labKey, labNome) {
  document.getElementById('lab-fila-nome').textContent = labNome;
  _labFilaLabKey = labKey;
  const [sessoesSnap, filaSnap] = await Promise.all([dbGet('lab_sessoes/' + labKey), dbGet('lab_fila/' + labKey)]);
  const sessoesMap = { [labKey]: {} };
  sessoesSnap.forEach(s => { sessoesMap[labKey][s.key] = s.val(); });
  const sessao = getActiveSessao(sessoesMap, labKey);
  const statusEl = document.getElementById('lab-fila-status-info');
  if (statusEl) statusEl.textContent = sessao ? '🔴 Ocupado até ' + fmtHora(sessao.fim) + ' por ' + (sessao.userName || 'alguém') : '🟢 Livre';
  const fila = []; filaSnap.forEach(f => fila.push({ _key: f.key, ...f.val() }));
  fila.sort((a, b) => (a.ts || 0) - (b.ts || 0));
  const minhaPosicao = fila.findIndex(f => CU && f.uid === CU.uid);
  const posEl = document.getElementById('lab-fila-pos-info');
  if (posEl) { posEl.textContent = minhaPosicao >= 0 ? '📍 Sua posição: ' + (minhaPosicao+1) + 'º na fila' : fila.length > 0 ? fila.length + ' pessoa(s) na fila' : 'Fila vazia'; }
  if (minhaPosicao >= 0) _labFilaKey = fila[minhaPosicao]._key;
  const listEl = document.getElementById('lab-fila-list');
  if (listEl) {
    listEl.innerHTML = !fila.length ? '<div style="font-size:13px;color:var(--t3);padding:8px 0">Fila vazia.</div>' : fila.map((f, i) => {
      const foto = f.userPhoto ? '<img src="' + escH(f.userPhoto) + '" style="width:100%;height:100%;object-fit:cover;display:block" alt="">' : '<span style="font-size:9px;font-weight:700">' + ini(f.userName || '?') + '</span>';
      const euSou = CU && f.uid === CU.uid;
      return '<div class="lab-fila-item" style="' + (euSou ? 'background:var(--gl);border-radius:6px;padding:4px 6px;' : '') + '">'
        + '<div class="lab-fila-num">' + (i+1) + '</div>'
        + '<div class="lab-uso-av" style="width:28px;height:28px">' + foto + '</div>'
        + '<div style="flex:1"><div style="font-size:12px;font-weight:600">' + escH(f.userName || 'Usuário') + (euSou ? ' <span style="font-size:10px;color:var(--gd)">(você)</span>' : '') + '</div>'
        + (f.turma ? '<div style="font-size:11px;color:var(--t3)">' + escH(f.turma) + '</div>' : '') + '</div>'
        + '<div style="font-size:10px;color:var(--t3)">' + ta(f.ts) + '</div></div>';
    }).join('');
  }
  const sairBtn = document.getElementById('lab-fila-sair-btn');
  if (sairBtn) sairBtn.style.display = minhaPosicao >= 0 ? '' : 'none';
  openModal('lab-fila-modal');
}

async function sairDaFila() {
  if (!_labFilaLabKey || !_labFilaKey) return;
  await DB.ref('lab_fila/' + _labFilaLabKey + '/' + _labFilaKey).remove();
  _labFilaKey = null; toast('Você saiu da fila.'); closeModal('lab-fila-modal');
  pageCache.labs = false; renderLabs();
}

async function _avancarFila(labKey) {
  try {
    const snap = await dbGet('lab_fila/' + labKey);
    const fila = []; snap.forEach(f => fila.push({ _key: f.key, ...f.val() }));
    fila.sort((a, b) => (a.ts || 0) - (b.ts || 0));
    if (!fila.length) return;
    const proximo = fila[0];
    const nKey = DB.ref('notifications/' + proximo.uid).push().key;
    const labNomeSnap = await dbGet('labs/' + labKey);
    const labNome = labNomeSnap.val()?.nome || labKey;
    await DB.ref('notifications/' + proximo.uid + '/' + nKey).set({ type: 'lab_fila_vez', labKey, labNome, msg: '🔔 É sua vez! ' + labNome + ' está livre agora.', ts: Date.now(), read: false });
    await DB.ref('lab_fila/' + labKey + '/' + proximo._key).remove();
  } catch(_) {}
}

/* ── deleteLabUso (admin) ─────────────────────────────────── */
async function deleteLabUso(labKey, usoKey) {
  if (!CU || CU.role !== 'admin') return;
  if (!confirm('Remover este registro de uso?')) return;
  await DB.ref('lab_usos/' + labKey + '/' + usoKey).remove();
  toast('Registro removido.'); pageCache.labs = false; renderLabs();
}

/* ── openAllUsos ─────────────────────────────────────────── */
async function openAllUsos(labKey, labNome) {
  const snap = await dbGet('lab_usos/' + labKey);
  const usos = []; snap.forEach(u => usos.push({ _key: u.key, ...u.val() }));
  usos.sort((a, b) => (b.ts || 0) - (a.ts || 0));
  const isAdmin = CU && CU.role === 'admin';
  const content = document.getElementById('all-usos-content');
  if (content) {
    content.innerHTML = usos.length
      ? usos.map(u => {
          const foto = u.userPhoto ? '<img src="' + escH(u.userPhoto) + '" style="width:100%;height:100%;object-fit:cover;display:block" alt="">' : '<span style="font-size:9px;font-weight:700">' + ini(u.userName) + '</span>';
          return '<div class="lab-uso-item" style="padding:10px 0;border-bottom:1px solid var(--bd)">'
            + '<div class="lab-uso-av">' + foto + '</div>'
            + '<div style="flex:1;min-width:0">'
            + '<div style="font-size:13px;font-weight:600">' + escH(u.userName || 'Usuário') + (u.userHandle ? ' <span style="color:var(--t3);font-size:11px">@' + escH(u.userHandle) + '</span>' : '') + '</div>'
            + '<div style="font-size:12px;color:var(--t2);margin-top:2px">' + escH(u.descricao || '') + '</div>'
            + (u.turma ? '<div style="font-size:11px;color:var(--t3)">🎓 ' + escH(u.turma) + '</div>' : '')
            + (u.duracao ? '<div style="font-size:11px;color:var(--t3)">⏱️ ' + u.duracao + ' min</div>' : '')
            + '<div style="font-size:10px;color:var(--t3);margin-top:2px">' + new Date(u.ts).toLocaleString('pt-BR') + '</div>'
            + '</div>'
            + (isAdmin ? '<button style="background:none;border:none;cursor:pointer;color:var(--r);font-size:14px;padding:0 4px;flex-shrink:0" onclick="deleteLabUso(\'' + escH(labKey) + '\',\'' + escH(u._key) + '\');closeModal(\'all-usos-modal\')">🗑</button>' : '')
            + '</div>';
        }).join('')
      : '<div class="es"><div class="ei">📋</div><div class="et">Nenhum registro ainda</div></div>';
    document.getElementById('all-usos-title').textContent = '📋 ' + labNome;
  }
  openModal('all-usos-modal');
}

/* ── previewLabImg ────────────────────────────────────────── */
function previewLabImg(e) {
  const f = e.target.files[0]; if (!f) return;
  if (f.size > 5 * 1024 * 1024) { toast('Imagem muito grande! Máx 5MB.'); return; }
  _labImgFile = f;
  const r = new FileReader();
  r.onload = ev => { const prev = document.getElementById('lab-img-preview'); if (prev) prev.innerHTML = '<img src="' + ev.target.result + '" style="max-width:100%;max-height:140px;border-radius:8px;display:block" alt="">'; };
  r.readAsDataURL(f);
}

/* ── saveLab (admin) ──────────────────────────────────────── */
async function saveLab() {
  if (!CU || CU.role !== 'admin') { toast('⛔ Apenas admins.'); return; }
  const nome = document.getElementById('lab-nome')?.value?.trim();
  const local = document.getElementById('lab-local')?.value?.trim() || '';
  const cap   = document.getElementById('lab-cap')?.value?.trim() || '';
  const desc  = document.getElementById('lab-desc')?.value?.trim() || '';
  if (!nome) { toast('Informe o nome do laboratório.'); return; }
  loadingStart();
  try {
    let imageUrl = '';
    if (_labImgFile) { toast('⏳ Enviando imagem...'); imageUrl = await uploadToCloudinary(_labImgFile); }
    const key = nome.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
    await DB.ref('labs/' + key).set({ nome, local, capacidade: cap ? Number(cap) : '', desc, imageUrl, updatedAt: Date.now(), by: CU.uid });
    _labImgFile = null; toast('✅ Laboratório salvo!'); closeModal('add-lab-modal');
    ['lab-nome','lab-local','lab-cap','lab-desc'].forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
    const prev = document.getElementById('lab-img-preview'); if(prev) prev.innerHTML = '';
    const inp  = document.getElementById('lab-img-input');   if(inp)  inp.value = '';
    pageCache.labs = false; renderLabs();
  } catch(err) {
    toast(err.message && err.message.toLowerCase().includes('permission') ? '⛔ Permissão negada. Verifique as regras do Firebase para "labs".' : 'Erro ao salvar: ' + err.message);
  } finally { loadingDone(); }
}

/* ── deleteLab (admin) ────────────────────────────────────── */
async function deleteLab(key, nome) {
  if (!CU || CU.role !== 'admin') return;
  if (!confirm('Remover o laboratório "' + nome + '"? Os registros de uso também serão removidos.')) return;
  await Promise.all([DB.ref('labs/' + key).remove(), DB.ref('lab_usos/' + key).remove(), DB.ref('lab_sessoes/' + key).remove(), DB.ref('lab_fila/' + key).remove()]);
  toast('Laboratório removido.'); pageCache.labs = false; renderLabs();
}


// ── Download de imagem do post ────────────────────────────────────────────────
function downloadPostImage(url, pid) {
  const dlUrl = url.includes('cloudinary.com')
    ? url.replace('/upload/', '/upload/fl_attachment/')
    : url;
  const a = document.createElement('a');
  a.href = dlUrl; a.download = 'ifconnect_post_' + pid + '.jpg';
  a.target = '_blank'; a.rel = 'noopener';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

// ── Denúncia de Post ──────────────────────────────────────────────────────────
let _reportPostId  = null;
let _reportPostUid = null;

function openReportPost(pid, uid) {
  _reportPostId  = pid;
  _reportPostUid = uid;
  const u      = usersCache[uid];
  const infoEl = document.getElementById('report-post-target-info');
  if (infoEl) {
    infoEl.innerHTML = u
      ? `<div style="display:flex;align-items:center;gap:10px;padding:10px;background:var(--s2);border-radius:var(--rs)">
           <div class="pav" style="width:32px;height:32px;font-size:12px">${u.photo ? `<img src="${imgSrc(u.photo)}" alt="">` : ini(u.name)}</div>
           <div>
             <div style="font-weight:600">${escH(u.name)}</div>
             <div style="font-size:12px;color:var(--t3)">Post de @${escH(u.handle)}</div>
           </div>
         </div>` : '';
  }
  const reasonEl = document.getElementById('report-post-reason');
  const detailEl = document.getElementById('report-post-detail');
  if (reasonEl) reasonEl.value = '';
  if (detailEl) detailEl.value = '';
  hi('report-post-err');
  openModal('report-post-modal');
}

async function submitPostReport() {
  const reason = document.getElementById('report-post-reason')?.value;
  const detail = document.getElementById('report-post-detail')?.value?.trim() || '';
  const errEl  = document.getElementById('report-post-err');
  if (!reason) {
    errEl.textContent = 'Selecione o motivo da denúncia.';
    sh('report-post-err'); return;
  }
  if (!_reportPostId) { closeModal('report-post-modal'); return; }
  const rid = Date.now().toString(36) + Math.random().toString(36).slice(2, 4);
  try {
    await DB.ref('reports/posts/' + rid).set({
      id: rid, postId: _reportPostId, targetUid: _reportPostUid,
      reportedBy: CU.uid, reporterHandle: CU.handle,
      reason, detail, ts: Date.now(), status: 'pending'
    });
    closeModal('report-post-modal');
    _reportPostId = null; _reportPostUid = null;
    toast('🚩 Post denunciado. Obrigado!');
  } catch(e) {
    errEl.textContent = 'Erro ao enviar denúncia: ' + (e.message || 'Verifique as regras do Firebase.');
    sh('report-post-err');
  }
}

// ══════════════════════════════════════════════════════════════
// MODULE: BAN SCREEN — verificação ao iniciar app
// ══════════════════════════════════════════════════════════════

/**
 * Exibe a tela de suspensão/ban antes de carregar o app.
 * Chamado por startApp() quando detecta status = 'banned' ou timeout.
 */
function showBanScreen(type, u, statusData) {
  ['splash','auth','app','verify-screen'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const screen = document.getElementById('ban-screen');
  if (!screen) return;
  screen.style.display = 'flex';
  if (type === 'banned') {
    document.getElementById('ban-icon').textContent  = '🔨';
    document.getElementById('ban-title').textContent = 'Conta Banida';
    document.getElementById('ban-msg').textContent   =
      'Sua conta foi permanentemente banida por violar as regras da comunidade IFConnect.';
    const banReason = statusData && statusData.reason ? statusData.reason : '';
    document.getElementById('ban-detail').textContent =
      (banReason ? 'Motivo: ' + banReason + '\n\n' : '') +
      'Se acredita que foi um engano, entre em contato com a administração.';
  } else {
    const remaining = statusData.until - Date.now();
    const hours     = Math.max(1, Math.ceil(remaining / 3600000));
    document.getElementById('ban-icon').textContent  = '⏰';
    document.getElementById('ban-title').textContent = 'Conta Suspensa Temporariamente';
    document.getElementById('ban-msg').textContent   =
      'Sua conta está em período de timeout. Você não pode acessar a plataforma agora.';
    document.getElementById('ban-detail').textContent =
      `Tempo restante: aproximadamente ${hours} hora${hours !== 1 ? 's' : ''}.`
      + (statusData.reason ? `\n\nMotivo: ${statusData.reason}` : '');
  }
}
