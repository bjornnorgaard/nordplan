import { days, groupByDay } from './artists';

export type ProgramEvent = {
	name: string;
	stage: string;
	day: string;
	startTime: string;
	endTime: string;
	genre: string;
};

export function programKey(event: ProgramEvent): string {
	return `${event.name}__${event.day}__${event.startTime}`;
}

export const nordiskDansProgram: ProgramEvent[] = [
	{
		name: 'Nordisk Dans Pop-up',
		stage: 'SideShow',
		day: 'Thursday',
		startTime: '17:30',
		endTime: '18:00',
		genre: 'Nordisk Dans'
	},
	{
		name: 'Nordisk Dans Workshop',
		stage: 'SideShow',
		day: 'Thursday',
		startTime: '18:00',
		endTime: '19:30',
		genre: 'Workshop'
	},
	{
		name: 'Nordisk Dans Workshop',
		stage: 'SideShow',
		day: 'Friday',
		startTime: '16:00',
		endTime: '17:30',
		genre: 'Workshop'
	},
	{
		name: 'Nordisk Dans Pop-up',
		stage: 'SideShow',
		day: 'Friday',
		startTime: '17:30',
		endTime: '18:00',
		genre: 'Nordisk Dans'
	},
	{
		name: 'Nordisk Dans Pop-up',
		stage: 'SideShow',
		day: 'Saturday',
		startTime: '17:30',
		endTime: '18:00',
		genre: 'Nordisk Dans'
	}
];

export { days, groupByDay };
