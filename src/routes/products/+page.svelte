<script lang="ts">
    let {data}= $props();
</script>

<h1>📦 Products</h1>
<button><a href="/products/create">Create Product</a></button>
{#if data.products.length === 0}
  <p>No products available.</p>
{:else}
  <table border="1" cellpadding="8">
    <thead>
      <tr>
        <th>Name</th>
        <th>SKU</th>
        <th>Description</th>
        <th>Quantity</th>
        <th>Detail</th>
      </tr>
    </thead>
    <tbody>
      {#each data.products as product}
        <tr>
            <td>{product.name}</td>
            <td>{product.sku}</td>
            <td>{product.description}</td>
            <td>{product.quantity}</td>
            <td><a href="/products/{product.id}">Detail</a></td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}