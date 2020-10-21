import { logError, logInfo } from "../../../deps.ts";

const encoder = new TextEncoder();

const testTemplate: Uint8Array = encoder.encode(
  `import { Rhum } from "https://deno.land/x/rhum@v1.1.4/mod.ts";

Rhum.testPlan(() => {
  Rhum.testSuite("my test suite", () => {
    Rhum.testCase("my test case", () => {
      Rhum.asserts.assertEquals(true, true);
    });
  });
});
`,
);

export function make(args: string[]) {
  let testFileToCreate = args[0];

  if (!testFileToCreate.includes(".ts")) {
    logError(
      `Test files require a .ts extension. You passed in "${testFileToCreate}" as the test file.`,
    );
    Deno.exit();
  }

  try {
    // If we can't read the file, then that means it doesn't exist. That also
    // means we can create the file in the catch block below.
    Deno.readFileSync(testFileToCreate);
    logError(`"${testFileToCreate}" already exists`);
  } catch (error) {
    // Try to create the file
    logInfo(`Creating "${testFileToCreate}"`);
    try {
      createFile(testFileToCreate);
    } catch (error) {
      logError(error.stack);
    }
  }
}

function createFile(testFileToCreate: string) {
  const pathToTestFile = testFileToCreate.split("/");
  pathToTestFile.pop();
  Deno.mkdirSync(pathToTestFile.join("/"), { recursive: true });
  Deno.writeFileSync(testFileToCreate, testTemplate);
  logInfo(`Test file "${testFileToCreate} created`);
}
