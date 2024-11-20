import { getElementByXpath } from "./genericUtil";

function extractText(element: Node | undefined | null): string {
  if (!element) return "";

  return Array.from(element.childNodes)
    .map((el) => {
      if (el.nodeName === "STYLE") return "";
      if (el.nodeType === Node.TEXT_NODE) return el.textContent?.trim() ?? "";

      return extractText(el).trim();
    })
    .filter(Boolean)
    .join(" ");
}

async function getPracujPlData(url: string) {
  const pageText = await fetch(
    `https://corsproxy.io/?${encodeURIComponent(url)}`
  ).then((res) => res.text());

  const parser = new DOMParser();
  const pageDocument = parser.parseFromString(pageText, "text/html");

  const salary = Array.from(
    pageDocument.querySelectorAll('[data-test="text-earningAmount"]')
  )
    .map((el) => el.textContent)
    .join("\n");

  const position =
    pageDocument.querySelector('[data-scroll-id="job-title"]')?.textContent ??
    "";

  const company =
    pageDocument.querySelector('[data-scroll-id="employer-name"]')
      ?.childNodes[0].textContent ?? "";

  return {
    salary,
    position,
    company,
  };
}

async function getNoFluffData(url: string) {
  const pageText = await fetch(
    `https://corsproxy.io/?${encodeURIComponent(url)}`
  ).then((res) => res.text());

  const parser = new DOMParser();
  const pageDocument = parser.parseFromString(pageText, "text/html");

  const salary =
    Array.from(pageDocument.querySelectorAll(".salary")).map((el) =>
      extractText(el)
        .replace(/oblicz.+/, "")
        .trim()
    )[0] ?? "";

  const position = extractText(
    pageDocument.querySelector(".posting-details-description")?.children[0]
  );

  const company = extractText(
    pageDocument.querySelector(".posting-details-description")?.children[1]
  );

  return {
    salary,
    position,
    company,
  };
}

async function getJustJoinData(url: string) {
  const pageText = await fetch(
    `https://corsproxy.io/?${encodeURIComponent(url)}`
  ).then((res) => res.text());

  const parser = new DOMParser();
  const pageDocument = parser.parseFromString(pageText, "text/html");

  // todo: handle multiple salaries
  const salary = extractText(
    getElementByXpath(
      `//*[@id="__next"]/div[2]/div/div[1]/div/div[2]/div[2]/div[1]/div[2]/div[2]/div[2]/div[1]/div[1]/div`,
      pageDocument
    )?.parentElement?.parentElement
  );

  const position = extractText(
    getElementByXpath(
      `//*[@id="__next"]/div[2]/div/div[1]/div/div[2]/div[2]/div[1]/div[2]/div[2]/h1`,
      pageDocument
    )
  );

  const company = extractText(
    getElementByXpath(
      '//*[@id="__next"]/div[2]/div/div[1]/div/div[2]/div[2]/div[1]/div[2]/div[2]/div[1]/div[1]/a/div/h2',
      pageDocument
    )
  );

  return {
    salary,
    position,
    company,
  };
}

async function getTheProtocolData(url: string) {
  const pageText = await fetch(
    `https://corsproxy.io/?${encodeURIComponent(url)}`
  ).then((res) => res.text());

  const parser = new DOMParser();
  const pageDocument = parser.parseFromString(pageText, "text/html");

  const salary = Array.from(
    pageDocument.querySelectorAll('[data-test="text-contractSalary"]')
  ).map(extractText)[0];

  const position = extractText(
    pageDocument.querySelector('[data-test="text-offerTitle"]')
  );

  const company = extractText(
    pageDocument.querySelector('[data-test="anchor-company-link"]')
  );

  return {
    salary,
    position,
    company,
  };
}

export async function getPageData(
  url: string
): Promise<Record<string, string | undefined>> {
  if (url.includes("pracuj.pl")) {
    return getPracujPlData(url);
  }

  if (url.includes("nofluffjobs.com")) {
    return getNoFluffData(url);
  }

  if (url.includes("justjoin.it")) {
    return getJustJoinData(url);
  }

  if (url.includes("theprotocol.it")) {
    return getTheProtocolData(url);
  }

  return {};
}
