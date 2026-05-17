<script>
    import { onMount } from "svelte";

    let items = [];
    let name = "";
    let quantity = 1;
    let lastRestocked = "";
    let inNeed = false;

    async function getItems() {
        const res = await fetch(`http://localhost:8080/fridge/items`, {
            credentials: "include",
        });
        items = (await res.json()).data || [];
    }
    onMount(getItems);

    async function addItem() {
        const res = await fetch(`http://localhost:8080/fridge/items`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                quantity,
                lastRestocked,
                inNeed: inNeed ? 1 : 0,
            }),
        });
        if (res.ok) await getItems();
    }

    async function updateItem(id, updates) {
        const res = await fetch(`http://localhost:8080/fridge/items/${id}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
        if (res.ok) await getItems();
    }

    async function deleteItem(id) {
        const res = await fetch(`http://localhost:8080/fridge/items/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (res.ok) await getItems();
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
