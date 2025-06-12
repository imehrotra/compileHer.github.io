/**
 * Utility functions for DOM manipulation and filtering
 */

/**
 * Add CSS class to an element
 * @param {HTMLElement} element - The DOM element
 * @param {string} name - The class name(s) to add
 */
function w3AddClass(element, name) {
  if (!element || typeof name !== 'string') return;
  
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}

/**
 * Remove CSS class from an element
 * @param {HTMLElement} element - The DOM element
 * @param {string} name - The class name(s) to remove
 */
function w3RemoveClass(element, name) {
  if (!element || typeof name !== 'string') return;
  
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1); 
    }
  }
  element.className = arr1.join(" ");
}

/**
 * Filter elements by class name
 * @param {string} filterClass - The class to filter by ("all" for all elements)
 * @param {string} elementClass - The class name of elements to filter
 */
function filterSelection(filterClass, elementClass) {
  if (typeof filterClass !== 'string' || typeof elementClass !== 'string') return;
  
  var x, i;
  x = document.getElementsByClassName(elementClass);
  if (filterClass == "all") filterClass = "";
  
  // Add the "show" class to filtered elements, remove from others
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(filterClass) > -1) {
      w3AddClass(x[i], "show");
    }
  }
}

/**
 * Validate if a string contains valid CSS class names
 * @param {string} className - The class name string to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidClassName(className) {
  if (typeof className !== 'string' || className.trim() === '') return false;
  
  // Split by spaces and validate each class name individually
  const classNames = className.trim().split(/\s+/);
  
  for (let i = 0; i < classNames.length; i++) {
    const cls = classNames[i];
    // Each class name should start with letter, underscore, or hyphen
    // and contain only letters, numbers, hyphens, and underscores
    if (!/^[a-zA-Z_-][a-zA-Z0-9_-]*$/.test(cls)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Get all classes from an element as an array
 * @param {HTMLElement} element - The DOM element
 * @returns {Array} - Array of class names
 */
function getElementClasses(element) {
  if (!element || typeof element.className !== 'string') return [];
  return element.className.split(" ").filter(cls => cls.length > 0);
}

// Export functions for testing (if module system is available)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    w3AddClass,
    w3RemoveClass,
    filterSelection,
    isValidClassName,
    getElementClasses
  };
}