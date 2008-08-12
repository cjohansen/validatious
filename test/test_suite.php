<?php

$query = '';

if (isset($_REQUEST['src'])) {
    $query = '?src=' . (trim($_REQUEST['src']) != '' ? trim($_REQUEST['src']) : 'v2.standalone.full');
}

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/2002/REC-xhtml1-20020801/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="nb-NO">
  <head>
    <title>Test suite for Validatious 2.0</title>
    <script type="text/javascript" src="jsunit/app/jsUnitCore.js"></script>
    <script type="text/javascript">
function v2TestSuite() {
  var v2Suite = new top.jsUnitTestSuite();
  v2Suite.addTestPage("../test_validators.php<?php print $query; ?>");
  v2Suite.addTestPage("../bridge/test_standalone.php<?php print $query; ?>");
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
//  v2Suite.addTestPage("../extensions/test_dsl.php<?php print $query; ?>");

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
