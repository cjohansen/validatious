#!/usr/bin/env ruby
$LOAD_PATH << File.expand_path(File.dirname(__FILE__))
require 'juicer'
require 'validator'
require 'fileutils'

#
# Builds Validatious distribution files
#
class ValidatiousBuilder
  attr_reader :basedir
  attr_accessor :language, :library, :extensions, :validators

  def initialize(basedir)
    @core = ["v2", "input_element", "radio_element", "select_element",
             "textarea_element", "checkbox_element", "field_validator",
             "form", "fieldset", "field"].collect { |s| "core/#{s}" }

    @basedir = basedir
    @library = :standalone
    @validators = nil # nil = standard validators, [] = no validators
    @extensions = []
    @language = "en"
  end

  #
  # Assemble distribution into file and optionally minify it
  #
  def assemble(filename = nil, minify = true)
    fname = filename || "tmp.min.js"
    FileUtils.mkdir_p(File.dirname(fname))

    # Merge files
    merger = Juicer::Merger::JavaScriptMerger.new(scripts)
    merger.save(fname)

    # Minify
    if minify
      begin
        path = File.join(Juicer.home, "lib/yui_compressor/bin")
        minifyer = Juicer::Minifyer::YuiCompressor.new(:bin_path => path)
        minifyer.save(fname, fname)
      rescue Exception => e
        puts e.message
        exit
      end
    end

    # TMP: Correct YUIC mistake on regexes
    contents = File.read(fname)

    File.open(fname, 'w') do |file|
      contents.gsub!(/\(\^\|\\s\)/, "(^|\\\\\\s)")
      contents.gsub!(/\(\\s\|\$\)/, "(\\\\\\s|$)")

      license = <<EOF
/**
 * TERMS OF USE - Validatious 2.0
 * Open source under the BSD License.
 * Copyright 2008-2009 Christian Johansen.
 * All rights reserved.
 */
EOF

      file.puts license + contents
    end

    # Print confirmation
    if $verbose
      size = File::Stat.new(fname).size / 1024.0
      puts "Produced #{fname}, #{sprintf '%.2f' % size} kB"
    end

    # Delete file if temporary
    File.delete(fname) if filename.nil?
    contents
  end

 private
  #
  # Builds and returns an array of script files to include in distribution
  #
  def scripts
    scripts = []

    # Make sure library exists
    @library = :standalone unless File.exists?("src/lib/#{@library}.js")

    # Add files
    scripts << "bridge/#{@library}"
    scripts.concat @core
    scripts.concat validator_files
    scripts << "messages/errors.#{@language}"
    scripts.concat @extensions.collect { |extension| "extensions/#{extension}" }

    # Expand paths
    scripts.collect { |s| File.join(@basedir, "src", "#{s}.js") }
  end

  #
  # Figures out which validator files to include. If there are less than 4 validators
  # they're added individually. If there are 4 or more, the V2::Validator.join method
  # is called to reduce total file size.
  #
  # Returns an array of files
  #
  def validator_files
    files = []

    if @validators.nil? ||@validators.size > 3
      V2::Validator.join(File.join(@basedir, "src/validators/standard.js"), @validators)
      files << "validators/standard"
    else
      files.concat @validators.collect { |validator| "validators/#{validator}" }
    end

    files
  end
end
