const ext = typeof browser !== 'undefined' ? browser : chrome;
const toggleDesign = document.getElementById('toggleDesign');
const openCalendarBtn = document.getElementById('openCalendarBtn');

async function loadSettings() {
    const result = await ext.storage.local.get(['designEnabled']);
    toggleDesign.checked = result.designEnabled !== false;
}

function saveSetting(key, value) {
    ext.storage.local.set({ [key]: value });
}

toggleDesign.addEventListener('change', () => saveSetting('designEnabled', toggleDesign.checked));

if (openCalendarBtn) {
    openCalendarBtn.addEventListener('click', async () => {
        try {
            const tabs = await ext.tabs.query({ active: true, currentWindow: true });
            const currentTab = tabs[0];
            if (currentTab && currentTab.url && currentTab.url.includes('crunchyroll.com')) {
                ext.tabs.sendMessage(currentTab.id, { action: 'open_calendar' });
                window.close();
            } else {
                ext.tabs.create({ url: 'https://www.crunchyroll.com' });
            }
        } catch (e) {
            ext.tabs.create({ url: 'https://www.crunchyroll.com' });
        }
    });
}

loadSettings();
