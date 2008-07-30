task :default => ['build:standalone:all']

$standalone = ['lib/add_dom_load_event', 'lib/Base', 'lib/events', 'interface/standalone'].collect { |s| "src/#{s}.js" }
$core = ['core/message', 'core/validator', 'core/field_validator',
         'core/field_validation', 'core/field', 'core/form', 'core/v2',
         'messages/errors.en', 'validators/standard'].collect { |s| "src/#{s}.js" }
$html = ['src/extensions/html.js']
$dsl = ['src/extensions/dsl.js']

namespace :build do

  desc 'Builds the minified standalone core (no extensions)'
  task :standalone do
    File.merge($standalone + $core, 'standalone', minify?)
  end

  namespace :standalone do
    desc 'Builds the minified standalone core with the HTML extension'
    task :html do
      File.merge($standalone + $core + $html, 'standalone.html', minify?)
    end

    desc 'Builds the minified standalone core with the DSL extension'
    task :dsl do
      File.merge($standalone + $core + $dsl, 'standalone.dsl', minify?)
    end

    desc 'Builds the minified standalone core with both the HTML and DSL extensions'
    task :full do
      File.merge($standalone + $core + $html + $dsl, 'standalone.full', minify?)
    end

    desc 'Builds all the minified standalone distributions'
    task :all => [:standalone, 'standalone:html', 'standalone:dsl', 'standalone:full'] do
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
