<script>
  import toastr from "toastr"
  import "toastr/build/toastr.min.css"
  import { onMount } from "svelte"

    let items = []
    let name = ""
    let quantity = 1
    let lastRestocked = ""
    let inNeed = false

  async function getItems() {
    const res = await fetch(`http://localhost:8080/fridge/items`, {
      credentials: "include",
    });
    items = (await res.json()).data || [];
  }
  onMount(getItems);


</script>

<main id="center">
  <h1>Welcome</h1>

  <ul>
        {#each items as item (item.id)}
            <li>
                <strong>{item.name}</strong> - quantity: {item.quantity} - last restocked: {item.last_restocked} {#if item.in_need} <i class="text-red-500">Needed!</i>{/if}
            </li>
        {/each}
    </ul>

</main>
