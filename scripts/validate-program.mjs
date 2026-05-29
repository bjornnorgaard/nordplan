import { readFile } from 'node:fs/promises';

const OFFICIAL_PROGRAM_URL = 'https://northside.dk/program/';
const LOCAL_ARTISTS_PATH = new URL('../src/lib/data/artists.ts', import.meta.url);

function decodeHtmlEntities(value) {
	return value
		.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
		.replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'");
}

function cleanText(value) {
	const withoutTags = value.replace(/<[^>]+>/g, ' ');
	const decoded = decodeHtmlEntities(withoutTags);
	return decoded.replace(/\s+/g, ' ').trim();
}

function normalizeDay(dayLabel) {
	if (dayLabel.startsWith('Tor')) return 'Thursday';
	if (dayLabel.startsWith('Fre')) return 'Friday';
	if (dayLabel.startsWith('L')) return 'Saturday';
	return dayLabel;
}

function normalizeStage(stage) {
	return /^[A-Z]+$/.test(stage) ? stage[0] + stage.slice(1).toLowerCase() : stage;
}

function parseLocalArtists(fileContent) {
	const rows = [];
	const entryPattern =
		/\{\s*name:\s*'([^']+)'\s*,\s*stage:\s*'([^']+)'\s*,\s*day:\s*'([^']+)'\s*,\s*startTime:\s*'([^']+)'/g;

	for (const match of fileContent.matchAll(entryPattern)) {
		const [, name, stage, day, startTime] = match;
		rows.push({ name, stage, day, startTime });
	}

	return rows;
}

function parseOfficialProgram(html) {
	const rows = [];
	const anchorPattern = /<a[^>]*class="program-artist"[^>]*>(.*?)<\/a>/gims;
	const infoMarker = '<span class="program-artist__info">';

	for (const match of html.matchAll(anchorPattern)) {
		const anchorContent = match[1].replace(/<figure.*?<\/figure>/gis, '');
		if (!anchorContent.includes(infoMarker)) continue;

		const [rawName] = anchorContent.split(infoMarker, 1);
		const name = cleanText(rawName);
		const startTimeMatch = anchorContent.match(/<span>\s*(\d{2}:\d{2})\s*<\/span>/i);
		const hiddenDesktopValues = [
			...anchorContent.matchAll(/<span\s+class="hidden-desktop">\s*([^<]+?)\s*<\/span>/gi)
		].map((m) => cleanText(m[1]));

		if (!startTimeMatch || hiddenDesktopValues.length < 2) continue;

		rows.push({
			name,
			stage: normalizeStage(hiddenDesktopValues[1]),
			day: normalizeDay(hiddenDesktopValues[0]),
			startTime: startTimeMatch[1]
		});
	}

	return rows;
}

function tupleKey(row) {
	return `${row.name}__${row.stage}__${row.day}__${row.startTime}`;
}

function slotKey(row) {
	return `${row.day}__${row.stage}__${row.startTime}`;
}

function diffSchedules(localRows, officialRows) {
	const localByKey = new Map(localRows.map((row) => [tupleKey(row), row]));
	const officialByKey = new Map(officialRows.map((row) => [tupleKey(row), row]));

	const missingInLocal = officialRows.filter((row) => !localByKey.has(tupleKey(row)));
	const extraInLocal = localRows.filter((row) => !officialByKey.has(tupleKey(row)));

	const extraBySlot = new Map(extraInLocal.map((row) => [slotKey(row), row]));
	const sameSlotNameMismatches = missingInLocal
		.filter((row) => extraBySlot.has(slotKey(row)))
		.map((row) => ({ official: row, local: extraBySlot.get(slotKey(row)) }));

	return { missingInLocal, extraInLocal, sameSlotNameMismatches };
}

function printRows(title, rows) {
	if (rows.length === 0) {
		console.log(`${title}: 0`);
		return;
	}

	console.log(`${title}: ${rows.length}`);
	for (const row of rows) {
		console.log(`  - ${row.name} | ${row.stage} | ${row.day} | ${row.startTime}`);
	}
}

async function run() {
	const localArtistsContent = await readFile(LOCAL_ARTISTS_PATH, 'utf8');
	const localRows = parseLocalArtists(localArtistsContent);

	const response = await fetch(OFFICIAL_PROGRAM_URL);
	if (!response.ok) {
		throw new Error(`Failed to fetch official program (${response.status} ${response.statusText})`);
	}
	const html = await response.text();
	const officialRows = parseOfficialProgram(html);

	const { missingInLocal, extraInLocal, sameSlotNameMismatches } = diffSchedules(localRows, officialRows);

	console.log('NordPlan program validation');
	console.log(`Local entries: ${localRows.length}`);
	console.log(`Official entries: ${officialRows.length}`);
	printRows('Missing in local', missingInLocal);
	printRows('Extra in local', extraInLocal);

	if (sameSlotNameMismatches.length > 0) {
		console.log(`Same slot, different artist name: ${sameSlotNameMismatches.length}`);
		for (const mismatch of sameSlotNameMismatches) {
			console.log(
				`  - ${mismatch.official.day} ${mismatch.official.stage} ${mismatch.official.startTime}: official="${mismatch.official.name}", local="${mismatch.local.name}"`
			);
		}
	} else {
		console.log('Same slot, different artist name: 0');
	}

	if (missingInLocal.length > 0 || extraInLocal.length > 0) {
		process.exitCode = 1;
		return;
	}

	console.log('Validation passed: local schedule matches official program.');
}

run().catch((error) => {
	console.error('Validation failed:', error instanceof Error ? error.message : error);
	process.exitCode = 1;
});

