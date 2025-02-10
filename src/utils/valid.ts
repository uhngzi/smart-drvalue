import { get } from "lodash";

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
        const value = get(item, field); // 중첩된 필드를 안전하게 접근
        if (value === undefined || value === null || value === '') {
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
    const value = get(data, field); // 중첩된 필드를 안전하게 접근
    if (value === undefined || value === null || value === '') {
      missingFields.push({ field, label });
    }
  });

  return {
    isValid: missingFields.length === 0,
    missingFields,
    missingLabels: missingFields.map((f) => f.label).join(', '),
  };
};
