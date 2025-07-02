<script lang="ts">
  let {data} = $props();
</script>

<h1>📋 Audit Log</h1>

{#if data.logs.length > 0}
  <table border="1" cellpadding="5">
    <thead>
      <tr>
        <th>Type</th>
        <th>Product</th>
        <th>Qty</th>
        <th>User</th>
        <th>Notes</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      {#each data.logs as log}
        <tr>
          <td>{log.type}</td>
          <td>{log.product}</td>
          <td>{log.quantity}</td>
          <td>{log.user}</td>
          <td>{log.notes}</td>
          <td>{new Date(log.created_at).toLocaleString()}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{:else}
  <p>No activity yet.</p>
{/if}
