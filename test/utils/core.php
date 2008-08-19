<?php
function scripts($additional = array()) {
    $core = array('lib/Base', 'lib/events', 'bridge/standalone',
                  'core/v2', 'core/interface', 'core/composite.interface',
                  'core/field_element.interface', 'core/form_item.interface',
                  'core/composite_form_item', 'core/input_element', 'core/radio_element',
                  'core/select_element', 'core/textarea_element', 'core/checkbox_element',
                  'core/message', 'core/validator', 'core/field', 'core/field_validator',
                  'core/form', 'validators/standard', 'extensions/reporting',
                  'messages/errors.en');

    $test_utils = array('jsunit/app/jsUnitCore', 'utils/test_helper');

    $path = preg_match('/test\/.*\/.*\.php/', $_SERVER['REQUEST_URI']) > 0 ? '../' : '';
    $str = '';

    if (isset($_REQUEST['src'])) {
        $file = trim($_REQUEST['src']) != '' ? trim($_REQUEST['src']) : 'v2.standalone.full';
        $str .= get_script_tags(array($file . '.min'), $path . '../dist/');
    } else {
        $str .= get_script_tags($core, $path . '../src/');
        $str .= get_script_tags($additional, $path . '../src/');
    }

    $str .= get_script_tags($test_utils, $path);

    return $str;
}

function get_script_tags($scripts, $path) {
    $str = '';

    foreach ($scripts as $script) {
        $str .= "    <script type=\"text/javascript\" src=\"$path$script.js\"></script>\n";
    }

    return $str;
}
