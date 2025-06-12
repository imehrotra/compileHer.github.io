/**
 * @jest-environment jsdom
 */

// Import the events filter utility functions
const {
  advancedFilterSelection,
  getCheckedValues,
  validateFilterParameters,
  countVisibleElements,
  resetFilters
} = require('../js/events-filter-utils.js');

describe('Events Filter Utility Functions', () => {
  beforeEach(() => {
    // Clean up DOM before each test
    document.body.innerHTML = '';
  });

  describe('advancedFilterSelection', () => {
    beforeEach(() => {
      // Create test event cards
      document.body.innerHTML = `
        <div class="event-card workshop tech show">Workshop 1</div>
        <div class="event-card hackathon tech show">Hackathon 1</div>
        <div class="event-card workshop design show">Workshop 2</div>
        <div class="event-card conference tech design show">Conference 1</div>
        <div class="event-card meetup networking">Meetup 1</div>
      `;
    });

    test('should show all elements when button filter is "all" and no dropdown filters', () => {
      advancedFilterSelection('all', []);
      const cards = document.getElementsByClassName('event-card');
      
      for (let i = 0; i < cards.length; i++) {
        expect(cards[i].classList.contains('show')).toBe(true);
      }
    });

    test('should filter by button filter only when no dropdown filters', () => {
      advancedFilterSelection('tech', []);
      const cards = document.getElementsByClassName('event-card');
      
      // Tech cards should be visible
      expect(cards[0].classList.contains('show')).toBe(true); // workshop tech
      expect(cards[1].classList.contains('show')).toBe(true); // hackathon tech
      expect(cards[3].classList.contains('show')).toBe(true); // conference tech design
      
      // Non-tech cards should be hidden
      expect(cards[2].classList.contains('show')).toBe(false); // workshop design
      expect(cards[4].classList.contains('show')).toBe(false); // meetup networking
    });

    test('should filter by dropdown filters with "all" button filter', () => {
      advancedFilterSelection('all', ['workshop']);
      const cards = document.getElementsByClassName('event-card');
      
      // Workshop cards should be visible
      expect(cards[0].classList.contains('show')).toBe(true); // workshop tech
      expect(cards[2].classList.contains('show')).toBe(true); // workshop design
      
      // Non-workshop cards should be hidden
      expect(cards[1].classList.contains('show')).toBe(false); // hackathon tech
      expect(cards[3].classList.contains('show')).toBe(false); // conference tech design
      expect(cards[4].classList.contains('show')).toBe(false); // meetup networking
    });

    test('should filter by both button and dropdown filters', () => {
      advancedFilterSelection('tech', ['workshop']);
      const cards = document.getElementsByClassName('event-card');
      
      // Only tech workshop should be visible
      expect(cards[0].classList.contains('show')).toBe(true); // workshop tech
      
      // All others should be hidden
      expect(cards[1].classList.contains('show')).toBe(false); // hackathon tech (no workshop)
      expect(cards[2].classList.contains('show')).toBe(false); // workshop design (no tech)
      expect(cards[3].classList.contains('show')).toBe(false); // conference tech design (no workshop)
      expect(cards[4].classList.contains('show')).toBe(false); // meetup networking
    });

    test('should handle multiple dropdown filters', () => {
      advancedFilterSelection('all', ['workshop', 'hackathon']);
      const cards = document.getElementsByClassName('event-card');
      
      // Workshop and hackathon cards should be visible
      expect(cards[0].classList.contains('show')).toBe(true); // workshop tech
      expect(cards[1].classList.contains('show')).toBe(true); // hackathon tech
      expect(cards[2].classList.contains('show')).toBe(true); // workshop design
      
      // Others should be hidden
      expect(cards[3].classList.contains('show')).toBe(false); // conference
      expect(cards[4].classList.contains('show')).toBe(false); // meetup
    });

    test('should handle non-existent filters gracefully', () => {
      advancedFilterSelection('non-existent', ['also-non-existent']);
      const cards = document.getElementsByClassName('event-card');
      
      // No cards should be visible
      for (let i = 0; i < cards.length; i++) {
        expect(cards[i].classList.contains('show')).toBe(false);
      }
    });

    test('should handle invalid parameters gracefully', () => {
      expect(() => advancedFilterSelection(null, [])).not.toThrow();
      expect(() => advancedFilterSelection('tech', null)).not.toThrow();
      expect(() => advancedFilterSelection(123, [])).not.toThrow();
    });

    test('should work with custom element class', () => {
      document.body.innerHTML = `
        <div class="custom-card tech show">Custom 1</div>
        <div class="custom-card design show">Custom 2</div>
      `;
      
      advancedFilterSelection('tech', [], 'custom-card');
      const cards = document.getElementsByClassName('custom-card');
      
      expect(cards[0].classList.contains('show')).toBe(true);
      expect(cards[1].classList.contains('show')).toBe(false);
    });
  });

  describe('getCheckedValues', () => {
    test('should return values from checked checkboxes', () => {
      document.body.innerHTML = `
        <input type="checkbox" value="tech" checked>
        <input type="checkbox" value="design" checked>
        <input type="checkbox" value="business">
      `;
      
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      const checkedValues = getCheckedValues(checkboxes);
      
      expect(checkedValues).toEqual(['tech', 'design']);
    });

    test('should return empty array when no checkboxes are checked', () => {
      document.body.innerHTML = `
        <input type="checkbox" value="tech">
        <input type="checkbox" value="design">
      `;
      
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      const checkedValues = getCheckedValues(checkboxes);
      
      expect(checkedValues).toEqual([]);
    });

    test('should handle empty NodeList', () => {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      const checkedValues = getCheckedValues(checkboxes);
      
      expect(checkedValues).toEqual([]);
    });

    test('should handle null input', () => {
      const checkedValues = getCheckedValues(null);
      expect(checkedValues).toEqual([]);
    });

    test('should ignore checkboxes without values', () => {
      document.body.innerHTML = `
        <input type="checkbox" value="tech" checked>
        <input type="checkbox" checked>
        <input type="checkbox" value="" checked>
      `;
      
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      const checkedValues = getCheckedValues(checkboxes);
      
      expect(checkedValues).toEqual(['tech']);
    });

    test('should work with array input', () => {
      document.body.innerHTML = `
        <input type="checkbox" value="tech" checked>
        <input type="checkbox" value="design" checked>
      `;
      
      const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
      const checkedValues = getCheckedValues(checkboxes);
      
      expect(checkedValues).toEqual(['tech', 'design']);
    });
  });

  describe('validateFilterParameters', () => {
    test('should validate correct parameters', () => {
      const result = validateFilterParameters('tech', ['workshop', 'hackathon']);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('should reject non-string button filter', () => {
      const result = validateFilterParameters(123, ['workshop']);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Button filter must be a string');
    });

    test('should reject non-array dropdown filters', () => {
      const result = validateFilterParameters('tech', 'not-an-array');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Dropdown filters must be an array');
    });

    test('should reject non-string values in dropdown filters', () => {
      const result = validateFilterParameters('tech', ['workshop', 123, 'hackathon']);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('All dropdown filter values must be strings');
    });

    test('should handle multiple validation errors', () => {
      const result = validateFilterParameters(null, 'not-an-array');
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });

    test('should validate empty dropdown filters array', () => {
      const result = validateFilterParameters('tech', []);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });

  describe('countVisibleElements', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="event-card show">Event 1</div>
        <div class="event-card">Event 2</div>
        <div class="event-card show">Event 3</div>
        <div class="event-card show">Event 4</div>
      `;
    });

    test('should count visible elements correctly', () => {
      const count = countVisibleElements();
      expect(count).toBe(3);
    });

    test('should work with custom element class', () => {
      document.body.innerHTML = `
        <div class="custom-card show">Custom 1</div>
        <div class="custom-card">Custom 2</div>
        <div class="custom-card show">Custom 3</div>
      `;
      
      const count = countVisibleElements('custom-card');
      expect(count).toBe(2);
    });

    test('should return 0 when no elements exist', () => {
      document.body.innerHTML = '';
      const count = countVisibleElements();
      expect(count).toBe(0);
    });

    test('should return 0 when no elements are visible', () => {
      document.body.innerHTML = `
        <div class="event-card">Event 1</div>
        <div class="event-card">Event 2</div>
      `;
      
      const count = countVisibleElements();
      expect(count).toBe(0);
    });
  });

  describe('resetFilters', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="event-card show">Event 1</div>
        <div class="event-card">Event 2</div>
        <div class="event-card show">Event 3</div>
      `;
    });

    test('should make all elements visible', () => {
      resetFilters();
      const cards = document.getElementsByClassName('event-card');
      
      for (let i = 0; i < cards.length; i++) {
        expect(cards[i].classList.contains('show')).toBe(true);
      }
    });

    test('should work with custom element class', () => {
      document.body.innerHTML = `
        <div class="custom-card">Custom 1</div>
        <div class="custom-card">Custom 2</div>
      `;
      
      resetFilters('custom-card');
      const cards = document.getElementsByClassName('custom-card');
      
      for (let i = 0; i < cards.length; i++) {
        expect(cards[i].classList.contains('show')).toBe(true);
      }
    });

    test('should handle empty element list gracefully', () => {
      document.body.innerHTML = '';
      expect(() => resetFilters()).not.toThrow();
    });
  });

  describe('Integration tests', () => {
    test('should handle complex filtering scenario', () => {
      document.body.innerHTML = `
        <div class="event-card workshop tech beginner show">Tech Workshop for Beginners</div>
        <div class="event-card hackathon tech advanced show">Advanced Tech Hackathon</div>
        <div class="event-card workshop design beginner show">Design Workshop for Beginners</div>
        <div class="event-card conference tech design intermediate show">Tech-Design Conference</div>
        <div class="event-card meetup networking beginner show">Networking Meetup</div>
      `;

      // First, filter by tech and workshop
      advancedFilterSelection('tech', ['workshop']);
      expect(countVisibleElements()).toBe(1); // Only tech workshop

      // Reset and filter by beginner level with workshop type
      resetFilters();
      advancedFilterSelection('beginner', ['workshop']);
      expect(countVisibleElements()).toBe(2); // Tech and design workshops for beginners

      // Reset and show all
      resetFilters();
      advancedFilterSelection('all', []);
      expect(countVisibleElements()).toBe(5); // All events
    });

    test('should work with checkbox simulation', () => {
      document.body.innerHTML = `
        <div class="event-card workshop tech">Workshop</div>
        <div class="event-card hackathon tech">Hackathon</div>
        <div class="event-card conference design">Conference</div>
        
        <input type="checkbox" class="eventCheck" value="workshop" checked>
        <input type="checkbox" class="eventCheck" value="hackathon">
        <input type="checkbox" class="eventCheck" value="conference" checked>
      `;

      const checkboxes = document.querySelectorAll('.eventCheck');
      const checkedValues = getCheckedValues(checkboxes);
      
      expect(checkedValues).toEqual(['workshop', 'conference']);
      
      // Apply filters based on checked values
      advancedFilterSelection('all', checkedValues);
      
      const cards = document.getElementsByClassName('event-card');
      expect(cards[0].classList.contains('show')).toBe(true); // workshop
      expect(cards[1].classList.contains('show')).toBe(false); // hackathon
      expect(cards[2].classList.contains('show')).toBe(true); // conference
    });
  });
});