import type { ApplicationClosingOptions, ApplicationConfiguration, ApplicationRenderContext, ApplicationRenderOptions } from "foundry-pf2e/foundry/client/applications/_module.mjs";
import type { Component } from "svelte";
import { flags } from "moduleJSON";
import { mount, unmount } from "svelte";

interface SvelteApplicationRenderContext extends ApplicationRenderContext {
	/** State data tracked by the root component: objects herein must be plain object. */
	data: object;
	/** This application instance */
	foundryApp: SvelteApplication;
}

function SvelteApplicationMixin<
	TBase extends AbstractConstructorOf<foundry.applications.api.ApplicationV2> & {
		DEFAULT_OPTIONS: DeepPartial<ApplicationConfiguration>;
	},
>(Base: TBase) {
	abstract class SvelteApplication extends Base {
		static override DEFAULT_OPTIONS: DeepPartial<ApplicationConfiguration> = {
			classes: [flags.css.id],
		};

		protected abstract root: Component<any>;

		/** State data tracked by the root component */
		protected $state: object = $state({});

		/** The mounted root component, saved to be unmounted on application close */
		#mount: object = {};

		protected override async _renderHTML(
			context: SvelteApplicationRenderContext,
		): Promise<SvelteApplicationRenderContext> {
			return context;
		}

		protected override _replaceHTML(
			result: SvelteApplicationRenderContext,
			content: HTMLElement,
			options: ApplicationRenderOptions,
		): void {
			Object.assign(this.$state, result.data);
			if (options.isFirstRender) {
				this.#mount = mount(
					this.root,
					{
						target: content,
						props: {
							...result,
							state: this.$state,
						},
					},
				);
			}
		}

		protected override _onClose(options: ApplicationClosingOptions): void {
			super._onClose(options);
			unmount(this.#mount);
		}
	}

	return SvelteApplication;
}

type SvelteApplication = InstanceType<ReturnType<typeof SvelteApplicationMixin>>;

export { SvelteApplicationMixin, type SvelteApplicationRenderContext };
