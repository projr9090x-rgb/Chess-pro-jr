// analysis.js - integrated analysis, arrow drawing, move classification, export, UI hookups
if(typeof Chess === 'undefined'){ alert('chess.min.js missing — place chess.min.js next to this file'); throw new Error('Chess not found'); }

// UI elements
const pgnInput = document.getElementById('pgn');
const analyzeBtn = document.getElementById('analyzeBtn');
const depthSel = document.getElementById('depth');
const depthSel2 = document.getElementById('depth2');
const panels = document.getElementById('panels');
const splash = document.getElementById('splash');
const engineModeEl = document.getElementById('engineMode');
const evalMain = document.getElementById('evalMain');
const bestMain = document.getElementById('bestMain');
const analyzingText = document.getElementById('analyzingText');
const boardDiv = document.getElementById('board');
const moveListContainer = document.getElementById('moveListContainer');
const moveList = document.getElementById('moveList');
const toggleBtn = document.getElementById('toggleMoves');
const exportBtn = document.getElementById('exportPGN');

// board helpers from previous code
const unicode = {'K':'♔','Q':'♕','R':'♖','B':'♗','N':'♘','P':'♙','k':'♚','q':'♛','r':'♜','b':'♝','n':'♞','p':'♟'};
const pieceValue = { p:100, n:320, b:330, r:500, q:900, k:20000 };
let game = new Chess();
let moveArray = [];
let moveHistory = []; // {move,san,uci,evalAfter,evalBestAfter,label}
let curIndex = -1;

// thresholds for classification (pawns)
const TH_BEST = 0.2, TH_GOOD = 0.5, TH_INACC = 1.0, TH_MIST = 2.0;

// build board
function buildBoard(){ boardDiv.innerHTML=''; const files=['a','b','c','d','e','f','g','h'], ranks=[8,7,6,5,4,3,2,1]; for(let r=0;r<8;r++){ for(let f=0;f<8;f++){ const sq = files[f]+ranks[r]; const d=document.createElement('div'); d.className='square '+(((f+(r%2))%2)===0?'light':'dark'); d.dataset.square=sq; d.addEventListener('click',(e)=>{}); // no interactive moves here for review mode d.style.position='relative'; if(r===7){ const c=document.createElement('div'); c.className='coordinate'; c.style.bottom='4px'; c.style.left='6px'; c.textContent = files[f]; d.appendChild(c); } if(f===0){ const c=document.createElement('div'); c.className='coordinate'; c.style.left='4px'; c.style.top='6px'; c.textContent = ranks[r]; d.appendChild(c); } boardDiv.appendChild(d);} } renderBoard(); }

function renderBoard(){ const squares = boardDiv.children; for(const d of squares){ const sq = d.dataset.square; d.innerHTML = d.querySelector('.coordinate')?d.querySelector('.coordinate').outerHTML : ''; const p = pieceAt(sq); if(p){ const sym = unicode[(p.color==='w'?p.type.toUpperCase():p.type)]; const span = document.createElement('div'); span.className='piece'; span.textContent = sym; span.style.fontSize='1.2em'; d.appendChild(span); } } fixBoardSize(); }

function pieceAt(square){ const b = game.board(); const f = square.charCodeAt(0)-97; const r = 8 - Number(square[1]); return b[r][f]; }

function fixBoardSize(){ const board = document.getElementById('board'); if(board) board.style.height = board.offsetWidth + 'px'; }

window.addEventListener('load', fixBoardSize);
window.addEventListener('resize', fixBoardSize);

function removeArrows(){ document.querySelectorAll('.arrow').forEach(a=>a.remove()); }
function drawBestMoveArrow(from,to){ removeArrows(); const board = document.getElementById('board'); if(!board) return; const arrow = document.createElement('div'); arrow.classList.add('arrow'); arrow.style.position='absolute'; const line = document.createElement('div'); line.classList.add('arrow-line'); const head = document.createElement('div'); head.classList.add('arrow-head'); arrow.appendChild(line); arrow.appendChild(head); board.appendChild(arrow); const fileToX = f => f.charCodeAt(0)-97; const rankToY = r => 8-parseInt(r); const fromX = fileToX(from[0]); const fromY = rankToY(from[1]); const toX = fileToX(to[0]); const toY = rankToY(to[1]); const cellWidth = board.offsetWidth/8; const cellHeight = board.offsetHeight/8; const startX = fromX*cellWidth + cellWidth/2; const startY = fromY*cellHeight + cellHeight/2; const endX = toX*cellWidth + cellWidth/2; const endY = toY*cellHeight + cellHeight/2; const dx = endX-startX; const dy = endY-startY; const length = Math.sqrt(dx*dx+dy*dy); const angle = Math.atan2(dy,dx)*(180/Math.PI); arrow.style.left = startX + 'px'; arrow.style.top = startY + 'px'; line.style.width = (length-18) + 'px'; line.style.height = '6px'; line.style.transform = `rotate(${angle}deg)`; head.style.left = (length-18) + 'px'; head.style.top = '-6px'; head.style.transform = `rotate(${angle}deg)`; setTimeout(()=>removeArrows(), 4000); }

# Stockfish worker helpers
let sfWorker = null;
let sfReady = false;
let stockfishAvailable = false;

def tryLoadStockfish():
    pass
