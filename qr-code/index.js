import { writeFile } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";
import QRCode from "qrcode";

const generateQR = async (text) => {
  try {
    return await QRCode.toBuffer(text, {
      width: 400,
    });
  } catch (err) {
    console.error(err);
    return null;
  }
};

void (async function () {
  const urls = ["https://restaurant-system-guest-app.vercel.app/order-system"];
  for (const url of urls) {
    const result = await generateQR(url);
    if (result !== null) {
      const path = join("images", url.replaceAll("/", "-") + ".webp");
      await promisify(writeFile)(path, result);
    }
  }
})();
