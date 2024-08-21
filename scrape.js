import pupeteer from "puppeteer";
import fs from "fs";

const scrape = async () => {
  const browser = await pupeteer.launch();
  const page = await browser.newPage();
  const url = "https://en.wikipedia.org/wiki/Algeria";
  await page.goto(url);

  const books = await page.evaluate(() => {
    const bookElements = document.querySelectorAll(".product_pod");
    return Array.from(bookElements).map((book) => {
      const title = book
        .querySelector("mw-page-title-main")
        .getAttribute("span");
      const price = book.querySelector(".price_color").textContent;
      const stock = book.querySelector(".instock.availability")
        ? "In stock"
        : "Out of Stock";
      const rating = book.querySelector(".star-rating").className.split(" ")[1];
      const link = book.querySelector("h3 a").getAttribute("href");
      return title;
    });
  });

  const jsonData = JSON.stringify(books, null, 2);
  fs.writeFileSync("data.json", jsonData);
  await browser.close();
  console.log(books);
};
scrape();
