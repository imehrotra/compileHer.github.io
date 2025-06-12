/**
 * @jest-environment jsdom
 */

// Import the utility functions
const {
  w3AddClass,
  w3RemoveClass,
  filterSelection,
  isValidClassName,
  getElementClasses
} = require('../js/utils.js');

describe('DOM Utility Functions', () => {
  let mockElement;

  beforeEach(() => {
    // Create a mock DOM element for testing
    mockElement = document.createElement('div');
    document.body.appendChild(mockElement);
  });

  afterEach(() => {
    // Clean up after each test
    document.body.innerHTML = '';
  });

  describe('w3AddClass', () => {
    test('should add a single class to an element', () => {
      mockElement.className = 'existing-class';
      w3AddClass(mockElement, 'new-class');
      expect(mockElement.className).toBe('existing-class new-class');
    });

    test('should add multiple classes to an element', () => {
      mockElement.className = 'existing-class';
      w3AddClass(mockElement, 'class1 class2');
      expect(mockElement.className).toBe('existing-class class1 class2');
    });

    test('should not add duplicate classes', () => {
      mockElement.className = 'existing-class';
      w3AddClass(mockElement, 'existing-class');
      expect(mockElement.className).toBe('existing-class');
    });

    test('should handle empty initial className', () => {
      mockElement.className = '';
      w3AddClass(mockElement, 'new-class');
      expect(mockElement.className).toBe(' new-class');
    });

    test('should handle null element gracefully', () => {
      expect(() => w3AddClass(null, 'test-class')).not.toThrow();
    });

    test('should handle non-string class name gracefully', () => {
      mockElement.className = 'existing-class';
      expect(() => w3AddClass(mockElement, null)).not.toThrow();
      expect(() => w3AddClass(mockElement, 123)).not.toThrow();
      expect(mockElement.className).toBe('existing-class');
    });
  });

  describe('w3RemoveClass', () => {
    test('should remove a single class from an element', () => {
      mockElement.className = 'class1 class2 class3';
      w3RemoveClass(mockElement, 'class2');
      expect(mockElement.className).toBe('class1 class3');
    });

    test('should remove multiple classes from an element', () => {
      mockElement.className = 'class1 class2 class3 class4';
      w3RemoveClass(mockElement, 'class2 class4');
      expect(mockElement.className).toBe('class1 class3');
    });

    test('should remove all instances of a class', () => {
      mockElement.className = 'class1 class2 class2 class3';
      w3RemoveClass(mockElement, 'class2');
      expect(mockElement.className).toBe('class1 class3');
    });

    test('should handle removing non-existent class gracefully', () => {
      mockElement.className = 'class1 class2';
      w3RemoveClass(mockElement, 'non-existent');
      expect(mockElement.className).toBe('class1 class2');
    });

    test('should handle empty className', () => {
      mockElement.className = '';
      w3RemoveClass(mockElement, 'any-class');
      expect(mockElement.className).toBe('');
    });

    test('should handle null element gracefully', () => {
      expect(() => w3RemoveClass(null, 'test-class')).not.toThrow();
    });

    test('should handle non-string class name gracefully', () => {
      mockElement.className = 'existing-class';
      expect(() => w3RemoveClass(mockElement, null)).not.toThrow();
      expect(() => w3RemoveClass(mockElement, 123)).not.toThrow();
      expect(mockElement.className).toBe('existing-class');
    });
  });

  describe('filterSelection', () => {
    beforeEach(() => {
      // Create multiple elements for filtering tests
      document.body.innerHTML = `
        <div class="blog-card category1 show">Card 1</div>
        <div class="blog-card category2 show">Card 2</div>
        <div class="blog-card category1 category2 show">Card 3</div>
        <div class="blog-card category3">Card 4</div>
      `;
    });

    test('should show all elements when filter is "all"', () => {
      filterSelection('all', 'blog-card');
      const cards = document.getElementsByClassName('blog-card');
      
      for (let i = 0; i < cards.length; i++) {
        expect(cards[i].className).toContain('show');
      }
    });

    test('should filter elements by specific category', () => {
      filterSelection('category1', 'blog-card');
      const cards = document.getElementsByClassName('blog-card');
      
      // Cards with category1 should have 'show' class
      expect(cards[0].className).toContain('show'); // category1
      expect(cards[2].className).toContain('show'); // category1 category2
      
      // Cards without category1 should not have 'show' class
      expect(cards[1].className).not.toContain('show'); // category2
      expect(cards[3].className).not.toContain('show'); // category3
    });

    test('should handle non-existent filter category', () => {
      filterSelection('non-existent', 'blog-card');
      const cards = document.getElementsByClassName('blog-card');
      
      // No cards should have 'show' class
      for (let i = 0; i < cards.length; i++) {
        expect(cards[i].className).not.toContain('show');
      }
    });

    test('should handle non-existent element class', () => {
      expect(() => filterSelection('category1', 'non-existent-class')).not.toThrow();
    });

    test('should handle invalid parameters gracefully', () => {
      expect(() => filterSelection(null, 'blog-card')).not.toThrow();
      expect(() => filterSelection('category1', null)).not.toThrow();
      expect(() => filterSelection(123, 'blog-card')).not.toThrow();
    });
  });

  describe('isValidClassName', () => {
    test('should validate correct single class names', () => {
      expect(isValidClassName('valid-class')).toBe(true);
      expect(isValidClassName('validClass')).toBe(true);
      expect(isValidClassName('valid_class')).toBe(true);
      expect(isValidClassName('_validClass')).toBe(true);
      expect(isValidClassName('-validClass')).toBe(true);
    });

    test('should validate correct multiple class names', () => {
      expect(isValidClassName('class1 class2')).toBe(true);
      expect(isValidClassName('valid-class another-class')).toBe(true);
    });

    test('should reject invalid class names', () => {
      expect(isValidClassName('123invalid')).toBe(false); // starts with number
      expect(isValidClassName('class@invalid')).toBe(false); // invalid character
      expect(isValidClassName('')).toBe(false); // empty string
      expect(isValidClassName('  ')).toBe(false); // only spaces
      expect(isValidClassName('class#invalid')).toBe(false); // invalid character
    });

    test('should handle non-string input', () => {
      expect(isValidClassName(null)).toBe(false);
      expect(isValidClassName(undefined)).toBe(false);
      expect(isValidClassName(123)).toBe(false);
      expect(isValidClassName({})).toBe(false);
    });

    test('should handle edge cases', () => {
      expect(isValidClassName(' valid-class ')).toBe(true); // trimmed
      expect(isValidClassName('a')).toBe(true); // single character
    });
  });

  describe('getElementClasses', () => {
    test('should return array of classes from element', () => {
      mockElement.className = 'class1 class2 class3';
      const classes = getElementClasses(mockElement);
      expect(classes).toEqual(['class1', 'class2', 'class3']);
    });

    test('should handle single class', () => {
      mockElement.className = 'single-class';
      const classes = getElementClasses(mockElement);
      expect(classes).toEqual(['single-class']);
    });

    test('should handle empty className', () => {
      mockElement.className = '';
      const classes = getElementClasses(mockElement);
      expect(classes).toEqual([]);
    });

    test('should handle extra spaces in className', () => {
      mockElement.className = '  class1   class2  class3  ';
      const classes = getElementClasses(mockElement);
      expect(classes).toEqual(['class1', 'class2', 'class3']);
    });

    test('should handle null element', () => {
      const classes = getElementClasses(null);
      expect(classes).toEqual([]);
    });

    test('should handle element without className property', () => {
      const invalidElement = {};
      const classes = getElementClasses(invalidElement);
      expect(classes).toEqual([]);
    });
  });

  describe('Integration tests', () => {
    test('should add and remove classes correctly in sequence', () => {
      mockElement.className = 'initial-class';
      
      w3AddClass(mockElement, 'added-class');
      expect(mockElement.className).toBe('initial-class added-class');
      
      w3AddClass(mockElement, 'another-class');
      expect(mockElement.className).toBe('initial-class added-class another-class');
      
      w3RemoveClass(mockElement, 'added-class');
      expect(mockElement.className).toBe('initial-class another-class');
      
      w3RemoveClass(mockElement, 'initial-class another-class');
      expect(mockElement.className).toBe('');
    });

    test('should work with real DOM filtering scenario', () => {
      // Create a realistic blog filtering scenario
      document.body.innerHTML = `
        <div class="blog-card tech show">Tech Article 1</div>
        <div class="blog-card design show">Design Article 1</div>
        <div class="blog-card tech design show">Mixed Article</div>
        <div class="blog-card events">Event Article</div>
      `;

      // Filter by tech category
      filterSelection('tech', 'blog-card');
      
      const techCards = document.querySelectorAll('.blog-card.tech');
      const designOnlyCards = document.querySelectorAll('.blog-card.design:not(.tech)');
      const eventCards = document.querySelectorAll('.blog-card.events');
      
      // Tech cards should be visible
      techCards.forEach(card => {
        expect(card.className).toContain('show');
      });
      
      // Design-only cards should be hidden
      designOnlyCards.forEach(card => {
        expect(card.className).not.toContain('show');
      });
      
      // Event cards should be hidden
      eventCards.forEach(card => {
        expect(card.className).not.toContain('show');
      });
    });
  });
});