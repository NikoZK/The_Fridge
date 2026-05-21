<script>
    import { onMount } from "svelte"
    import { fetchGet, fetchPost, fetchPatch, fetchDelete } from '../util/fetchUtil.js'

    let items = []
    let name = ""
    let quantity = 1
    let lastRestocked = ""
    let inNeed = false

    async function getItems() {
        const res = await fetchGet(`/fridge/items`)
        items = (res && res.data) ? res.data : []
    }
    onMount(getItems)

    async function addItem() {
        const res = await fetchPost(`/fridge/items`, {
                name,
                quantity,
                lastRestocked,
                inNeed: inNeed ? 1 : 0
            })
        if (res) await getItems()
    }

    async function updateItem(id, updates) {
        const res = await fetchPatch(`/fridge/items/${id}`, updates)
        if (res) await getItems()
    }

    async function deleteItem(id) {
        const res = await fetchDelete(`/fridge/items/${id}`)
        if (res) await getItems()
    }

</script>

<main id="center"> 
    <h1>Fridge dashboard</h1>

    <section>
        <h2>Add item</h2>
        <input class="bg_box" bind:value={name} placeholder="Name" />
        <input class="bg_box" type="number" bind:value={quantity} min="1" />
        <input class="bg_box" type="date" bind:value={lastRestocked} />
        <label><input type="checkbox" bind:checked={inNeed} /> In need</label>
        <button onclick={addItem}>Add</button>
    </section>

    <ul>
        {#each items as item (item.id)}
            <li>
                <strong>{item.name}</strong> - quantity: {item.quantity} - last restocked: {item.last_restocked}{#if item.in_need} <em>(Need)</em>{/if}
                <button class="btn" onclick={() => updateItem(item.id, { quantity: item.quantity + 1, lastRestocked: item.lastRestocked || new Date().toISOString().split('T')[0], inNeed: item.inNeed })}>+</button>
                <button class="btn-delete" onclick={() => deleteItem(item.id)}>Delete</button>
            </li>
        {/each}
    </ul>
</main>
