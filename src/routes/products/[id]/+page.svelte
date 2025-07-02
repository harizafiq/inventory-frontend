<script lang="ts">
  import QRCode from 'qrcode';
  import JsBarcode from 'jsbarcode';

  let {data} = $props();
  
  //qr code
  let qrUrl = $state('');
  const product = data.product;
  // Encode product ID or SKU or URL
  const text = `Product SKU: ${product.sku}`;

  QRCode.toDataURL(text)
    .then(url => {
      qrUrl = url;
    })
    .catch(err => {
      console.error(err);
  });

  //barcode
  // let svg = $state(document.getElementById('barcode'));
  // // Generate barcode
  // if (svg && product.sku) {
  //   JsBarcode(svg, product.sku, {
  //     format: 'CODE128',
  //     lineColor: '#000',
  //     width: 2,
  //     height: 60,
  //     displayValue: true
  //   });
  // }
</script>
<a href="/products">Back</a>
<h1>{data.product.name}</h1>
<h1>{data.product.quantity}</h1>
<h2>🧾 Product QR Code</h2>

{#if qrUrl}
  <img src={qrUrl} alt="QR Code" />
  <p><small>Encodes: {text}</small></p>
{:else}
  <p>Loading QR code...</p>
{/if}

<!-- <h2>🏷️ Product Barcode</h2>
{#if product.sku}
  <svg id="barcode"></svg>
  <p><small>Barcode for SKU: {product.sku}</small></p>
{:else}
  <p>No SKU available for barcode.</p>
{/if} -->


<h3>🔁 Cycle Count</h3>

<form method="POST" action="?/cycle">
  <label for="counted_quantity">Counted Quantity</label>
  <input
    type="number"
    id="counted_quantity"
    name="counted_quantity"
    required
    placeholder="e.g. 58"
  />

  <label for="notes">Notes</label>
  <input type="text" id="notes" name="notes" placeholder="e.g. Monthly check" />

  <button type="submit">Update Stock</button>
</form>

<h2>📥 Inbound History</h2>
{#if data.inbound.length > 0}
  <table border="1" cellpadding="5">
    <thead>
      <tr>
        <th>Qty</th>
        <th>Notes</th>
        <th>By</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      {#each data.inbound as entry}
        <tr>
          <td>{entry.quantity}</td>
          <td>{entry.notes}</td>
          <td>{entry.created_by}</td>
          <td>{new Date(entry.created_at).toLocaleString()}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{:else}
  <p>No inbound records yet.</p>
{/if}

<h2>📤 Outbound History</h2>
{#if data.outbound.length > 0}
  <table border="1" cellpadding="5">
    <thead>
      <tr>
        <th>Qty</th>
        <th>Notes</th>
        <th>By</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      {#each data.outbound as entry}
        <tr>
          <td>{entry.quantity}</td>
          <td>{entry.notes}</td>
          <td>{entry.created_by}</td>
          <td>{new Date(entry.created_at).toLocaleString()}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{:else}
  <p>No outbound records yet.</p>
{/if}

<!-- Add inbound -->
<h3>Inbound</h3>
<form method="POST" action="?/inbound">
    <label for="quantity">Quantity</label>
    <input type="number" id="quantity" name="quantity" required placeholder="Qty" />
    <label for="notes">Notes</label>
    <input type="text" id="notes" name="notes" placeholder="Notes" />
    <button type="submit">Inbound</button>
</form>

<!-- Add outbound -->
<h3>Outbound</h3>
<form method="POST" action="?/outbound">
    <label for="quantity">Quantity</label>
    <input type="number" id="quantity" name="quantity" required placeholder="Qty" />
    <label for="notes">Notes</label>
    <input type="text" id="notes" name="notes" placeholder="Notes" />
    <button type="submit">Outbound</button>
</form>

<h2>🔁 Cycle Count History</h2>
{#if data.cycleCounts.length > 0}
  <table border="1" cellpadding="5">
    <thead>
      <tr>
        <th>Counted</th>
        <th>Old Qty</th>
        <th>Diff</th>
        <th>Notes</th>
        <th>By</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      {#each data.cycleCounts as count}
        <tr>
          <td>{count.counted_quantity}</td>
          <td>{count.previous_quantity}</td>
          <td>{count.difference}</td>
          <td>{count.notes}</td>
          <td>{count.created_by}</td>
          <td>{new Date(count.created_at).toLocaleString()}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{:else}
  <p>No cycle counts yet.</p>
{/if}