export default function sanitizeDates(
  ...dates: (string | undefined)[]
): Date[] {
  return dates.map((date) => (date ? new Date(date) : null));
}

// usage example
// const [createdGte, createdLte, updatedGte, updatedLte] = this.sanitizeDates(payload.created, ...)
