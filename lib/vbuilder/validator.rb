module V2
  #
  # Ruby representation of Validatious validator source
  #
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

    #
    # Reads a Validatious validator source file and creates a V2::Validator
    # object representing it.
    #
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

    #
    # Finds all validators in a given directory. All .js files in the given
    # directory are assumed to be validators.
    #
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

    #
    # Joins together several validator files. The point of this operation is to
    # save a few bytes in the generated JS source. This is achieved by creating
    # an anonymous closure that holds the uncompressable v2.Validator namespace
    # in the local variable v, and uses this instead of v2.Validator for each
    # added validator.
    #
    # This technique saves 11 bytes per validator. The overhead is 35 bytes, so
    # use this when you have 4 or more validators to join.
    #
    # Every byte counts! :)
    #
    def self.join(output, names = nil)
      dirname = File.dirname(output)

      # If the standard validators are required, and the standard.js file is the
      # most recent one, abort.
      if names.nil?
        most_recent = `ls -ltc #{dirname}`.split("\n")[1].split(/([^\s]*)$/)[1]
        return if most_recent == File.basename(output)
      end

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
end

#
# Joins the content of several files with a newline between
#
def File.cat(*files)
  files = files[0] if files.respond_to?(:push)

  files.inject('') do |str, file|
    str += File.read(file) + "\n"
  end
end
