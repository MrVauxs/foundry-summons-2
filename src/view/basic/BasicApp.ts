import {
   SvelteApplication,
   type SvelteApp }     from '#runtime/svelte/application';

import BasicAppShell    from './BasicAppShell.svelte';

// Make sure to check out the `BasicApp` namespace below on defining custom options and interface for the `#external`
// context.

class BasicApp extends SvelteApplication<BasicApp.Options>
{
   constructor(options?: Partial<BasicApp.Options>)
   {
      super(options);
   }

   static get defaultOptions(): BasicApp.Options
   {
      return foundry.utils.mergeObject<SvelteApp.Options, Partial<BasicApp.Options>>(super.defaultOptions, {
         extra: true,   // Typed extra option from `BasicApp.Options` below.
         id: 'template-svelte-ts',
         resizable: true,
         minimizable: true,
         width: '25%',  // Just showing off you can use browser window percentages too!
         top: '10%',

         title: 'TemplateTS.title',

         svelte: {
            class: BasicAppShell,
            target: document.body,
         }
      });
   }
}

declare namespace BasicApp {
   /** Extends the SvelteApp `#external` types specifying a concrete application */
   export type External = SvelteApp.Context.External<BasicApp>;

   /** Extended options that you can define. */
   export interface Options extends SvelteApp.Options {
      /** An example of defining additional options */
      extra?: boolean;
   }
}

export { BasicApp }