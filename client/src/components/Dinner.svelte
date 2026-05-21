<script>
    import { onDestroy, onMount } from "svelte"
    import io from "socket.io-client"
    import { dinnerStore } from "./stores/dinnerStore.js"

    let postText = ""
    let socket;

    onMount(() => {
        socket = io("http://localhost:8080", { withCredentials: true })
        socket.on("post:new", (post) => {
            dinnerStore.update((list) => [...list, post])
        })
    })

    onDestroy(() => socket.disconnect())

    function sendPost() {
        socket.emit("post:create", { message: postText })
    }
</script>

<div>
    <input bind:value={postText} placeholder="What do you want to eat?" />
    <button on:click={sendPost}>Post</button>
</div>

<div>
    {#each $dinnerStore as post}
    <p>{post.message} -- {post.username}</p>
    {/each}
</div>