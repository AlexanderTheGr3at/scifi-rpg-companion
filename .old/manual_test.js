// Manual test script - paste this into browser console on the main character sheet

console.log('=== MANUAL UPGRADE SYSTEM TEST ===');

// Test 1: Check if all upgrade elements exist
const powerSlots = ['biotic-power-1', 'biotic-power-2', 'biotic-power-3', 'tech-power-1', 'tech-power-2', 'tech-power-3'];

powerSlots.forEach(slot => {
    const powerSelect = document.getElementById(slot);
    const levelSelect = document.getElementById(slot + '-level');
    const upgradeSelect = document.getElementById(slot + '-upgrade');

    console.log(`${slot}:`);
    console.log(`  Power select: ${!!powerSelect}`);
    console.log(`  Level select: ${!!levelSelect}`);
    console.log(`  Upgrade select: ${!!upgradeSelect}`);

    if (upgradeSelect) {
        console.log(`  Upgrade display: ${upgradeSelect.style.display}`);
        console.log(`  Upgrade visible: ${upgradeSelect.offsetParent !== null}`);
    }
});

// Test 2: Test biotic-power-2 specifically
console.log('\n=== TESTING BIOTIC-POWER-2 SPECIFICALLY ===');

const testSlot = 'biotic-power-2';
const testPowerSelect = document.getElementById(testSlot);
const testLevelSelect = document.getElementById(testSlot + '-level');
const testUpgradeSelect = document.getElementById(testSlot + '-upgrade');

if (testPowerSelect && testLevelSelect && testUpgradeSelect) {
    console.log('All elements found for biotic-power-2');

    // Set power to Lash
    testPowerSelect.value = 'Lash';
    console.log('Set power to Lash');

    // Trigger power change
    updatePowerUpgradeOptions(testSlot, 'Lash');
    console.log('Called updatePowerUpgradeOptions');

    // Set level to level5
    testLevelSelect.value = 'level5';
    console.log('Set level to level5');

    // Trigger level change
    updatePowerUpgradeDropdown(testSlot, 'Lash');
    console.log('Called updatePowerUpgradeDropdown');

    console.log(`Upgrade select display: ${testUpgradeSelect.style.display}`);
    console.log(`Upgrade select innerHTML: ${testUpgradeSelect.innerHTML}`);
    console.log(`Upgrade options count: ${testUpgradeSelect.options.length}`);

} else {
    console.log('ERROR: Missing elements for biotic-power-2');
}

// Test 3: Check Lash power data
console.log('\n=== CHECKING LASH POWER DATA ===');
const lashData = POWER_DATA['Lash'];
if (lashData) {
    console.log('Lash data exists');
    console.log('Has upgrades:', !!lashData.upgrades);
    if (lashData.upgrades) {
        console.log('Level 5 upgrades:', !!lashData.upgrades.level5);
        console.log('Level 10 upgrades:', !!lashData.upgrades.level10);
        if (lashData.upgrades.level5) {
            console.log('Level 5 options:', lashData.upgrades.level5.options.map(opt => opt.name));
        }
    }
} else {
    console.log('ERROR: Lash data not found');
}

console.log('\n=== TEST COMPLETE ===');