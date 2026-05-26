<script>
  import { fetchGet } from '../util/fetchUtil.js'
  import 'toastr/build/toastr.min.css'
  import { onMount } from 'svelte'
  import { userStore } from './stores/userStore.js'

  let items = []

  async function getItems() {
    const res = await fetchGet(`/fridge/items`)
    items = res && res.data ? res.data : []
  }
  onMount(getItems)
</script>

<svelte:head>
  <title>The Fridge | Home</title>
</svelte:head>

<main id="center">
  <p class="text-8xl">Welcome {$userStore.username}!</p>

  <div class="flex gap-3 w-full text-4xl">
    <section class="flex-1">
      <p class="text-6xl pb-3">Fridge items</p>
      <ul>
        {#each items as item (item.id)}
          {#if item.quantity > 0}
            <li class="text-left border-2 p-1 border-blue-950">
              <div class="flex justify-between w-full">
                <span>{item.name}</span>
                <span>({item.quantity} left)</span>
              </div>
            </li>
          {/if}
        {/each}
      </ul>
    </section>

    <section class="flex-1">
      <p class="text-6xl pb-3 text-red-500">Needed items</p>
      <ul>
        {#each items as item (item.id)}
          {#if item.in_need === 1}
            <li class="border-2 p-1 border-red-700 text-right">
              <div class="flex justify-between w-full">
                <span>{item.name}</span>
                <span><strong class="text-red-500"> ({item.quantity} left)</strong></span>
              </div>
            </li>
          {/if}
        {/each}
      </ul>
    </section>
  </div>
</main>
