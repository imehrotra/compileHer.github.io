/**
 * Utility functions for events filtering with dropdown support
 */

/**
 * Advanced filter selection that supports both button filters and dropdown filters
 * @param {string} buttonFilter - The button filter ("all" or specific category)
 * @param {Array} dropdownFilters - Array of dropdown filter values
 * @param {string} elementClass - The class name of elements to filter (default: "event-card")
 */
function advancedFilterSelection(buttonFilter, dropdownFilters = [], elementClass = "event-card") {
  if (typeof buttonFilter !== 'string') return;
  if (!Array.isArray(dropdownFilters)) dropdownFilters = [];
  
  var elements = document.getElementsByClassName(elementClass);
  var processedButtonFilter = buttonFilter;
  
  if (buttonFilter === "all" && dropdownFilters.length === 0) {
    processedButtonFilter = "";
  }
  
  // Handle case with no dropdown filters
  if (dropdownFilters.length === 0) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.remove("show");
      if (elements[i].className.indexOf(processedButtonFilter) > -1) {
        elements[i].classList.add("show");
      }
    }
  } else {
    // Handle case with dropdown filters
    if (buttonFilter === "all") processedButtonFilter = "";
    
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.remove("show");
      
      for (var j = 0; j < dropdownFilters.length; j++) {
        var hasButtonFilter = processedButtonFilter === "" || 
                             elements[i].className.indexOf(processedButtonFilter) > -1;
        var hasDropdownFilter = elements[i].className.indexOf(dropdownFilters[j]) > -1;
        
        if (hasButtonFilter && hasDropdownFilter) {
          elements[i].classList.add("show");
          break; // No need to check other dropdown filters for this element
        }
      }
    }
  }
}

/**
 * Extract checked values from checkbox elements
 * @param {NodeList|Array} checkboxElements - Array or NodeList of checkbox elements
 * @returns {Array} - Array of values from checked checkboxes
 */
function getCheckedValues(checkboxElements) {
  if (!checkboxElements) return [];
  
  var checkedValues = [];
  for (var i = 0; i < checkboxElements.length; i++) {
    if (checkboxElements[i] && checkboxElements[i].checked && checkboxElements[i].value && checkboxElements[i].value !== 'on') {
      checkedValues.push(checkboxElements[i].value);
    }
  }
  return checkedValues;
}

/**
 * Validate filter parameters
 * @param {string} buttonFilter - The button filter value
 * @param {Array} dropdownFilters - Array of dropdown filter values
 * @returns {Object} - Validation result with isValid boolean and errors array
 */
function validateFilterParameters(buttonFilter, dropdownFilters) {
  var errors = [];
  var isValid = true;
  
  if (typeof buttonFilter !== 'string') {
    errors.push('Button filter must be a string');
    isValid = false;
  }
  
  if (!Array.isArray(dropdownFilters)) {
    errors.push('Dropdown filters must be an array');
    isValid = false;
  } else {
    for (var i = 0; i < dropdownFilters.length; i++) {
      if (typeof dropdownFilters[i] !== 'string') {
        errors.push('All dropdown filter values must be strings');
        isValid = false;
        break;
      }
    }
  }
  
  return {
    isValid: isValid,
    errors: errors
  };
}

/**
 * Count visible elements after filtering
 * @param {string} elementClass - The class name of elements to count
 * @returns {number} - Number of visible elements
 */
function countVisibleElements(elementClass = "event-card") {
  var elements = document.getElementsByClassName(elementClass);
  var count = 0;
  
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].classList.contains("show")) {
      count++;
    }
  }
  
  return count;
}

/**
 * Reset all filters and show all elements
 * @param {string} elementClass - The class name of elements to reset
 */
function resetFilters(elementClass = "event-card") {
  var elements = document.getElementsByClassName(elementClass);
  
  for (var i = 0; i < elements.length; i++) {
    elements[i].classList.add("show");
  }
}

// Export functions for testing (if module system is available)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    advancedFilterSelection,
    getCheckedValues,
    validateFilterParameters,
    countVisibleElements,
    resetFilters
  };
}