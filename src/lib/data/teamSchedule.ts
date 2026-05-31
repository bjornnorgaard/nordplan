export type TeamScheduleUrgency = 'normal' | 'urgent';

export type TeamScheduleEntry = {
	time: string;
	title: string;
	detail?: string;
	urgency?: TeamScheduleUrgency;
};

export type TeamScheduleDay = {
	id: string;
	label: string;
	items: TeamScheduleEntry[];
};

export const teamScheduleIntro =
	'Her er en ren, overskuelig og letlæselig tidsplan baseret på dine informationer. Det tætte program er delt op pr. dag, så det er nemt at overskue for hele holdet.';

export const teamScheduleDays: TeamScheduleDay[] = [
	{
		id: 'thursday',
		label: 'Torsdag',
		items: [
			{
				time: '17.30 – 18.00',
				title: 'Nordisk Dans Pop-up',
				detail: 'Sideshowområdet'
			},
			{
				time: '18.00 – ca. 19.30',
				title: 'Workshop',
				detail: 'Afholdes i forlængelse af pop-up. Vi går derhen i samlet flok!'
			},
			{
				time: 'Efter kl. 19.30',
				title: 'Oprydning og slæbning af udstyr',
				detail: 'Efter workshoppen'
			}
		]
	},
	{
		id: 'friday',
		label: 'Fredag',
		items: [
			{
				time: '16.00 – ca. 17.30',
				title: 'Workshop',
				detail: 'Præcist sted og sluttidspunkt er endnu ukendt'
			},
			{
				time: '17.30 – 18.00',
				title: 'Nordisk Dans Pop-up',
				detail: 'Sideshowområdet'
			},
			{
				time: '18.00',
				title: 'Hjælp musikerne ned af scenen og ryd op efter pop-up',
				urgency: 'urgent'
			}
		]
	},
	{
		id: 'weekend',
		label: 'Lørdag & øvrige festivaldage',
		items: [
			{
				time: '17.30 – 18.00',
				title: 'Nordisk Dans Pop-up',
				detail: 'Sideshowområdet'
			},
			{
				time: '18.00',
				title: 'Hjælp musikerne ned af scenen med det samme',
				urgency: 'urgent'
			}
		]
	}
];

export const teamScheduleDisclaimer =
	'Alle tidspunkter og steder er med forbehold for ændringer. Vi giver besked, så snart vi ved mere om de præcise lokationer for workshops.';

export const teamScheduleTasks = [
	{
		title: 'Hver dag kl. 18.00',
		detail: 'Vær klar til at hjælpe musikerne hurtigt ned fra scenen efter pop-up.'
	},
	{
		title: 'Før og efter workshops',
		detail: 'Klargøring og slæbning af udstyr (Torsdag aften og fredag eftermiddag).'
	}
];
