// Shared HTML template for the landing page. The A/B test only differs in
// whether the Vimeo video embed is included (`includeVideo`) — everything
// else (copy, styling, survey flow, booking widget) is byte-for-byte
// identical between variants and untouched from the current production page.

function videoBlock() {
  return `  <div class="video-embed">
    <div class="video-ratio">
      <iframe src="https://player.vimeo.com/video/1221692348?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;autoplay=1&amp;muted=1" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin" title="GoalFinance"></iframe>
    </div>
  </div>

`;
}

function videoStyles() {
  return `
  .video-embed {
    width: 100%;
    max-width: 640px;
    margin: 28px auto 0;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(17, 24, 39, 0.10);
  }

  .video-embed .video-ratio {
    padding: 56.6% 0 0 0;
    position: relative;
  }

  .video-embed iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;
}

export function renderLandingPage(variant) {
  const includeVideo = variant === 'a';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Restructure Your Debts Into One Easy Payment</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>
  :root {
    --accent: #0e9f6e;
    --accent-dark: #0b7f58;
    --accent-soft: #e6f6f0;
    --border: #e2e5e9;
    --text: #111;
    --muted: #6b7280;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Montserrat', Arial, sans-serif;
    background: #eceef0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 20px;
  }

  .headline {
    color: #000;
    font-weight: 800;
    font-size: clamp(28px, 5vw, 46px);
    line-height: 1.15;
    text-align: center;
    text-wrap: balance;
    max-width: 820px;
  }

  .subline {
    color: var(--muted);
    font-weight: 500;
    font-size: 13px;
    text-align: center;
    margin-top: 14px;
  }

  .card {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(17, 24, 39, 0.10);
    width: 100%;
    max-width: 540px;
    margin-top: 40px;
    padding: 36px 32px 32px;
    transition: max-width .3s ease;
  }

  .card-booking { max-width: 820px; }

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .step-count {
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
    letter-spacing: .04em;
    text-transform: uppercase;
  }

  .back {
    background: none;
    border: none;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    color: var(--muted);
    cursor: pointer;
    padding: 4px;
    visibility: hidden;
  }
  .back.show { visibility: visible; }
  .back:hover { color: var(--text); }

  .progress {
    height: 6px;
    background: #eef0f2;
    border-radius: 3px;
    margin-bottom: 28px;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    width: 0%;
    background: var(--accent);
    border-radius: 3px;
    transition: width .3s ease;
  }

  .question {
    font-weight: 700;
    font-size: 20px;
    color: var(--text);
    margin-bottom: 22px;
    line-height: 1.35;
  }

  .option, .field {
    display: block;
    width: 100%;
    border: 2px solid var(--border);
    border-radius: 10px;
    padding: 16px 18px;
    font-family: 'Montserrat', Arial, sans-serif;
    font-weight: 500;
    font-size: 16px;
    color: var(--text);
    margin-bottom: 12px;
  }

  .option {
    background: #fff;
    text-align: left;
    cursor: pointer;
    transition: border-color .15s, background .15s, transform .1s;
  }

  .option:hover, .option:focus-visible {
    border-color: var(--accent);
    background: var(--accent-soft);
    outline: none;
  }

  .option:active { transform: scale(.99); }

  .option.selected {
    border-color: var(--accent);
    background: var(--accent-soft);
    font-weight: 600;
  }

  .option.selected::after {
    content: '\\2713';
    float: right;
    color: var(--accent);
    font-weight: 700;
  }

  .multi-hint {
    font-size: 13px;
    font-weight: 500;
    color: var(--muted);
    margin: -14px 0 18px;
  }

  .field::placeholder { color: #9ca3af; }
  .field:focus { border-color: var(--accent); outline: none; }

  .submit {
    display: block;
    width: 100%;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 17px 18px;
    font-family: 'Montserrat', Arial, sans-serif;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    margin-top: 8px;
    text-align: center;
    text-decoration: none;
    transition: background .15s;
  }

  .submit:hover, .submit:focus-visible { background: var(--accent-dark); outline: none; }

  .step { display: none; }
  .step.active { display: block; animation: fadeIn .25s ease; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: none; }
  }

  .final {
    font-weight: 600;
    font-size: 19px;
    color: var(--text);
    text-align: center;
    line-height: 1.55;
    margin-bottom: 22px;
  }

  .badge {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: var(--accent-soft);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 4px auto 18px;
  }

  .badge svg { width: 32px; height: 32px; }

  .hint {
    font-size: 13px;
    color: var(--muted);
    text-align: center;
    margin-top: 14px;
    font-weight: 500;
  }

  .tagline {
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
    text-align: center;
    margin-top: 18px;
  }

  .footer {
    font-size: 10px;
    font-weight: 500;
    color: #9ca3af;
    text-align: center;
    margin-top: 40px;
  }

  @media (prefers-reduced-motion: reduce) {
    .option, .progress-bar, .submit { transition: none; }
    .step.active { animation: none; }
  }
${includeVideo ? videoStyles() : ''}</style>
</head>
<body>

  <h1 class="headline">We'll restructure your debts into one easy payment you can afford</h1>
  <p class="subline">T+C's Apply</p>

${includeVideo ? videoBlock() : ''}  <div class="card">
    <div class="card-top">
      <button class="back" id="backBtn" onclick="goBack()" aria-label="Go back">&larr; Back</button>
      <span class="step-count" id="stepCount">Step 1 of 6</span>
    </div>
    <div class="progress"><div class="progress-bar" id="bar"></div></div>

    <div class="step active" data-step="1">
      <p class="question">Hey! What's your name?</p>
      <input class="field" type="text" id="name" placeholder="Your first name" autocomplete="given-name">
      <button class="submit" onclick="submitName()">Continue</button>
    </div>

    <div class="step" data-step="2">
      <p class="question" id="q2">What kind of debts are you looking to consolidate?</p>
      <p class="multi-hint">Select all that apply</p>
      <button class="option" onclick="toggleDebt(this,'Credit card')">Credit card</button>
      <button class="option" onclick="toggleDebt(this,'Car loan')">Car loan</button>
      <button class="option" onclick="toggleDebt(this,'Personal loan')">Personal loan</button>
      <button class="option" onclick="toggleDebt(this,'Payday loans')">Payday loans</button>
      <button class="option" onclick="toggleDebt(this,'Other')">Other</button>
      <button class="submit" onclick="submitDebts()">Continue</button>
    </div>

    <div class="step" data-step="3">
      <p class="question">What's your current employment?</p>
      <button class="option" onclick="answer('employment','Self employed')">Self employed</button>
      <button class="option" onclick="answer('employment','Full time')">Full time</button>
      <button class="option" onclick="answer('employment','Part time')">Part time</button>
      <button class="option" onclick="disqualify('employment','Centrelink')">Centrelink</button>
      <button class="option" onclick="disqualify('employment','Unemployed')">Unemployed</button>
    </div>

    <div class="step" data-step="4">
      <p class="question">What is your approximate household income?</p>
      <button class="option" onclick="answer('income','30-50k')">$30k &ndash; $50k</button>
      <button class="option" onclick="answer('income','50-80k')">$50k &ndash; $80k</button>
      <button class="option" onclick="answer('income','80-100k')">$80k &ndash; $100k</button>
      <button class="option" onclick="answer('income','100k+')">$100k+</button>
    </div>

    <div class="step" data-step="5">
      <p class="question">Do you have a mortgage?</p>
      <button class="option" onclick="answer('mortgage','Yes')">Yes</button>
      <button class="option" onclick="disqualify('mortgage','No')">No</button>
    </div>

    <div class="step" data-step="6">
      <p class="question">What's the mortgage size?</p>
      <button class="option" onclick="answer('mortgageSize','300k or less')">$300k or less</button>
      <button class="option" onclick="answer('mortgageSize','300k-500k')">$300k &ndash; $500k</button>
      <button class="option" onclick="answer('mortgageSize','500k+')">$500k+</button>
    </div>

    <div class="step" data-step="7">
      <div class="badge">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="#0e9f6e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <p class="final" id="congrats">Congrats, we can help! Book a time below to start saving on your repayments today!</p>
      <p class="hint">No cost. No obligation.</p>
      <iframe id="tuYSeKsHzMeQ4V5SDpA2_1787193419184" allow="payment" style="width:100%;border:none;min-height:900px;margin-top:16px;" title="Book your free call"></iframe>
    </div>

    <div class="step" data-step="disqualified">
      <p class="final">Sorry, it doesn't look like we're able to help with your situation right now.</p>
    </div>
  </div>

  <p class="tagline">We've helped 100's of Aussies get their finances back on track!</p>

  <p class="footer">&copy; Goal Finance. All Rights Reserved.</p>

<script>
  var current = 1;
  var total = 7;
  var stepHistory = [];
  var bar = document.getElementById('bar');
  var stepCount = document.getElementById('stepCount');
  var backBtn = document.getElementById('backBtn');
  var answers = {};

  function render() {
    document.querySelectorAll('.step').forEach(function(s){ s.classList.remove('active'); });
    document.querySelector('.step[data-step="' + current + '"]').classList.add('active');
    if (current === 'disqualified' || current === total) {
      bar.style.width = '100%';
      stepCount.textContent = '';
      backBtn.classList.remove('show');
    } else {
      bar.style.width = ((current - 1) / (total - 1) * 100) + '%';
      stepCount.textContent = 'Step ' + current + ' of ' + (total - 1);
      backBtn.classList.toggle('show', stepHistory.length > 0);
    }
  }

  function goTo(step) {
    stepHistory.push(current);
    current = step;
    render();
  }

  function goBack() {
    if (!stepHistory.length) return;
    current = stepHistory.pop();
    render();
  }

  var selectedDebts = [];

  function toggleDebt(btn, value) {
    var i = selectedDebts.indexOf(value);
    if (i === -1) {
      selectedDebts.push(value);
      btn.classList.add('selected');
    } else {
      selectedDebts.splice(i, 1);
      btn.classList.remove('selected');
    }
  }

  function submitDebts() {
    if (!selectedDebts.length) { alert('Please select at least one debt type.'); return; }
    answers.debts = selectedDebts.join(', ');
    goTo(3);
  }

  function submitName() {
    var name = document.getElementById('name').value.trim();
    if (!name) { alert('Please enter your name.'); return; }
    answers.name = name;
    var q2 = document.getElementById('q2');
    q2.textContent = 'Nice to meet you, ' + name + '! What kind of debts are you looking to consolidate?';
    goTo(2);
  }

  function answer(key, value) {
    answers[key] = value;
    if (current === total - 1) {
      // Send lead here (webhook/CRM endpoint):
      // fetch('YOUR_WEBHOOK_URL', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(answers) });
      var c = document.getElementById('congrats');
      c.textContent = 'Congrats' + (answers.name ? ' ' + answers.name : '') + ', we can help! Book a time below to start saving on your repayments today!';
      loadBookingCalendar();
    }
    goTo(current + 1);
  }

  function loadBookingCalendar() {
    var frame = document.getElementById('tuYSeKsHzMeQ4V5SDpA2_1787193419184');
    if (frame.src) return;
    var params = new URLSearchParams();
    if (answers.name) params.set('first_name', answers.name);
    if (answers.debts) params.set('debt_type', answers.debts);
    if (answers.employment) params.set('employment', answers.employment);
    if (answers.income) params.set('household_income', answers.income);
    if (answers.mortgage) params.set('mortgage', answers.mortgage);
    if (answers.mortgageSize) params.set('mortgage_size', answers.mortgageSize);
    frame.src = 'https://api.leadconnectorhq.com/widget/booking/tuYSeKsHzMeQ4V5SDpA2?' + params.toString();
    document.querySelector('.card').classList.add('card-booking');
  }

  function disqualify(key, value) {
    answers[key] = value;
    goTo('disqualified');
  }

  render();
</script>
<script src="https://link.msgsndr.com/js/form_embed.js" type="text/javascript"></script>
${includeVideo ? '<script src="https://player.vimeo.com/api/player.js"></script>\n' : ''}
</body>
</html>
`;
}
