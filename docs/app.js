// docs/app.js
document.addEventListener('DOMContentLoaded', function() {
  const propertyTypeSelect = document.getElementById('propertyType');
  const apartmentFields = document.getElementById('apartment-fields');
  const houseFields = document.getElementById('house-fields');
  const form = document.getElementById('estimator-form');
  const resultDiv = document.getElementById('result');
  
  // Toggle display of fields based on property type
  propertyTypeSelect.addEventListener('change', function() {
    if (propertyTypeSelect.value === 'apartment') {
      apartmentFields.style.display = 'block';
      houseFields.style.display = 'none';
    } else {
      apartmentFields.style.display = 'none';
      houseFields.style.display = 'block';
    }
  });
  
  // Calculation functions
  function calculateApartmentBoxes(bedrooms) {
    // For a 1-bedroom apartment: 10 book, 10 medium, 5 large, 3 dish boxes, and 3 rolls of tape.
    // For additional bedrooms, we use a 1.5x scale factor per extra bedroom.
    const scale = bedrooms > 1 ? 1 + (bedrooms - 1) * 0.5 : 1;
    return {
      book: Math.round(10 * scale),
      medium: Math.round(10 * scale),
      large: Math.round(5 * scale),
      dish: Math.round(3 * scale),
      tape: Math.round(3 * scale)
    };
  }
  
  function calculateHouseBoxes(bedrooms, yearsLived, belongingsFactor) {
    // Base estimate: 1 bedroom = 30 boxes, plus 20 boxes for each additional bedroom.
    const baseBoxes = 30 + (bedrooms - 1) * 20;
    // If lived > 5 years, add 10% per extra year.
    let yearFactor = 1;
    if (yearsLived > 5) {
      yearFactor = 1 + 0.1 * (yearsLived - 5);
    }
    const totalBoxes = Math.round(baseBoxes * yearFactor * belongingsFactor);
    
    // Distribute boxes into types using approximate ratios (based on a 1-bedroom apartment's ratios)
    const ratioBook = 10 / 28;
    const ratioMedium = 10 / 28;
    const ratioLarge = 5 / 28;
    const ratioDish = 3 / 28;
    
    return {
      book: Math.round(totalBoxes * ratioBook),
      medium: Math.round(totalBoxes * ratioMedium),
      large: Math.round(totalBoxes * ratioLarge),
      dish: Math.round(totalBoxes * ratioDish),
      tape: Math.round(totalBoxes * (3 / 28)) // approximate tape quantity
    };
  }
  
  function calculateCosts(items) {
    // Prices for each item:
    const prices = {
      book: 2.50,
      medium: 3.50,
      large: 4.50,
      dish: 7.00,
      tape: 3.00,
      picture: 2.00,
      bubbleWrap: 2.00,
      mattressCover: 10.00
    };
    
    let cost = 0;
    cost += (items.book || 0) * prices.book;
    cost += (items.medium || 0) * prices.medium;
    cost += (items.large || 0) * prices.large;
    cost += (items.dish || 0) * prices.dish;
    cost += (items.tape || 0) * prices.tape;
    cost += (items.picture || 0) * prices.picture;
    cost += (items.bubbleWrap || 0) * prices.bubbleWrap;
    cost += (items.mattressCover || 0) * prices.mattressCover;
    
    return cost;
  }
  
  // Form submission event
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let items = {};
    const propertyType = document.getElementById('propertyType').value;
    
    if (propertyType === 'apartment') {
      const bedrooms = parseInt(document.getElementById('bedroomsApartment').value) || 1;
      items = calculateApartmentBoxes(bedrooms);
    } else if (propertyType === 'house') {
      const bedrooms = parseInt(document.getElementById('bedroomsHouse').value) || 1;
      const yearsLived = parseInt(document.getElementById('yearsLived').value) || 0;
      const belongingsValue = document.getElementById('belongings').value;
      let belongingsFactor = 1;
      if (belongingsValue === 'a_lot') {
        belongingsFactor = 1.25;
      } else if (belongingsValue === 'a_little') {
        belongingsFactor = 0.75;
      }
      items = calculateHouseBoxes(bedrooms, yearsLived, belongingsFactor);
    }
    
    // Add additional optional supplies from the form
    const extraPictureBoxes = parseInt(document.getElementById('extraPictureBoxes').value) || 0;
    const extraBubbleWrap = parseInt(document.getElementById('extraBubbleWrap').value) || 0;
    const extraMattressCovers = parseInt(document.getElementById('extraMattressCovers').value) || 0;
    items.picture = extraPictureBoxes;
    items.bubbleWrap = extraBubbleWrap;
    items.mattressCover = extraMattressCovers;
    
    const totalCost = calculateCosts(items);
    
    displayResult(items, totalCost);
  });
  
  // Display the results in the UI
  function displayResult(items, totalCost) {
    let html = '<h2>Estimation Result</h2>';
    html += '<ul>';
    for (const key in items) {
      html += `<li>${key}: ${items[key]}</li>`;
    }
    html += '</ul>';
    html += `<p><strong>Total Cost:</strong> $${totalCost.toFixed(2)}</p>`;
    resultDiv.innerHTML = html;
  }
});
