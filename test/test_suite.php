<?php

$full = isset($_REQUEST['full']);

$bridge = isset($_REQUEST['bridge']) ? $_REQUEST['bridge'] : 'standalone';
$mode = isset($_REQUEST['src']) ? 'src' : '';

$bridges = $full ? array('standalone', 'prototype') : array($bridge);
$modes = $full ? array('', 'src') : array($mode);

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/2002/REC-xhtml1-20020801/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="nb-NO">
  <head>
    <title>Test suite for Validatious 2.0</title>
    <script type="text/javascript" src="jsunit/app/jsUnitCore.js"></script>
    <script type="text/javascript">
function v2TestSuite() {
  var v2Suite = new top.jsUnitTestSuite();
<?php for ($i = 0; $i < count($bridges); $i++) { ?>
  <?php for ($j = 0; $j < count($modes); $j++) { ?>
    <?php $query = "?bridge=" . $bridges[$i] . ($modes[$j] != '' ? "&" . $modes[$j] : ''); ?>
    v2Suite.addTestPage("../test_validators.php<?php print $query; ?>");
    v2Suite.addTestPage("../bridge/test_<?php print $bridges[$i]; ?>.php<?php print $query; ?>");
    v2Suite.addTestPage("../core/test_interface.php<?php print $query; ?>");
    v2Suite.addTestPage("../core/test_field_element.php<?php print $query; ?>");
    v2Suite.addTestPage("../core/test_composite_form_item.php<?php print $query; ?>");
    v2Suite.addTestPage("../core/test_form.php<?php print $query; ?>");
    v2Suite.addTestPage("../core/test_field.php<?php print $query; ?>");
    v2Suite.addTestPage("../core/test_field_validator.php<?php print $query; ?>");
    v2Suite.addTestPage("../core/test_validator.php<?php print $query; ?>");
    v2Suite.addTestPage("../core/test_message.php<?php print $query; ?>");
    v2Suite.addTestPage("../extensions/test_reporting.php<?php print $query; ?>");
    v2Suite.addTestPage("../extensions/test_html.php<?php print $query; ?>");
    v2Suite.addTestPage("../extensions/test_dsl.php<?php print $query; ?>");
  <?php } ?>
<?php } ?>

  return v2Suite;
}

function suite() {
  var fullSuite = new top.jsUnitTestSuite();
  fullSuite.addTestSuite(v2TestSuite());
  return fullSuite;
}
    </script>
  </head>
  <body>
    <div id="test"></div>
  </body>
</html>
