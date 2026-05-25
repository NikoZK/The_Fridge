<script>
    import { onDestroy, onMount } from "svelte"
    import io from "socket.io-client"
    import { userStore } from "./stores/userStore.js"

    let postText = ''
    let socket
    let currentUsername = ''
    let dinnerStore = []

    $: currentUsername = $userStore.username

    onMount(() => {
        socket = io("http://localhost:8080", { withCredentials: true })
        
        socket.on('post:all', (posts) => {
            dinnerStore = posts
        })
    })

    onDestroy(() => socket.disconnect())

    function sendPost() {
        socket.emit("post:create", { message: postText })
        postText = ''
    }
</script>

<div class="chat-page ">

<div class="chat-room border-2 ">
    {#each dinnerStore as post}
    <p class={post.username === currentUsername ? 'my-post' : 'other-post'}>{post.message} <br> -{post.username}</p>
    {/each}
</div>

<div class="chat-input">
    <input size="50" style="height: 50px" bind:value={postText} placeholder="What do you want to eat?" />
    <button class="btn" class:btn-unavailable={postText === ""} disabled={postText === ""} on:click={sendPost}>Post</button>
</div>

</div>