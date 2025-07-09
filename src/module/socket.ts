import type { ActorPF2e } from "foundry-pf2e";
import { id } from "moduleJSON";

export let socket: SocketlibSocket | undefined;

Hooks.once("socketlib.ready", () => {
	// eslint-disable-next-line no-console
	console.log("Foundry Summons | Registered Socket");
	socket = socketlib.registerModule(id);
	socket!.register("summon", handleEvent);
});

interface argument {
	uuid: string;
	crosshair: TemplateData;
	updateData?: object;
}

async function handleEvent({ uuid, crosshair, updateData }: argument) {
	if (game.user !== game.users.activeGM) return;

	const actor: ActorPF2e | null = await fromUuid(uuid);

	if (!actor) throw ui.notifications.error("Could not find to be summoned actor!");
	// @ts-expect-error Lack of tcal types
	if (!game.tcal) throw ui.notifications.error("You do not have the Transient Compendium Actor Library installed!");

	// @ts-expect-error Lack of tcal types
	const summonedActor = await game.tcal.importTransientActor(actor.uuid, {}, updateData) as ActorPF2e;

	const offset = (canvas.scene?.grid.size ?? 200) / 2 * actor.prototypeToken.height;
	const tokenData = await summonedActor.getTokenDocument({ x: Math.ceil(crosshair.x - offset), y: Math.ceil(crosshair.y - offset) });

	const [created] = await canvas.scene!.createEmbeddedDocuments("Token", [tokenData.toObject()]);
	return created;
}
