<script lang="ts">
    let { data } = $props();
</script>

<h1>Dashboard</h1>

<p>Welcome, <strong>{data.user.username}</strong>!</p>
<p>Your role: {data.user.role}</p>
<a href="/logout">🚪 Logout</a>
<a href="/products">📦 View Products</a>

<h1>📊 Dashboard</h1>

<ul>
  <li><strong>Total Products:</strong> {data.summary.total_products}</li>
  <li><strong>Total Stock:</strong> {data.summary.total_stock}</li>
  <li><strong>Inbound Today:</strong> {data.summary.inbound_today}</li>
  <li><strong>Outbound Today:</strong> {data.summary.outbound_today}</li>
</ul>