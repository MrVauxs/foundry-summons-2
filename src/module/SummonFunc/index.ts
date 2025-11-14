import type { ActorPF2e, TokenDocumentPF2e } from "foundry-pf2e";
import { socket } from "../socket";

interface SummonParams {
	crosshairParameters?: Parameters<typeof Sequencer.Crosshair.show>[0];
	crosshairCallbacks?: Parameters<typeof Sequencer.Crosshair.show>[1];
	updateData?: object;
	tokenData?: object;
	drawPing?: boolean;
}

type PredicateParams = { uuid: string } | { actor: ActorPF2e };

async function pick(params: SummonParams & PredicateParams): Promise<TokenDocumentPF2e> {
	const { crosshairCallbacks, crosshairParameters, updateData } = params;

	let actor: ActorPF2e | null = "actor" in params ? params.actor : null;
	if ("uuid" in params && !actor) {
		actor = await fromUuid(params.uuid);
	}

	if (!actor) throw ui.notifications.error("Could not find to be summoned actor!");
	// @ts-expect-error Lack of tcal types
	if (actor.inCompendium && !game.tcal) throw ui.notifications.error("You do not have the Transient Compendium Actor Library installed!");
	if (!actor.inCompendium && params.updateData) ui.notifications.warn("Warning! <code>updateData</code> will not affect non-compendium actors!");

	const crosshair = await Sequencer.Crosshair.show(
		{
			// @ts-expect-error Fucked up Sequencer types
			location: {
				obj: canvas.tokens.controlled[0],
				showRange: true,
			},
			// @ts-expect-error Fucked up Sequencer types
			texture: actor.prototypeToken.texture.src,
			distance: actor.prototypeToken.height * canvas.grid.distance / 2,
			textureAlpha: 1,
			borderColor: "#7b5d38",
			snap: {
				position: CONST.GRID_SNAPPING_MODES.CENTER,
				resolution: 1,
				size: CONST.GRID_SNAPPING_MODES.CENTER,
				direction: 0,
			},
			...crosshairParameters,
		},
		crosshairCallbacks,
	);

	if (!crosshair) throw console.error("Crosshair cancelled, exiting summoning.");

	const [template] = await canvas.scene!.createEmbeddedDocuments(
		"MeasuredTemplate",
		[{ ...crosshair, flags: { "pf2e-toolbelt": { betterTemplate: { skip: true } } } }],
	);

	return await socket!.executeForAllGMs(
		"summon",
		{
			uuid: actor.uuid,
			template: template.toJSON(),
			updateData: {
				ownership: { [game.userId]: 3 },
				...updateData,
			},
			tokenData: params.tokenData,
			drawPing: params.drawPing ?? true,
			userId: game.userId,
		},
	);
}

export { pick };
