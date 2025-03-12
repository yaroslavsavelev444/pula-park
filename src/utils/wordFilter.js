const bannedWords = ["банан", "помидор", "оскорбление1", "матерноеСлово", "блять"]; // Запрещённые слова
const exceptions = ["расслабляться"]; // Слова, которые могут содержать запрещённые, но не должны быть заблокированы

const charMap = {
  "а": ["a", "@"], "б": ["6", "b"], "в": ["b", "v"], "г": ["r", "g"], "д": ["d"], "е": ["e"], "ё": ["e"],
  "ж": ["zh", "\\*"], "з": ["3", "z"], "и": ["u", "i"], "й": ["u", "i"], "к": ["k", "|{"], "л": ["l", "ji"],
  "м": ["m"], "н": ["h", "n"], "о": ["o", "0"], "п": ["n", "p"], "р": ["r", "p"], "с": ["c", "s"], "т": ["m", "t"],
  "у": ["y", "u"], "ф": ["f"], "х": ["x", "h", "}{"], "ц": ["c", "u,"], "ч": ["ch"], "ш": ["sh"], "щ": ["sch"],
  "ь": ["b"], "ы": ["bi"], "э": ["e"], "ю": ["io"], "я": ["ya"]
};

// Функция экранирования спецсимволов для RegExp
const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Функция замены похожих символов на стандартные буквы
export const normalizeText = (text) => {
  return Object.entries(charMap).reduce((normalized, [original, replacements]) => {
    const regex = new RegExp(replacements.map(escapeRegExp).join("|"), "gi");
    return normalized.replace(regex, original);
  }, text.toLowerCase().replace(/\s/g, "")); // Убираем пробелы
};

// Функция проверки на запрещённые слова
export const containsBannedWords = (text) => {
  const normalizedText = normalizeText(text);

  // Проверяем, является ли текст исключением (например, "расслабляться")
  for (const exception of exceptions) {
    if (normalizedText.includes(exception)) {
      return false; // Если текст является исключением, не считаем его запрещённым
    }
  }

  // Если нет исключений, проверяем на запрещённые слова
  return bannedWords.some(word => normalizedText.includes(word));
};