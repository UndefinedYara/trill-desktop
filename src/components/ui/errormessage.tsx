export function ErrorMessage({
  message,
  fieldName,
}: {
  message?: string;
  fieldName?: string;
}) {
  return (
    <p id={`${fieldName}-error`} className="text-sm text-red-500">
      {message}
    </p>
  );
}
