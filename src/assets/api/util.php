<?php

/**
 * Retrieves body from POST request and converts it to JSON
 * @return mixed|string[] Error if request ain't POST - Associative JSON data array otherwise
 */
function getJSONData() {
  if ($_SERVER['REQUEST_METHOD'] !== 'POST') return ['error' => 'Only POST requests are allowed'];
  if (!isset($_SERVER['CONTENT_TYPE']) || strpos($_SERVER['CONTENT_TYPE'], 'application/json') === false) {
    return ['error' => 'Content-Type must be application/json'];
  }
  $jsonData = file_get_contents('php://input');
  $data = json_decode($jsonData, true);
  if (json_last_error() !== JSON_ERROR_NONE) return ['error' => 'Invalid JSON: ' . json_last_error_msg()];
  return $data;
}

?>
