$LOAD_PATH << File.expand_path(File.join(File.dirname(__FILE__), 'lib'))
require 'vbuilder/vbuilder'
require 'tmpdir'
require 'fileutils'

$verbose = true
bridges = Dir.glob("src/bridge/*.js").collect do |bridge|
  File.basename(bridge).sub(/\.js$/, "")
end

task :default => :build

desc 'Builds all files'
task :build => ["build:standalone:all"].concat(bridges.collect { |bridge| "build:#{bridge}:all" }) do
  # It's all in the prerequisites
end

namespace :build do

  desc 'Joins standard (builtin) validators to the file src/validators/standard.js'
  task :validators do
    V2::Validator.join(File.join(File.dirname(__FILE__), 'src/validators/standard.js'))
  end

  #
  # Define individual build tasks for each supported library
  #
  bridges.each do |bridge|
    desc "Builds the minified #{bridge} core (no extensions)"
    task bridge.to_sym do
      builder = ValidatiousBuilder.new(File.dirname(__FILE__))
      builder.set_library(bridge.to_sym)
      builder.assemble(File.join(builder.basedir, "dist/v2.#{bridge}#{suffix}"), minify?)
    end

    namespace bridge.to_sym do
      desc "Builds all the #{bridge} files"
      task :all => ["build:#{bridge}", "build:#{bridge}:full"] do
        # It's all in the prerequisites...
      end

      desc "Builds the minified #{bridge} core with all extensions"
      task :full do
        builder = ValidatiousBuilder.new(File.dirname(__FILE__))
        builder.set_library(bridge)
        builder.add_extension(:reporting, :html, :dsl)
        builder.assemble(File.join(builder.basedir, "dist/v2.#{bridge}.full#{suffix}"), minify?)
      end
    end

  end
end

desc 'Produces a new release of validatious'
task :release do
  raise 'Usage: rake release VERSION=x.y.z' unless ENV.key? 'VERSION'
  version = ENV['VERSION']

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
