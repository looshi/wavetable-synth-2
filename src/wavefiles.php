<?php
// Returns a list of files as JSON which are located in the "wavs" directory.
$files = array();

$dir = opendir('./wavs');
while ($file = readdir($dir)) {
    if ($file == '.' || $file == '..') {
        continue;
    }

    $files[] = $file;
}
sort($files);
header('Content-type: application/json');
echo json_encode($files);
?>
