<script>
	import toastr from "toastr"
	import "toastr/build/toastr.min.css"
	import { navigate } from "svelte-routing"

	let email = ""
	let username = ""
	let password = ""

	async function signup(email, username, password) {
		const response = await fetch("http://localhost:8080/auth/signup", {
			method: "POST",
			headers: { "content-type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ email, username, password }),
		})

		const data = await response.json()
		if (!response.ok) throw new Error(data.error)
		return data
	}

	async function handleSignup() {
		try {
			const data = await signup(email, username, password)
			toastr.success(`Account created for ${data.user.username}!`)
			location.reload()
		} catch (error) {
			toastr.error(error.message)
		}
	}
</script>

<main id="center">
	<h1>Sign up</h1>

	<form on:submit|preventDefault={handleSignup}>
		<p>
			<label>
				Email
				<br />
				<input
					type="email"
					name="email"
					placeholder="email@example.com"
					bind:value={email}
				/>
			</label>
		</p>

		<p>
			<label>
				Username
				<br />
				<input
					type="text"
					name="username"
					placeholder="user123"
					bind:value={username}
				/>
			</label>
		</p>

		<p>
			<label>
				Password
				<br />
				<input
					type="password"
					name="password"
					placeholder="********"
					bind:value={password}
				/>
			</label>
		</p>

		<p>
			<br />
			<button type="submit" class="counter">Sign Up</button>
		</p>
	</form>
</main>
