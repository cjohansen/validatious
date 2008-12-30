require "rubygems"
require "sinatra"
require "juicer"

#
# Make sure correct scripts are loaded
#
# Force a specific bridge with the bridge parameter, ie:
# ?bridge=standalone
# ?bridge=prototype
#
# Specify if you want to test with full sources or the minified distribution
# using the corresponding parameter, ie (default is full sources):
# ?minified
# ?full
#
before do
  # Set modes from URL parameters
  @modes = params.keys.find_all { |key| ["minified", "full"].include?(key) }
  @modes = nil if @modes.length == 0

  # Decide which lib to use
  bridge = params[:bridge] || "standalone"

  # Build scripts array
  @scripts = []
  @scripts << "lib/#{bridge}" if File.exists?(path("src/lib/#{bridge}.js"))

  if params.key?("minified")
    @scripts << "v2.#{bridge}.full.min"
  else
    files = ["bridge/#{bridge}", "core/input_element", "core/radio_element",
             "core/select_element", "core/textarea_element", "core/checkbox_element",
             "core/field_validator", "validators/standard", "messages/errors.en",
             "extensions/reporting"].collect { |file| path("src/#{file}.js") }

    resolver = Juicer::Merger::JavaScriptFileMerger.new(files)
    @scripts.concat(resolver.files.collect { |file| relative(file).sub(/\.js$/, "") })
  end
end

#
# Index, offer to start some predefined test suites
#
get "/" do
  @bridges = bridges
  erb :index
end

#
# Run full test suite on all bridges
#
get "/test_suite/full" do
  test_suite bridges, @modes || ["full", "minified"]
end

#
# Run test suite on one specific bridge
#
get "/test_suite/:bridge" do
  filename = path("src/bridge/#{params[:bridge]}.js")
  raise "No such bridge '#{params[:bridge]}" unless File.exists?(filename)
  test_suite params[:bridge], @modes || "full"
end

#
# Test cases
#
get "/*test_:module" do
  redirect "/test_suite/standalone" if params[:module] == "suite"
  test_case = "#{params[:splat]}test_#{params[:module]}"
  filename = path(File.join("test", "views", "#{test_case}.erb"))
  raise "Test case '#{test_case}' not found" unless File.exists?(filename)

  header "Content-Type" => "text/html;charset=utf-8"
  erb test_case.to_sym
end

#
# Source files
#
get "/validatious/*" do
  dir = params[:splat].first =~ /\.min\.js$/ ? "dist" : "src"
  path = path(File.join(dir, params[:splat].first))
  raise "File does not exist" unless File.exists?(path)

  header "Content-Type" => "text/javascript;charset=utf-8"
  File.read(path)
end

helpers do
  #
  # Provide a link to the test runner with test page prefilled
  #
  def suite_link(text, suite, mode = nil)
    mode = mode.nil? ? "" : "?#{mode}"
    url = "#{request.env["HTTP_HOST"]}/test_suite/#{suite}#{mode}"
    "<a href=\"/jsunit/testRunner.html?testPage=#{url}\">#{text}</a>"
  end
end

#
# Run test suite with given bridges and modes. Default is to run suite only once
# for the standalone mode.
#
def test_suite(bridges = "standalone", modes = "full")
  @bridges = bridges.is_a?(Array) ? bridges : [bridges]
  @modes = modes.is_a?(Array) ? modes : [modes]
  erb :test_suite, :layout => false
end

#
# Returns an array of all available bridges
#
def bridges
  bridges = Dir.new(path("src/bridge")).entries.find_all { |bridge| bridge =~ /\.js$/ }
  bridges.collect { |bridge| File.basename(bridge).sub(/\.js$/, "") }
end

#
# Takes a file path relative to Validatious root folder and returns an absolute
# path
#
def path(rel)
  File.join(File.dirname(__FILE__), "..", rel)
end

#
# Takes a full path and returns path relative to Validatious source folder
#
def relative(filename)
  filename.sub(%r{#{File.expand_path(File.join(File.dirname(__FILE__), "..", "src"))}/}, "")
end
