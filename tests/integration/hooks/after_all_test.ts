/**
 * Purpose of this test is to ensure a test using before_each succeeds
 */

import { Rhum } from "../../../mod.ts";

let suite_val = "Ed";
let case_val = 22;
let async_case_val = 5;
Rhum.testPlan("after_all_test.ts", () => {
  Rhum.afterAll(() => {
    suite_val = "Eric";
  });
  // Run the first test suite
  Rhum.testSuite("test suite 1", () => {
    Rhum.afterAll(() => {
      case_val = 2;
    });
    Rhum.testCase("hooks properly set suite_val and case_val", () => {
      // Asserting that the suite val should not have been changed by the hook (yet)
      Rhum.asserts.assertEquals(suite_val, "Ed");
      // Revert it back for the next test that uses it
      suite_val = "Ed";
      // Assert the value is kept the same (hook hasn't ran yet)
      Rhum.asserts.assertEquals(case_val, 22);
    });
    Rhum.testCase("hooks properly set case_val", () => {
      // Assert the value has changes as the hook should have ran
      Rhum.asserts.assertEquals(case_val, 2);
    });
  });

  // Run the second test suite
  Rhum.testSuite("test suite 2", () => {
    Rhum.afterAll(() => {
      case_val = 0;
    });
    Rhum.testCase("hooks properly set suite_val and case_val", async () => {
      // Asserting the hook should have replaced the name
      Rhum.asserts.assertEquals(suite_val, "Eric");
      suite_val = "Ed";
      // Should be kept the same as the after each hook should have updated the value
      Rhum.asserts.assertEquals(case_val, 2);
    });
  });
  Rhum.testSuite("test suite 3", () => {
    Rhum.afterAll(async () => {
      await new Promise((resolve) => {
        setTimeout(() => resolve((async_case_val = 15)), 1000);
      });
    });
    Rhum.testCase("Async afterAll hook has no effect before case", () => {
      Rhum.asserts.assertEquals(async_case_val, 5);
    });
  });
  Rhum.testSuite("test suite 4", () => {
    Rhum.testCase("Async afterAll hook has effect after case", () => {
      Rhum.asserts.assertEquals(async_case_val, 15);
    });
  });
});

Rhum.run();
