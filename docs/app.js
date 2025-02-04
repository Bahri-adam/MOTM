// docs/app.js
document.addEventListener('DOMContentLoaded', function() {
  // Box information: cost and dimensions
  const boxInfo = {
    book: { name: "Book Box", cost: 2.50, dimensions: "12¾ x 12¾ x 16.5" },
    medium: { name: "Medium Box", cost: 3.50, dimensions: "18 x 18 x 16" },
    large: { name: "Large Box", cost: 4.50, dimensions: "18 x 18 x 24" },
    dish: { name: "Dish Pack Box", cost: 7.00, dimensions: "18 x 18 x 28" },
    tape: { name: "Roll of Tape", cost: 3.00, dimensions: "N/A" },
    picture: { name: "Picture Box", cost: 2.00, dimensions: "N/A" },
    bubbleWrap: { name: "Bubble Wrap (per foot)", cost: 2.00, dimensions: "N/A" },
    mattressCover: { name: "Mattress Cover", cost: 10.00, dimensions: "Fits standard mattresses" }
  };

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
  
  // Calculation for apartments:
  function calculateApartmentBoxes(bedrooms) {
    const scale = bedrooms > 1 ? 1 + (bedrooms - 1) * 0.5 : 1;
    return {
      book: Math.round(10 * scale),
      medium: Math.round(10 * scale),
      large: Math.round(5 * scale),
      dish: Math.round(3 * scale),
      tape: Math.round(3 * scale)
    };
  }
  
  // Calculation for houses:
  function calculateHouseBoxes(bedrooms, yearsLived, belongingsFactor) {
    const baseBoxes = 30 + (bedrooms - 1) * 20;
    let yearFactor = 1;
    if (yearsLived > 5) {
      yearFactor = 1 + 0.1 * (yearsLived - 5);
    }
    const totalBoxes = Math.round(baseBoxes * yearFactor * belongingsFactor);
    
    const ratioBook = 10 / 28;
    const ratioMedium = 10 / 28;
    const ratioLarge = 5 / 28;
    const ratioDish = 3 / 28;
    
    return {
      book: Math.round(totalBoxes * ratioBook),
      medium: Math.round(totalBoxes * ratioMedium),
      large: Math.round(totalBoxes * ratioLarge),
      dish: Math.round(totalBoxes * ratioDish),
      tape: Math.round(totalBoxes * (3 / 28))
    };
  }
  
  // Calculate total cost based on the quantities and boxInfo prices.
  function calculateCosts(items) {
    let cost = 0;
    for (const key in items) {
      if (boxInfo.hasOwnProperty(key)) {
        cost += (items[key] || 0) * boxInfo[key].cost;
      }
    }
    return cost;
  }
  
  // Form submission event: Gather inputs, perform calculations, and display results.
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let items = {};
    const propertyType = document.getElementById('propertyType').value;
    
    if (propertyType === 'apartment') {
      const bedrooms = parseInt(document.getElementById('bedroomsApartment').value) || 1;
      items = calculateApartmentBoxes(bedrooms);
      // Automatically include one mattress cover per bedroom.
      items.mattressCover = bedrooms;
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
      // Automatically include one mattress cover per bedroom.
      items.mattressCover = bedrooms;
    }
    
    // Optional supplies: extra Picture Boxes, Bubble Wrap, and extra Mattress Covers.
    const extraPictureBoxes = parseInt(document.getElementById('extraPictureBoxes').value) || 0;
    const extraBubbleWrap = parseInt(document.getElementById('extraBubbleWrap').value) || 0;
    const extraMattressCovers = parseInt(document.getElementById('extraMattressCovers').value) || 0;
    
    items.picture = extraPictureBoxes;
    items.bubbleWrap = extraBubbleWrap;
    // Add any extra mattress covers on top of the base required covers.
    items.mattressCover = (items.mattressCover || 0) + extraMattressCovers;
    
    const totalCost = calculateCosts(items);
    
    displayResult(items, totalCost);
  });
  
  // Display the results in a detailed Bootstrap-styled table.
  function displayResult(items, totalCost) {
    let html = '<h2 class="mb-3">Estimation Result</h2>';
    html += '<div class="table-responsive">';
    html += '<table class="table table-bordered table-striped">';
    html += '<thead class="table-primary"><tr><th>Item</th><th>Quantity</th><th>Cost per Unit</th><th>Total Cost</th><th>Dimensions</th></tr></thead>';
    html += '<tbody>';
    
    // Define the display order for items.
    const order = ['book', 'medium', 'large', 'dish', 'tape', 'picture', 'bubbleWrap', 'mattressCover'];
    
    order.forEach(key => {
      if (items[key] && items[key] > 0) {
        const quantity = items[key];
        const unitCost = boxInfo[key].cost;
        const itemTotalCost = quantity * unitCost;
        html += `<tr>
                   <td>${boxInfo[key].name}</td>
                   <td>${quantity}</td>
                   <td>$${unitCost.toFixed(2)}</td>
                   <td>$${itemTotalCost.toFixed(2)}</td>
                   <td>${boxInfo[key].dimensions}</td>
                 </tr>`;
      }
    });
    
    html += '</tbody></table></div>';
    html += `<p class="h5 mt-3"><strong>Total Estimated Cost:</strong> $${totalCost.toFixed(2)}</p>`;
    resultDiv.innerHTML = html;
  }
});
