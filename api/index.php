<?php
//require_once './eSql.php';
require_once 'NeteaseMusicAPI_mini.php';
$api = new NeteaseMusicAPI();
$result;
# Get data
switch ($_REQUEST) {
	case isset($_REQUEST['search']):
		$result = $api->search($_REQUEST['search']);
		break;
	case isset($_REQUEST['artist']):
		$result = $api->artist($_REQUEST['artist']);
		break;
	case isset($_REQUEST['playlist']):
		$result = $api->playlist($_REQUEST['playlist']);
		break;
	case isset($_REQUEST['url']):
		$result = $api->url($_REQUEST['url']);
		break;
	case isset($_REQUEST['lyric']):
		$result = $api->lyric($_REQUEST['lyric']);
		break;
	default:
		$result = '{"code": 404,"message": "Not found to your request"}';
		# code...
		break;
}
// or $result = $api->mini()->search('hello');
// $result = $api->artist('46487');
// $result = $api->detail('35847388');
// $result = $api->album('3377030');
//$result = $api->playlist('124394335');
//$result = $api->url('239682'); # v2 only
//$result = $api->lyric('239682');
// $result = $api->mv('501053');

# return JSON, just use it
$data=json_decode($result);
header('Content-type: application/json; charset=UTF-8','Access-Control-Allow-Origin : *');
echo json_encode($data,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
?>