#!/usr/bin/env ruby
$LOAD_PATH << File.expand_path(File.dirname(__FILE__))
require 'file_extra'
require 'validator'

#
# Builds Validatious distribution files
#
class ValidatiousBuilder
  attr_reader :basedir

  def initialize(basedir)
    @core = ['composite_form_item', 'input_element', 'radio_element',
             'select_element', 'textarea_element', 'checkbox_element',
             'message', 'validator', 'field', 'fieldset', 'field_validator',
             'form'].collect { |s| "core/#{s}" }

    @basedir = basedir
    set_library(:standalone)
    @validators = nil
    @extensions = []
    @language = 'en'
  end

  #
  # Set which library to base distribution on. Default distribution is
  # standalone. Parameter should be a symbol representation, like :mootools
  #
  def set_library(library)
    if library == :standalone
      @library = ['lib/add_dom_load_event', 'lib/Base', 'lib/events', 'bridge/standalone']
    else
      @library = ["lib/Base", "bridge/#{library}"]
    end
  end

  #
  # Add a Validatious extension (like :dsl, :html, :reporting)
  #
  def add_extension(*name)
    name = name[0] if name[0].respond_to?(:push)
    @extensions.concat(name.collect { |n| "extensions/#{n}" })
  end

  #
  # Add a validator to the mix
  #
  def add_validator(*name)
    name = name[0] if name[0].respond_to?(:push)

    @validators = [] if @validators.nil?
    @validators.concat name
  end

  #
  # Set language of default error messages
  #
  def set_language(lang)
    @language = lang
  end

  #
  # Assemble distribution into file and optionally minify it
  #
  def assemble(filename = nil, minify = true)
    fname = filename || 'tmp.min.js'
    V2::Validator.join(File.join(@basedir, 'src/validators/standard.js'), @validators) unless @validators.nil?

    files = (@library + @core + ['validators/standard'] +
             ["messages/errors.#{@language}"] + @extensions).collect do |file|
      "#{File.join(@basedir, 'src', file + '.js')}"
    end

    File.merge(files, fname, minify)

    if filename.nil?
      str = File.read(fname)
      File.delete(fname)
      return str
    end
  end
end
