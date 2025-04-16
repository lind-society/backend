import { BadRequestException } from '@nestjs/common';

export function validatePayloadFromDefinedKey(
  payload: Record<string, any>,
  requiredFields: string[],
) {
  const missingFields = requiredFields.filter((field) => !payload[field]);

  if (missingFields.length) {
    throw new BadRequestException(
      `Payload incomplete, missing fields: ${missingFields.join(', ')}`,
    );
  }
}

export function validatePayloadFromObjectKey(
  payload: Record<string, any>,
  requiredFields: Record<string, any>,
) {
  const missingFields = Object.keys(requiredFields).filter(
    (field) => !payload[field],
  );

  if (missingFields.length) {
    throw new BadRequestException(
      `Payload incomplete, missing fields: ${missingFields.join(', ')}`,
    );
  }
}
