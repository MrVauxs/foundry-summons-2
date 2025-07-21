import type { ActorPF2e } from "foundry-pf2e";
import { id } from "moduleJSON";
import { settings } from "./settings.svelte";

export let socket: SocketlibSocket | undefined;

Hooks.once("socketlib.ready", () => {
	// eslint-disable-next-line no-console
	console.log("Foundry Summons | Registered Socket");
	socket = socketlib.registerModule(id);
	socket!.register("summon", handleEvent);
});

interface argument {
	uuid: string;
	template: MeasuredTemplateDocument<Scene>["_source"];
	updateData?: object;
	userId: string;
}

async function handleEvent({ uuid, template, updateData, userId }: argument) {
	if (game.user !== game.users.activeGM) return;

	const actor: ActorPF2e | null = await fromUuid(uuid);

	if (!actor) throw ui.notifications.error("Could not find to be summoned actor!");
	// @ts-expect-error Lack of tcal types
	if (actor.compendium && !game.tcal) throw ui.notifications.error("You do not have the Transient Compendium Actor Library installed!");

	const user = game.users.get(userId);
	if (!user) throw ui.notifications.error("An unknown user tried to send a summoning request!");

	canvas.controls.drawPing(
		template,
		{
			style: CONFIG.Canvas.pings.types.PULSE,
			size: canvas.grid.size * actor.prototypeToken.height,
			duration: 10 * 1000,
		},
	);

	if (user.role < settings.permission) {
		const result = await foundry.applications.api.DialogV2.confirm({
			window: { title: "Confirm Summon" },
			content: `
				<p>${user.name} is requesting to summon ${actor.name} at the highlighted coordinates.</p>
				<p>You can move the generated template if you wish to change the spawn location.</p>
			`,
		});

		if (!result) throw ui.notifications.info("Denied summon request!");
	}

	let summonedActor: ActorPF2e;
	// @ts-expect-error Typing error, no idea why, ask laughingman
	if (actor.compendium) {
		// @ts-expect-error Lack of tcal types
		summonedActor = await game.tcal.importTransientActor(actor.uuid, { preferExisting: false }, updateData) as ActorPF2e;
	} else {
		summonedActor = actor;
	}

	const fullTemplate = canvas.scene!.templates.get(template._id!);
	const offset = (canvas.scene?.grid.size ?? 200) / 2 * summonedActor.prototypeToken.height;
	const tokenData = await summonedActor.getTokenDocument({
		x: Math.ceil((fullTemplate?.x || template.x) - offset),
		y: Math.ceil((fullTemplate?.y || template.y) - offset),
	});

	const [created] = await canvas.scene!.createEmbeddedDocuments("Token", [tokenData.toObject()]);
	canvas.scene!.templates.get(template._id!)?.delete();
	return created;
}
