<?php
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
