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

const workerFunction = async () => {
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
  await driver.findElement(By.xpath("//span[text()='Me']")).click();

  //Me dropdown
  await driver
    .wait(
      until.elementLocated(
        By.xpath(
          "//div[@class='artdeco-dropdown__content-inner']//a[text()='View Profile']"
        )
      ),
      5000
    )
    .click();

  await driver.sleep(5000);

  //profile section
  await driver
    .findElement(
      By.xpath(
        "/html/body/div[6]/div[3]/div/div/div[2]/div/div/main/section[1]/div[2]/div[3]/button"
      )
    )
    .click();

  //profile section dropdown
  await driver
    .findElement(
      By.xpath("/html/body/div[3]/div/div/div[2]/div[1]/div/div[2]/div[4]/a")
    )
    .click();

  await driver.sleep(3000);

  //job title
  const titleInput = await driver.wait(
    until.elementLocated(
      By.xpath(
        "//input[@id='single-typeahead-entity-form-component-profileEditFormElement-POSITION-profilePosition-ACoAAC54cEYB1MvLzdUJU1pIG2bkmNgbuGpDxq4-1-title']"
      )
    ),
    5000
  );
  await titleInput.sendKeys(title, Key.ENTER);
  await titleInput.sendKeys(Key.ENTER);

  await driver.sleep(2000);

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
    .wait(
      until.elementLocated(By.xpath("/html/body/div[3]/div/div/div[3]/button")),
      5000
    )
    .click()
    .then(logger("Profile saved successfully"));

  await driver.sleep(5000);

  //bypass modal
  await driver
    .findElement(By.xpath("/html/body/div[3]/div/div/button"))
    .click();

  await driver.sleep(5000);

  //jobs
  await driver
    .findElement(By.xpath("//*[@id='global-nav']/div/nav/ul/li[3]/a"))
    .click()
    .then(logger("Jobs button clicked successfully"));

  await driver.sleep(5000);

  //job search
  const searchInput = await driver.findElement(
    By.xpath(
      "/html/body/div[6]/header/div/div/div/div[2]/div[2]/div/div/input[1]"
    )
  );
  await searchInput.sendKeys("Software Developer Intern", Key.RETURN);

  await driver.sleep(5000);

  //search results to json
  const listOfJobs = await driver.findElements(
    By.xpath(
      "/html/body/div[6]/div[3]/div[4]/div/div/main/div/div[2]/div[1]/div/ul"
    )
  );
  let jobs = [];
  for (const job of listOfJobs) {
    const listItems = await job.findElements(By.xpath("./li"));
    for (const listItem of listItems) {
      await listItem.click();
      await driver.sleep(2000);
      const jobElements = await driver.findElements(
        By.xpath(
          "/html/body/div[6]/div[3]/div[4]/div/div/main/div/div[2]/div[2]/div/div[2]/div/div[1]/div"
        )
      );
      for (const element of jobElements) {
        const titleElement = await element.findElement(
          By.xpath(
            "/html/body/div[6]/div[3]/div[4]/div/div/main/div/div[2]/div[2]/div/div[2]/div/div[1]/div/div[1]/div/div[1]/div[1]/div[1]/h1/a/span"
          )
        );
        let descriptionElement = await element.findElement(By.className("mt4"));
        const title = await titleElement.getText();
        const desc = await descriptionElement.getText();
        jobs.push({ title: title, description: desc });
      }
    }
  }
  fs.writeFileSync("jobs.json", JSON.stringify(jobs, null, 2));

  await driver.sleep(5000);

  //set job alert
  await driver
    .wait(until.elementLocated(By.xpath("//input[@type='checkbox']")), 5000)
    .click()
    .then(logger("Set job alert button clicked successfully"));

  await driver.sleep(5000);

  //message
  await driver
    .findElement(By.xpath("/html/body/div[6]/header/div/nav/ul/li[4]/a"))
    .click();

  await driver.sleep(5000);

  //message recipient
  const recipientInput = await driver.findElement(
    By.xpath(
      "/html/body/div[6]/div[3]/div[2]/div/div/main/div/div[2]/div[2]/div[1]/div/div[3]/div[1]/div/section/div/input"
    )
  );
  await recipientInput.sendKeys("Matija Bilić");
  await driver.sleep(5000);
  await recipientInput.sendKeys(Key.RETURN);

  await driver.sleep(5000);

  //message body
  const messageInput = await driver.findElement(
    By.xpath(
      "/html/body/div[6]/div[3]/div[2]/div/div/main/div/div[2]/div[2]/div[1]/div/div[3]/form/div[3]/div/div[1]/div[1]/p"
    )
  );
  await messageInput.sendKeys(
    "Hi,\n My name is Robert Robotić and this is test message."
  );

  await driver.sleep(2000);

  await driver
    .findElement(By.xpath("//button[@type='submit']"))
    .click()
    .then(logger("Message sent successfully"));
};

const logger = (text) => {
  const date = new Date();
  const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  fs.writeFileSync("./application.log", time + ": " + text + "\n", {
    flag: "a",
  });
};

const linkedIn_Worker = async () => {
  try {
    await config();
    await workerFunction();
  } catch (error) {
    logger(error);
  } finally {
    await driver.quit();
  }
};
linkedIn_Worker();
