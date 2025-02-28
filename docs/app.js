// docs/app.js
document.addEventListener('DOMContentLoaded', function() {
  // Box information: cost and dimensions
  const boxInfo = {
    book: { 
      name: "Small Box", 
      cost: 2.50, 
      dimensions: "12¾ x 12¾ x 16.5",
      description: "Perfect for heavy items. Fits approximately 2 feet of books, 15-20 DVDs, or 4-6 canned good boxes. Ideal for: books, records, canned goods, tools, small appliances, heavy decorative items. Pro tip: Keep weight under 50 lbs for easy lifting."
    },
    medium: { 
      name: "Medium Box", 
      cost: 3.50, 
      dimensions: "18 x 18 x 16",
      description: "Most versatile box size. Fits contents of 2-3 kitchen drawers, 8-10 board games, or 15-20 articles of folded clothing. Perfect for: pots and pans, small kitchen appliances, toys, shoes, decorative items, electronics. Great for most household items."
    },
    large: { 
      name: "Large Box", 
      cost: 4.50, 
      dimensions: "18 x 18 x 24",
      description: "Ideal for light, bulky items. Can fit 2-3 large pillows, a full bedding set, or 3-4 large sweaters/jackets. Best for: bedding, pillows, comforters, blankets, towels, coats, lamp shades, and large plastic items. Remember: the bigger the box, the lighter the items should be."
    },
    dish: { 
      name: "Dish Pack Box", 
      cost: 7.00, 
      dimensions: "18 x 18 x 28",
      description: "Double-walled construction with dividers for maximum protection. Holds full service for 12, or approximately 12-15 glasses plus padding. Perfect for: china, glasses, crystal, ceramics, porcelain, and other fragile items. Includes dividers for extra protection."
    },
    wardrobe: {
      name: "Wardrobe Box",
      cost: 12.00,
      dimensions: "24 x 21 x 46",
      description: "Built-in metal hanging bar. Fits approximately 2-3 feet of hanging clothes (10-15 garments). Ideal for: suits, dresses, coats, and delicate clothing that shouldn't be folded. Keeps clothes wrinkle-free and ready to hang in your new closet."
    },
    tape: { 
      name: "Roll of Tape", 
      cost: 3.00, 
      dimensions: "N/A" 
    },
    packingPaper: { 
      name: "Packing Paper Bundle (25 lbs)", 
      cost: 35.00, 
      dimensions: "N/A",
      description: "One bundle contains 25 pounds of clean, ink-free paper. Perfect for wrapping dishes, glasses, and filling empty spaces in boxes. Each bundle can wrap approximately 500-750 dishes or 375-500 glasses."
    },
    picture: {
      name: "Picture Box",
      cost: 2.00,
      dimensions: "Varies",
      description: "Specially designed for framed artwork, mirrors, and other flat items. Multiple sections available for different sizes. Provides extra protection for your valuable wall hangings."
    },
    bubbleWrap: {
      name: "Bubble Wrap",
      cost: 2.00,
      dimensions: "Per foot",
      description: "High-quality bubble wrap for maximum protection. Perfect for wrapping fragile items, electronics, and valuable decorative pieces."
    },
    mattressCover: {
      name: "Mattress Cover",
      cost: 10.00,
      dimensions: "Fits standard mattresses",
      description: "Heavy-duty plastic cover that keeps your mattress clean and protected during the move. Available for all standard mattress sizes."
    }
  };

  const propertyTypeSelect = document.getElementById('propertyType');
  const apartmentFields = document.getElementById('apartment-fields');
  const houseFields = document.getElementById('house-fields');
  const form = document.getElementById('estimator-form');
  const resultDiv = document.getElementById('result');
  
  // Initialize the modal
  let boxInfoModal;
  
  // Wait for Bootstrap to be loaded
  document.addEventListener('DOMContentLoaded', function() {
    const modalElement = document.getElementById('boxInfoModal');
    if (modalElement) {
      boxInfoModal = new bootstrap.Modal(modalElement, {
        keyboard: true,
        backdrop: true
      });
      
      // Add event listener for modal close button
      modalElement.querySelector('.btn-close').addEventListener('click', function() {
        boxInfoModal.hide();
      });
      
      // Add event listener for clicking outside modal
      modalElement.addEventListener('click', function(e) {
        if (e.target === modalElement) {
          boxInfoModal.hide();
        }
      });
      
      // Add event listener for ESC key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalElement.classList.contains('show')) {
          boxInfoModal.hide();
        }
      });
    }
  });
  
  // Function to show box information in modal
  function showBoxInfo(boxType) {
    const box = boxInfo[boxType];
    if (box.description && boxInfoModal) {
      const modalTitle = document.getElementById('boxInfoModalLabel');
      const boxDescription = document.getElementById('boxDescription');
      
      modalTitle.textContent = box.name;
      boxDescription.innerHTML = `
        <p>${box.description}</p>
        <p><strong>Dimensions:</strong> ${box.dimensions}</p>
        <p><strong>Cost:</strong> $${box.cost.toFixed(2)}</p>
      `;
      
      boxInfoModal.show();
    }
  }
  
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
      wardrobe: Math.round(2 * scale),
      tape: Math.round(3 * scale)
    };
  }
  
  // Calculation for houses:
  function calculateHouseBoxes(bedrooms) {
    let items = {};
    
    switch(bedrooms) {
      case 2:
        items = {
          book: 15,
          medium: 15,
          large: 10,
          dish: 5,
          tape: 5,
          packingPaper: 2  // 2 bundles (50 pounds)
        };
        break;
      case 3:
        items = {
          book: 20,
          medium: 20,
          large: 15,
          dish: 10,
          tape: 10,
          packingPaper: 3  // 3 bundles (75 pounds)
        };
        break;
      case 4:
        items = {
          book: 25,
          medium: 25,
          large: 20,
          dish: 15,
          tape: 15,
          packingPaper: 4  // 4 bundles (100 pounds)
        };
        break;
      default:
        // For 1 bedroom or other sizes, scale based on bedroom count
        const baseCount = Math.max(1, bedrooms);
        items = {
          book: Math.round(10 * baseCount),
          medium: Math.round(10 * baseCount),
          large: Math.round(5 * baseCount),
          dish: Math.round(3 * baseCount),
          tape: Math.round(3 * baseCount),
          packingPaper: Math.round(baseCount)  // 1 bundle per bedroom
        };
    }
    
    return items;
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
    } else if (propertyType === 'house') {
      const bedrooms = parseInt(document.getElementById('bedroomsHouse').value) || 1;
      items = calculateHouseBoxes(bedrooms);
    }
    
    // Additional supplies
    const extraPictureBoxes = parseInt(document.getElementById('extraPictureBoxes').value) || 0;
    const extraBubbleWrap = parseInt(document.getElementById('extraBubbleWrap').value) || 0;
    const extraMattressCovers = parseInt(document.getElementById('extraMattressCovers').value) || 0;
    const extraPackingPaper = parseInt(document.getElementById('extraPackingPaper').value) || 0;
    
    // Only add additional supplies if they have values
    if (extraPictureBoxes > 0) items.picture = extraPictureBoxes;
    if (extraBubbleWrap > 0) items.bubbleWrap = extraBubbleWrap;
    if (extraMattressCovers > 0) items.mattressCover = extraMattressCovers;
    if (extraPackingPaper > 0) {
      items.packingPaper = (items.packingPaper || 0) + extraPackingPaper;
    }
    
    const totalCost = calculateCosts(items);
    displayResult(items, totalCost);
  });
  
  // Display the results in a detailed Bootstrap-styled table with editable quantities
  function displayResult(items, totalCost) {
    let html = '<h2 class="mb-3">Estimation Result</h2>';
    html += '<div class="table-responsive">';
    html += '<table class="table table-bordered table-striped">';
    html += '<thead class="table-primary"><tr><th>Item</th><th>Quantity</th><th>Cost per Unit</th><th>Total Cost</th><th>Dimensions</th></tr></thead>';
    html += '<tbody>';
    
    // Define the display order for items
    const order = ['book', 'medium', 'large', 'dish', 'wardrobe', 'packingPaper', 'picture', 'bubbleWrap', 'mattressCover', 'tape'];
    
    order.forEach(key => {
      // Only show items that have quantities or are part of the base calculation
      if (items[key]) {
        const quantity = items[key];
        const unitCost = boxInfo[key].cost;
        const itemTotalCost = quantity * unitCost;
        
        html += `<tr>
                   <td>
                     ${boxInfo[key].description ? 
                       `<a href="#" class="box-info-link" data-box-type="${key}" style="text-decoration: none; color: inherit;">
                          ${boxInfo[key].name}
                          <small><i class="bi bi-info-circle-fill ms-1" title="Click for details"></i></small>
                        </a>` : 
                       boxInfo[key].name}
                   </td>
                   <td>
                     <input type="number" 
                            class="form-control quantity-input" 
                            data-box-type="${key}" 
                            value="${quantity}" 
                            min="0" 
                            style="width: 80px">
                   </td>
                   <td>$${unitCost.toFixed(2)}</td>
                   <td class="item-total">$${itemTotalCost.toFixed(2)}</td>
                   <td>${boxInfo[key].dimensions}</td>
                 </tr>`;
      }
    });
    
    html += '</tbody></table></div>';
    html += `<p class="h5 mt-3"><strong>Total Estimated Cost:</strong> <span id="total-cost">$${totalCost.toFixed(2)}</span></p>`;
    resultDiv.innerHTML = html;

    // Add event listeners to quantity inputs
    document.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', function() {
        const boxType = this.dataset.boxType;
        const newQuantity = parseInt(this.value) || 0;
        items[boxType] = newQuantity;
        
        // Update item total
        const unitCost = boxInfo[boxType].cost;
        const newItemTotal = newQuantity * unitCost;
        this.closest('tr').querySelector('.item-total').textContent = `$${newItemTotal.toFixed(2)}`;
        
        // Update grand total
        const newTotalCost = calculateCosts(items);
        document.getElementById('total-cost').textContent = `$${newTotalCost.toFixed(2)}`;
      });
    });

    // Add event listeners to box info links
    document.querySelectorAll('.box-info-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        showBoxInfo(this.dataset.boxType);
      });
    });
  }
});
