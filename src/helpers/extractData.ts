export const extractData = async ($, selector, replaceText = "") => {
  const header = $(selector);
  const text = header.parent().next().find("h4").text().trim();

  if (replaceText && text.includes(replaceText)) {
    return text.replace(replaceText, ` ${replaceText}`);
  }

  return text;
};
