export interface Artist {
	name: string;
	stage: string;
	day: string;
	startTime: string;
	genre: string;
}

export const artists: Artist[] = [
    // THURSDAY
    { name: 'Elias Rønnenfelt', stage: 'Nova', day: 'Thursday', startTime: '13:00', genre: 'Poetic Indie Punk' },
    { name: 'Kalaset', stage: 'Astra', day: 'Thursday', startTime: '14:00', genre: 'Summery Danish Pop' },
    { name: 'Kayak', stage: 'Luna', day: 'Thursday', startTime: '14:00', genre: 'Crossover Rock/Prog' },
    { name: 'SPEEDRUN', stage: 'SideShow', day: 'Thursday', startTime: '14:15', genre: 'High-energy Electro-Swing' },
    { name: 'CMAT', stage: 'Nova', day: 'Thursday', startTime: '15:15', genre: 'Humorous Country Pop' },
    { name: 'Glitter Wrestling', stage: 'SideShow', day: 'Thursday', startTime: '15:30', genre: 'Theatrical Performance' },
    { name: 'Vinnie Who (DJ set)', stage: 'Skovbrynet', day: 'Thursday', startTime: '16:00', genre: 'Disco/Pop DJ Set' },
    { name: 'Big Thief', stage: 'Astra', day: 'Thursday', startTime: '16:30', genre: 'Vulnerable Indie Folk' },
    { name: 'The Twilight Sad', stage: 'Luna', day: 'Thursday', startTime: '16:30', genre: 'Dark Scottish Indie' },
    { name: 'Emma Lea', stage: 'SideShow', day: 'Thursday', startTime: '16:30', genre: 'Contemporary Pop' },
    { name: 'The Sideshow Spectacular', stage: 'SideShow', day: 'Thursday', startTime: '17:30', genre: 'Variety Show' },
    { name: 'Ashnikko', stage: 'Nova', day: 'Thursday', startTime: '17:45', genre: 'Explosive Rap/Punk' },
    { name: 'Mike Sheridan (DJ set)', stage: 'Skovbrynet', day: 'Thursday', startTime: '18:00', genre: 'Electronic DJ Set' },
    { name: 'APHACA', stage: 'Astra', day: 'Thursday', startTime: '19:00', genre: 'Youthful Indie Pop' },
    { name: 'Sudan Archives', stage: 'Luna', day: 'Thursday', startTime: '19:00', genre: 'Experimental R&B' },
    { name: 'Orkestr Partisanski', stage: 'SideShow', day: 'Thursday', startTime: '19:00', genre: 'Soviet Balkan Rock' },
    { name: 'Domino', stage: 'Skovbrynet', day: 'Thursday', startTime: '19:30', genre: 'Electronic Music' },
    { name: 'The Sideshow Cabaret: Part One', stage: 'SideShow', day: 'Thursday', startTime: '20:00', genre: 'Cabaret Performance' },
    { name: 'Primal Scream', stage: 'Nova', day: 'Thursday', startTime: '20:30', genre: 'Alternative Rock Icons' },
    { name: 'The Sideshow Cabaret: Part Two', stage: 'SideShow', day: 'Thursday', startTime: '21:00', genre: 'Cabaret Performance' },
    { name: 'Baxter Dury', stage: 'Luna', day: 'Thursday', startTime: '21:30', genre: 'Sophisticated Art Rock' },
    { name: 'Empire Of The Sun', stage: 'Astra', day: 'Thursday', startTime: '22:00', genre: 'Visual Synth-Pop' },
    { name: 'Big Band of Boom', stage: 'SideShow', day: 'Thursday', startTime: '22:00', genre: 'Heavy Big Band Horns' },
    { name: 'Culture Works (DJ set)', stage: 'Skovbrynet', day: 'Thursday', startTime: '22:00', genre: 'Curated DJ Set' },
    { name: 'Lottery Winners', stage: 'Luna', day: 'Thursday', startTime: '23:15', genre: 'Indie Pop Anthems' },
    { name: 'Peggy Gou', stage: 'Nova', day: 'Thursday', startTime: '23:45', genre: 'Melodic House/Techno' },

    // FRIDAY
    { name: 'Rigmor', stage: 'Nova', day: 'Friday', startTime: '13:00', genre: 'Edgy Indie Rock' },
    { name: 'URO', stage: 'Astra', day: 'Friday', startTime: '14:00', genre: 'Brutally Honest Pop' },
    { name: 'Ashes of Billy', stage: 'Luna', day: 'Friday', startTime: '14:00', genre: 'Explosive Grunge Rock' },
    { name: 'Junglelyd', stage: 'SideShow', day: 'Friday', startTime: '14:15', genre: 'Tropical Analog Groove' },
    { name: 'Patina', stage: 'Nova', day: 'Friday', startTime: '15:15', genre: 'Soul-inspired Pop' },
    { name: 'Glitter Wrestling', stage: 'SideShow', day: 'Friday', startTime: '15:30', genre: 'Theatrical Performance' },
    { name: 'Electric Dreams', stage: 'Skovbrynet', day: 'Friday', startTime: '15:30', genre: 'Electronic Beats' },
    { name: 'Kings of Convenience', stage: 'Astra', day: 'Friday', startTime: '16:30', genre: 'Intimate Indie Folk' },
    { name: 'Carl Knast', stage: 'Luna', day: 'Friday', startTime: '16:30', genre: 'Playful Electronic Pop' },
    { name: 'Heavy Beat Brass Band', stage: 'SideShow', day: 'Friday', startTime: '16:30', genre: 'New Orleans Brass Energy' },
    { name: 'The Sideshow Spectacular', stage: 'SideShow', day: 'Friday', startTime: '17:30', genre: 'Variety Show' },
    { name: 'Blaue Blume', stage: 'Nova', day: 'Friday', startTime: '17:45', genre: 'Dreamy Synth-Pop' },
    { name: 'IDLES', stage: 'Astra', day: 'Friday', startTime: '19:00', genre: 'High-Intensity Punk' },
    { name: 'Søn', stage: 'Luna', day: 'Friday', startTime: '19:00', genre: 'Alternative Danish Pop' },
    { name: 'Big Band of Boom', stage: 'SideShow', day: 'Friday', startTime: '19:00', genre: '12-piece Cinematic Beast' },
    { name: 'Zanjani', stage: 'Skovbrynet', day: 'Friday', startTime: '19:30', genre: 'Electronic Music' },
    { name: 'The Sideshow Cabaret: Part One', stage: 'SideShow', day: 'Friday', startTime: '20:00', genre: 'Cabaret Performance' },
    { name: 'Skepta', stage: 'Nova', day: 'Friday', startTime: '20:30', genre: 'Hard Grime Beats' },
    { name: 'The Sideshow Cabaret: Part Two', stage: 'SideShow', day: 'Friday', startTime: '21:00', genre: 'Cabaret Performance' },
    { name: 'Goose', stage: 'Luna', day: 'Friday', startTime: '21:30', genre: 'Sophisticated Jam Rock' },
    { name: 'Thomas Helmig', stage: 'Astra', day: 'Friday', startTime: '22:00', genre: 'Danish Pop Legend' },
    { name: 'Bjonko', stage: 'SideShow', day: 'Friday', startTime: '22:00', genre: 'Balkan Beats Fusion' },
    { name: 'Kasper Nørlund & Rune Wehner (Spleen United – DJ set)', stage: 'Skovbrynet', day: 'Friday', startTime: '22:00', genre: 'Dark Electronic DJ Set' },
    { name: 'wicky', stage: 'Luna', day: 'Friday', startTime: '23:15', genre: 'Emo Rap / Honest Unrest' },
    { name: 'Tinlicker', stage: 'Nova', day: 'Friday', startTime: '23:45', genre: 'Deep House / Electronic' },
    { name: 'La Dolce Vita Disco Club', stage: 'Skovbrynet', day: 'Friday', startTime: '23:59', genre: 'Late Night Disco' },

    // SATURDAY
    { name: 'Østen', stage: 'Nova', day: 'Saturday', startTime: '13:00', genre: 'Fragile/Powerful Pop' },
    { name: 'Alex Vargas', stage: 'Astra', day: 'Saturday', startTime: '14:00', genre: 'Soulful Vocal Pop' },
    { name: 'Svaneborg Kardyb', stage: 'Luna', day: 'Saturday', startTime: '14:00', genre: 'Electronic Ambient Jazz' },
    { name: 'Pater', stage: 'SideShow', day: 'Saturday', startTime: '14:15', genre: 'Intense Aarhus Indie' },
    { name: 'Jonah Blacksmith', stage: 'Nova', day: 'Saturday', startTime: '15:15', genre: 'North Sea Folk Rock' },
    { name: 'Glitter Wrestling', stage: 'SideShow', day: 'Saturday', startTime: '15:30', genre: 'Theatrical Performance' },
    { name: 'Oidsel', stage: 'Skovbrynet', day: 'Saturday', startTime: '15:30', genre: 'Electronic Melodies' },
    { name: 'Viagra Boys', stage: 'Astra', day: 'Saturday', startTime: '16:30', genre: 'Chaotic Humor Punk' },
    { name: 'Skullcrusher', stage: 'Luna', day: 'Saturday', startTime: '16:30', genre: 'Dreamy Indie Folk' },
    { name: 'Diddy Swegg', stage: 'SideShow', day: 'Saturday', startTime: '16:30', genre: 'Intergalactic Disco Funk' },
    { name: 'The Sideshow Spectacular', stage: 'SideShow', day: 'Saturday', startTime: '17:30', genre: 'Variety Show' },
    { name: 'SOFIA ISELLA', stage: 'Nova', day: 'Saturday', startTime: '17:45', genre: 'Experimental Art Pop' },
    { name: 'Tobias Rahim', stage: 'Astra', day: 'Saturday', startTime: '19:00', genre: 'Modern Pop Anthems' },
    { name: 'Red Leather', stage: 'Luna', day: 'Saturday', startTime: '19:00', genre: 'Raw Intense Rock' },
    { name: 'Smashing Boneheads', stage: 'SideShow', day: 'Saturday', startTime: '19:00', genre: 'Voodoo Swing Band' },
    { name: 'True Nord: René Thalund & Kristian Riis (Nephew)', stage: 'Skovbrynet', day: 'Saturday', startTime: '19:30', genre: 'Danish Electronic Legacy' },
    { name: 'The Sideshow Cabaret: Part One', stage: 'SideShow', day: 'Saturday', startTime: '20:00', genre: 'Cabaret Performance' },
    { name: 'Father John Misty', stage: 'Nova', day: 'Saturday', startTime: '20:30', genre: 'Poetic Indie/Alternative' },
    { name: 'The Sideshow Cabaret: Part Two', stage: 'SideShow', day: 'Saturday', startTime: '21:00', genre: 'Cabaret Performance' },
    { name: 'Florence Road', stage: 'Luna', day: 'Saturday', startTime: '21:30', genre: 'Contemporary Indie' },
    { name: 'Lulu Rouge (DJ set)', stage: 'Skovbrynet', day: 'Saturday', startTime: '21:30', genre: 'Deep Dub Electronic' },
    { name: 'Jack White', stage: 'Astra', day: 'Saturday', startTime: '22:00', genre: 'Legendary Blues Rock' },
    { name: 'Orkestr Partisanski', stage: 'SideShow', day: 'Saturday', startTime: '22:00', genre: 'Explosive Party Energy' },
    { name: 'Ebbb', stage: 'Luna', day: 'Saturday', startTime: '23:15', genre: 'Emergent Discovery' },
    { name: 'Michael Bang Bang', stage: 'Skovbrynet', day: 'Saturday', startTime: '23:30', genre: 'Late Night House' },
    { name: 'Charlotte de Witte', stage: 'Nova', day: 'Saturday', startTime: '23:45', genre: 'Global Techno Elite' },
];

export const days = ['Thursday', 'Friday', 'Saturday'];
export const stages = ['Astra', 'Nova', 'Luna', 'SideShow'];

export function artistKey(artist: Artist): string {
	return `${artist.name}__${artist.day}__${artist.startTime}`;
}

export function groupByDay<T extends { day: string }>(
	items: T[],
	selectedDay: string = 'All days'
): { day: string; items: T[] }[] {
	const dayOrder = selectedDay === 'All days' ? days : [selectedDay];
	return dayOrder
		.map((day) => ({ day, items: items.filter((item) => item.day === day) }))
		.filter((group) => group.items.length > 0);
}
