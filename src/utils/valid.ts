export const validReq = (
  data: any | any[],
  requiredFields: { field: string; label: string }[]
): {
  isValid: boolean;
  missingFields: { [index: number]: { field: string; label: string }[] } | { field: string; label: string }[];
  missingLabels: string;
} => {
  if (Array.isArray(data)) {
    const missingFields: { [index: number]: { field: string; label: string }[] } = {};
    let allMissingLabels: string[] = [];

    data.forEach((item, index) => {
      const itemMissingFields: { field: string; label: string }[] = [];
      requiredFields.forEach(({ field, label }) => {
        if (item[field] === undefined || item[field] === null || item[field] === '') {
          itemMissingFields.push({ field, label });
        }
      });
      if (itemMissingFields.length > 0) {
        missingFields[index] = itemMissingFields;
        allMissingLabels = allMissingLabels.concat(itemMissingFields.map((f) => f.label));
      }
    });

    const hasErrors = Object.keys(missingFields).length > 0;
    return {
      isValid: !hasErrors,
      missingFields,
      missingLabels: allMissingLabels.join(', '),
    };
  }

  // 단일 객체 처리
  const missingFields: { field: string; label: string }[] = [];
  requiredFields.forEach(({ field, label }) => {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      missingFields.push({ field, label });
    }
  });

  return {
    isValid: missingFields.length === 0,
    missingFields,
    missingLabels: missingFields.map((f) => f.label).join(', '),
  };
};
