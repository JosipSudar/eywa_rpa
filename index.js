const { Builder, Browser, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");
require("dotenv").config();

(async function linkedIn_worker() {
  let driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .usingServer("http://localhost:4444/wd/hub")
    .build();
  const url = process.env.URL;
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;
  const title = "Junior software engineer";
  const company = "Neyho Informatika d.o.o.";

  try {
    await driver.manage().window().maximize();
    await driver.get(url);

    //login
    const emailInput = await driver.findElement(
      By.xpath('//*[@id="session_key"]')
    );
    const passwordInput = await driver.findElement(
      By.xpath('//*[@id="session_password"]')
    );
    const signInButton = await driver.findElement(
      By.xpath('//button[@type="submit"]')
    );

    await emailInput.sendKeys(email);
    await passwordInput.sendKeys(password);
    await signInButton.click().then(() => {
      fs.writeFileSync("./application.log", "Signed in successfully\n", {
        flag: "a",
      });
    });

    await new Promise((resolve) => setTimeout(resolve, 5000));

    //view profile
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[6]/div[3]/div/div/div[2]/div/div/div/div/div[1]/div[1]/a/div[2]"
        )
      )
      .click()
      .then(() => {
        fs.writeFileSync("application.log", "Profile view successful\n", {
          flag: "a",
        });
      });

    await new Promise((resolve) => setTimeout(resolve, 5000));

    //add experience
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[6]/div[3]/div/div/div[2]/div/div/main/section[1]/div[2]/div[3]/button"
        )
      )
      .click()
      .then(() => {
        fs.writeFileSync("application.log", "Section view successful\n", {
          flag: "a",
        });
      });

    //add position
    await driver
      .findElement(
        By.xpath("/html/body/div[3]/div/div/div[2]/div[1]/div/div[2]/div[4]/a")
      )
      .click()
      .then(() => {
        fs.writeFileSync(
          "application.log",
          "Add position button click successful\n",
          {
            flag: "a",
          }
        );
      });

    //job title
    const titleInput = await driver.findElement(
      By.xpath(
        "/html/body/div[3]/div/div/div[2]/div/div[2]/div[1]/div[1]/div/div/div/div/input"
      )
    );
    await titleInput.sendKeys(title, Key.ENTER);
    await titleInput.sendKeys(Key.ENTER);

    //employment
    const employmentSelect = await driver.findElement(
      By.xpath(
        "/html/body/div[3]/div/div/div[2]/div/div[2]/div[1]/div[2]/div/div/div[1]/select"
      )
    );
    await employmentSelect.click();

    //job option
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div/div[2]/div/div[2]/div[1]/div[2]/div/div/div[1]/select/option[2]"
        )
      )
      .click();

    //company
    const companyInput = await driver.findElement(
      By.xpath(
        "/html/body/div[3]/div/div/div[2]/div/div[2]/div[1]/div[3]/div/div/div[1]/div/input"
      )
    );
    await companyInput.sendKeys(company, Key.RETURN);

    //start date
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div/div[2]/div/div[2]/div[1]/div[7]/div/div/div/div[1]/fieldset[1]/div/span[1]/select/option[5]"
        )
      )
      .click();
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[3]/div/div/div[2]/div/div[2]/div[1]/div[7]/div/div/div/div[1]/fieldset[1]/div/span[2]/select/option[2]"
        )
      )
      .click();

    //save
    await driver
      .findElement(By.xpath("/html/body/div[3]/div/div/div[3]/button"))
      .click()
      .then(() => {
        fs.writeFileSync("application.log", "Position added successfully\n", {
          flag: "a",
        });
      });

    await new Promise((resolve) => setTimeout(resolve, 5000));

    //bypass modal
    await driver
      .findElement(By.xpath("/html/body/div[3]/div/div/button"))
      .click()
      .then(() => {
        fs.writeFileSync(
          "application.log",
          "Exit button clicked successfully\n",
          {
            flag: "a",
          }
        );
      });

    await new Promise((resolve) => setTimeout(resolve, 5000));

    //jobs
    driver
      .findElement(By.xpath("/html/body/div[6]/header/div/nav/ul/li[3]/a"))
      .click()
      .then(() => {
        fs.writeFileSync(
          "application.log",
          "Jobs button clicked successfully\n",
          {
            flag: "a",
          }
        );
      });

    await new Promise((resolve) => setTimeout(resolve, 5000));

    //job search
    const searchInput = await driver.findElement(
      By.xpath(
        "/html/body/div[5]/header/div/div/div/div[2]/div[2]/div/div/input[1]"
      )
    );
    await searchInput.sendKeys("Software Developer Intern", Key.RETURN);
    const countryInput = driver.findElement(
      By.xpath(
        "/html/body/div[5]/header/div/div/div/div[2]/div[3]/div/div/input[1]"
      )
    );
    await countryInput.sendKeys("Croatia", Key.RETURN);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    //search
    driver
      .findElement(
        By.xpath("/html/body/div[6]/header/div/div/div/div[2]/button[1]")
      )
      .click()
      .then(() => {
        fs.writeFileSync(
          "application.log",
          "Search button clicked successfully\n",
          {
            flag: "a",
          }
        );
      });

    await new Promise((resolve) => setTimeout(resolve, 5000));

    //search results
    let searchResults = await driver.findElements(
      By.xpath("/html/body/div[6]/div[3]/div[4]")
    );
    searchResults = await Promise.all(
      searchResults.map(async (result) => {
        const title = await result
          .findElement(
            By.xpath(
              "/html/body/div[6]/div[3]/div[4]/div/div/main/div/div[2]/div[1]/div/ul/li[1]/div/div/div[1]/div[1]/div[2]/div[1]/a/strong"
            )
          )
          .getText();
        const description = await result
          .findElement(
            By.xpath(
              "/html/body/div[6]/div[3]/div[4]/div/div/main/div/div[2]/div[2]/div/div[2]/div/div[1]/div/div[2]/article/div/div[1]/div/span[1]/p"
            )
          )
          .getText();
        return { title, description };
      })
    );
    const searchResultsJson = JSON.stringify(searchResults, null, 2);
    fs.writeFileSync("searchResults.json", searchResultsJson);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    //set job alert
    await driver
      .findElement(
        By.xpath(
          "/html/body/div[4]/div[3]/div[4]/div/div/main/div/div[2]/div[1]/header/div[2]/div/div/input"
        )
      )
      .click()
      .then(() => {
        fs.writeFileSync(
          "application.log",
          "Set alert button clicked successfully\n",
          {
            flag: "a",
          }
        );
      });

    await new Promise((resolve) => setTimeout(resolve, 5000));

    //message
    await driver
      .findElement(By.xpath("/html/body/div[4]/header/div/nav/ul/li[4]/a"))
      .click()
      .then(() => {
        fs.writeFileSync(
          "application.log",
          "Message button clicked successfully\n",
          {
            flag: "a",
          }
        );
      });

    await new Promise((resolve) => setTimeout(resolve, 5000));

    //message recipient
    const recipientInput = await driver.findElement(
      By.xpath(
        "/html/body/div[4]/div[3]/div[2]/div/div/main/div/div[2]/div[2]/div[1]/div/div[3]/div[1]/div/section/div/input"
      )
    );
    await recipientInput.sendKeys("Ino Stiv", Key.RETURN);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    //message body
    //TODO: bypass premium message
  } catch (error) {
    fs.writeFileSync("./application.log", error + "\n", { flag: "a" });
  } finally {
    await driver.quit();
  }
})();
