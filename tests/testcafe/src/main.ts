import { Selector, t } from "testcafe"; // first import testcafe selectors

async function loginTestUser(
  t: TestController,
  name: string,
  pw: string
): Promise<TestController> {
  return await t
    .click(".loginButton")
    .click("#idplistextra")
    //    .click(Selector("a").withAttribute("data-id", "https://idp.feide.no"))

    .typeText("#username", name)
    .typeText("#password", pw)
    .click(Selector("button").withAttribute("type", "submit"));

  //#OLD    .click('.submit')
  //    .wait(5000)
}

function labelledControlSelector(label: string): Selector {
  const labelCtrl = Selector("label").withAttribute("for", label);
  const control = labelCtrl.nextSibling("input");
  return control; // await t.click(labelCtrl).pressKey('tab');
}

class UrlProvider {
  constructor(readonly museumId: number, readonly collection: string) {}

  private constructUrl(postfix: string): string {
    return `/museum/${this.museumId}/collections/${this.collection}/${postfix}`;
  }

  private constructAHrefSelector(postfix: string): SelectorPromise {
    return Selector("a").withAttribute("href", this.constructUrl(postfix));
  }

  get SearchObjectsUrl(): string {
    return this.constructUrl("search/objects");
  }

  get SearchObjectsSelector(): SelectorPromise {
    return this.constructAHrefSelector("search/objects");
  }
}

//fixture`Getting Started`.page`musit-test:8888/`; // declare the fixture // specify the start page
fixture`Getting Started`.page`https://musit-utv.uio.no/`; // declare the fixture // specify the start page
//

//then create a test and place your code there
test("My first test", async t => {
  const urlProvider = new UrlProvider(
    4,
    "7352794d-4973-447b-b84e-2635cafe910a"
  );

  //  const afterLogin = await loginTestUser(t, "eva_student", "5tgb");
  const afterLogin = await loginTestUser(t, "frank_foreleser", "6yhn");
  console.log(afterLogin);

  const searchObjects = await urlProvider.SearchObjectsSelector;
  await t

    .click(searchObjects)
    .typeText("#search-term", "lycopodiella")
    //    .typeText("#search-museumNo", "TRH-V-2")

    .click("#executeSearch")
    //    .click(Selector("button").withAttribute("type", "submit"))
    .wait(10000);
  //.takeScreenshot('testbilde')

  // Use the assertion to check if the actual header text is equal to the expected one
  //.expect(Selector('#article-header').innerText).eql('Thank you, John Smsith!');
});
