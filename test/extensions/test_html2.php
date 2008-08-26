<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/2002/REC-xhtml1-20020801/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="nb-NO">
  <head>
    <title>Test suite for Validatious 2.0 HTML declarative validation</title>
    <?php
        require '../utils/core.php';
        print scripts(array('extensions/html'));
    ?>
    <script type="text/javascript">
// Opera needs this
function test() {
    assert(true);
}
    </script>
    <style>
      .field {
          padding: 12px;
      }

      .error {
          border: 1px solid #c00;
      }

      .error .messages {
          color: #c00;
      }
    </style>
  </head>
  <body>
    <form id="testForm" class="validate">
      <fieldset>
        <div class="field">
          <label for="field1">Field 1</label>
          <input type="text" name="field1" id="field1" value="" class="min-length_4" />
        </div>
        <div class="field">
          <label for="field2">Field 2</label>
          <input type="text" name="field2" id="field2" value="Text" title="This field should be atleast 12 characters!" class
="min-length_12" />
        </div>
        <div class="validate_any required">
          <div class="field">
            <label for="field3">Field 3</label>
            <input type="text" name="field3" id="field3" value="" />
          </div>
          <div class="field">
            <label for="field4" title="E-mail">Enter your email</label>
            <input type="text" name="field4" id="field4" value="" class="email" />
          </div>
        </div>
      </fieldset>
      <fieldset>
        <div class="button"><input type="submit" name="next" value="Next" id="next" /></div>
        <div class="button"><input type="submit" name="prev" value="Previous" id="prev" /></div>
      </fieldset>
    </form>
  </body>
</html>
