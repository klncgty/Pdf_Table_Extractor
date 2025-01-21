Deno.test("example test", () => {
  const result = 2 + 2;
  if (result !== 4) {
    throw new Error("Test failed");
  }
});
