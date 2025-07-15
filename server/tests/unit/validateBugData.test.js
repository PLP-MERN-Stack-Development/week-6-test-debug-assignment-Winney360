const { validateBugData } = require('../../src/utils/validateBugData');

describe('validateBugData', () => {
  it('should return no errors for valid bug data', () => {
    const bugData = {
      title: 'Test Bug',
      description: 'This is a test bug',
      priority: 'medium',
    };
    const errors = validateBugData(bugData);
    expect(errors).toEqual([]);
  });

  it('should return error for missing title', () => {
    const bugData = {
      description: 'This is a test bug',
      priority: 'medium',
    };
    const errors = validateBugData(bugData);
    expect(errors).toContain('Title is required');
  });

  it('should return error for missing description', () => {
    const bugData = {
      title: 'Test Bug',
      priority: 'medium',
    };
    const errors = validateBugData(bugData);
    expect(errors).toContain('Description is required');
  });

  it('should return error for invalid priority', () => {
    const bugData = {
      title: 'Test Bug',
      description: 'This is a test bug',
      priority: 'invalid',
    };
    const errors = validateBugData(bugData);
    expect(errors).toContain('Priority must be low, medium, or high');
  });
});