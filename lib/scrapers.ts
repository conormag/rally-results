export function validateRallyId(rallyId: string): boolean {
  /*
    Validates rally ID format as 2 uppercase letters followed by 2 digits,
    where digits represent a year between 2002 and the current year.
  */
  const currentYear = new Date().getFullYear();
  const rallyCodeRegex = new RegExp(`^[A-Z]{2}(0[2-9]|1[0-9]|2[0-${currentYear % 100 % 10}])$`);
  return rallyCodeRegex.test(rallyId);
}
