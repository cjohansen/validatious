task :default => ['build:standalone:all']

$standalone = ['lib/add_dom_load_event', 'lib/Base', 'lib/events', 'bridge/standalone'].collect { |s| "src/#{s}.js" }
$prototype = ['lib/Base', 'bridge/prototype'].collect { |s| "src/#{s}.js" }
$interfaces = ['core/interface', 'core/composite.interface',
               'core/field_element.interface', 'core/form_item.interface'].collect { |s| "src/#{s}.js" }
$core = ['core/composite_form_item', 'core/input_element', 'core/radio_element',
         'core/select_element', 'core/textarea_element', 'core/checkbox_element',
         'core/message', 'core/validator', 'core/field', 'core/fieldset', 'core/field_validator',
         'core/form', 'validators/standard', 'messages/errors.en'].collect { |s| "src/#{s}.js" }
$core_full = $core #['src/core/v2.js'] + $core
$html = ['src/extensions/html.js']
$dsl = ['src/extensions/dsl.js']
$reporting = ['src/extensions/reporting.js']

namespace :build do

  desc 'Builds the minified standalone core (no extensions)'
  task :standalone do
    File.merge($standalone + $core_full, 'standalone', minify?)
  end

  desc 'Builds the minified prototype core (no extensions)'
  task :prototype do
    File.merge($prototype + $core_full, 'prototype', minify?)
  end

  desc 'Joins the validators into a single file'
  task :validators do
    validators = Dir.new('src/validators').entries.find_all do |f|
      f =~ /\.js$/ && f != 'standard.js' && f !~ /(_|\.)nor(_|\.)/
    end

    puts validators
    Validator.join validators
  end

  namespace :standalone do
    desc 'Builds the minified standalone core with the HTML extension'
    task :html do
      File.merge($standalone + $core_full + $html, 'standalone.html', minify?)
    end

    desc 'Builds the minified standalone core with the DSL extension'
    task :dsl do
      File.merge($standalone + $core_full + $dsl, 'standalone.dsl', minify?)
    end

    desc 'Builds the minified standalone core with both the HTML and DSL extensions'
    task :full do
      File.merge($standalone + $core_full + $html + $dsl + $reporting, 'standalone.full', minify?)
    end

    desc 'Builds all the minified standalone distributions'
    task :all => [:standalone, 'standalone:html', 'standalone:dsl', 'standalone:full'] do
      # Dependencies does all the job
    end
  end

  namespace :prototype do
    desc 'Builds the minified prototype core with the HTML extension'
    task :html do
      File.merge($prototype + $core_full + $html, 'prototype.html', minify?)
    end

    desc 'Builds the minified prototype core with the DSL extension'
    task :dsl do
      File.merge($prototype + $core_full + $dsl, 'prototype.dsl', minify?)
    end

    desc 'Builds the minified prototype core with both the HTML and DSL extensions'
    task :full do
      File.merge($prototype + $core_full + $html + $dsl + $reporting, 'prototype.full', minify?)
    end

    desc 'Builds all the minified prototype distributions'
    task :all => [:prototype, 'prototype:html', 'prototype:dsl', 'prototype:full'] do
      # Dependencies does all the job
    end
  end
end

namespace :examples do
  desc 'svn move all examples higher than start one step to make room for a new example'
  task :add do
    start = ENV['start'].to_i
    Dir.chdir('docs/examples')
    current = Dir.glob('*.html').collect { |f| f.split('.')[0].to_i }.max

    while current > start
      `svn move #{current}.html #{current + 1}.html`
      current -= 1
    end
  end

  desc 'Build full standalone design and copy to design folder for examples'
  task :updatejs => ['build:standalone:full'] do
    `cp dist/v2.standalone.full.min.js docs/examples/design/js/.`
  end
end

def minify?
  !ENV.key?('minify') || ENV.key?('minify') && ENV['minify'] == 'yes'
end

def File.cat(*files)
  files = files[0] if files.respond_to?(:push)
  files.inject('') do |str, file|
    #puts file
    str += File.read(file) + "\n"
  end
end

def File.merge(files, name, minify = true)
  #File.open("dist/v2.#{name}.min.js", 'w') { |f| f.puts(File.cat(files)) }
  target = "dist/v2.#{name}.min.js"
  tmp = ".#{name}.tmp.js"
  tmp = target unless minify

  # Write concatenated contents to tmp file
  File.open(tmp, 'w') { |f| f.puts(File.cat(files)) }

  # Minify with YUI Compressor
  `java -jar lib/yuicompressor-2.2.5.jar --type js -o #{target} #{tmp}` if minify

  # Delete tmp file
  File.delete("#{tmp}") if minify

  # Print confirmation
  size = File::Stat.new(target).size / 1024.0
  puts "Produced #{target}, #{sprintf '%.2f' % size} kB"
end

class Validator
  def self.join(names = nil, output = 'standard.js')
    dirname = 'src/validators'
    names ||= Dir.new(dirname).entries.reject { |f| f =~ /^\./ || f == output }

    File.open "#{File.join(dirname, output)}", 'w+' do |f|
      f.puts <<-EOF
(function() {
  var v = v2.Validator;
      EOF

      contents = File.cat(names.collect { |file| File.join(dirname, file) })
      f.puts(contents.gsub('v2.Validator', 'v'))

      f.puts <<-EOF
})();
      EOF
    end

    puts "Wrote #{File.join(dirname, output)}"
  end
end
