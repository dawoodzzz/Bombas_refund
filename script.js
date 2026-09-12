const packSizeEl     = document.getElementById('packSize');
const refundQtyEl    = document.getElementById('refundQty');
const packPriceEl    = document.getElementById('packPrice');
const taxRateEl      = document.getElementById('taxRate');
const discountRateEl = document.getElementById('discountRate');

const errorBanner = document.getElementById('errorBanner');
const errorText   = document.getElementById('errorText');

const baseVal  = document.getElementById('baseVal');
const taxVal   = document.getElementById('taxVal');
const totalVal = document.getElementById('totalVal');

function showError(msg, focusEl) {
  errorText.textContent = msg;
  errorBanner.classList.add('visible');
  if (focusEl) focusEl.focus();
}

function hideError() {
  errorBanner.classList.remove('visible');
}

function fmt(n) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

function calculate() {
  hideError();

  const packSize = parseInt(packSizeEl.value, 10);
  if (!Number.isInteger(packSize) || packSize <= 0) {
    return showError('Pack size must be a positive whole number.', packSizeEl);
  }

  const refundQty = parseInt(refundQtyEl.value, 10);
  if (!Number.isInteger(refundQty) || refundQty < 1 || refundQty > packSize) {
    return showError(`Refund quantity must be between 1 and ${packSize}.`, refundQtyEl);
  }

  const packPrice = parseFloat(packPriceEl.value);
  if (isNaN(packPrice) || packPrice < 0) {
    return showError('Pack price must be a positive number.', packPriceEl);
  }

  const taxRate = parseFloat(taxRateEl.value);
  if (isNaN(taxRate) || taxRate < 0) {
    return showError('Tax rate must be 0 or greater.', taxRateEl);
  }

  const discountRate = parseFloat(discountRateEl.value);
  if (isNaN(discountRate) || discountRate < 0 || discountRate > 100) {
    return showError('Discount rate must be between 0 and 100.', discountRateEl);
  }

  const baseRefund  = (refundQty / packSize) * packPrice;
  const afterTax    = baseRefund * (1 + taxRate / 100);
  const totalRefund = Math.round(afterTax * (1 - discountRate / 100) * 1000) / 1000;

  baseVal.textContent  = fmt(baseRefund);
  taxVal.textContent   = fmt(afterTax);
  totalVal.textContent = fmt(totalRefund);
}

function clearAll() {
  [packSizeEl, refundQtyEl, packPriceEl, taxRateEl, discountRateEl].forEach(el => el.value = '');
  [baseVal, taxVal, totalVal].forEach(el => el.textContent = '—');
  hideError();
  packSizeEl.focus();
}

document.getElementById('calcBtn').addEventListener('click', calculate);
document.getElementById('clearBtn').addEventListener('click', clearAll);

document.querySelectorAll('input').forEach(el => {
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter') calculate();
  });
});

packSizeEl.focus();
