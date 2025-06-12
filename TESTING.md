# Testing Documentation

This document describes the testing infrastructure and test coverage for the CompileHer website.

## Overview

The project now includes comprehensive unit tests for JavaScript functionality using Jest as the testing framework. The tests focus on utility functions that handle DOM manipulation, filtering, and form validation.

## Test Setup

### Dependencies
- **Jest**: JavaScript testing framework
- **jest-environment-jsdom**: Provides DOM environment for testing

### Installation
```bash
npm install
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

### Current Coverage
- **utils.js**: 100% statement, 96.87% branch, 100% function coverage
- **events-filter-utils.js**: 100% statement, 95.45% branch, 100% function coverage  
- **form-validation.js**: 100% statement, 96.42% branch, 100% function coverage

### Tested Modules

#### 1. DOM Utilities (`js/utils.js`)
- **w3AddClass**: Adds CSS classes to DOM elements
- **w3RemoveClass**: Removes CSS classes from DOM elements
- **filterSelection**: Filters elements by class name
- **isValidClassName**: Validates CSS class name format
- **getElementClasses**: Extracts class names from elements

#### 2. Events Filter Utilities (`js/events-filter-utils.js`)
- **advancedFilterSelection**: Advanced filtering with button and dropdown filters
- **getCheckedValues**: Extracts values from checked checkboxes
- **validateFilterParameters**: Validates filter input parameters
- **countVisibleElements**: Counts visible elements after filtering
- **resetFilters**: Resets all filters to show all elements

#### 3. Form Validation (`js/form-validation.js`)
- **isValidEmail**: Validates email address format
- **validateRequiredFields**: Checks for required form fields
- **isValidPhone**: Validates phone number format
- **sanitizeInput**: Sanitizes input to prevent XSS
- **validateContactForm**: Comprehensive form validation
- **formatFormData**: Formats and sanitizes form data

## Test Structure

### Test Files Location
```
tests/
├── utils.test.js                 # DOM utility function tests
├── events-filter-utils.test.js   # Events filtering tests
└── form-validation.test.js       # Form validation tests
```

### Test Categories

#### Unit Tests
- Individual function testing with various input scenarios
- Edge case handling (null, undefined, invalid types)
- Error condition testing

#### Integration Tests
- Multi-function workflows
- Real DOM manipulation scenarios
- Form validation and formatting pipelines

### Test Patterns

#### DOM Testing
- Creates mock DOM elements for testing
- Tests actual DOM manipulation
- Verifies class additions/removals
- Simulates filtering scenarios

#### Validation Testing
- Tests valid and invalid inputs
- Boundary condition testing
- Security validation (XSS prevention)
- Format validation (email, phone)

#### Error Handling
- Graceful handling of invalid inputs
- Type safety validation
- Null/undefined parameter handling

## Benefits Added

### 1. Code Quality Assurance
- Ensures functions work as expected
- Catches regressions during development
- Validates edge case handling

### 2. Documentation
- Tests serve as living documentation
- Examples of how functions should be used
- Clear specification of expected behavior

### 3. Refactoring Safety
- Safe to modify code with test coverage
- Immediate feedback on breaking changes
- Confidence in code changes

### 4. Security
- Validates input sanitization
- Tests XSS prevention measures
- Ensures form validation works correctly

## Future Improvements

### Potential Areas for Additional Testing
1. **End-to-End Tests**: Full user workflow testing
2. **Visual Regression Tests**: UI component testing
3. **Performance Tests**: Function performance benchmarks
4. **Accessibility Tests**: Screen reader and keyboard navigation
5. **Cross-browser Tests**: Browser compatibility testing

### Additional Modules to Test
1. **main.js**: Core website functionality
2. **blog-modal.js**: Modal dialog functionality
3. **availability-calendar.js**: Calendar widget functionality
4. **event-modal.js**: Event display modals

## Running Tests in CI/CD

The test suite is configured to run with:
```bash
npm test
```

This can be integrated into GitHub Actions or other CI/CD pipelines for automated testing on every commit.

## Contributing

When adding new JavaScript functionality:

1. Write tests for new functions
2. Ensure tests pass: `npm test`
3. Check coverage: `npm run test:coverage`
4. Aim for >90% coverage on new code
5. Include both positive and negative test cases
6. Test edge cases and error conditions

## Test Configuration

The Jest configuration is defined in `package.json`:

```json
{
  "jest": {
    "testEnvironment": "jsdom",
    "testMatch": [
      "**/tests/**/*.test.js",
      "**/tests/**/*.spec.js"
    ],
    "collectCoverageFrom": [
      "js/**/*.js",
      "!js/vendor/**",
      "!js/**/*.min.js"
    ]
  }
}
```

This configuration:
- Uses jsdom for DOM testing
- Looks for test files in the `tests/` directory
- Excludes vendor and minified files from coverage
- Provides detailed coverage reports