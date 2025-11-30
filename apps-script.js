/**
 * Google Apps Script for handling wedding quiz submissions.
 * Deploy this as a Web App and set access to "Anyone" (anonymous).
 */

const SHEET_NAME = "Scores";

function doPost(e) {
  // Validate request body
  if (!e || !e.postData || !e.postData.contents) {
    return createJsonResponse({
      status: "error",
      message: "empty request body",
    });
  }

  // Parse JSON payload
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return createJsonResponse({ status: "error", message: "invalid JSON" });
  }

  // Acquire lock to prevent concurrent write conflicts
  const lock = LockService.getScriptLock();
  try {
    // Wait up to 10 seconds to obtain the lock
    lock.waitLock(10 * 1000);
  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: "could not obtain lock",
    });
  }

  try {
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error(`Sheet "${SHEET_NAME}" not found`);
    }

    // Prepare one row of values (schema unchanged)
    const row = [
      new Date(data.completedAt || new Date()),
      data.name || "",
      data.correct ?? "",
      data.total ?? "",
      data.percentage ?? "",
      data.startedAt || "",
      data.isPerfect ? "TRUE" : "",
    ];

    // Write using setValues() instead of appendRow() to reduce write-lock contention
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, 1, row.length).setValues([row]);
  } finally {
    // Always release the lock
    lock.releaseLock();
  }

  return createJsonResponse({ status: "ok" });
}

function doGet(e) {
  return createJsonResponse({ status: "ok" });
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
