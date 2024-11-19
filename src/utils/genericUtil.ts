export function isValueElement(
  element: unknown
): element is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement {
  if (!(element instanceof HTMLElement)) return false;

  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLTextAreaElement
  );
}

export function getFormData(form: HTMLFormElement) {
  const objEntries = Object.entries(form.elements)
    .filter((e) => e[0].match(/^[a-z]/i))
    .map((e) => {
      const element = e[1];
      if (isValueElement(element)) {
        return [e[0], element.value] as const;
      }

      return null;
    })
    .filter((e) => e !== null);
  return Object.fromEntries(objEntries);
}

export function fillInput(el: unknown, value: string) {
  if (!isValueElement(el)) return;

  el.dispatchEvent(new Event("focus", { bubbles: true }));
  el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.blur();
}

export function getElementByXpath(path: string, thatDocument: Document) {
  return thatDocument.evaluate(
    path,
    thatDocument,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}
