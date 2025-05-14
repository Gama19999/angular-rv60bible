<?php
require 'util.php';

/**
 * @var $data Array of associative data with the structure:<br>
 * endpoint: string - (books | verses)<br>
 * vr: associative array of verse request data
 */
$data = getJSONData();
if (!isset($data['endpoint'])) return json_encode(['error' => 'Endpoint not specified!']);

require 'data/dblink.php';
$dblink = new DBLink();

switch ($data['endpoint']) {
  case 'get-all-books': echo json_encode($dblink->getAllBooks()); break;
  case 'get-verses-on': echo json_encode($dblink->getVersesOn($data['vr'])); break;
}

$dblink->close();
unset($dblink);

?>
