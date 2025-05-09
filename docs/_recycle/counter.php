<?php
define('WIDTH', 27);
define('HEIGHT', 28);
define('DIGIT', 8);

$dbh = new PDO(
    'connection',
    'user',
    'password'
);

$prepare = $dbh->prepare("UPDATE counter SET cnt = cnt + 1");
$prepare->execute();

$prepare = $dbh->prepare("SELECT * FROM counter");
$prepare->execute();
$result = $prepare->fetchAll(PDO::FETCH_ASSOC);
$counter = $result[0];
$count = sprintf('%08d', $counter['cnt']);

header('Content-Type: image/svg+xml');
header('Expires: Tue, 1 Jan 2019 00:00:00 GMT');
header('Last-Modified:' . gmdate( 'D, d M Y H:i:s' ) . 'GMT');
header('Cache-Control:no-cache,no-store,must-revalidate,max-age=0');
header('Cache-Control:pre-check=0,post-check=0',false);
header('Pragma:no-cache');

echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<svg width="<?= WIDTH * DIGIT ?>px" height="<?= HEIGHT ?>px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Counter</title>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <?php for ($i = 0; $i < DIGIT; $i++): ?>
        <rect id="Rectangle" fill="#000000" x="<?= $i * WIDTH ?>" y="0" width="<?= WIDTH ?>" height="<?= HEIGHT ?>"></rect>
        <text id="0" font-family="Courier" font-size="24" font-weight="normal" fill="#00FF00">
            <tspan x="<?= $i * WIDTH + 6 ?>" y="22"><?= $count[$i] ?></tspan>
        </text>
        <?php endfor ?>
    </g>
</svg>