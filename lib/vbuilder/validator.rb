class Validator
  attr_reader :name, :description, :source, :since

  def initialize(name, description, source, builtin = false, since = '0.9')
    @name = name
    @description = description
    @source = source
    @builtin = builtin
    @since = since
  end

  def name_id
    name.downcase.gsub(/[^a-zA-Z0-9_\-]/, '_').gsub(/__+/, '_').gsub(/^_|_$/, '')
  end

  def filename
    name_id.gsub(/\-/, '_') + '.js'
  end

  def builtin?
    @builtin
  end

  def <=>(other)
    name <=> other.name
  end

  def self.from_file(file)
    comment = ''
    name = nil
    source = nil
    comment_complete = false
    builtin = false
    since = '0.9'

    File.read(file).each_line do |line|
      if line.strip == "*/"
        comment_complete = true
        next
      end

      unless comment_complete
        str = line.strip.sub(/^\/?\**\s*/, '').strip

        if str =~ /@([^\s]*)(?:\s(.*))?/
          builtin = true if $~[2].nil?
          since = $~[2] unless $~[2].nil?
        else
          comment += ' ' + line.strip.sub(/^\/?\**\s*/, '')
        end
      end

      source += line unless source.nil?

      if comment_complete && name.nil?
        name = line.split(/[a-zA-Z]\('|"/)[1].split(/'|"/)[0]
        source = 'function' + line.split('function')[1]
      end
    end

    Validator.new(name, comment.strip.gsub(/  /, ' '), source.sub(/\);$/, ''), builtin, since)
  end

  def self.find_all(path, builtin = false)
    validators = []

    Dir.new(path).entries.each do |file|
      unless file =~ /^\./ || file == 'standard.js'
        validator = Validator.from_file(File.join(path, file))
        validators.push(validator) if !builtin || (builtin && validator.builtin?)
      end
    end

    validators.sort
  end

  def self.join(output, names = nil)
    dirname = File.dirname(output)
    names ||= Validator.find_all(dirname, true).collect { |v| v.filename }

    str = <<-EOF
(function() {
  var v = v2.Validator;
    EOF

    contents = File.cat(names.collect { |file| File.join(dirname, file) })
    str += contents.gsub('v2.Validator', 'v').gsub(/^/m, '  ')
    str += "})();\n"

    unless output.nil?
      File.open(output, 'w+') { |f| f.puts str }
      puts "Wrote #{output}" if $verbose
    end

    str
  end
end
