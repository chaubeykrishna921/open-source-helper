document.addEventListener('DOMContentLoaded', async () => {
  const pageStatus = document.getElementById('pageStatus');
  const btnAction = document.getElementById('btnAction');
  const btnOpenWeb = document.getElementById('btnOpenWeb');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab?.url || '';

  const isIssuePage = /github\.com\/[^/]+\/[^/]+\/issues\/\d+/.test(url);
  const isPRPage = /github\.com\/[^/]+\/[^/]+\/(compare|pull)/.test(url);

  if (isIssuePage) {
    pageStatus.innerHTML = '<strong>GitHub Issue Detected</strong><span style="color:#10b981;">Ready to explain in simple terms!</span>';
    btnAction.textContent = '✨ Explain Issue with GitStart';
    btnAction.onclick = async () => {
      await chrome.tabs.sendMessage(tab.id, { action: 'TRIGGER_EXPLAIN' });
      window.close();
    };
  } else if (isPRPage) {
    pageStatus.innerHTML = '<strong>Pull Request Page Detected</strong><span style="color:#38bdf8;">Ready to audit PR draft before submitting!</span>';
    btnAction.textContent = '🛡️ Pre-Flight PR Review';
    btnAction.onclick = async () => {
      await chrome.tabs.sendMessage(tab.id, { action: 'TRIGGER_PR_REVIEW' });
      window.close();
    };
  } else {
    pageStatus.innerHTML = '<strong>GitHub Assistant Active</strong><span>Browse to any GitHub issue or PR to activate inline AI helpers.</span>';
    btnAction.textContent = '🔍 Find Matching Issues';
    btnAction.onclick = () => {
      chrome.tabs.create({ url: 'http://localhost:3000' });
      window.close();
    };
  }

  btnOpenWeb.onclick = () => {
    chrome.tabs.create({ url: 'http://localhost:3000' });
    window.close();
  };
});
