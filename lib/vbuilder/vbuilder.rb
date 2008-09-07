#!/usr/bin/env ruby
$LOAD_PATH << File.expand_path(File.dirname(__FILE__))
require 'file_extra'
require 'validator'

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

  def set_library(library)
    if library == :standalone
      @library = ['lib/add_dom_load_event', 'lib/Base', 'lib/events', 'bridge/standalone']
    elsif library == :prototype
      @library = ['lib/Base', 'bridge/prototype']
    end
  end

  def add_extension(*name)
    name = name[0] if name[0].respond_to?(:push)
    @extensions.concat(name.collect { |n| "extensions/#{n}" })
  end

  def add_validator(*name)
    name = name[0] if name[0].respond_to?(:push)

    @validators = [] if @validators.nil?
    @validators.concat name
  end

  def set_language(lang)
    @language = lang
  end

  def assemble(filename = nil, minify = true)
    fname = filename || 'tmp.min.js'
    Validator.join(File.join(@basedir, 'src/validators/standard.js'), @validators)

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
