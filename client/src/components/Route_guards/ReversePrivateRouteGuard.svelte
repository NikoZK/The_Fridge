<script>
  import { onMount } from 'svelte'
  import { navigate } from 'svelte-routing'

  let isAllowed = false

  onMount(async () => {
    const response = await fetch('http://localhost:8080/auth/me', {
      credentials: 'include'
    })
    if (response.ok) {
      navigate('/home', { replace: true })
    } else {
      isAllowed = true
    }
  })
</script>

{#if isAllowed}
  <slot />
{/if}
