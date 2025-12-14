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

  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return createJsonResponse({ status: "error", message: "invalid JSON" });
  }

  // Acquire script lock (to prevent concurrent writes)
  const lock = LockService.getScriptLock();
  try {
    // Wait up to 90 seconds to obtain the lock
    lock.waitLock(90 * 1000);
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

    // Prepare one row of data (schema fixed)
    const row = [
      new Date(data.completedAt || new Date()),
      data.name || "",
      data.startedAt || "",
      data.isPerfect ? "TRUE" : "",
      data.questionCount ?? "",
      data.score ?? "",
      data.percentage ?? "",
      data.answers ?? "",
    ];

    // Safely append a row (atomic operation with lock)
    sheet.appendRow(row);
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
