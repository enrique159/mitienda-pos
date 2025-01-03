export const validateOnlyNumbers = (event: KeyboardEvent) => {
  const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete']; // Teclas permitidas
  const key = event.key;

  if (allowedKeys.includes(key)) {
    return;
  }

  const regex = /^[0-9]$/;
  if (!regex.test(key)) {
    event.preventDefault();
  }
};
