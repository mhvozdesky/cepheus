function calculateNewAmount(row) {
    const priceInput = row.querySelector('.field-price input');
    const quantityInput = row.querySelector('.field-quantity input');
    return (parseFloat(priceInput.value) * parseFloat(quantityInput.value)).toFixed(2);
}

function changeAmount(element) {
    const row = element.parentNode.parentNode;
    const amountInput = row.querySelector('.field-amount input');
    const newAmount = calculateNewAmount(row);
    amountInput.value = newAmount;
}

window.addEventListener("load", function() {
(function($) {
	$('.field-quantity input, .field-price input').change(function(event) {
        changeAmount(event.target);
    });
})(django.jQuery);
})
