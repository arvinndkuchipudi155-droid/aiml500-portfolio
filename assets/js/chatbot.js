  // ── CHATBOT ──
  var mApiKey = '';
  var mHistory = [];
  var mBusy = false;
  var SYSTEM_PROMPT = 'You are a Change Management and AI Leadership Coach for graduate students in the AIML-500 course. Help users apply frameworks like ADKAR, Kotter\'s 8-Step Model, Prosci, and CCL\'s 9 Change Leadership Competencies to real-world AI/ML integration challenges. Coaching style: Socratic — ask 1-2 clarifying questions before advice. Empathetic. Framework-aware. Responsible AI-focused. Practical and actionable. Do NOT give legal/compliance advice, make decisions for users, or go off-topic.';
  var QUICK_STARTS = ['My team is resisting our new AI tool', 'How do I present AI strategy to the board?', 'There may be bias in our AI model', 'How do I build trust during AI change?'];

  function openChatbot() {
    document.getElementById('cb-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  function closeChatbot() {
    document.getElementById('cb-modal').style.display = 'none';
    document.body.style.overflow = '';
  }
  async function mValidateKey() {
    var inp = document.getElementById('m-key-input');
    var err = document.getElementById('m-key-error');
    var key = inp.value.trim();
    err.textContent = '';
    if (!key.startsWith('AIza')) { err.textContent = 'Key should start with "AIza". Please check and try again.'; return; }
    err.textContent = 'Verifying...';
    try {
      var res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=' + key, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({contents: [{parts: [{text: 'hi'}]}]})
      });
      if (res.status === 400 || res.status === 403) { err.textContent = 'Invalid API key. Please check and try again.'; return; }
      mApiKey = key;
      document.getElementById('m-key-screen').style.display = 'none';
      var cs = document.getElementById('m-chat-screen');
      cs.style.display = 'flex'; cs.style.flexDirection = 'column';
      mInitChat();
    } catch(e) { err.textContent = 'Connection error. Check your internet and try again.'; }
  }
  function mInitChat() {
    var box = document.getElementById('m-chat-box');
    var chips = QUICK_STARTS.map(function(q) {
      return '<span onclick="mQuick(this)" style="background:#1e3560;border:1px solid #2d5299;color:#93c5fd;padding:4px 10px;border-radius:12px;font-size:11px;cursor:pointer;">' + q + '</span>';
    }).join('');
    box.innerHTML = '<div style="display:flex;gap:8px;align-items:flex-start;"><div style="width:28px;height:28px;border-radius:50%;background:#1e3a6e;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;">🤝</div><div style="background:#1a2d4a;border:1px solid #2d4a72;color:#dbeafe;padding:11px 14px;border-radius:12px;border-bottom-left-radius:3px;font-size:13px;line-height:1.6;max-width:85%;">Hi! I\'m your <strong>Change &amp; AI Leadership Coach</strong>. Tell me your challenge:<br/><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;">' + chips + '</div></div></div>';
  }
  function mQuick(el) { document.getElementById('m-input').value = el.textContent; mSend(); }
  function mAddMsg(role, text) {
    var box = document.getElementById('m-chat-box');
    var isUser = role === 'user';
    var formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
    var div = document.createElement('div');
    div.style.cssText = 'display:flex;gap:8px;align-items:flex-start;' + (isUser ? 'flex-direction:row-reverse;' : '');
    div.innerHTML = '<div style="width:28px;height:28px;border-radius:50%;background:' + (isUser ? '#1e3a3a' : '#1e3a6e') + ';display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;">' + (isUser ? '👤' : '🤝') + '</div><div style="background:' + (isUser ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : '#1a2d4a') + ';' + (isUser ? '' : 'border:1px solid #2d4a72;') + 'color:' + (isUser ? '#fff' : '#dbeafe') + ';padding:11px 14px;border-radius:12px;' + (isUser ? 'border-bottom-right-radius:3px' : 'border-bottom-left-radius:3px') + ';font-size:13px;line-height:1.6;max-width:85%;">' + formatted + '</div>';
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }
  function mShowTyping() {
    var box = document.getElementById('m-chat-box');
    var div = document.createElement('div');
    div.id = 'm-typing';
    div.style.cssText = 'display:flex;gap:8px;align-items:flex-start;';
    div.innerHTML = '<div style="width:28px;height:28px;border-radius:50%;background:#1e3a6e;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;">🤝</div><div style="background:#1a2d4a;border:1px solid #2d4a72;padding:12px 16px;border-radius:12px;border-bottom-left-radius:3px;display:flex;gap:5px;align-items:center;"><span style="width:7px;height:7px;background:#3b82f6;border-radius:50%;display:inline-block;animation:bounce 1.2s infinite;"></span><span style="width:7px;height:7px;background:#3b82f6;border-radius:50%;display:inline-block;animation:bounce 1.2s 0.2s infinite;"></span><span style="width:7px;height:7px;background:#3b82f6;border-radius:50%;display:inline-block;animation:bounce 1.2s 0.4s infinite;"></span></div>';
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }
  async function mSend() {
    if (mBusy) return;
    var inp = document.getElementById('m-input');
    var text = inp.value.trim();
    if (!text) return;
    inp.value = '';
    mBusy = true;
    mAddMsg('user', text);
    mHistory.push({role: 'user', parts: [{text: text}]});
    mShowTyping();
    try {
      var res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=' + mApiKey, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({system_instruction: {parts: [{text: SYSTEM_PROMPT}]}, contents: mHistory})
      });
      var data = await res.json();
      var el = document.getElementById('m-typing');
      if (el) el.remove();
      var reply = '';
      if (data.error) {
        reply = data.error.code === 429 ? 'Quota reached for today. Resets every 24 hours.' : 'Error: ' + data.error.message;
      } else {
        reply = data.candidates[0].content.parts.map(function(p) { return p.text || ''; }).join('');
      }
      mHistory.push({role: 'model', parts: [{text: reply}]});
      mAddMsg('assistant', reply);
    } catch(e) {
      var el = document.getElementById('m-typing');
      if (el) el.remove();
      mAddMsg('assistant', 'Connection error. Please try again.');
    }
    mBusy = false;
  }
  document.getElementById('m-key-input').addEventListener('keydown', function(e) { if (e.key === 'Enter') mValidateKey(); });
  document.getElementById('m-input').addEventListener('keydown', function(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); mSend(); } });


document.addEventListener('keydown',function(e){if(e.key==='Escape')closeChatbot();});
