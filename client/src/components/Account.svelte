<script>
  import { fetchDelete } from '../util/fetchUtil.js'
  import toastr from 'toastr'
  import 'toastr/build/toastr.min.css'
  import { userStore } from './stores/userStore.js'

  async function deleteAccount() {
    const response = await fetchDelete('/auth/me')
    if (response) {
      toastr.success('Account deleted!')
      setTimeout(() => {
        location.replace('/signup')
      }, 2000)
    } else {
      toastr.error('Could not delete account')
    }
  }
</script>

<svelte:head>
  <title>The Fridge | Account</title>
</svelte:head>

<main id="center">
  <p class="text-7xl">Account information</p>

  <div>
    <p class="text-4xl">Email: {$userStore.email}</p>
    <p class="text-4xl">Username: {$userStore.username}</p>

    <br /><br /><br />

    <div class="p-3 border-5 border-red-600">
      <button class="btn-delete m-2" on:click={deleteAccount}>Delete my account</button>
      <p>THIS ACTION CANNOT BE UNDONE</p>
    </div>
  </div>
</main>
