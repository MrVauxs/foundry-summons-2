import type { ApplicationClosingOptions, ApplicationConfiguration, ApplicationRenderContext, ApplicationRenderOptions } from "foundry-pf2e/foundry/client/applications/_module.mjs";
import type { Component } from "svelte";
import { flags } from "moduleJSON";

interface SvelteShadowApplicationRenderContext extends ApplicationRenderContext {
	/** State data tracked by the root component: objects herein must be plain object. */
	state: object;
	/** This application instance */
	foundryApp: SvelteApplication;
}

function SvelteShadowApplicationMixin<
	TBase extends AbstractConstructorOf<foundry.applications.api.ApplicationV2> & {
		DEFAULT_OPTIONS: DeepPartial<ApplicationConfiguration>;
	},
>(Base: TBase) {
	abstract class SvelteApplication extends Base {
		abstract elementId: string;

		static override DEFAULT_OPTIONS: DeepPartial<ApplicationConfiguration> = {
			classes: [flags.css.id],
		};

		protected abstract root: Component<any>;

		/** State data tracked by the root component */
		protected $state: object = $state({});

		/** Props exposed to the shadow DOM element */
		protected exposedProps: Record<string, any> = {};

		/** The mounted root component, saved to be unmounted on application close */
		#mount: HTMLElement | null = null;

		protected override async _renderHTML(
			context: SvelteShadowApplicationRenderContext,
		): Promise<SvelteShadowApplicationRenderContext> {
			return context;
		}

		protected override _replaceHTML(
			result: SvelteShadowApplicationRenderContext,
			content: HTMLElement,
			options: ApplicationRenderOptions,
		): void {
			Object.assign(this.$state, result.state);

			if (options.isFirstRender) {
				// Define custom element if not already defined
				if (!customElements.get(this.elementId)) {
					customElements.define(this.elementId, this.root.element!);
				}

				// Create the custom element container
				content.innerHTML = `<${this.elementId}></${this.elementId}>`;

				// Store reference to the custom element
				this.#mount = content.querySelector(this.elementId);

				// Set initial props on the custom element
				if (this.#mount) {
					this.updateElementProps();
				}
			} else if (this.#mount) {
				// Update props on re-render
				this.updateElementProps();
			}
		}

		protected override _onClose(options: ApplicationClosingOptions): void {
			// Clear reference to mounted element
			this.#mount = null;

			super._onClose(options);
		}

		/** Update props on the custom element */
		private updateElementProps(): void {
			if (!this.#mount) return;

			// Set props as properties on the custom element
			Object.assign(this.#mount, {
				...this.exposedProps,
				state: this.$state,
				foundryApp: this,
			});
		}

		/** Update exposed props and sync to custom element */
		protected updateExposedProps(newProps: Record<string, any>): void {
			Object.assign(this.exposedProps, newProps);
			this.updateElementProps();
		}
	}

	return SvelteApplication;
}

type SvelteApplication = InstanceType<ReturnType<typeof SvelteShadowApplicationMixin>>;

export { SvelteShadowApplicationMixin, type SvelteShadowApplicationRenderContext };
