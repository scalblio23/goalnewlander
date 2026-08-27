// Shared HTML template for the landing page. The A/B test only differs in
// whether the Vimeo video embed is included (`includeVideo`) — everything
// else (copy, styling, survey flow, booking widget) is byte-for-byte
// identical between variants and untouched from the current production page.
//
// This page is meant to be pasted as a fragment into third-party page
// builders (e.g. a GHL "Custom HTML" element), which typically discard the
// outer <html>/<head>/<body> tags and keep only the inner content, and
// which may already define their own generic class names (.card, .badge,
// .footer, etc.) on the same page. So every class name here is prefixed
// uniquely ("gf-lp-...") rather than relying on ancestor scoping or CSS
// specificity alone — verified against an adversarial test where a host
// page defines colliding class names with `!important` rules.

function videoBlock() {
  return `    <div class="gf-lp-video-embed">
      <div class="gf-lp-video-ratio">
        <iframe src="https://player.vimeo.com/video/1221692348?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;autoplay=1&amp;muted=1" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin" title="GoalFinance"></iframe>
      </div>
    </div>

`;
}

function videoStyles() {
  return `
  .gf-lp .gf-lp-video-embed {
    width: 100%;
    max-width: 640px;
    margin: 28px auto 0;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(17, 24, 39, 0.10);
  }

  .gf-lp .gf-lp-video-embed .gf-lp-video-ratio {
    padding: 56.6% 0 0 0;
    position: relative;
  }

  .gf-lp .gf-lp-video-embed iframe {
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
  .gf-lp {
    --gf-lp-accent: #0e9f6e;
    --gf-lp-accent-dark: #0b7f58;
    --gf-lp-accent-soft: #e6f6f0;
    --gf-lp-border: #e2e5e9;
    --gf-lp-text: #111;
    --gf-lp-muted: #6b7280;
  }

  .gf-lp, .gf-lp * { margin: 0; padding: 0; box-sizing: border-box; }

  .gf-lp {
    font-family: 'Montserrat', Arial, sans-serif;
    background: #eceef0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 20px;
    /* Full-bleed: page builders commonly wrap a Custom HTML element in a
       "boxed" column with its own max-width, which would otherwise leave
       the host page's background showing as white margins on both sides.
       This breaks out to the full viewport width regardless of that
       column's width, without needing any GHL settings changed. */
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
  }

  .gf-lp .gf-lp-headline {
    color: #000;
    font-weight: 800;
    font-size: clamp(28px, 5vw, 46px);
    line-height: 1.15;
    text-align: center;
    text-wrap: balance;
    max-width: 820px;
  }

  .gf-lp .gf-lp-subline {
    color: var(--gf-lp-muted);
    font-weight: 500;
    font-size: 13px;
    text-align: center;
    margin-top: 14px;
  }

  .gf-lp .gf-lp-cta-line {
    color: var(--gf-lp-text);
    font-weight: 700;
    font-size: 17px;
    line-height: 1.4;
    text-align: center;
    text-wrap: balance;
    max-width: 560px;
    margin: 28px auto 0;
  }

  .gf-lp .gf-lp-card {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(17, 24, 39, 0.10);
    width: 100%;
    max-width: 540px;
    margin-top: 40px;
    padding: 36px 32px 32px;
    transition: max-width .3s ease;
  }

  .gf-lp .gf-lp-card-booking { max-width: 820px; }

  .gf-lp .gf-lp-card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .gf-lp .gf-lp-step-count {
    font-size: 12px;
    font-weight: 600;
    color: var(--gf-lp-muted);
    letter-spacing: .04em;
    text-transform: uppercase;
  }

  .gf-lp .gf-lp-back {
    background: none;
    border: none;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    color: var(--gf-lp-muted);
    cursor: pointer;
    padding: 4px;
    visibility: hidden;
  }
  .gf-lp .gf-lp-back.gf-lp-show { visibility: visible; }
  .gf-lp .gf-lp-back:hover { color: var(--gf-lp-text); }

  .gf-lp .gf-lp-progress {
    height: 6px;
    background: #eef0f2;
    border-radius: 3px;
    margin-bottom: 28px;
    overflow: hidden;
  }

  .gf-lp .gf-lp-progress-bar {
    height: 100%;
    width: 0%;
    background: var(--gf-lp-accent);
    border-radius: 3px;
    transition: width .3s ease;
  }

  .gf-lp .gf-lp-question {
    font-weight: 700;
    font-size: 20px;
    color: var(--gf-lp-text);
    margin-bottom: 22px;
    line-height: 1.35;
  }

  .gf-lp .gf-lp-option, .gf-lp .gf-lp-field {
    display: block;
    width: 100%;
    border: 2px solid var(--gf-lp-border);
    border-radius: 10px;
    padding: 16px 18px;
    font-family: 'Montserrat', Arial, sans-serif;
    font-weight: 500;
    font-size: 16px;
    color: var(--gf-lp-text);
    margin-bottom: 12px;
  }

  .gf-lp .gf-lp-option {
    background: #fff;
    text-align: left;
    cursor: pointer;
    transition: border-color .15s, background .15s, transform .1s;
  }

  .gf-lp .gf-lp-option:hover, .gf-lp .gf-lp-option:focus-visible {
    border-color: var(--gf-lp-accent);
    background: var(--gf-lp-accent-soft);
    outline: none;
  }

  .gf-lp .gf-lp-option:active { transform: scale(.99); }

  .gf-lp .gf-lp-option.gf-lp-selected {
    border-color: var(--gf-lp-accent);
    background: var(--gf-lp-accent-soft);
    font-weight: 600;
  }

  .gf-lp .gf-lp-option.gf-lp-selected::after {
    content: '\\2713';
    float: right;
    color: var(--gf-lp-accent);
    font-weight: 700;
  }

  .gf-lp .gf-lp-multi-hint {
    font-size: 13px;
    font-weight: 500;
    color: var(--gf-lp-muted);
    margin: -14px 0 18px;
  }

  .gf-lp .gf-lp-field::placeholder { color: #9ca3af; }
  .gf-lp .gf-lp-field:focus { border-color: var(--gf-lp-accent); outline: none; }

  .gf-lp .gf-lp-submit {
    display: block;
    width: 100%;
    background: var(--gf-lp-accent);
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

  .gf-lp .gf-lp-submit:hover, .gf-lp .gf-lp-submit:focus-visible { background: var(--gf-lp-accent-dark); outline: none; }

  .gf-lp .gf-lp-step { display: none; }
  .gf-lp .gf-lp-step.gf-lp-active { display: block; animation: gf-lp-fade-in .25s ease; }

  @keyframes gf-lp-fade-in {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: none; }
  }

  .gf-lp .gf-lp-final {
    font-weight: 600;
    font-size: 19px;
    color: var(--gf-lp-text);
    text-align: center;
    line-height: 1.55;
    margin-bottom: 22px;
  }

  .gf-lp .gf-lp-badge {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: var(--gf-lp-accent-soft);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 4px auto 18px;
  }

  .gf-lp .gf-lp-badge svg { width: 32px; height: 32px; }

  .gf-lp .gf-lp-hint {
    font-size: 13px;
    color: var(--gf-lp-muted);
    text-align: center;
    margin-top: 14px;
    font-weight: 500;
  }

  .gf-lp .gf-lp-tagline {
    font-size: 12px;
    font-weight: 600;
    color: var(--gf-lp-muted);
    text-align: center;
    margin-top: 18px;
  }

  .gf-lp .gf-lp-footer {
    font-size: 10px;
    font-weight: 500;
    color: #9ca3af;
    text-align: center;
    margin-top: 40px;
  }

  @media (prefers-reduced-motion: reduce) {
    .gf-lp .gf-lp-option, .gf-lp .gf-lp-progress-bar, .gf-lp .gf-lp-submit { transition: none; }
    .gf-lp .gf-lp-step.gf-lp-active { animation: none; }
  }
${includeVideo ? videoStyles() : ''}</style>
</head>
<body>

<div class="gf-lp">

  <h1 class="gf-lp-headline">We'll restructure your debts into one easy payment you can afford</h1>
  <p class="gf-lp-subline">T+C's Apply</p>

${includeVideo ? videoBlock() : ''}  <p class="gf-lp-cta-line">Book your free, complimentary strategy call below. We'll restructure your debt within the next three to seven days.</p>

  <div class="gf-lp-card">
    <div class="gf-lp-card-top">
      <button class="gf-lp-back" id="gf-lp-backBtn" onclick="gfLpGoBack()" aria-label="Go back">&larr; Back</button>
      <span class="gf-lp-step-count" id="gf-lp-stepCount">Step 1 of 6</span>
    </div>
    <div class="gf-lp-progress"><div class="gf-lp-progress-bar" id="gf-lp-bar"></div></div>

    <div class="gf-lp-step gf-lp-active" data-step="1">
      <p class="gf-lp-question">Hey! What's your name?</p>
      <input class="gf-lp-field" type="text" id="gf-lp-name" placeholder="Your first name" autocomplete="given-name">
      <button class="gf-lp-submit" onclick="gfLpSubmitName()">Continue</button>
    </div>

    <div class="gf-lp-step" data-step="2">
      <p class="gf-lp-question" id="gf-lp-q2">What kind of debts are you looking to consolidate?</p>
      <p class="gf-lp-multi-hint">Select all that apply</p>
      <button class="gf-lp-option" onclick="gfLpToggleDebt(this,'Credit card')">Credit card</button>
      <button class="gf-lp-option" onclick="gfLpToggleDebt(this,'Car loan')">Car loan</button>
      <button class="gf-lp-option" onclick="gfLpToggleDebt(this,'Personal loan')">Personal loan</button>
      <button class="gf-lp-option" onclick="gfLpToggleDebt(this,'Payday loans')">Payday loans</button>
      <button class="gf-lp-option" onclick="gfLpToggleDebt(this,'Other')">Other</button>
      <button class="gf-lp-submit" onclick="gfLpSubmitDebts()">Continue</button>
    </div>

    <div class="gf-lp-step" data-step="3">
      <p class="gf-lp-question">What's your current employment?</p>
      <button class="gf-lp-option" onclick="gfLpAnswer('employment','Self employed')">Self employed</button>
      <button class="gf-lp-option" onclick="gfLpAnswer('employment','Full time')">Full time</button>
      <button class="gf-lp-option" onclick="gfLpAnswer('employment','Part time')">Part time</button>
      <button class="gf-lp-option" onclick="gfLpDisqualify('employment','Centrelink')">Centrelink</button>
      <button class="gf-lp-option" onclick="gfLpDisqualify('employment','Unemployed')">Unemployed</button>
    </div>

    <div class="gf-lp-step" data-step="4">
      <p class="gf-lp-question">What is your approximate household income?</p>
      <button class="gf-lp-option" onclick="gfLpAnswer('income','30-50k')">$30k &ndash; $50k</button>
      <button class="gf-lp-option" onclick="gfLpAnswer('income','50-80k')">$50k &ndash; $80k</button>
      <button class="gf-lp-option" onclick="gfLpAnswer('income','80-100k')">$80k &ndash; $100k</button>
      <button class="gf-lp-option" onclick="gfLpAnswer('income','100k+')">$100k+</button>
    </div>

    <div class="gf-lp-step" data-step="5">
      <p class="gf-lp-question">Do you have a mortgage?</p>
      <button class="gf-lp-option" onclick="gfLpAnswer('mortgage','Yes')">Yes</button>
      <button class="gf-lp-option" onclick="gfLpDisqualify('mortgage','No')">No</button>
    </div>

    <div class="gf-lp-step" data-step="6">
      <p class="gf-lp-question">What's the mortgage size?</p>
      <button class="gf-lp-option" onclick="gfLpAnswer('mortgageSize','300k or less')">$300k or less</button>
      <button class="gf-lp-option" onclick="gfLpAnswer('mortgageSize','300k-500k')">$300k &ndash; $500k</button>
      <button class="gf-lp-option" onclick="gfLpAnswer('mortgageSize','500k+')">$500k+</button>
    </div>

    <div class="gf-lp-step" data-step="7">
      <div class="gf-lp-badge">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="#0e9f6e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <p class="gf-lp-final" id="gf-lp-congrats">Congrats, we can help! Book a time below to start saving on your repayments today!</p>
      <p class="gf-lp-hint">No cost. No obligation.</p>
      <iframe id="tuYSeKsHzMeQ4V5SDpA2_1787193419184" allow="payment" style="width:100%;border:none;min-height:900px;margin-top:16px;" title="Book your free call"></iframe>
    </div>

    <div class="gf-lp-step" data-step="disqualified">
      <p class="gf-lp-final">Sorry, it doesn't look like we're able to help with your situation right now.</p>
    </div>
  </div>

  <p class="gf-lp-tagline">We've helped 100's of Aussies get their finances back on track!</p>

  <p class="gf-lp-footer">&copy; Goal Finance. All Rights Reserved.</p>

</div>

<script>
  var gfLpCurrent = 1;
  var gfLpTotal = 7;
  var gfLpStepHistory = [];
  var gfLpBar = document.getElementById('gf-lp-bar');
  var gfLpStepCount = document.getElementById('gf-lp-stepCount');
  var gfLpBackBtn = document.getElementById('gf-lp-backBtn');
  var gfLpAnswers = {};

  function gfLpRender() {
    document.querySelectorAll('.gf-lp-step').forEach(function(s){ s.classList.remove('gf-lp-active'); });
    document.querySelector('.gf-lp-step[data-step="' + gfLpCurrent + '"]').classList.add('gf-lp-active');
    if (gfLpCurrent === 'disqualified' || gfLpCurrent === gfLpTotal) {
      gfLpBar.style.width = '100%';
      gfLpStepCount.textContent = '';
      gfLpBackBtn.classList.remove('gf-lp-show');
    } else {
      gfLpBar.style.width = ((gfLpCurrent - 1) / (gfLpTotal - 1) * 100) + '%';
      gfLpStepCount.textContent = 'Step ' + gfLpCurrent + ' of ' + (gfLpTotal - 1);
      gfLpBackBtn.classList.toggle('gf-lp-show', gfLpStepHistory.length > 0);
    }
  }

  function gfLpGoTo(step) {
    gfLpStepHistory.push(gfLpCurrent);
    gfLpCurrent = step;
    gfLpRender();
  }

  function gfLpGoBack() {
    if (!gfLpStepHistory.length) return;
    gfLpCurrent = gfLpStepHistory.pop();
    gfLpRender();
  }

  var gfLpSelectedDebts = [];

  function gfLpToggleDebt(btn, value) {
    var i = gfLpSelectedDebts.indexOf(value);
    if (i === -1) {
      gfLpSelectedDebts.push(value);
      btn.classList.add('gf-lp-selected');
    } else {
      gfLpSelectedDebts.splice(i, 1);
      btn.classList.remove('gf-lp-selected');
    }
  }

  function gfLpSubmitDebts() {
    if (!gfLpSelectedDebts.length) { alert('Please select at least one debt type.'); return; }
    gfLpAnswers.debts = gfLpSelectedDebts.join(', ');
    gfLpGoTo(3);
  }

  function gfLpSubmitName() {
    var name = document.getElementById('gf-lp-name').value.trim();
    if (!name) { alert('Please enter your name.'); return; }
    gfLpAnswers.name = name;
    var q2 = document.getElementById('gf-lp-q2');
    q2.textContent = 'Nice to meet you, ' + name + '! What kind of debts are you looking to consolidate?';
    gfLpGoTo(2);
  }

  function gfLpAnswer(key, value) {
    gfLpAnswers[key] = value;
    if (gfLpCurrent === gfLpTotal - 1) {
      // Send lead here (webhook/CRM endpoint):
      // fetch('YOUR_WEBHOOK_URL', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(gfLpAnswers) });
      var c = document.getElementById('gf-lp-congrats');
      c.textContent = 'Congrats' + (gfLpAnswers.name ? ' ' + gfLpAnswers.name : '') + ', we can help! Book a time below to start saving on your repayments today!';
      gfLpLoadBookingCalendar();
    }
    gfLpGoTo(gfLpCurrent + 1);
  }

  function gfLpLoadBookingCalendar() {
    var frame = document.getElementById('tuYSeKsHzMeQ4V5SDpA2_1787193419184');
    if (frame.src) return;
    var params = new URLSearchParams();
    if (gfLpAnswers.name) params.set('first_name', gfLpAnswers.name);
    if (gfLpAnswers.debts) params.set('debt_type', gfLpAnswers.debts);
    if (gfLpAnswers.employment) params.set('employment', gfLpAnswers.employment);
    if (gfLpAnswers.income) params.set('household_income', gfLpAnswers.income);
    if (gfLpAnswers.mortgage) params.set('mortgage', gfLpAnswers.mortgage);
    if (gfLpAnswers.mortgageSize) params.set('mortgage_size', gfLpAnswers.mortgageSize);
    frame.src = 'https://api.leadconnectorhq.com/widget/booking/tuYSeKsHzMeQ4V5SDpA2?' + params.toString();
    document.querySelector('.gf-lp-card').classList.add('gf-lp-card-booking');
  }

  function gfLpDisqualify(key, value) {
    gfLpAnswers[key] = value;
    gfLpGoTo('disqualified');
  }

  gfLpRender();
</script>
<script src="https://link.msgsndr.com/js/form_embed.js" type="text/javascript"></script>
${includeVideo ? '<script src="https://player.vimeo.com/api/player.js"></script>\n' : ''}
</body>
</html>
`;
}
