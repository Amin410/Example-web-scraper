import pupeteer from "puppeteer";
import fs from "fs";

const scrape = async () => {
  const browser = await pupeteer.launch();
  const page = await browser.newPage();
  const url = "https://books.toscrape.com/";
  await page.goto(url);

  const books = await page.evaluate(() => {
    const bookElements = document.querySelectorAll(".product_pod");
    return Array.from(bookElements).map((book) => {
      const title = book.querySelector("h3 a").getAttribute("title");
      const price = book.querySelector(".price_color").textContent;
      const stock = book.querySelector(".instock.availability")
        ? "In stock"
        : "Out of Stock";
      const rating = book.querySelector(".star-rating").className.split(" ")[1];
      const link = book.querySelector("h3 a").getAttribute("href");
      return { title, link, price, stock, rating };
    });
  });

  const jsonData = JSON.stringify(books, null, 2);
  fs.writeFileSync("data.json", jsonData);
  await browser.close();
  console.log(books);
};
scrape();
