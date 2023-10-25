<script lang="ts">
  import Doodler from "./Doodler.svelte";
  import type { PageData } from "./$types";

  export let data : PageData;
  const doodles = data.doodles;
  let is_doodling = false;
</script>


<div class="flex flex-col w-full h-full items-center text-white min-w-screen min-h-screen p-8 bg-violet-950">
  <main class="flex flex-col gap-8 w-full h-full max-w-md items-center">
    <input type="checkbox" bind:checked={is_doodling} />
    {#if is_doodling} 
      <Doodler />
    {/if}
    {#each doodles as doodle}
      <Doodler {doodle} />
    {/each}
  </main>
</div>
