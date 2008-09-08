<?php
function scripts($additional = array()) {
    $bridges = array();
    $bridges['standalone'] = array(array(), array('lib/add_dom_load_event', 'lib/Base', 'lib/events', 'bridge/standalone'));
    $bridges['prototype'] = array(array('lib/prototype'), array('lib/Base', 'lib/prototype', 'bridge/prototype'));

    $core = array('core/v2', 'core/interface', 'core/composite.interface',
                  'core/field_element.interface', 'core/form_item.interface',
                  'core/composite_form_item', 'core/input_element', 'core/radio_element',
                  'core/select_element', 'core/textarea_element', 'core/checkbox_element',
                  'core/message', 'core/validator', 'core/field', 'core/field_validator',
                  'core/fieldset', 'core/form', 'validators/standard', 'extensions/reporting',
                  'messages/errors.en');

    $test_utils = array('jsunit/app/jsUnitCore', 'utils/test_helper');

    $path = preg_match('/test\/.*\/.*\.php/', $_SERVER['REQUEST_URI']) > 0 ? '../' : '';
    $str = '';
    $bridge = isset($_REQUEST['bridge']) ? $_REQUEST['bridge'] : 'standalone';

    if (isset($_REQUEST['src'])) {
        $file = trim($_REQUEST['src']) != '' ? trim($_REQUEST['src']) : "v2.$bridge.full";
        $str .= get_script_tags($bridges[$bridge][0], $path . '../src/');
        $str .= get_script_tags(array($file . '.min'), $path . '../dist/');
    } else {
        $str .= get_script_tags($bridges[$bridge][1], $path . '../src/');
        $str .= get_script_tags($core, $path . '../src/');
        $str .= get_script_tags($additional, $path . '../src/');
    }

    $str .= get_script_tags($test_utils, $path);

    return $str;
}

function get_script_tags($scripts, $path) {
    $str = '';
    $param = '?cache_buster=' . rand_str();

    foreach ($scripts as $script) {
        $str .= "    <script type=\"text/javascript\" src=\"$path$script.js$param\"></script>\n";
    }

    return $str;
}

function rand_str() {
    $chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    srand((double)microtime()*1000000);
    $str = '' ;

    while (strlen($str) < 8) {
        $str .= substr($chars, rand() % 33, 1);
    }

    return $str;
}
