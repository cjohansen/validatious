$LOAD_PATH << File.expand_path(File.join(File.dirname(__FILE__), 'lib'))
require 'vbuilder/vbuilder'
require 'tmpdir'
require 'fileutils'

$verbose = true

task :default => :build

desc 'Builds all files'
task :build => ['build:standalone:all', 'build:prototype:all'] do
  # It's all in the prerequisites
end

namespace :build do

  desc 'Joins standard (builtin) validators to the file src/validators/standard.js'
  task :validators do
    Validator.join(File.join(File.dirname(__FILE__), 'src/validators/standard.js'))
  end

  desc 'Builds the minified standalone core (no extensions)'
  task :standalone do
    builder = ValidatiousBuilder.new(File.dirname(__FILE__))
    builder.assemble(File.join(builder.basedir, "dist/v2.standalone#{suffix}"), minify?)
  end

  desc 'Builds the minified prototype core (no extensions)'
  task :prototype do
    builder = ValidatiousBuilder.new(File.dirname(__FILE__))
    builder.set_library :prototype
    builder.assemble(File.join(builder.basedir, "dist/v2.prototype#{suffix}"), minify?)
  end

  namespace :standalone do

    desc 'Builds all the standalone files'
    task :all => ['build:standalone', 'build:standalone:full'] do
      # It's all in the prerequisites...
    end

    desc 'Builds the minified standalone core with all extensions'
    task :full do
      builder = ValidatiousBuilder.new(File.dirname(__FILE__))
      builder.add_extension(:reporting, :html, :dsl)
      builder.assemble(File.join(builder.basedir, "dist/v2.standalone.full#{suffix}"), minify?)
    end
  end

  namespace :prototype do

    desc 'Builds all the prototype files'
    task :all => ['build:prototype', 'build:prototype:full'] do
      # It's all in the prerequisites...
    end

    desc 'Builds the minified prototype core with all extensions'
    task :full do
      builder = ValidatiousBuilder.new(File.dirname(__FILE__))
      builder.set_library :prototype
      builder.add_extension(:reporting, :html, :dsl)
      builder.assemble(File.join(builder.basedir, "dist/v2.prototype.full#{suffix}"), minify?)
    end
  end
end

desc 'Produces a new release of validatious'
task :release do
  raise 'Usage: rake release VERSION=x.y.z [TARGET=dir]' unless ENV.key? 'VERSION'
  version = ENV['VERSION']

  if ENV['TARGET']
    # Copy files and create zip
    target = Dir.tmpdir
    target_file = File.expand_path(ENV['TARGET'])

    FileUtils.cp_r(File.dirname(__FILE__), target)
    Dir.chdir target

    FileUtils.rm_r Dir.glob(File.join('**', '.svn'))
    FileUtils.rm_r Dir.glob(File.join('**', '*interface*js'))
    FileUtils.rm_r Dir.glob(File.join('**', 'lib/*prototype*js'))
    FileUtils.rm_r Dir.glob(File.join('**', 'dist/*js'))

    dirname = File.basename(File.dirname(__FILE__))
    `zip -r #{File.join(target_file, 'validatious-' + version + '-src.zip')} #{dirname}`

    Dir.chdir File.dirname(__FILE__)
    FileUtils.rm_r File.join(target, dirname)
  end

  # Tag release in subversion
  `svn info` =~ /URL: (.*)\/trunk/
  repo = $1
  `svn copy #{repo}/trunk #{repo}/tags/#{version} -m "Tagging #{version} release"`
end

#
# Helper methods
#
def minify?
  !ENV.key?('minify') || ENV.key?('minify') && ENV['minify'] == 'yes'
end

def suffix
  minify? ? '.min.js' : '.js'
end
