const ext = typeof browser !== 'undefined' ? browser : chrome
const toggleDesign = document.getElementById('toggleDesign')
const toggleBlurUnwatched = document.getElementById('toggleBlurUnwatched')

async function loadSettings() {
    const result = await ext.storage.local.get(['designEnabled', 'blurUnwatchedEnabled'])
    toggleDesign.checked = result.designEnabled !== false
    toggleBlurUnwatched.checked = result.blurUnwatchedEnabled !== false
}

function saveSetting(key, value) {
    ext.storage.local.set({ [key]: value })
}

toggleDesign.addEventListener('change', () => saveSetting('designEnabled', toggleDesign.checked))
toggleBlurUnwatched.addEventListener('change', () => saveSetting('blurUnwatchedEnabled', toggleBlurUnwatched.checked))
loadSettings()
