test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseData = await response.json();

  const parseDate = new Date(responseData.update_at).toISOString();
  expect(responseData.update_at).toEqual(parseDate);

  expect(responseData.dependencies.database.version).toEqual("16.11");
  expect(responseData.dependencies.database.max_connections).toEqual(100);
  expect(responseData.dependencies.database.opened_connections).toEqual(1);
});
