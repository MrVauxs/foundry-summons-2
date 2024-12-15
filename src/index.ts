import { BasicApp } from './view/SummonMenu';
import './app.postcss';

const foundrySummons = {
	open: () => new BasicApp().render(true, { focus: true }),
};

Hooks.on('ready', () => {
	window.foundrySummons = foundrySummons;
});

declare global {
	interface Window { foundrySummons: typeof foundrySummons }
}
