chrome.tabs.onUpdated.addListener(closeZoomTabs);
chrome.tabs.onActivated.addListener(closeZoomTabs);

const delay = 6000;
const urls = [
  "https://zoom.us/postattendee",
  "https://zoom.us/j/*",
  "https://*.zoom.us/j/*",
  "https://zoom.us/s/*",
  "https://*.zoom.us/s/*",
  "https://www.bing.com/*"
];

async function closeZoomTabs() {
  // Wait for delay milliesconds
  await new Promise(resolve => setTimeout(resolve, delay));

  // Find all the tabs matching URL patterns
  try {
    let tabs = await chrome.tabs.query({
      url: urls
    });
    // console.log(tabs);

    let tabsCount = tabs.length || 0;
    let tabIds = [];
    for (let i = 0; i < tabsCount; i++) {
      let currTab = tabs[i];
      // console.log({ currTab });
      // Add tab for removal only if the tab has completed the loading status
      if (currTab.status === "complete") {
        let { id } = currTab;
        tabIds.push(id);
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