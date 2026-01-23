// Toast notification helper functions
export const toastMessages = {
  // Validation errors
  validation: {
    requiredFields: "Please fill in all required fields",
    projectNotFound: "Project not found",
  },

  // Success messages
  success: {
    created: (item) => `${item} created successfully`,
    updated: (item) => `${item} updated successfully`,
    deleted: (item) => `${item} deleted successfully`,
    saved: (item) => `${item} saved successfully`,
  },

  // Error messages
  error: {
    created: (item) => `Failed to create ${item}`,
    updated: (item) => `Failed to update ${item}`,
    deleted: (item) => `Failed to delete ${item}`,
    saved: (item) => `Failed to save ${item}`,
    general: "Something went wrong. Please try again",
  },
};

// Helper function to handle async operations with toast notifications
export const handleAsyncWithToast = async (
  asyncFn,
  successMessage,
  errorMessage,
  addToast
) => {
  try {
    await asyncFn();
    addToast(successMessage, { appearance: "success" });
    return true;
  } catch (error) {
    addToast(errorMessage, { appearance: "error" });
    return false;
  }
};

// Validation helper
export const validateRequiredFields = (fields, addToast) => {
  const isEmpty = fields.some(field => !field || field.trim() === '');
  if (isEmpty) {
    addToast(toastMessages.validation.requiredFields, { appearance: "error" });
    return false;
  }
  return true;
};

// Project validation helper
export const validateProject = (projectId, addToast) => {
  if (!projectId) {
    addToast(toastMessages.validation.projectNotFound, { appearance: "error" });
    return false;
  }
  return true;
};
