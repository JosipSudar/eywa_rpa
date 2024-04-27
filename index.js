const { Builder, Browser, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");
require("dotenv").config();

let driver = new Builder()
  .forBrowser(Browser.CHROME)
  .usingServer("http://localhost:4444/wd/hub")
  .build();
const url = process.env.URL;
const email = process.env.EMAIL;
const password = process.env.PASSWORD;
const title = "Junior software engineer";
const company = "Neyho Informatika d.o.o.";

const config = async () => {
  await driver.manage().window().maximize();
  await driver.get(url);
};

const mainFunction = async () => {
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
  await signInButton.click().then(logger("Signed in successfully"));

  await driver.sleep(5000);

  //Me button click
  await driver
    .findElement(
      By.xpath(
        "//button[@class='artdeco-dropdown__trigger artdeco-dropdown__trigger--placement-bottom ember-view']"
      )
    )
    .click();

  //Me dropdown
  await driver
    .wait(
      until.elementLocated(
        By.xpath(
          "//div[@class='artdeco-dropdown__content-inner']//button[text()='View Profile']"
        )
      ),
      5000
    )
    .click();

  await driver.sleep(5000);

  //profile
  await driver
    .findElement(By.xpath("//button[@id='overflow-Add-new-experience']"))
    .click();

  //experience modal
  await driver.wait(
    until.elementLocated(
      By.xpath(
        "//div[@class='artdeco-dropdown__content-inner']//button[text()='Add Position']"
      )
    ),
    5000
  ).click;

  await driver.sleep(5000);

  //job title
  const titleInput = await driver.findElement(
    By.xpath(
      "//input[@id='single-typeahead-entity-form-component-profileEditFormElement-POSITION-profilePosition-ACoAAC54cEYB1MvLzdUJU1pIG2bkmNgbuGpDxq4-1-title']"
    )
  );
  await titleInput.sendKeys(title, Key.ENTER);
  await titleInput.sendKeys(Key.ENTER);

  //employment
  const employmentSelect = await driver.findElement(
    By.xpath(
      "//select[@id='text-entity-list-form-component-profileEditFormElement-POSITION-profilePosition-ACoAAC54cEYB1MvLzdUJU1pIG2bkmNgbuGpDxq4-1-employmentStatus']"
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
      "//input[@id='single-typeahead-entity-form-component-profileEditFormElement-POSITION-profilePosition-ACoAAC54cEYB1MvLzdUJU1pIG2bkmNgbuGpDxq4-1-requiredCompany']"
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
    .findElement(By.xpath("//button[text()='Save']"))
    .click()
    .then(logger("Profile saved successfully"));

  await driver.sleep(5000);

  //bypass modal
  await driver
    .findElement(By.xpath("/html/body/div[3]/div/div/button"))
    .click();

  await driver.sleep(5000);

  //jobs
  driver
    .findElement(By.xpath("//*[@id='global-nav']/div/nav/ul/li[3]/a"))
    .click()
    .then(logger("Jobs button clicked successfully"));

  await driver.sleep(5000);

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

  await driver.sleep(5000);

  //search
  driver
    .findElement(By.xpath("//button[text()='Search']"))
    .click()
    .then(logger("Search button clicked successfully"));

  await driver.sleep(5000);

  //search results
  const jobElements = await driver.findElements(
    By.className("jobs-search-results__list-item")
  );
  let jobs = [];
  for (let jobElement of jobElements) {
    let titleElement = await jobElement.findElement(
      By.className("job-card-search__title")
    );
    let companyElement = await jobElement.findElement(
      By.className("job-card-search__company-name")
    );
    let title = await titleElement.getText();
    let company = await companyElement.getText();
    jobs.push({ title: title, company: company });
  }
  fs.writeFileSync("jobs.json", JSON.stringify(jobs, null, 2));

  await driver.sleep(5000);

  //set job alert
  await driver
    .findElement(By.xpath("//input[@type='checkbox']"))
    .click()
    .then(logger("Set job alert button clicked successfully"));

  await driver.sleep(5000);

  //message
  await driver
    .findElement(By.xpath("/html/body/div[4]/header/div/nav/ul/li[4]/a"))
    .click();

  await driver.sleep(5000);

  //message recipient
  const recipientInput = await driver.findElement(
    By.xpath("//input[@id='ember2303-search-field']")
  );
  await recipientInput.sendKeys("Ino Stiv", Key.RETURN);

  await driver.sleep(5000);

  //message body
  //TODO: bypass premium message
};

const logger = (text) => {
  fs.writeFileSync("./application.log", text + "\n", { flag: "a" });
};

const linkedIn_Worker = async () => {
  try {
    await config();
    await mainFunction();
  } catch (error) {
    logger(error);
  } finally {
    await driver.quit();
  }
};

linkedIn_Worker();
