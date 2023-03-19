const initData = {
  interval: 5000,
  urls: [
    "https://zoom.us/postattendee",
    "https://zoom.us/j/*",
    "https://*.zoom.us/j/*",
    "https://zoom.us/s/*",
    "https://*.zoom.us/s/*",
    "https://www.bing.com/*"
  ]
};

// Saves options to chrome.storage
async function saveInterval() {
  let interval = document.getElementById('interval').value;
  interval = interval * 1000;

  try {
    await chrome.storage.sync.set({ interval });
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = `New interval ${interval / 1000} seconds`;
    setTimeout(function () {
      status.textContent = '';
    }, 2000);
  } catch (err) {
    console.log(err);
    var status = document.getElementById('status');
    status.textContent = err;
    setTimeout(function () {
      status.textContent = '';
    }, 2000);
  }
}

// Saves options to chrome.storage
async function saveUrls() {
  let urlStr = document.getElementById('urls').value;
  if (urlStr === undefined) return;

  urlStr = urlStr.trim();
  if (!urlStr && urlStr.length === 0) {
    var status = document.getElementById('status_urls');
    status.textContent = `At least 1 URL match pattern is required.`;
    setTimeout(function () {
      status.textContent = '';
    }, 2000);
    return
  }

  let urlArr = urlStr.split('\n');
  let urls = [];
  for (let i = 0; i < urlArr.length; i++) {
    let url = urlArr[i].trim();
    if (url) {
      urls.push(url);
    }
  }

  if (!urls || urls.length === 0) {
    return
  }

  try {
    await chrome.storage.sync.set({ urls });
    document.getElementById('urls').value = urls.join('\n');
    // Update status to let user know options were saved.
    var status = document.getElementById('status_urls');
    status.textContent = `New URLs saved.`;
    setTimeout(function () {
      status.textContent = '';
    }, 2000);
  } catch (err) {
    console.log(err);
    var status = document.getElementById('status_urls');
    status.textContent = err;
    setTimeout(function () {
      status.textContent = '';
    }, 2000);
  }
}

// Restores select box state using the preferences
// stored in chrome.storage.
async function restoreOptions() {
  try {
    let items = await chrome.storage.sync.get(initData);

    document.getElementById('interval').value = items.interval / 1000;
    document.getElementById('urls').value = items.urls.join('\n');
  } catch (err) {
    console.log(err);
  }
}

async function resetOptions() {
  try {
    await chrome.storage.sync.set(initData);

    document.getElementById('interval').value = initData.interval / 1000;
    document.getElementById('urls').value = initData.urls.join('\n');
    var status = document.getElementById('status_reset');
    status.textContent = `Settings reset to default values.`;
    setTimeout(function () {
      status.textContent = '';
    }, 2000);
  } catch (err) {
    var status = document.getElementById('status_reset');
    status.textContent = err;
    setTimeout(function () {
      status.textContent = '';
    }, 2000);
    console.log(err);
  }
}

// Restore options when extension is loaded
document.addEventListener('DOMContentLoaded', restoreOptions);
// Set new interval
document.getElementById('interval').addEventListener('change', saveInterval);
// Save new URLs
document.getElementById('save').addEventListener('click', saveUrls);
// Restore defaults
document.getElementById('reset').addEventListener('click', resetOptions);