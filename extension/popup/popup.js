const ext = typeof browser !== 'undefined' ? browser : chrome

const toggles = [
    ['toggleDesign', 'designEnabled'],
    ['toggleBlur', 'blurUnwatchedEnabled'],
    ['toggleFiller', 'fillerTagsEnabled'],
    ['toggleCalendar', 'calendarEnabled'],
]

async function loadSettings() {
    const result = await ext.storage.local.get(toggles.map(([, key]) => key))
    for (const [id, key] of toggles) {
        const el = document.getElementById(id)
        el.checked = result[key] !== false
        el.addEventListener('change', () => saveSetting(key, el.checked))
    }
}

function saveSetting(key, value) {
    ext.storage.local.set({ [key]: value })
}

loadSettings()
