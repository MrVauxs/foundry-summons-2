import type { ActorPF2e, TokenDocumentPF2e } from "foundry-pf2e";

interface SummonParams {
	crosshairParameters?: Parameters<typeof Sequencer.Crosshair.show>[0];
	crosshairCallbacks?: Parameters<typeof Sequencer.Crosshair.show>[1];
	updateData?: object;
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
	if (!game.tcal) throw ui.notifications.error("You do not have the Transient Compendium Actor Library installed!");

	const crosshair = await Sequencer.Crosshair.show(
		{
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

	// @ts-expect-error Lack of tcal types
	const summonedActor = await game.tcal.importTransientActor(actor.uuid, {}, updateData) as ActorPF2e;

	const offset = (canvas.scene?.grid.size ?? 200) / 2 * actor.prototypeToken.height;
	const tokenData = await summonedActor.getTokenDocument({ x: Math.ceil(crosshair.x - offset), y: Math.ceil(crosshair.y - offset) });

	const [created] = await canvas.scene!.createEmbeddedDocuments("Token", [tokenData.toObject()]);
	return created;
}

export { pick };
