import moduleJSON from "moduleJSON" with { type: "json" };

Hooks.on("ready", () => {
	ui.notifications.info(`Running ${moduleJSON.id}!`);
});
