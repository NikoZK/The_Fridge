<script>
    import { onMount }from 'svelte'
    import { navigate } from 'svelte-routing'

    let isAllowed = false

    onMount(async () => { 
        const response = await fetch('http://localhost:8080/auth/me', {
        credentials: 'include'
    })
        if (response.ok) {
            isAllowed = true
        } else {
            navigate('/login', { replace: true })
        }
    })
</script>

{#if isAllowed}
<slot />
{/if}