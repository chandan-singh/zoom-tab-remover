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

async function init() {
  try {
    let data = await chrome.storage.sync.get(initData);
    await chrome.storage.sync.set(data);

    console.log("Init completed");
  } catch (error) {
    console.error(error);
  }
}

async function closeZoomTabs() {
  try {
    let data = await chrome.storage.sync.get(initData);

    // if there is no data available then use the default urls 
    if (!data || !data.urls || data.urls.length === 0) {
      data = initData;
    }

    // Find all the tabs matching URL patterns
    let tabs = await chrome.tabs.query({
      url: data.urls
    });

    // Wait for delay milliesconds
    await new Promise(resolve => setTimeout(resolve, data.interval));
    // console.log(tabs);

    let tabsCount = tabs.length || 0;
    let tabIds = [];
    for (let i = 0; i < tabsCount; i++) {
      try {
        // Check if the tab is still open
        let currTab = await chrome.tabs.get(tabs[i].id);
        if (currTab && currTab.status === "complete") {
          let { id } = currTab;
          // Add tab for removal only if the tab has completed the loading status
          tabIds.push(id);
        }
      } catch (err) {
        // console.log(err);
      }
    }

    // Close the tab if any tab found
    if (tabIds.length > 0) {
      try {
        await chrome.tabs.remove(tabIds);
      } catch (err) {
        console.log(err);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

chrome.runtime.onInstalled.addListener(init);
chrome.tabs.onUpdated.addListener(closeZoomTabs);
// chrome.tabs.onActivated.addListener(closeZoomTabs);