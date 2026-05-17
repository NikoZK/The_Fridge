<script>
//If a user is logged in, they should not access login or signup. There is probably a much easier way of ensuring that...
  import { onMount } from 'svelte'
  import { navigate } from 'svelte-routing'

  let isAllowed = false

  onMount(async () => {
    const response = await fetch('http://localhost:8080/auth/me', {
      credentials: 'include'
    })
    if (response.ok) {
      navigate('/profile', { replace: true })
    } else {
      isAllowed = true
    }
  })
</script>

{#if isAllowed}
  <slot />
{/if}