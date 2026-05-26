<script>
  import { onMount } from 'svelte'
  import { fetchGet, fetchPost, fetchPatch, fetchDelete } from '../util/fetchUtil.js'
  import toastr from 'toastr'

  let items = []
  let name = ''
  let quantity = ''
  let lastRestocked = ''
  let inNeed = false

  async function getItems() {
    const res = await fetchGet(`/fridge/items`)
    items = res && res.data ? res.data : []
  }
  onMount(getItems)

  async function addItem() {
    const res = await fetchPost(`/fridge/items`, {
      name,
      quantity,
      lastRestocked,
      inNeed: inNeed ? 1 : 0
    })

    if (res) {
      await getItems()
      toastr.success(`Added ${res.data.name}`)

      name = ''
      quantity = ''
      lastRestocked = ''
      inNeed = false
    } else {
      toastr.error('Failed to add the item')
    }
  }

  async function updateItem(id, updates) {
    const res = await fetchPatch(`/fridge/items/${id}`, updates)
    if (res) await getItems()
  }

  async function deleteItem(id) {
    const res = await fetchDelete(`/fridge/items/${id}`)
    if (res) {
      await getItems()
      toastr.success('Item successfully deleted')
    }
  }
</script>
<svelte:head>
   <title>The Fridge | Dashboard</title>
</svelte:head>

<main class="w-3/6">
  <h1>Fridge dashboard</h1>

  <section class="pb-7">
    <input class="bg_box" bind:value={name} placeholder="Name" />
    <input class="bg_box" type="number" bind:value={quantity} placeholder="Amount" min="0" />
    <input class="bg_box" type="date" bind:value={lastRestocked} />
    <label><input id="input-default" type="checkbox" bind:checked={inNeed} /> In need</label>
    <button
      class="btn"
      class:btn-unavailable={!name || quantity === null || quantity < 0 || !lastRestocked}
      disabled={!name || quantity === null || quantity < 0 || !lastRestocked}
      onclick={addItem}>Add</button
    >
  </section>

  <table class="w-full table-fixed text-2xl">
    <tbody>
      <tr>
        <th class="w-1/4">Name</th>
        <th>Quantity</th>
        <th>Last restocked</th>
        <th class="w-30"></th>
        <th></th>
        <th class="w-6"></th>
        <th></th>
      </tr>

      {#each items as item (item.id)}
        <tr class="border-4 border-blue-950">
          <td class="truncate">{item.name}</td>
          <td>{item.quantity}</td>
          <td>{item.last_restocked}</td>
          <td
            >{#if item.in_need}
              <p class="text-red-500">In need!</p>
            {/if}</td
          >
          <td>
            <input
              type="checkbox"
              checked={item.in_need}
              onclick={() => updateItem(item.id, { inNeed: item.in_need ? 0 : 1 })}
            />
          </td>
          <td class="flex items-center gap-2 justify-center">
            <button
              class="btn"
              onclick={() =>
                updateItem(item.id, {
                  quantity: item.quantity + 1,
                  lastRestocked: item.lastRestocked || new Date().toISOString().split('T')[0],
                  inNeed: 0
                })}>+</button
            >
            <button
              class="btn"
              disabled={item.quantity === 0}
              class:btn-unavailable={item.quantity === 0}
              onclick={() => updateItem(item.id, { quantity: item.quantity - 1 })}>−</button
            >
          </td>

          <td>
            <button class="btn-delete" onclick={() => deleteItem(item.id)}>Delete</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</main>
