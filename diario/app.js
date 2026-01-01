// app.js - diario simple con localStorage
const STORAGE_KEY = 'miDiarioEntradasV1';

const entryDate = document.getElementById('entryDate');
const entryText = document.getElementById('entryText');
const saveBtn = document.getElementById('saveEntry');
const clearBtn = document.getElementById('clearForm');
const entriesDiv = document.getElementById('entries');
const template = document.getElementById('entryTemplate');
const toggleThemeBtn = document.getElementById('toggleTheme');

let entries = []; // {id, date, text}

// Inicializar fecha por defecto a hoy
entryDate.value = new Date().toISOString().slice(0,10);

// Cargar entradas desde storage
function load(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    entries = raw ? JSON.parse(raw) : [];
  }catch(e){
    console.error('Error cargando storage', e);
    entries = [];
  }
}

function saveToStorage(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function render(){
  entriesDiv.innerHTML = '';
  if(entries.length === 0){
    entriesDiv.innerHTML = '<p style="color:var(--muted)">Aún no hay entradas.</p>';
    return;
  }
  // Mostrar las entradas más recientes primero
  entries.slice().reverse().forEach(e => {
    const node = template.content.cloneNode(true);
    node.querySelector('.entry-date').textContent = e.date;
    node.querySelector('.entry-text').textContent = e.text;
    const art = node.querySelector('.entry');
    art.dataset.id = e.id;
    // acciones
    node.querySelector('.edit').addEventListener('click', () => startEdit(e.id));
    node.querySelector('.delete').addEventListener('click', () => removeEntry(e.id));
    entriesDiv.appendChild(node);
  });
}

function uid(){
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}

function addOrUpdate(){
  const date = entryDate.value;
  const text = entryText.value.trim();
  if(!date || !text){
    alert('Completa la fecha y el texto antes de guardar.');
    return;
  }
  const existing = entries.find(e => e.id === saveBtn.dataset.editId);
  if(existing){
    existing.date = date;
    existing.text = text;
    delete saveBtn.dataset.editId;
  }else{
    entries.push({id: uid(), date, text});
  }
  saveToStorage();
  render();
  clearForm();
}

function clearForm(){
  entryText.value = '';
  entryDate.value = new Date().toISOString().slice(0,10);
  delete saveBtn.dataset.editId;
}

function startEdit(id){
  const e = entries.find(x => x.id === id);
  if(!e) return;
  entryDate.value = e.date;
  entryText.value = e.text;
  saveBtn.dataset.editId = id;
  window.scrollTo({top:0,behavior:'smooth'});
}

function removeEntry(id){
  if(!confirm('¿Borrar esta entrada?')) return;
  entries = entries.filter(e => e.id !== id);
  saveToStorage();
  render();
}

// Theme
function loadTheme(){
  if(localStorage.getItem('miDiarioTheme') === 'dark' || window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
    document.documentElement.classList.add('dark');
    // update only the label text (don't overwrite icons)
    const lbl = toggleThemeBtn.querySelector('.label');
    if(lbl) lbl.textContent = 'Modo claro';
    toggleThemeBtn.setAttribute('aria-pressed','true');
  }
}
function toggleTheme(){
  const isDark = document.documentElement.classList.toggle('dark');
  const lbl = toggleThemeBtn.querySelector('.label');
  if(lbl) lbl.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
  toggleThemeBtn.setAttribute('aria-pressed', String(isDark));
  localStorage.setItem('miDiarioTheme', isDark ? 'dark' : 'light');
}

// Event listeners
saveBtn.addEventListener('click', addOrUpdate);
clearBtn.addEventListener('click', clearForm);
toggleThemeBtn.addEventListener('click', toggleTheme);

// Init
loadTheme();
load();
render();