/* =========================================================
   CATÁLOGO DE DOCES 3D (ALTO CONTRASTE + FORMAS ÚNICAS)
   ========================================================= */
   let rows = 5;
   let cols = 8;
   
   const CANDIES = [
     {
       id: "jujuba",
       name: "Jujuba Vermelha",
       svg: `
         <svg class="candy-svg" viewBox="0 0 100 100" aria-hidden="true">
           <path d="M26,22 C38,10 62,16 74,34 C86,52 84,74 68,84 C54,92 38,80 32,64 C26,50 14,34 26,22 Z"
             fill="url(#grad-red)" stroke="#000000" stroke-width="6.5" stroke-linejoin="round" />
           <ellipse cx="42" cy="27" rx="11" ry="5.5" transform="rotate(-28 42 27)"
             fill="#ffffff" opacity="0.88" />
           <circle cx="58" cy="40" r="3.5" fill="#ffffff" opacity="0.75" />
         </svg>
       `,
     },
     {
       id: "gota",
       name: "Gota Amarela",
       svg: `
         <svg class="candy-svg" viewBox="0 0 100 100" aria-hidden="true">
           <path d="M50,10 C50,10 84,46 84,66 C84,84 69,92 50,92 C31,92 16,84 16,66 C16,46 50,10 50,10 Z"
             fill="url(#grad-yellow)" stroke="#000000" stroke-width="6.5" stroke-linejoin="round" />
           <path d="M50,24 C50,24 72,50 72,64 C72,76 62,82 50,82 C38,82 28,76 28,64 C28,50 50,24 50,24 Z"
             fill="none" stroke="#fff8d6" stroke-width="3.5" opacity="0.7" />
           <ellipse cx="38" cy="54" rx="6" ry="12" transform="rotate(18 38 54)"
             fill="#ffffff" opacity="0.9" />
         </svg>
       `,
     },
     {
       id: "esfera",
       name: "Bala Azul",
       svg: `
         <svg class="candy-svg" viewBox="0 0 100 100" aria-hidden="true">
           <circle cx="50" cy="50" r="39" fill="url(#grad-blue)" stroke="#000000" stroke-width="6.5" />
           <path d="M16,46 Q50,62 84,46" fill="none" stroke="#caf0f8" stroke-width="5" stroke-linecap="round" opacity="0.75" />
           <ellipse cx="36" cy="30" rx="13" ry="7" transform="rotate(-25 36 30)"
             fill="#ffffff" opacity="0.92" />
           <circle cx="26" cy="42" r="3.5" fill="#ffffff" opacity="0.8" />
         </svg>
       `,
     },
     {
       id: "quadrado",
       name: "Bala Quadrada Verde",
       svg: `
         <svg class="candy-svg" viewBox="0 0 100 100" aria-hidden="true">
           <rect x="14" y="14" width="72" height="72" rx="18"
             fill="url(#grad-green)" stroke="#000000" stroke-width="6.5" />
           <rect x="24" y="24" width="52" height="52" rx="11"
             fill="none" stroke="#b7efc5" stroke-width="4" opacity="0.8" />
           <ellipse cx="35" cy="27" rx="12" ry="5" fill="#ffffff" opacity="0.9" />
         </svg>
       `,
     },
     {
       id: "flor",
       name: "Flor Roxa",
       svg: `
         <svg class="candy-svg" viewBox="0 0 100 100" aria-hidden="true">
           <path d="M50,10 L74,20 L88,42 L84,68 L66,86 L34,86 L16,68 L12,42 L26,20 Z"
             fill="url(#grad-purple)" stroke="#000000" stroke-width="6.5" stroke-linejoin="round" />
           <circle cx="50" cy="34" r="10" fill="#f3c4fb" opacity="0.55" />
           <circle cx="35" cy="52" r="10" fill="#f3c4fb" opacity="0.55" />
           <circle cx="65" cy="52" r="10" fill="#f3c4fb" opacity="0.55" />
           <circle cx="50" cy="67" r="10" fill="#f3c4fb" opacity="0.55" />
           <ellipse cx="38" cy="26" rx="10" ry="5" transform="rotate(-20 38 26)"
             fill="#ffffff" opacity="0.9" />
         </svg>
       `,
     },
     {
       id: "oval",
       name: "Pastilha Laranja",
       svg: `
         <svg class="candy-svg" viewBox="0 0 100 100" aria-hidden="true">
           <ellipse cx="50" cy="50" rx="29" ry="40"
             fill="url(#grad-orange)" stroke="#000000" stroke-width="6.5" />
           <ellipse cx="50" cy="50" rx="15" ry="24"
             fill="none" stroke="#ffe5b4" stroke-width="4.5" opacity="0.85" />
           <ellipse cx="38" cy="28" rx="6" ry="11" transform="rotate(15 38 28)"
             fill="#ffffff" opacity="0.9" />
         </svg>
       `,
     },
   ];
   
   /* =========================================================
      ESTADO DO JOGO E PREFERÊNCIAS DE ACESSIBILIDADE
      ========================================================= */
   let board = [];
   let selectedCell = null;
   let hintCells = [];
   let score = 0;
   let bestScore = Number(localStorage.getItem("doceMatchBest") || 0);
   let isAnimating = false;
   let animEnabled = true;
   let soundEnabled = true;
   let voiceEnabled = false;
   let audioCtx = null;
   
   /* Controle de arraste (Touch / Mouse) */
   let dragStart = null;
   
   /* =========================================================
      ELEMENTOS DO DOM
      ========================================================= */
   const boardEl = document.getElementById("board");
   const boardWrapperEl = document.querySelector(".board-wrapper");
   const scoreEl = document.getElementById("score");
   const bestScoreEl = document.getElementById("best-score");
   const statusBannerEl = document.getElementById("status-banner");
   const legendListEl = document.getElementById("legend-list");
   
   const btnTheme = document.getElementById("btn-theme");
   const btnSize = document.getElementById("btn-size");
   const btnAnim = document.getElementById("btn-anim");
   const btnSound = document.getElementById("btn-sound");
   const btnVoice = document.getElementById("btn-voice");
   const btnHint = document.getElementById("btn-hint");
   const btnRestart = document.getElementById("btn-restart");
   
   /* =========================================================
      ÁUDIO SINTETIZADO E NARRAÇÃO (SEM ARQUIVOS EXTERNOS)
      ========================================================= */
   function playTone(freq, duration = 0.12, type = "sine") {
     if (!soundEnabled) return;
     try {
       if (!audioCtx) {
         audioCtx = new (window.AudioContext || window.webkitAudioContext)();
       }
       const osc = audioCtx.createOscillator();
       const gain = audioCtx.createGain();
       osc.type = type;
       osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
       gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
       gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
       osc.connect(gain);
       gain.connect(audioCtx.destination);
       osc.start();
       osc.stop(audioCtx.currentTime + duration);
     } catch (e) {
       // Ignora bloqueio antes de interação do usuário
     }
   }
   
   function playMatchSound(combo) {
     const base = 440 + combo * 95;
     playTone(base, 0.12, "triangle");
     setTimeout(() => playTone(base * 1.25, 0.16, "triangle"), 85);
   }
   
   function playErrorSound() {
     playTone(170, 0.18, "sawtooth");
   }
   
   function speak(text) {
     if (!voiceEnabled || !("speechSynthesis" in window)) return;
     window.speechSynthesis.cancel();
     const utterance = new SpeechSynthesisUtterance(text);
     utterance.lang = "pt-BR";
     utterance.rate = 1.1;
     window.speechSynthesis.speak(utterance);
   }
   
   function updateStatus(message, shouldSpeak = false) {
     statusBannerEl.textContent = message;
     if (shouldSpeak) speak(message);
   }
   
   /* =========================================================
      INICIALIZAÇÃO E RENDERIZAÇÃO DO TABULEIRO
      ========================================================= */
   function randomCandy() {
     return CANDIES[Math.floor(Math.random() * CANDIES.length)];
   }
   
   function createsInitialMatch(r, c, candy) {
     if (
       c >= 2 &&
       board[r][c - 1]?.id === candy.id &&
       board[r][c - 2]?.id === candy.id
     ) {
       return true;
     }
     if (
       r >= 2 &&
       board[r - 1][c]?.id === candy.id &&
       board[r - 2][c]?.id === candy.id
     ) {
       return true;
     }
     return false;
   }
   
   function initBoard() {
     do {
       board = Array.from({ length: rows }, () => Array(cols).fill(null));
       for (let r = 0; r < rows; r++) {
         for (let c = 0; c < cols; c++) {
           let candy;
           do {
             candy = randomCandy();
           } while (createsInitialMatch(r, c, candy));
           board[r][c] = candy;
         }
       }
     } while (!findValidMove());
   
     selectedCell = null;
     hintCells = [];
   
     const allCoords = new Set();
     for (let r = 0; r < rows; r++) {
       for (let c = 0; c < cols; c++) {
         allCoords.add(`${r},${c}`);
       }
     }
     renderBoard(new Set(), allCoords);
   }
   
   function renderLegend() {
     legendListEl.innerHTML = CANDIES.map(
       (item) => `
         <div class="legend-item">
           <div class="legend-icon">${item.svg}</div>
           <span>${item.name}</span>
         </div>
       `
     ).join("");
   }
   
   function renderBoard(matchedSet = new Set(), droppingSet = new Set()) {
     boardEl.innerHTML = "";
   
     for (let r = 0; r < rows; r++) {
       for (let c = 0; c < cols; c++) {
         const candy = board[r][c];
         const cellBtn = document.createElement("button");
         cellBtn.type = "button";
         cellBtn.className = "cell";
         cellBtn.setAttribute("role", "gridcell");
         cellBtn.dataset.row = r;
         cellBtn.dataset.col = c;
         cellBtn.setAttribute(
           "aria-label",
           `Linha ${r + 1}, Coluna ${c + 1}: ${candy ? candy.name : "Vazio"}`
         );
   
         const delay = ((r * 0.14 + c * 0.19) % 2.4).toFixed(2);
         cellBtn.style.setProperty("--idle-delay", `-${delay}s`);
   
         if (selectedCell && selectedCell.r === r && selectedCell.c === c) {
           cellBtn.classList.add("selected");
           cellBtn.setAttribute("aria-selected", "true");
         }
   
         if (hintCells.some((h) => h.r === r && h.c === c)) {
           cellBtn.classList.add("hint");
         }
   
         if (matchedSet.has(`${r},${c}`)) {
           cellBtn.classList.add("matched");
         }
   
         if (droppingSet.has(`${r},${c}`)) {
           cellBtn.classList.add("dropping");
         }
   
         if (candy) {
           cellBtn.innerHTML = candy.svg;
         }
   
         cellBtn.addEventListener("click", () => handleCellAction(r, c));
         cellBtn.addEventListener("keydown", (e) => handleKeyNavigation(e, r, c));
   
         cellBtn.addEventListener("pointerdown", (e) => {
           dragStart = { r, c, x: e.clientX, y: e.clientY };
         });
   
         cellBtn.addEventListener("pointerup", (e) => {
           if (!dragStart) return;
           const dx = e.clientX - dragStart.x;
           const dy = e.clientY - dragStart.y;
           const startR = dragStart.r;
           const startC = dragStart.c;
           dragStart = null;
   
           if (Math.max(Math.abs(dx), Math.abs(dy)) > 26) {
             let targetR = startR;
             let targetC = startC;
             if (Math.abs(dx) > Math.abs(dy)) {
               targetC += dx > 0 ? 1 : -1;
             } else {
               targetR += dy > 0 ? 1 : -1;
             }
             if (
               targetR >= 0 &&
               targetR < rows &&
               targetC >= 0 &&
               targetC < cols
             ) {
               selectedCell = { r: startR, c: startC };
               handleCellAction(targetR, targetC);
             }
           }
         });
   
         boardEl.appendChild(cellBtn);
       }
     }
   }
   
   /* =========================================================
      NAVEGAÇÃO POR TECLADO E LÓGICA DE JOGADA
      ========================================================= */
   function handleKeyNavigation(e, r, c) {
     let nr = r;
     let nc = c;
   
     if (e.key === "ArrowUp") nr = Math.max(0, r - 1);
     else if (e.key === "ArrowDown") nr = Math.min(rows - 1, r + 1);
     else if (e.key === "ArrowLeft") nc = Math.max(0, c - 1);
     else if (e.key === "ArrowRight") nc = Math.min(cols - 1, c + 1);
     else return;
   
     e.preventDefault();
     const target = boardEl.querySelector(`[data-row="${nr}"][data-col="${nc}"]`);
     if (target) {
       target.focus();
       const candy = board[nr][nc];
       if (candy) {
         speak(`Linha ${nr + 1}, Coluna ${nc + 1}: ${candy.name}`);
       }
     }
   }
   
   async function handleCellAction(r, c) {
     if (isAnimating) return;
     hintCells = [];
   
     const clickedCandy = board[r][c];
     if (!clickedCandy) return;
   
     if (!selectedCell) {
       selectedCell = { r, c };
       playTone(540, 0.08);
       updateStatus(
         `Selecionado: ${clickedCandy.name} (Linha ${r + 1}, Coluna ${c + 1}). Escolha um vizinho.`,
         true
       );
       renderBoard();
       return;
     }
   
     if (selectedCell.r === r && selectedCell.c === c) {
       selectedCell = null;
       playTone(340, 0.08);
       updateStatus("Seleção cancelada.", true);
       renderBoard();
       return;
     }
   
     const isAdjacent =
       Math.abs(selectedCell.r - r) + Math.abs(selectedCell.c - c) === 1;
   
     if (!isAdjacent) {
       selectedCell = { r, c };
       playTone(540, 0.08);
       updateStatus(
         `Nova seleção: ${clickedCandy.name} (Linha ${r + 1}, Coluna ${c + 1}).`,
         true
       );
       renderBoard();
       return;
     }
   
     const first = { ...selectedCell };
     const second = { r, c };
     selectedCell = null;
     isAnimating = true;
   
     swapPieces(first, second);
     renderBoard();
   
     const matches = findMatches();
   
     if (matches.length === 0) {
       playErrorSound();
       updateStatus("Movimento inválido. Essa troca não combina 3 doces iguais.", true);
       await wait(320);
       swapPieces(first, second);
       renderBoard();
       isAnimating = false;
       return;
     }
   
     await processCascades(matches);
   
     if (!findValidMove()) {
       updateStatus("Sem jogadas possíveis! Embaralhando doces...", true);
       await wait(850);
       initBoard();
     }
   
     isAnimating = false;
   }
   
   function swapPieces(a, b) {
     const temp = board[a.r][a.c];
     board[a.r][a.c] = board[b.r][b.c];
     board[b.r][b.c] = temp;
   }
   
   /* =========================================================
      COMBINAÇÕES, GRAVIDADE E PONTUAÇÃO FLUTUANTE
      ========================================================= */
   function findMatches() {
     const matched = new Set();
   
     // Horizontal
     for (let r = 0; r < rows; r++) {
       let streak = 1;
       for (let c = 1; c <= cols; c++) {
         const curr = c < cols ? board[r][c] : null;
         const prev = board[r][c - 1];
         if (curr && prev && curr.id === prev.id) {
           streak++;
         } else {
           if (streak >= 3) {
             for (let k = c - streak; k < c; k++) {
               matched.add(`${r},${k}`);
             }
           }
           streak = 1;
         }
       }
     }
   
     // Vertical
     for (let c = 0; c < cols; c++) {
       let streak = 1;
       for (let r = 1; r <= rows; r++) {
         const curr = r < rows ? board[r][c] : null;
         const prev = board[r - 1][c];
         if (curr && prev && curr.id === prev.id) {
           streak++;
         } else {
           if (streak >= 3) {
             for (let k = r - streak; k < r; k++) {
               matched.add(`${k},${c}`);
             }
           }
           streak = 1;
         }
       }
     }
   
     return Array.from(matched).map((coord) => {
       const [r, c] = coord.split(",").map(Number);
       return { r, c };
     });
   }
   
   function showFloatingPoints(matches, gained) {
     if (!animEnabled || matches.length === 0) return;
     const center = matches[Math.floor(matches.length / 2)];
     const cellEl = boardEl.querySelector(
       `[data-row="${center.r}"][data-col="${center.c}"]`
     );
     if (!cellEl) return;
   
     const badge = document.createElement("div");
     badge.className = "floating-score";
     badge.textContent = `+${gained}`;
     badge.style.left = `${cellEl.offsetLeft + cellEl.offsetWidth / 2}px`;
     badge.style.top = `${cellEl.offsetTop}px`;
     boardWrapperEl.appendChild(badge);
   
     setTimeout(() => badge.remove(), 820);
   }
   
   async function processCascades(initialMatches) {
     let matches = initialMatches;
     let combo = 1;
   
     while (matches.length > 0) {
       const matchedSet = new Set(matches.map((m) => `${m.r},${m.c}`));
       renderBoard(matchedSet);
       playMatchSound(combo);
   
       const gained = matches.length * 10 * combo;
       score += gained;
       updateScoreUI();
       showFloatingPoints(matches, gained);
   
       const comboMsg = combo > 1 ? ` Combo ${combo}x!` : "";
       updateStatus(`Doce combinado! +${gained} pontos.${comboMsg}`, true);
   
       await wait(360);
   
       for (const { r, c } of matches) {
         board[r][c] = null;
       }
   
       const droppingSet = applyGravityAndRefill();
       renderBoard(new Set(), droppingSet);
   
       await wait(380);
   
       matches = findMatches();
       combo++;
     }
   }
   
   function applyGravityAndRefill() {
     const droppingSet = new Set();
   
     for (let c = 0; c < cols; c++) {
       const remaining = [];
       for (let r = rows - 1; r >= 0; r--) {
         if (board[r][c] !== null) {
           remaining.push({ candy: board[r][c], fromRow: r });
         }
       }
   
       let idx = 0;
       for (let r = rows - 1; r >= 0; r--) {
         if (idx < remaining.length) {
           const item = remaining[idx++];
           board[r][c] = item.candy;
           if (item.fromRow !== r) {
             droppingSet.add(`${r},${c}`);
           }
         } else {
           board[r][c] = randomCandy();
           droppingSet.add(`${r},${c}`);
         }
       }
     }
   
     return droppingSet;
   }
   
   function findValidMove() {
     for (let r = 0; r < rows; r++) {
       for (let c = 0; c < cols; c++) {
         if (c + 1 < cols) {
           swapPieces({ r, c }, { r, c: c + 1 });
           const hasMatch = findMatches().length > 0;
           swapPieces({ r, c }, { r, c: c + 1 });
           if (hasMatch) return [{ r, c }, { r, c: c + 1 }];
         }
         if (r + 1 < rows) {
           swapPieces({ r, c }, { r: r + 1, c });
           const hasMatch = findMatches().length > 0;
           swapPieces({ r, c }, { r: r + 1, c });
           if (hasMatch) return [{ r, c }, { r: r + 1, c }];
         }
       }
     }
     return null;
   }
   
   function updateScoreUI() {
     scoreEl.textContent = score;
     if (score > bestScore) {
       bestScore = score;
       localStorage.setItem("doceMatchBest", String(bestScore));
     }
     bestScoreEl.textContent = bestScore;
   }
   
   function wait(ms) {
     return new Promise((resolve) => setTimeout(resolve, ms));
   }
   
   /* =========================================================
      BOTÕES DE ACESSIBILIDADE E CONTROLE
      ========================================================= */
   btnTheme.addEventListener("click", () => {
     const isLight = document.body.classList.toggle("theme-light");
     document.body.classList.toggle("theme-dark", !isLight);
     btnTheme.textContent = isLight ? "Contraste: Claro" : "Contraste: Escuro";
     btnTheme.setAttribute("aria-pressed", String(isLight));
     playTone(600, 0.08);
   });
   
   btnSize.addEventListener("click", () => {
     if (isAnimating) return;
     const isLarge = document.body.classList.toggle("size-large");
     rows = isLarge ? 5 : 7;
     cols = isLarge ? 8 : 7;
     btnSize.textContent = isLarge ? "Tamanho: Máximo (5×8)" : "Tamanho: Grande (7×7)";
     btnSize.setAttribute("aria-pressed", String(isLarge));
     boardEl.setAttribute("aria-label", `Tabuleiro ${rows} por ${cols} de doces`);
     playTone(600, 0.08);
     initBoard();
     updateStatus(
       isLarge
         ? "Modo Tamanho Máximo: 5 linhas por 8 colunas."
         : "Modo Tamanho Grande: 7 linhas por 7 colunas.",
       true
     );
   });
   
   btnAnim.addEventListener("click", () => {
     animEnabled = !animEnabled;
     document.body.classList.toggle("no-animations", !animEnabled);
     btnAnim.textContent = animEnabled ? "Animação: Ligada" : "Animação: Desligada";
     btnAnim.setAttribute("aria-pressed", String(animEnabled));
     playTone(600, 0.08);
   });
   
   btnSound.addEventListener("click", () => {
     soundEnabled = !soundEnabled;
     btnSound.textContent = soundEnabled ? "Som: Ligado" : "Som: Desligado";
     btnSound.setAttribute("aria-pressed", String(soundEnabled));
     if (soundEnabled) playTone(660, 0.1);
   });
   
   btnVoice.addEventListener("click", () => {
     voiceEnabled = !voiceEnabled;
     btnVoice.textContent = voiceEnabled ? "Voz: Ligada" : "Voz: Desligada";
     btnVoice.setAttribute("aria-pressed", String(voiceEnabled));
     if (voiceEnabled) {
       speak("Narração por voz ativada.");
     } else if ("speechSynthesis" in window) {
       window.speechSynthesis.cancel();
     }
   });
   
   btnHint.addEventListener("click", () => {
     if (isAnimating) return;
     const move = findValidMove();
     if (move) {
       hintCells = move;
       renderBoard();
       const p1 = board[move[0].r][move[0].c];
       const p2 = board[move[1].r][move[1].c];
       playTone(720, 0.12);
       updateStatus(
         `Dica: troque ${p1.name} (Linha ${move[0].r + 1}, Coluna ${move[0].c + 1}) com ${p2.name} (Linha ${move[1].r + 1}, Coluna ${move[1].c + 1}).`,
         true
       );
     }
   });
   
   btnRestart.addEventListener("click", () => {
     if (isAnimating) return;
     score = 0;
     updateScoreUI();
     initBoard();
     playTone(480, 0.12);
     updateStatus("Novo jogo iniciado!", true);
   });
   
   /* =========================================================
      INICIALIZAÇÃO AO CARREGAR A PÁGINA
      ========================================================= */
   bestScoreEl.textContent = bestScore;
   renderLegend();
   initBoard();