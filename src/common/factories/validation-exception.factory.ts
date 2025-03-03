import { ValidationError } from '@nestjs/common';

function extractChildrenErrors(children: ValidationError[]): string[] {
  if (!children || children.length === 0) return [];
  return children.flatMap((child) =>
    Object.values(child.constraints || {}).concat(
      extractChildrenErrors(child.children),
    ),
  );
}

export function validationExceptionFactory(errors: ValidationError[]): string {
  const formattedErrors = errors.map((error) => ({
    field: error.property,
    message: Object.values(error.constraints || {}).concat(
      extractChildrenErrors(error.children),
    ),
  }));

  return JSON.stringify({ errors: formattedErrors }, null, 2);
}
