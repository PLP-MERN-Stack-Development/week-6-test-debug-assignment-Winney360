module.exports.validateBugData = (bugData) => {
  console.log('Validating bug data:', bugData); // Debugging log
  const errors = [];

  if (!bugData.title || bugData.title.trim() === '') {
    errors.push('Title is required');
  }

  if (!bugData.description || bugData.description.trim() === '') {
    errors.push('Description is required');
  }

  if (!['low', 'medium', 'high'].includes(bugData.priority)) {
    errors.push('Priority must be low, medium, or high');
  }

  return errors;
};