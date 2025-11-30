/**
 * Google Apps Script for handling wedding quiz submissions.
 * Deploy this as a Web App and set access to "Anyone" (anonymous).
 */

const SHEET = SpreadsheetApp.openById("<YOUR_SPREADSHEET_ID>").getSheetByName(
  "Scores"
);

function doGet() {
  return createCorsResponse({ status: "ok" });
}

function doPost(e) {
  const data = parsePayload(e);
  SHEET.appendRow([
    new Date(data.completedAt || new Date()),
    data.name || "",
    data.correct ?? "",
    data.total ?? "",
    data.percentage ?? "",
    data.startedAt || "",
    data.isPerfect ? "TRUE" : "",
  ]);
  return createCorsResponse({ status: "ok" });
}

function doOptions() {
  return createCorsResponse({ status: "ok" }, true);
}

function parsePayload(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return {};
  }
  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    console.warn("Invalid JSON payload", error);
    return {};
  }
}

function createCorsResponse(body, isOptions) {
  const output = ContentService.createTextOutput(
    isOptions ? "" : JSON.stringify(body)
  );
  output.setMimeType(ContentService.MimeType.JSON);
  output.setHeader("Access-Control-Allow-Origin", "*");
  output.setHeader("Access-Control-Allow-Headers", "Content-Type");
  output.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  return output;
}
