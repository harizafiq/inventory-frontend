<script lang="ts">
    let { data } = $props();
</script>

<h1>Dashboard</h1>

<p>Welcome, <strong>{data.user.username}</strong>!</p>
<p>Your role: {data.user.role}</p>

<a href="/products">📦 View Products</a>